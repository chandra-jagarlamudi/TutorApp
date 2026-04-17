'use client';

import { useState, useEffect, useCallback } from 'react';
import AppShell from './AppShell';
import ConversationSidebar from './ConversationSidebar';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import SubjectSelector from './SubjectSelector';
import ModelPicker from './ModelPicker';
import type { DbConversation, DbMessage } from '@/lib/db';
import type { Subject } from '@/lib/prompts/subjects';
import type { ProviderName } from '@/lib/gateway/manager';
import { useStreamingChat } from '@/hooks/useStreamingChat';

export default function TutorApp() {
  const [conversations, setConversations] = useState<DbConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [subject, setSubject] = useState<Subject>('general');
  const [selectedModel, setSelectedModel] = useState('');
  const [activeProvider, setActiveProvider] = useState<ProviderName>('openrouter');
  const [loadingConversations, setLoadingConversations] = useState(true);

  const { isStreaming, streamingContent, sendMessage } = useStreamingChat();

  // Load conversation list
  const refreshConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json() as DbConversation[];
      setConversations(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    refreshConversations().finally(() => setLoadingConversations(false));
  }, [refreshConversations]);

  // Load a conversation's messages
  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) return;
      const data = await res.json() as DbConversation & { messages: DbMessage[] };
      setActiveConversationId(id);
      setMessages(data.messages);
      setSubject(data.subject);
    } catch { /* ignore */ }
  }, []);

  // Create a new conversation
  const handleNewConversation = useCallback(async () => {
    setActiveConversationId(null);
    setMessages([]);
    setSubject('general');
  }, []);

  // Delete a conversation
  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
      await refreshConversations();
    } catch { /* ignore */ }
  }, [activeConversationId, refreshConversations]);

  // Send a message
  const handleSend = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    // Create conversation if none active
    let convId = activeConversationId;
    if (!convId) {
      if (!selectedModel) return;
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, model: selectedModel }),
        });
        if (!res.ok) return;
        const conv = await res.json() as DbConversation;
        convId = conv.id;
        setActiveConversationId(convId);
      } catch { return; }
    }

    // Save user message to DB
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content }),
      });
      if (!res.ok) return;
      const userMsg = await res.json() as DbMessage;
      setMessages((prev) => [...prev, userMsg]);
      await refreshConversations(); // update title in sidebar
    } catch { return; }

    // Send to gateway and stream response
    const chatMessages = [...messages, { role: 'user' as const, content }];
    const responseContent = await sendMessage({
      messages: chatMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      model: selectedModel,
      subject,
    });

    if (responseContent) {
      // Save assistant message to DB
      try {
        const res = await fetch(`/api/conversations/${convId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'assistant', content: responseContent }),
        });
        if (!res.ok) return;
        const assistantMsg = await res.json() as DbMessage;
        setMessages((prev) => [...prev, assistantMsg]);
      } catch { /* ignore */ }
    }
  }, [
    isStreaming,
    activeConversationId,
    selectedModel,
    subject,
    messages,
    sendMessage,
    refreshConversations,
  ]);

  const sidebar = (
    <ConversationSidebar
      conversations={conversations}
      activeId={activeConversationId}
      onSelect={loadConversation}
      onNew={handleNewConversation}
      onDelete={handleDeleteConversation}
      loading={loadingConversations}
    />
  );

  const bottomBar = (
    <div className="flex flex-col gap-0 border-t border-gray-200 dark:border-gray-700">
      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-x-2 px-2 pt-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex-1 min-w-0">
          <SubjectSelector
            value={subject}
            onChange={setSubject}
            disabled={isStreaming}
          />
        </div>
        <div className="flex-shrink-0 min-w-[200px] max-w-xs">
          <ModelPicker
            selectedModel={selectedModel}
            activeProvider={activeProvider}
            onModelChange={setSelectedModel}
            onProviderChange={setActiveProvider}
            disabled={isStreaming}
          />
        </div>
      </div>
      {/* Input row */}
      <MessageInput
        onSend={handleSend}
        disabled={isStreaming || !selectedModel}
        placeholder={
          !selectedModel
            ? 'Loading models...'
            : isStreaming
            ? 'Waiting for response...'
            : 'Ask your tutor anything… (Enter to send)'
        }
      />
    </div>
  );

  return (
    <AppShell sidebar={sidebar} bottomBar={bottomBar}>
      <ChatMessages
        messages={messages}
        streamingContent={streamingContent}
        isStreaming={isStreaming}
      />
    </AppShell>
  );
}
