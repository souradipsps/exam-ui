import React, { useState, useMemo, useEffect, useRef } from 'react';

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
  const chapters = useMemo(() => {
    if (Array.isArray(questionType.chapters) && questionType.chapters.length > 0) {
      return questionType.chapters;
    }
    return ['General Syllabus'];
  }, [questionType.chapters]);

  const chapterMap = useMemo(() => {
    if (questionType.chapterQuestionTypes && Object.keys(questionType.chapterQuestionTypes).length > 0) {
      return questionType.chapterQuestionTypes;
    }
    if (typesList.length > 0 && chapters.length > 0) {
      return { [chapters[0]]: typesList };
    }
    return {};
  }, [questionType.chapterQuestionTypes, typesList, chapters]);

  // View mode: 'chapter' (individual) or 'all' (all details together)
  const [viewMode, setViewMode] = useState('chapter');
  const [activeChapter, setActiveChapter] = useState(() => {
    const firstConfigured = chapters.find((ch) => (chapterMap[ch] || []).length > 0);
    return firstConfigured || chapters[0] || '';
  });

  // Sync selected chapter only when switching to a different questionType (avoids redundant initial double-render)
  const prevViewIdRef = useRef(questionType?.id);
  useEffect(() => {
    if (!isOpen) return;
    if (questionType?.id !== prevViewIdRef.current) {
      prevViewIdRef.current = questionType?.id;
      const firstConfigured = chapters.find((ch) => (chapterMap[ch] || []).length > 0);
      setActiveChapter(firstConfigured || chapters[0] || '');
      setViewMode('chapter');
    }
  }, [isOpen, questionType, chapters, chapterMap]);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const configuredChapters = useMemo(() => {
    return chapters
      .map((ch, idx) => ({ ch, idx, types: chapterMap[ch] || [] }))
      .filter((item) => item.types.length > 0);
  }, [chapters, chapterMap]);

  const pendingChapters = useMemo(() => {
    return chapters
      .map((ch, idx) => ({ ch, idx, types: chapterMap[ch] || [] }))
      .filter((item) => item.types.length === 0);
  }, [chapters, chapterMap]);

  const configuredChaptersCount = configuredChapters.length;

  const uniqueTypesCount = useMemo(() => {
    const names = new Set();
    typesList.forEach((t) => t?.name && names.add(t.name));
    Object.values(chapterMap).forEach((list) => {
      if (Array.isArray(list)) list.forEach((t) => t?.name && names.add(t.name));
    });
    return names.size || typesList.length;
  }, [typesList, chapterMap]);

  const currentChapterIndex = chapters.indexOf(activeChapter);
  const activeChapterTypes = activeChapter ? chapterMap[activeChapter] || [] : [];
  const activeChapterGrouped = groupTypesByCategory(activeChapterTypes);

  return (
    /* Full-Page Workspace View — fills the content canvas without blur overlays or popup margins */
    <div
      className="fixed top-[60px] left-0 md:left-[240px] right-0 bottom-0 z-40 bg-[#FAF8F5] flex flex-col overflow-hidden animate-fade-in"
      role="region"
      aria-label="View Question Types Set"
    >
      {/* Full-Area Dedicated Page Surface */}
      <div className="w-full h-full bg-[#FAF8F5] flex flex-col overflow-hidden">
        
        {/* ── 1. CLEAN MODERN HEADER WITH METADATA BADGES ── */}
        <div className="px-5 sm:px-6 py-3 bg-white border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8B1F3A] to-[#5C0C21] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              QT
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  style={{
                    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#111827',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                  className="truncate"
                >
                  {questionType.subject}
                </h2>
                {questionType.id && (
                  <span className="font-mono text-[10px] font-bold text-[#72102A] bg-[#FAF0F3] border border-[#F2D7DF] px-2 py-0.5 rounded-full">
                    {questionType.id}
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    questionType.status === 'Approved' || questionType.status === 'Submitted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : questionType.status === 'Draft'
                      ? 'bg-stone-100 text-stone-700 border-stone-300'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {questionType.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 mb-0 truncate">
                <strong className="text-[#5B21B6]">{questionType.assessmentTag || 'Term Assessment'}</strong> ·{' '}
                {questionType.program}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F7] border border-stone-200/90 text-stone-700 font-medium text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="text-stone-400">Unique Types:</span>
              <strong className="text-[#72102A]">{uniqueTypesCount} Allowed</strong>
            </div>

            {questionType.dueDate && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F7] border border-stone-200/90 text-stone-700 font-medium text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Due Date: <strong className="text-stone-900">{questionType.dueDate}</strong></span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{ outline: 'none' }}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer text-xs shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── 2. WORKSPACE: INDEPENDENT DETACHED CURVED BOXES ── */}
        <div className="flex-1 min-h-0 p-3.5 sm:p-4 lg:p-5 flex flex-col md:flex-row gap-3.5 lg:gap-4 overflow-hidden bg-gradient-to-br from-[#FAF8F5]/75 via-white/55 to-[#FAF0F3]/35">
          
          {/* ── LEFT PANEL BOX: CHAPTER NAVIGATOR (Curved & Detached) ── */}
          <div className="w-full md:w-80 lg:w-[320px] shrink-0 bg-white rounded-2xl border border-[#E8E2D9] shadow-xs flex flex-col min-h-0 overflow-hidden">
            
            {/* "All Details Together" Option at Top */}
            <div className="p-3 border-b border-[#E8E2D9] bg-[#FDFBF7] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-[#72102A] text-white font-bold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 border border-stone-200/90 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="truncate font-bold">All Chapters Together</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    viewMode === 'all'
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {configuredChaptersCount} / {chapters.length}
                </span>
              </button>
            </div>

            {/* Individual Chapters Section Header */}
            <div className="px-4 py-2.5 border-b border-[#E8E2D9] bg-stone-50/70 shrink-0">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Individual Chapters ({chapters.length})
              </span>
            </div>

            {/* Scrollable list of individual chapters */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-1.5">
              {chapters.map((ch, idx) => {
                const chTypes = chapterMap[ch] || [];
                const isSelected = viewMode === 'chapter' && ch === activeChapter;
                const count = chTypes.length;

                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => {
                      setViewMode('chapter');
                      setActiveChapter(ch);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF0F3] text-[#72102A] font-bold shadow-xs border border-[#F2D7DF]'
                        : 'text-stone-700 hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1 truncate">
                      <span className={`text-[10.5px] font-mono mr-1.5 ${isSelected ? 'text-[#72102A]' : 'text-stone-400'}`}>
                        {idx + 1}.
                      </span>
                      <span className="truncate">{ch}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                        count > 0
                          ? isSelected
                            ? 'bg-[#72102A] text-white border-[#72102A]'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-stone-100 text-stone-400 border-stone-200'
                      }`}
                    >
                      {count > 0 ? `${count} types` : 'Pending'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT PANEL BOX: MAIN DETAIL DECK (Curved & Detached) ── */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-[#E8E2D9] shadow-xs flex flex-col min-h-0 overflow-hidden">
            
            {/* Header bar with view-mode toggle inside curved box */}
            <div className="px-5 sm:px-6 py-3.5 border-b border-[#E8E2D9] bg-white flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                {viewMode === 'all' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-black px-2 py-0.5 rounded-md bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]">
                        Complete Syllabus
                      </span>
                      <h3 className="text-base font-extrabold text-stone-900 truncate m-0">
                        All Chapters Overview
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 mb-0">
                      All syllabus chapters and configured question formats together
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-black px-2 py-0.5 rounded-md bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]">
                        Chapter {currentChapterIndex + 1}
                      </span>
                      <h3 className="text-base font-extrabold text-stone-900 truncate m-0">
                        {activeChapter}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 mb-0">
                      Question formats configured for this chapter
                    </p>
                  </>
                )}
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="inline-flex rounded-xl border border-stone-200 bg-stone-100 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'all'
                        ? 'bg-white text-[#72102A] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    All Together
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('chapter');
                      if (!activeChapter) {
                        const first = chapters.find((c) => (chapterMap[c] || []).length > 0);
                        setActiveChapter(first || chapters[0] || '');
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'chapter'
                        ? 'bg-white text-[#72102A] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    By Chapter
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              
              {/* ── FORMAT 1: ALL DETAILS TOGETHER ── */}
              {viewMode === 'all' && (
                <div className="space-y-6">
                  {configuredChapters.length === 0 ? (
                    <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-8 text-stone-400 space-y-3 bg-white rounded-2xl border border-stone-200">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-800 m-0">No Question Types Configured Yet</h4>
                        <p className="text-xs text-stone-500 mt-1 max-w-sm mb-0">
                          All {chapters.length} chapters are currently pending question type assignments.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Configured Chapters with full cards */}
                      <div className="space-y-5">
                        {configuredChapters.map(({ ch, idx, types }) => {
                          const grouped = groupTypesByCategory(types);
                          return (
                            <div
                              key={ch}
                              className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs space-y-3"
                            >
                              <div className="flex items-center justify-between pb-3 border-b border-stone-100 gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[10.5px] font-black px-2 py-0.5 rounded-md bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] shrink-0">
                                    Ch {idx + 1}
                                  </span>
                                  <h4 className="font-extrabold text-stone-900 text-sm m-0 truncate">
                                    {ch}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                    {types.length} {types.length === 1 ? 'Type' : 'Types'}
                                  </span>
                                </div>
                              </div>

                              {/* Question Type Cards for this chapter */}
                              <div className="space-y-4">
                                {grouped.map(([catName, catTypes]) => (
                                  <div key={catName} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${getCategoryDotColor(catName)}`} />
                                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                                        {catName} ({catTypes.length})
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {catTypes.map((t, tIdx) => (
                                        <div
                                          key={t.id || tIdx}
                                          className="p-3 rounded-xl bg-[#FAF8F5]/80 border border-stone-200/90 shadow-2xs flex flex-col justify-between gap-1.5 content-visibility-auto"
                                        >
                                          <div>
                                            <div className="flex items-start justify-between gap-2">
                                              <h5 className="font-bold text-stone-900 text-[14px] sm:text-[14.5px] m-0 leading-tight">
                                                {t.name}
                                              </h5>
                                              <span
                                                className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-semibold border shrink-0 leading-none ${getCategoryBadgeStyle(
                                                  t.category
                                                )}`}
                                              >
                                                {t.category || 'General'}
                                              </span>
                                            </div>

                                            {t.description && (
                                              <p className="text-[12px] text-stone-600 mt-1 mb-0 leading-snug line-clamp-2">
                                                {t.description}
                                              </p>
                                            )}
                                          </div>

                                          {t.id && (
                                            <div className="pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[9.5px] text-stone-400">
                                              <span className="font-mono">{t.id}</span>
                                              <span className="text-emerald-700 font-medium">Included</span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pending Chapters Compact Summary */}
                      {pendingChapters.length > 0 && (
                        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                              Pending Chapters ({pendingChapters.length})
                            </span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              Waiting for question types
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {pendingChapters.map(({ ch, idx }) => (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => {
                                  setViewMode('chapter');
                                  setActiveChapter(ch);
                                }}
                                className="text-left p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-white text-xs flex items-center justify-between gap-2 cursor-pointer transition-all"
                              >
                                <span className="truncate text-stone-700">
                                  <span className="font-mono text-stone-400 mr-1.5">{idx + 1}.</span>
                                  {ch}
                                </span>
                                <span className="text-[10px] font-bold text-stone-400 shrink-0">Pending</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── FORMAT 2: INDIVIDUAL CHAPTER VIEW (CURRENT VIEW) ── */}
              {viewMode === 'chapter' && (
                <div>
                  {activeChapterTypes.length === 0 ? (
                    <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-8 text-stone-400 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-800 m-0">No Question Types Assigned Yet</h4>
                        <p className="text-xs text-stone-500 mt-1 max-w-sm mb-0">
                          This chapter is currently pending. Assign syllabus question types to enable question generation.
                        </p>
                      </div>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onEdit(questionType);
                          }}
                          className="text-xs font-bold text-[#72102A] hover:underline cursor-pointer pt-1"
                        >
                          Assign question types in editor →
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {activeChapterGrouped.map(([catName, catTypes]) => (
                        <div key={catName} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getCategoryDotColor(catName)}`} />
                            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                              {catName} ({catTypes.length})
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {catTypes.map((t, idx) => (
                              <div
                                key={t.id || idx}
                                className="p-3.5 rounded-xl bg-white border border-[#E8E2D9] shadow-xs flex flex-col justify-between gap-2 hover:border-stone-300 transition-all content-visibility-auto"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-bold text-stone-900 text-[14.5px] sm:text-[15px] m-0 leading-tight">
                                      {t.name}
                                    </h4>
                                    <span
                                      className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-semibold border shrink-0 leading-none ${getCategoryBadgeStyle(
                                        t.category
                                      )}`}
                                    >
                                      {t.category || 'General'}
                                    </span>
                                  </div>

                                  {t.description && (
                                    <p className="text-[12.5px] text-stone-600 mt-1.5 mb-0 leading-snug line-clamp-2">
                                      {t.description}
                                    </p>
                                  )}
                                </div>

                                {t.id && (
                                  <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[9.5px] text-stone-400">
                                    <span className="font-mono">{t.id}</span>
                                    <span className="text-emerald-700 font-medium">Active in Syllabus</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
