import React from 'react';
import Icon from './Icon.jsx';

export function ModalWrapper({ title, subtitle, onClose, children, wide, narrow }) {
  const w = wide ? 'max-w-2xl' : narrow ? 'max-w-md' : 'max-w-xl';
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${w} max-h-[90vh] overflow-y-auto flex flex-col`}>
        <div
          className="border-b border-gray-100 flex items-start justify-between gap-4 sticky top-0 bg-white z-10"
          style={{ padding: '16px 20px 14px 20px' }}
        >
          <div>
            <h3 className="text-base font-bold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {title}
            </h3>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>
        <div style={{ padding: '18px 20px' }}>{children}</div>
      </div>
    </div>
  );
}

export function Label({ children }) {
  return <label className="block text-xs font-semibold text-gray-600 mb-1">{children}</label>;
}

export function InfoBox({ title, content }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">{title}</div>
      <p className="text-xs text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}
