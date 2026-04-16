'use client';

import { SUBJECTS, SUBJECT_LABELS } from '@/lib/prompts/subjects';
import type { Subject } from '@/lib/prompts/subjects';

interface Props {
  value: Subject;
  onChange: (subject: Subject) => void;
  disabled?: boolean;
}

const SUBJECT_ICONS: Record<Subject, string> = {
  math: '∑',
  science: '⚗',
  english: '✍',
  history: '📜',
  coding: '</>',
  general: '★',
};

export default function SubjectSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-1 p-2">
      {SUBJECTS.map((subject) => (
        <button
          key={subject}
          onClick={() => onChange(subject)}
          disabled={disabled}
          aria-pressed={value === subject}
          className={[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            value === subject
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
          ].join(' ')}
        >
          <span className="mr-1" aria-hidden="true">{SUBJECT_ICONS[subject]}</span>
          {SUBJECT_LABELS[subject]}
        </button>
      ))}
    </div>
  );
}
