import React from 'react';

const getCategoryBadgeStyle = (category = '') => {
  const c = category.toLowerCase();
  if (c.includes('objective')) return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
  if (c.includes('short') || c.includes('subjective')) return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
  if (c.includes('comprehension') || c.includes('applied')) return 'bg-[#CCFBF1] text-[#115E59] border-[#99F6E4]';
  if (c.includes('competency') || c.includes('analytical')) return 'bg-[#FFE4E6] text-[#9F1239] border-[#FECDD3]';
  if (c.includes('math')) return 'bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]';
  if (c.includes('science') && !c.includes('social')) return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]';
  if (c.includes('social')) return 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]';
  if (c.includes('language')) return 'bg-[#FAE8FF] text-[#86198F] border-[#F5D0FE]';
  if (c.includes('practical')) return 'bg-[#ECFCCB] text-[#3F6212] border-[#D9F99D]';
  if (c.includes('digital')) return 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]';
  if (c.includes('coding')) return 'bg-[#F5E6EA] text-[#72102A] border-[#E6C4CD]';
  return 'bg-stone-100 text-stone-700 border-stone-200';
};

const getCategoryDotColor = (category = '') => {
  const c = category.toLowerCase();
  if (c.includes('objective')) return 'bg-amber-500';
  if (c.includes('short') || c.includes('subjective')) return 'bg-emerald-600';
  if (c.includes('comprehension') || c.includes('applied')) return 'bg-teal-600';
  if (c.includes('competency') || c.includes('analytical')) return 'bg-rose-600';
  if (c.includes('math')) return 'bg-orange-500';
  if (c.includes('science') && !c.includes('social')) return 'bg-sky-600';
  if (c.includes('social')) return 'bg-violet-600';
  if (c.includes('language')) return 'bg-fuchsia-600';
  if (c.includes('practical')) return 'bg-lime-600';
  if (c.includes('digital')) return 'bg-indigo-600';
  if (c.includes('coding')) return 'bg-[#72102A]';
  return 'bg-stone-400';
};

const groupTypesByCategory = (types = []) => {
  const grouped = new Map();
  types.forEach((t) => {
    const cat = t.category || 'General';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(t);
  });
  return Array.from(grouped.entries());
};

