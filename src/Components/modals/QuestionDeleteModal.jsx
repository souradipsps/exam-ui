import React from 'react';
import Icon from '../common/Icon.jsx';
import { ModalWrapper } from '../common/ModalWrapper.jsx';

export default function QuestionDeleteModal({ current, onConfirm, onClose }) {
  if (!current) return null;

  return (
    <ModalWrapper title="Delete Question" onClose={onClose} narrow>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
        >
          <Icon name="trash" className="w-5 h-5" style={{ color: '#DC2626' }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Are you sure?</p>
          <p className="text-xs text-gray-500">
            This will permanently remove <span className="font-mono font-bold text-gray-700">{current.id}</span> from the Question Bank.
          </p>
        </div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-xs text-gray-600 italic">
        "{current.questionText?.slice(0, 100)}..."
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          style={{ padding: '10px 14px', borderRadius: '8px' }}
          className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{ padding: '10px 14px', borderRadius: '8px' }}
          className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
        >
          Confirm Delete
        </button>
      </div>
    </ModalWrapper>
  );
}
