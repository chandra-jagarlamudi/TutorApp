'use client';

import { useRef, useCallback } from 'react';

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({ onSend, disabled, placeholder }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const content = textareaRef.current?.value.trim();
    if (!content || disabled) return;
    onSend(content);
    // Clear after send
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
  }, [onSend, disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Cmd/Ctrl+Enter or just Enter (without Shift) sends
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  }, []);

  return (
    <div className="flex items-end gap-2 p-3">
      <textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        onChange={handleInput}
        disabled={disabled}
        placeholder={placeholder ?? 'Ask your tutor anything… (Enter to send, Shift+Enter for new line)'}
        rows={1}
        className={[
          'flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm',
          'bg-white dark:bg-gray-800',
          'border-gray-200 dark:border-gray-600',
          'text-gray-800 dark:text-gray-200',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-shadow min-h-[44px] max-h-[200px] overflow-y-auto',
        ].join(' ')}
        aria-label="Message input"
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        aria-label="Send message"
        className={[
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
          disabled
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        ].join(' ')}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
}
