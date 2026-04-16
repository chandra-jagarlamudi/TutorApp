'use client';

import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  content: string;
  isStreaming: boolean;
}

export default function StreamingMessage({ content, isStreaming }: Props) {
  return (
    <div className="relative">
      <MarkdownRenderer content={content} />
      {isStreaming && (
        <span
          className="inline-block w-2 h-4 bg-gray-500 dark:bg-gray-400 rounded-sm ml-0.5 align-middle animate-pulse"
          aria-label="Response generating..."
          role="status"
        />
      )}
    </div>
  );
}
