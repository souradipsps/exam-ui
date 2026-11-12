import React from 'react';
import Icon from '../common/Icon.jsx';
import { TYPE_BADGES } from '../../data/mockQuestions.js';

const ACTIONS = [
  { key: 'edit', label: 'Edit', icon: 'edit', cls: 'text-amber-700 border-amber-200 bg-amber-50/40 hover:bg-amber-100' },
  { key: 'history', label: 'History', icon: 'history', cls: 'text-teal-700 border-teal-200 bg-teal-50/40 hover:bg-teal-100' },
  { key: 'delete', label: 'Delete', icon: 'trash', cls: 'text-red-600 border-red-200 bg-red-50/40 hover:bg-red-100' },
];

export default function QuestionCards({ questions, onOpenModal, onOpenEdit }) {
  const handleAction = (key, q) => (e) => {
    e.stopPropagation();
    if (key === 'edit') onOpenEdit(q);
    else onOpenModal(key, q);
  };

  return (
    <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pb-1">
        {questions.map((q) => {
          const badge = TYPE_BADGES[q.type];
          return (
            <article
              key={q.id}
              onClick={() => onOpenModal('details', q)}
              title="Click to view question details"
              className="bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-[#72102a]/40 transition-all"
              style={{ borderColor: '#E8E2D9' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs text-gray-700">{q.id}</span>
                <span
                  className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${
                    badge?.cls || 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {badge?.label || q.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                <span className="font-semibold text-gray-800">{q.subject}</span>
                <span>{q.class || q.grade || '—'}</span>
                <span className="line-clamp-1" title={q.chapter}>{q.chapter}</span>
              </div>

              <p className="text-xs text-gray-700 line-clamp-3 flex-1">{q.questionText}</p>

              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>
                  <strong className="text-gray-800">{q.marks}</strong> {q.marks === 1 ? 'mark' : 'marks'}
                </span>
                <span>{q.history?.length ?? 0} edits</span>
              </div>

              <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
                {ACTIONS.map((a) => (
                  <button
                    key={a.key}
                    onClick={handleAction(a.key, q)}
                    title={`${a.label} Question`}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${a.cls}`}
                  >
                    <Icon name={a.icon} className="w-3 h-3" />
                    {a.label}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
