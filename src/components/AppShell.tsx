'use client';

import { useState } from 'react';

interface Props {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  bottomBar: React.ReactNode;
}

export default function AppShell({ sidebar, children, bottomBar }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0',
          'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
          'transform transition-transform duration-200 ease-in-out',
          'sm:relative sm:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {sidebar}
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Mobile header with menu toggle */}
        <header className="flex items-center h-12 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sm:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 font-semibold text-gray-800 dark:text-gray-200">Tutor</span>
        </header>

        {/* Chat messages area — scrollable */}
        <main className="flex-1 overflow-y-auto min-h-0">
          {children}
        </main>

        {/* Bottom bar — always pinned */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {bottomBar}
        </div>
      </div>
    </div>
  );
}
