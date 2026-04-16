'use client';

import { useEffect, useRef } from 'react';
import type { DbMessage } from '@/lib/db';
import StreamingMessage from './StreamingMessage';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  messages: DbMessage[];
  streamingContent: string;
  isStreaming: boolean;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="text-5xl mb-4" aria-hidden="true">🎓</div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Start a conversation
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
        Choose a subject and ask anything — your tutor is here to help.
      </p>
    </div>
  );
}

interface BubbleProps {
  message: DbMessage;
}

function MessageBubble({ message }: BubbleProps) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-sm',
        ].join(' ')}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}

export default function ChatMessages({ messages, streamingContent, isStreaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or streaming content updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isStreaming) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col py-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Streaming response bubble */}
      {isStreaming && (
        <div className="flex justify-start mb-4 px-4">
          <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700">
            {streamingContent ? (
              <StreamingMessage content={streamingContent} isStreaming={isStreaming} />
            ) : (
              <div className="flex gap-1 items-center py-1" aria-label="Tutor is thinking..." role="status">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              </div>
            )}
          </div>
        </div>
      )}

      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
