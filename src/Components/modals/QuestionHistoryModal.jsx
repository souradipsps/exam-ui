import React from 'react';
import { ModalWrapper } from '../common/ModalWrapper.jsx';

export default function QuestionHistoryModal({ current, onClose }) {
  if (!current) return null;

  return (
    <ModalWrapper
      title="Activity History"
      subtitle={`${current.id} • ${current.version} — Full audit trail`}
      onClose={onClose}
    >
      <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
        {current.history?.map((log, i) => {
          const colors = {
            Created: { dot: '#059669', badge: 'bg-green-100 text-green-700 border-green-200' },
            Edited: { dot: '#0369A1', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
            Versioned: { dot: '#6B21A8', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
            'Edit History': { dot: '#6B21A8', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
            Downloaded: { dot: '#D97706', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
            'Sent Back': { dot: '#DC2626', badge: 'bg-red-100 text-red-700 border-red-200' },
          };
          const style = colors[log.action] || { dot: '#6B7280', badge: 'bg-gray-100 text-gray-600 border-gray-200' };

          return (
            <div key={i} className="relative">
              <div
                className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: style.dot }}
              />
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${style.badge}`}>
                    {log.action}
                  </span>
                  <span className="text-[11px] text-gray-400">{log.date}</span>
                </div>
                <p className="text-xs text-gray-700">{log.note}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  By: <span className="font-medium text-gray-500">{log.user}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={onClose}
          style={{ padding: '10px 14px', borderRadius: '8px' }}
          className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
}
