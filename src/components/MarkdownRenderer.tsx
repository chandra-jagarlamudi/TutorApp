'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import type { Components } from 'react-markdown';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';

interface Props {
  content: string;
  className?: string;
}

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const isInline = !className?.startsWith('language-');
    if (isInline) {
      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre({ children, ...props }) {
    return (
      <pre
        className="overflow-x-auto rounded-lg my-3 text-sm font-mono"
        {...props}
      >
        {children}
      </pre>
    );
  },
  a({ href, children, ...props }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  h1({ children, ...props }) {
    return <h1 className="text-2xl font-bold mt-4 mb-2" {...props}>{children}</h1>;
  },
  h2({ children, ...props }) {
    return <h2 className="text-xl font-bold mt-3 mb-2" {...props}>{children}</h2>;
  },
  h3({ children, ...props }) {
    return <h3 className="text-lg font-semibold mt-2 mb-1" {...props}>{children}</h3>;
  },
  ul({ children, ...props }) {
    return <ul className="list-disc list-inside my-2 space-y-1 pl-2" {...props}>{children}</ul>;
  },
  ol({ children, ...props }) {
    return <ol className="list-decimal list-inside my-2 space-y-1 pl-2" {...props}>{children}</ol>;
  },
  li({ children, ...props }) {
    return <li className="ml-2" {...props}>{children}</li>;
  },
  p({ children, ...props }) {
    return <p className="my-1 leading-relaxed" {...props}>{children}</p>;
  },
  blockquote({ children, ...props }) {
    return (
      <blockquote
        className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic text-gray-600 dark:text-gray-400"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
};

export default function MarkdownRenderer({ content, className }: Props) {
  return (
    <div className={`prose-sm max-w-none text-sm leading-relaxed ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