export default function QuestionTypeViewModal({ isOpen, onClose, questionType, onEdit }) {
  if (!isOpen || !questionType) return null;

  const typesList = questionType.questionTypes || [];
  const chapters = Array.isArray(questionType.chapters) ? questionType.chapters : [];
  const chapterMap = questionType.chapterQuestionTypes || null;
  const hasChapterMapping = Boolean(chapterMap && Object.keys(chapterMap).length > 0);
  const configuredChapters = chapters.filter((ch) => (chapterMap?.[ch] || []).length > 0).length;

  return (
    <div
      className="fixed top-[60px] left-0 md:left-[240px] right-0 bottom-0 z-40 bg-[#FAF8F5]/72 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_18px_48px_-12px_rgba(24,24,27,0.16),0_0_0_1px_rgba(232,226,217,0.95)] border border-white/90 overflow-hidden flex flex-col max-h-full animate-ios-reveal">
        
        {/* MODERN CLEAN HEADER */}
        <div className="px-6 py-4 bg-white/85 backdrop-blur-lg border-b border-[#E8E2D9] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8B1F3A] to-[#5C0C21] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              QT
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  style={{
                    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#111827',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {questionType.subject}
                </h2>
                {questionType.id && (
                  <span className="font-mono text-[10px] font-bold text-[#72102A] bg-[#FAF0F3] border border-[#F2D7DF] px-2 py-0.5 rounded-full">
                    {questionType.id}
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    questionType.status === 'Approved' || questionType.status === 'Submitted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {questionType.status}
                </span>
              </div>
              <p className="text-[11.5px] text-stone-500 mt-0.5 truncate m-0">
                <strong className="text-[#5B21B6]">{questionType.assessmentTag || 'Term Assessment'}</strong> ·{' '}
                {questionType.program}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ outline: 'none' }}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all cursor-pointer shrink-0 text-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 bg-gradient-to-br from-[#FAF8F5]/75 via-white/60 to-[#FAF0F3]/30 text-xs">
          
          {/* Compact Context Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/85 border border-[#E8E2D9]">
              <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-wider">Exam</span>
              <p className="text-[11.5px] font-bold text-[#5B21B6] mt-0.5 mb-0 truncate">
                {questionType.assessmentTag || 'Term Assessment'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white/85 border border-[#E8E2D9]">
              <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-wider">Class / Program</span>
              <p className="text-[11.5px] font-bold text-stone-800 mt-0.5 mb-0 truncate">
                {questionType.program}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white/85 border border-[#E8E2D9]">
              <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-wider">Chapters</span>
              <p className="text-[11.5px] font-bold text-emerald-700 mt-0.5 mb-0">
                {hasChapterMapping ? `${configuredChapters}/${chapters.length} Configured` : `${chapters.length} Chapters`}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white/85 border border-[#E8E2D9]">
              <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-wider">Unique Types</span>
              <p className="text-[11.5px] font-bold text-[#72102A] mt-0.5 mb-0">
                {typesList.length} Allowed
              </p>
            </div>
          </div>

          {/* Chapter-Wise Question Types Breakdown */}
          {hasChapterMapping && chapters.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider">
                  Chapter-Wise Question Types ({chapters.length} Chapters)
                </span>
                <span className="text-[11px] text-stone-500">
                  Author: <strong className="text-stone-700">{questionType.assignedTeacher || 'Department Faculty'}</strong>
                </span>
              </div>

              {chapters.map((ch, idx) => {
                const chTypes = chapterMap[ch] || [];
                return (
                  <div
                    key={ch}
                    className="p-3.5 rounded-2xl bg-white/90 border border-[#E8E2D9] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] shrink-0">
                          Ch {idx + 1}
                        </span>
                        <span className="font-bold text-stone-900 text-[12.5px] truncate">
                          {ch}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                          chTypes.length > 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {chTypes.length} {chTypes.length === 1 ? 'Type' : 'Types'}
                      </span>
                    </div>

                    {chTypes.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic m-0">
                        No question types assigned to this chapter yet.
                      </p>
                    ) : (
                      <div className="space-y-3 pt-1 border-t border-stone-100">
                        {groupTypesByCategory(chTypes).map(([catName, catTypes]) => (
                          <div key={catName} className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${getCategoryDotColor(catName)}`}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                                {catName}
                              </span>
                              <span className="text-[10px] font-semibold text-stone-400">
                                ({catTypes.length})
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {catTypes.map((t, tIdx) => (
                                <div
                                  key={t.id || tIdx}
                                  className="p-2.5 rounded-xl bg-[#FAF8F5]/90 border border-stone-200/80 flex items-start justify-between gap-2"
                                >
                                  <div className="min-w-0">
                                    <span className="font-bold text-stone-900 text-[11.5px] block truncate">
                                      {t.name}
                                    </span>
                                    {t.description && (
                                      <p className="text-[10.5px] text-stone-500 mt-0.5 mb-0 line-clamp-2 leading-snug">
                                        {t.description}
                                      </p>
                                    )}
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold border shrink-0 ${getCategoryBadgeStyle(
                                      t.category
                                    )}`}
                                  >
                                    {t.category || 'General'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/90 border border-[#E8E2D9] space-y-2.5">
              <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">
                Configured Question Types ({typesList.length} Types)
              </span>

              {typesList.length === 0 ? (
                <p className="text-stone-400 italic py-2 m-0">No question types added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {typesList.map((t, idx) => (
                    <div
                      key={t.id || idx}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-stone-900 block truncate">{t.name}</span>
                        {t.description && (
                          <p className="text-[10.5px] text-stone-500 mt-0.5 mb-0 leading-snug">{t.description}</p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold border shrink-0 ${getCategoryBadgeStyle(
                          t.category
                        )}`}
                      >
                        {t.category || 'General'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-3.5 bg-white/90 backdrop-blur-xl border-t border-[#E8E2D9] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            style={{ outline: 'none' }}
            className="h-9 px-5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-xs font-semibold transition-all cursor-pointer"
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
              style={{ outline: 'none' }}
              className="h-9 px-5 rounded-full bg-gradient-to-r from-[#72102A] to-[#54081C] hover:from-[#851633] hover:to-[#680C25] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Edit Chapter Question Types
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
