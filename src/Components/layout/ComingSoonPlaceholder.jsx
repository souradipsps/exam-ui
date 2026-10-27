import React from 'react';
import Icon from '../common/Icon.jsx';
import { COMING_SOON_PAGES } from '../../data/navigation.js';

export default function ComingSoonPlaceholder({ activeNav }) {
  const meta = COMING_SOON_PAGES[activeNav];
  if (!meta) return null;

  return (
    <div className="flex flex-col items-center justify-center px-8 py-28">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, #72102a 0%, #5C0C21 100%)',
          boxShadow: '0 8px 24px rgba(114, 16, 42, 0.25)',
        }}
      >
        <Icon name={meta.icon} className="w-10 h-10 text-white" />
      </div>
      <h2
        className="text-2xl font-extrabold text-gray-800 mb-2 text-center"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {meta.label}
      </h2>
      <p className="text-sm text-gray-500 max-w-sm text-center mb-8 leading-relaxed">
        {meta.desc}
      </p>
      <div
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold"
        style={{
          backgroundColor: 'rgba(114, 16, 42, 0.08)',
          color: '#72102a',
          border: '1.5px solid rgba(114, 16, 42, 0.2)',
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#c9a84c', animation: 'pulse 1.5s infinite' }}
        />
        Coming Soon
      </div>
    </div>
  );
}
