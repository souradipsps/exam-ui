import React from 'react';

export default function QuestionViewModal({ isOpen, onClose, question, onEdit }) {
  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#72102A] to-[#5C0C21] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#C9A84C]/25 text-[#FDF8E8] border border-[#C9A84C]/50 flex items-center justify-center font-bold text-sm">
              {question.code?.slice(0, 3) || 'Q'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-serif leading-tight">{question.code || question.id}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  question.status === 'Approved' || question.status === 'Submitted'
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                    : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                }`}>
                  {question.status}
                </span>
              </div>
              <p className="text-xs text-[#F5E6EA]/80 mt-0.5">
                {question.program} • {question.subject}
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
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-stone-50/30">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-semibold border border-stone-200">
              Type: {question.type}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#72102A] text-white font-bold">
              Marks: {question.marks}
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-bold border ${
              question.difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : question.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              Difficulty: {question.difficulty}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F5E6EA] text-[#72102A] font-bold border border-[#E6C4CD]">
              Cognitive: {question.cognitiveLevel}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 font-medium border border-stone-200">
              Section: {question.blueprintSection || 'General'}
            </span>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <h4 className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Question Statement</h4>
            <p className="text-sm text-[#1A1A1A] font-medium leading-relaxed whitespace-pre-wrap">
              {question.questionText}
            </p>
          </div>

          {/* Options (if present) */}
          {question.options && question.options.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
              <h4 className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Answer Options</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {question.options.map(opt => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900 shadow-xs'
                        : 'bg-[#FAF8F5] border-stone-200 text-stone-700'
                    }`}
                  >
                    <span>{opt.id}. {opt.text}</span>
                    {opt.isCorrect && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correct Answer / Solution */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
            <h4 className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Correct Key & Solution</h4>
            <p className="text-xs font-bold text-[#72102A]">
              {question.correctAnswer || 'See step-by-step solution'}
            </p>
            {question.solution && (
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 whitespace-pre-wrap font-mono mt-1">
                {question.solution}
              </div>
            )}
          </div>

          {/* Author & Timestamp */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
            <span>Author: <strong>{question.author || question.assignedTeacher}</strong></span>
            <span>Created: {question.createdAt}</span>
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
                onEdit(question);
              }}
              className="px-5 py-2 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white font-bold text-xs shadow-md transition-all"
            >
              Edit Question (Permission Granted)
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

