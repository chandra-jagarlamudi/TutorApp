'use client';

import { useState, useCallback, useRef } from 'react';
import type { GatewayMessage } from '@/lib/gateway/types';
import type { Subject } from '@/lib/prompts/subjects';

export interface StreamingState {
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
}

export interface UseStreamingChatReturn extends StreamingState {
  sendMessage: (params: {
    messages: GatewayMessage[];
    model: string;
    subject: Subject;
  }) => Promise<string | null>;
  abort: () => void;
}

export function useStreamingChat(): UseStreamingChatReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(async ({
    messages,
    model,
    subject,
  }: {
    messages: GatewayMessage[];
    model: string;
    subject: Subject;
  }): Promise<string | null> => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsStreaming(true);
    setStreamingContent('');
    setError(null);

    let fullContent = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, model, subject }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data) as { token?: string; error?: string };
            if (parsed.error) {
              setError(parsed.error);
              return null;
            }
            if (parsed.token) {
              fullContent += parsed.token;
              setStreamingContent(fullContent);
            }
          } catch { /* skip malformed lines */ }
        }
      }

      return fullContent;
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
      return null;
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { isStreaming, streamingContent, error, sendMessage, abort };
}
