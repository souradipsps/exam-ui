import React from 'react';

const OPTIONS = [
  {
    value: 'list',
    label: 'List view',
    path: 'M4 6h16M4 12h16M4 18h16',
  },
  {
    value: 'grid',
    label: 'Card view',
    path: 'M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z',
  },
];

export default function ViewToggle({ view, onChange }) {
  return (
    <div
      className="inline-flex rounded-lg border bg-white p-0.5 shadow-sm"
      style={{ borderColor: '#E8E2D9' }}
      role="group"
      aria-label="Switch question view"
    >
      {OPTIONS.map((o) => {
        const active = view === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            title={o.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              active ? 'bg-[#72102a] text-white' : 'text-gray-600 hover:bg-[#72102a]/5'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={o.path} />
            </svg>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
