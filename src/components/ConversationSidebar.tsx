'use client';

import type { DbConversation } from '@/lib/db';
import { SUBJECT_LABELS } from '@/lib/prompts/subjects';

interface Props {
  conversations: DbConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  loading,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">Conversations</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          title="New conversation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">No conversations yet</div>
        ) : (
          <ul className="py-1">
            {conversations.map((conv) => (
              <li key={conv.id} className="group relative">
                <button
                  onClick={() => onSelect(conv.id)}
                  className={[
                    'w-full text-left px-4 py-3 transition-colors',
                    'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700',
                    activeId === conv.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {SUBJECT_LABELS[conv.subject]} · {formatDate(conv.updated_at)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="Delete conversation"
                      aria-label={`Delete ${conv.title}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
