import React from 'react';
import Icon from '../common/Icon.jsx';
import { ModalWrapper, Label, InfoBox } from '../common/ModalWrapper.jsx';
import { TYPE_BADGES } from '../../data/mockQuestions.js';

export default function QuestionDetailsModal({ current, onClose, onOpenEdit, onOpenHistory, onOpenDelete }) {
  if (!current) return null;

  return (
    <ModalWrapper
      title="Question Details"
      subtitle={`${current.id} • ${current.version}`}
      onClose={onClose}
      wide
    >
      <div className="space-y-4">
        {/* Meta grid: 2 balanced rows with expanded widths for Subject & Chapter, plus Edit History */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {/* Row 1: Subject (2 cols), Class (1 col), Chapter (3 cols) */}
          <div className="col-span-1 sm:col-span-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center">
            <div className="text-[11px] font-medium text-gray-400 mb-0.5">Subject</div>
            <div className="text-xs font-semibold text-gray-800 leading-snug">{current.subject}</div>
          </div>

          <div className="col-span-1 sm:col-span-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center">
            <div className="text-[11px] font-medium text-gray-400 mb-0.5">Class</div>
            <div className="text-xs font-semibold text-gray-800 leading-snug">{current.class || current.grade}</div>
          </div>

          <div className="col-span-2 sm:col-span-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center">
            <div className="text-[11px] font-medium text-gray-400 mb-0.5">Chapter</div>
            <div className="text-xs font-semibold text-gray-800 leading-snug" title={current.chapter}>
              {current.chapter}
            </div>
          </div>

          {/* Row 2: Question Type (2 cols), Marks (2 cols), Edit History (2 cols) */}
          <div className="col-span-2 sm:col-span-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center">
            <div className="text-[11px] font-medium text-gray-400 mb-0.5">Question Type</div>
            <div className="text-xs font-semibold text-gray-800 leading-snug">
              {TYPE_BADGES[current.type]?.label || current.type}
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center">
            <div className="text-[11px] font-medium text-gray-400 mb-0.5">Marks</div>
            <div className="text-xs font-semibold text-gray-800 leading-snug">
              {current.marks} Mark{current.marks === 1 ? '' : 's'}
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center">
            <div className="text-[11px] font-medium text-gray-400 mb-0.5">Edit History</div>
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-bold text-gray-800 font-mono">
                {current.version}
              </span>
              <button
                type="button"
                onClick={() => onOpenHistory(current)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#72102a] hover:underline"
                title="View edit history log"
              >
                <Icon name="history" className="w-3 h-3 text-[#72102a]" />
                <span>Log</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <Label>Question Content</Label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {current.questionText}
          </div>
        </div>

        {current.options && current.options.length > 0 && (
          <div>
            <Label>Answer Options</Label>
            <div className="space-y-1.5">
              {current.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                    opt.isCorrect
                      ? 'bg-green-50 border-green-200 text-green-800 font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center font-bold text-[11px]">
                      {opt.id.slice(-1)}
                    </span>
                    {opt.text}
                  </div>
                  {opt.isCorrect && (
                    <span className="flex items-center gap-1 text-green-700 font-semibold">
                      <Icon name="check" className="w-3.5 h-3.5" /> Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <InfoBox title="💡 Model Answer" content={current.correctAnswer || current.explanation} />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100">
          <span>📚 {current.bookReference}</span>
          <span>✍️ {current.author}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={() => onOpenHistory(current)}
          style={{ padding: '8px 12px', borderRadius: '8px', gap: '8px' }}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center transition-colors"
        >
          <Icon name="history" className="w-4 h-4" /> <span>View Activity History</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onOpenEdit(current)}
            style={{ backgroundColor: '#72102a', padding: '10px 14px', borderRadius: '8px' }}
            className="text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Edit Question
          </button>
          <button
            onClick={() => { onClose(); onOpenDelete && onOpenDelete(current); }}
            style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
            className="text-xs font-semibold flex items-center gap-1.5 hover:bg-red-200 transition-colors"
          >
            <Icon name="trash" className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
