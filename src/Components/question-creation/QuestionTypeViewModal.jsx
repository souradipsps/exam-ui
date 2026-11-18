import React from 'react';

export default function QuestionTypeViewModal({ isOpen, onClose, questionType, onEdit }) {
  if (!isOpen || !questionType) return null;

  const typesList = questionType.questionTypes || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#72102A] to-[#5C0C21] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#C9A84C]/25 text-[#FDF8E8] border border-[#C9A84C]/50 flex items-center justify-center font-bold text-sm">
              QT
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-serif leading-tight">{questionType.subject}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  questionType.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'
                }`}>
                  {questionType.status}
                </span>
              </div>
              <p className="text-xs text-[#F5E6EA]/80 mt-0.5">
                {questionType.program}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-stone-50/30 text-xs">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[10px] font-bold text-stone-500 uppercase">Class / Program</span>
              <p className="text-xs font-bold text-[#1A1A1A] mt-1">{questionType.program}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[10px] font-bold text-stone-500 uppercase">Question Types</span>
              <p className="text-sm font-bold text-[#72102A] mt-1">{typesList.length} Types Allowed</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase">Assigned Author</span>
              <p className="text-xs font-bold text-stone-800 mt-1 truncate">{questionType.assignedTeacher || 'Department Faculty'}</p>
            </div>
          </div>

          {questionType.chapters && questionType.chapters.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 shadow-xs">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Included Chapters ({questionType.chapters.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {questionType.chapters.map((ch, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-stone-200 text-stone-700 font-medium text-[11px]"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2.5 shadow-xs">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Configured Question Types ({typesList.length} Types)
            </span>
            
            {typesList.length === 0 ? (
              <p className="text-stone-400 italic py-2">No question types added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {typesList.map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-stone-900 block">{t.name}</span>
                      <span className="text-[10px] text-stone-500">{t.category || 'General'}</span>
                      {t.description && (
                        <p className="text-[10.5px] text-stone-400 mt-1 leading-snug">{t.description}</p>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#F5E6EA] text-[#72102A] text-[10px] font-bold shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-stone-500">
            <span>Course Scope: <strong>{questionType.program}</strong></span>
            <span>Status: <strong className="text-[#72102A]">{questionType.status}</strong></span>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold"
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(questionType);
              }}
              className="px-4 py-2 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white text-xs font-bold transition-all shadow-xs"
            >
              ✎ Edit Question Types
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
