import React, { useState, useEffect, useMemo } from 'react';
import {
  ACADEMIC_PROGRAMS,
  PROGRAM_SUBJECTS,
  EXAMS_LIST,
  DEFAULT_CHAPTERS_BY_SUBJECT,
  MASTER_QUESTION_TYPES
} from '../../data/questionCreationData.js';
import CustomDropdown from './CustomDropdown.jsx';

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

const groupTypesByCategory = (types = [], categoryOrder = []) => {
  const grouped = new Map();
  types.forEach((t) => {
    const cat = t.category || 'General';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(t);
  });

  const orderIndex = new Map(categoryOrder.map((cat, i) => [cat, i]));
  return Array.from(grouped.entries()).sort((a, b) => {
    const idxA = orderIndex.has(a[0]) ? orderIndex.get(a[0]) : 999;
    const idxB = orderIndex.has(b[0]) ? orderIndex.get(b[0]) : 999;
    return idxA - idxB;
  });
};

const getFallbackChapters = (subject) => {
  if (subject && DEFAULT_CHAPTERS_BY_SUBJECT[subject]) {
    return [...DEFAULT_CHAPTERS_BY_SUBJECT[subject]];
  }
  return ['Chapter 1: Fundamentals', 'Chapter 2: Core Concepts', 'Chapter 3: Applications'];
};

const buildInitialChapters = (editingItem, subject) => {
  if (editingItem && Array.isArray(editingItem.chapters) && editingItem.chapters.length > 0) {
    return [...editingItem.chapters];
  }
  return getFallbackChapters(subject);
};

const buildInitialChapterMap = (editingItem, chaptersList) => {
  const map = {};
  const existingMap = editingItem?.chapterQuestionTypes;
  const legacyTypes = Array.isArray(editingItem?.questionTypes) ? editingItem.questionTypes : [];

  chaptersList.forEach((ch) => {
    if (existingMap && Array.isArray(existingMap[ch])) {
      map[ch] = [...existingMap[ch]];
    } else if (!existingMap && legacyTypes.length > 0) {
      map[ch] = [...legacyTypes];
    } else {
      map[ch] = [];
    }
  });
  return map;
};

export default function CreateQuestionTypeModal({ isOpen, onClose, onSave, editingItem }) {
  const initialSubject =
    editingItem?.subject ||
    (PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]] ? PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]][0] : '');
  const initialChapters = buildInitialChapters(editingItem, initialSubject);

  const [selectedExam, setSelectedExam] = useState(
    editingItem?.assessmentTag || EXAMS_LIST[0].name
  );
  const [selectedProgram, setSelectedProgram] = useState(
    editingItem?.program || ACADEMIC_PROGRAMS[0]
  );
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [chapters, setChapters] = useState(initialChapters);
  const [activeChapter, setActiveChapter] = useState(initialChapters[0] || '');
  const [chapterQuestionTypes, setChapterQuestionTypes] = useState(() =>
    buildInitialChapterMap(editingItem, initialChapters)
  );

  const [catalogSearch, setCatalogSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Sync local state whenever modal opens or target course changes
  useEffect(() => {
    if (!isOpen) return;
    const subj =
      editingItem?.subject ||
      (PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]] ? PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]][0] : '');
    const chList = buildInitialChapters(editingItem, subj);

    setSelectedExam(editingItem?.assessmentTag || EXAMS_LIST[0].name);
    setSelectedProgram(editingItem?.program || ACADEMIC_PROGRAMS[0]);
    setSelectedSubject(subj);
    setChapters(chList);
    setActiveChapter(chList[0] || '');
    setChapterQuestionTypes(buildInitialChapterMap(editingItem, chList));
    setCatalogSearch('');
    setCategoryFilter('All');
    setShowSelectedOnly(false);
  }, [isOpen, editingItem]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const categories = useMemo(
    () => ['All', ...new Set(MASTER_QUESTION_TYPES.map((m) => m.category))],
    []
  );

  const categoryCounts = useMemo(() => {
    const counts = { All: MASTER_QUESTION_TYPES.length };
    MASTER_QUESTION_TYPES.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, []);

  const activeChapterTypes = useMemo(
    () => chapterQuestionTypes[activeChapter] || [],
    [chapterQuestionTypes, activeChapter]
  );

  const activeSelectedIds = useMemo(
    () => new Set(activeChapterTypes.map((t) => t.id)),
    [activeChapterTypes]
  );

  // Deduplicated unique types across all chapters + aggregate stats
  const { uniqueAllTypes, totalAssignments, configuredChaptersCount } = useMemo(() => {
    const uniqueMap = new Map();
    let total = 0;
    let configured = 0;

    chapters.forEach((ch) => {
      const list = chapterQuestionTypes[ch] || [];
      if (list.length > 0) configured += 1;
      total += list.length;
      list.forEach((t) => {
        if (!uniqueMap.has(t.id)) {
          uniqueMap.set(t.id, t);
        }
      });
    });

    return {
      uniqueAllTypes: Array.from(uniqueMap.values()),
      totalAssignments: total,
      configuredChaptersCount: configured,
    };
  }, [chapters, chapterQuestionTypes]);

  const filteredMasterTypes = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    return MASTER_QUESTION_TYPES.filter((m) => {
      if (showSelectedOnly && !activeSelectedIds.has(m.id)) return false;
      const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [catalogSearch, categoryFilter, showSelectedOnly, activeSelectedIds]);

  if (!isOpen) return null;

  const activeChapterIdx = Math.max(0, chapters.indexOf(activeChapter));
  const pendingChaptersCount = chapters.length - configuredChaptersCount;
  const chapterProgressPct =
    chapters.length > 0 ? Math.round((configuredChaptersCount / chapters.length) * 100) : 0;

  const handleProgramChange = (prog) => {
    setSelectedProgram(prog);
    const subs = PROGRAM_SUBJECTS[prog] || [];
    const nextSub = subs[0] || '';
    setSelectedSubject(nextSub);
    const nextCh = getFallbackChapters(nextSub);
    setChapters(nextCh);
    setActiveChapter(nextCh[0] || '');
    setChapterQuestionTypes(buildInitialChapterMap(null, nextCh));
  };

  const handleSubjectChange = (sub) => {
    setSelectedSubject(sub);
    const nextCh = getFallbackChapters(sub);
    setChapters(nextCh);
    setActiveChapter(nextCh[0] || '');
    setChapterQuestionTypes(buildInitialChapterMap(null, nextCh));
  };

  const toggleMasterType = (mType) => {
    if (!activeChapter) return;
    setChapterQuestionTypes((prev) => {
      const current = prev[activeChapter] || [];
      const exists = current.some((t) => t.id === mType.id);
      const nextList = exists
        ? current.filter((t) => t.id !== mType.id)
        : [
            ...current,
            {
              id: mType.id,
              name: mType.name,
              category: mType.category,
              description: mType.description,
            },
          ];
      return { ...prev, [activeChapter]: nextList };
    });
  };

  const removeTypeFromChapter = (chapterName, typeId) => {
    setChapterQuestionTypes((prev) => ({
      ...prev,
      [chapterName]: (prev[chapterName] || []).filter((t) => t.id !== typeId),
    }));
  };

  const handleSelectAllVisible = () => {
    if (!activeChapter) return;
    setChapterQuestionTypes((prev) => {
      const current = prev[activeChapter] || [];
      const existingIds = new Set(current.map((t) => t.id));
      const toAdd = filteredMasterTypes
        .filter((m) => !existingIds.has(m.id))
        .map((m) => ({
          id: m.id,
          name: m.name,
          category: m.category,
          description: m.description,
        }));
      return { ...prev, [activeChapter]: [...current, ...toAdd] };
    });
  };

  const handleClearActiveChapter = () => {
    if (!activeChapter) return;
    setChapterQuestionTypes((prev) => ({ ...prev, [activeChapter]: [] }));
  };

  const handleStepChapter = (delta) => {
    const nextIdx = activeChapterIdx + delta;
    if (nextIdx >= 0 && nextIdx < chapters.length) {
      setActiveChapter(chapters[nextIdx]);
      setShowSelectedOnly(false);
    }
  };

  const handleSubmit = (status) => {
    if (uniqueAllTypes.length === 0) {
      alert('Please assign at least one question type to a chapter before saving.');
      return;
    }

    const payload = {
      id: editingItem ? editingItem.id : `QTS-SET-${Date.now().toString().slice(-4)}`,
      program: selectedProgram,
      subject: selectedSubject,
      department:
        editingItem?.department ||
        (selectedProgram.includes('Science') || selectedProgram.includes('Physics')
          ? 'Science'
          : 'General Faculty'),
      assignedTeacher: editingItem?.assignedTeacher || 'Current Educator (You)',
      status,
      updatedAt: 'Just now',
      chapters,
      chapterQuestionTypes,
      questionTypes: uniqueAllTypes,
      assessmentTag: selectedExam,
      requestedBy: editingItem?.requestedBy,
      requestedAt: editingItem?.requestedAt,
      isNewRequest: false,
    };

    onSave(payload, status);
    onClose();
  };

  const isEditingExisting = Boolean(
    editingItem && editingItem.questionTypes && editingItem.questionTypes.length > 0
  );

  return (
    /* Covers ONLY the main workspace area — Top NavBar (60px) & Left Sidebar (240px) remain crisp & unblurred */
    <div
      className="fixed top-[60px] left-0 md:left-[240px] right-0 bottom-0 z-40 bg-[#FAF8F5]/72 backdrop-blur-md p-2.5 sm:p-4 lg:p-5 flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={isEditingExisting ? 'Edit Question Types' : 'Add Question Types from Master Data'}
    >
      {/* Full-Area Modern Frosted Glass Form Surface */}
      <div className="w-full h-full bg-white/85 backdrop-blur-xl rounded-3xl border border-white/95 shadow-[0_14px_44px_-10px_rgba(24,24,27,0.12),0_0_0_1px_rgba(232,226,217,0.9)] flex flex-col overflow-hidden animate-ios-reveal">
        
        {/* ── COMPACT MODERN HEADER ── */}
        <div className="px-4 sm:px-6 py-3 bg-white/85 backdrop-blur-lg border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1F3A] to-[#5C0C21] text-white flex items-center justify-center font-bold text-[11px] shadow-sm shrink-0">
              QT
            </div>

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
                  {isEditingExisting ? 'Edit Chapter-Wise Question Types' : 'Add Chapter-Wise Question Types'}
                </h2>
                {editingItem?.id && (
                  <span className="font-mono text-[10px] font-bold text-[#72102A] bg-[#FAF0F3] border border-[#F2D7DF] px-2 py-0.5 rounded-full">
                    {editingItem.id}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate m-0">
                Assign syllabus question formats per chapter for{' '}
                <strong className="text-[#5B21B6]">{selectedExam}</strong> ·{' '}
                <strong className="text-stone-700">{selectedProgram}</strong> ·{' '}
                <strong className="text-[#72102A]">{selectedSubject}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                configuredChaptersCount === chapters.length && chapters.length > 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-[#FEF3C7]/80 text-[#92400E] border-[#FDE68A]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  configuredChaptersCount === chapters.length && chapters.length > 0
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
              />
              {configuredChaptersCount}/{chapters.length} Chapters
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] text-[11px] font-bold">
              {totalAssignments} Assigned
            </span>
            <button
              type="button"
              onClick={onClose}
              style={{ outline: 'none' }}
              className="w-8 h-8 rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer text-xs"
              aria-label="Close form"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── LOCKED-VIEWPORT OPTIMIZED SPLIT WORKSPACE ── */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-3.5 sm:p-4 bg-gradient-to-br from-[#FAF8F5]/75 via-white/55 to-[#FAF0F3]/35">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:h-full lg:min-h-0">
            
            {/* LEFT MAIN WORKSPACE (8 Cols): Compact Context + Chapter Strip + High-Density Catalogue */}
            <div className="lg:col-span-8 flex flex-col gap-3 lg:h-full lg:min-h-0">
              
              {/* SECTION 1: ULTRA-COMPACT ACADEMIC CONTEXT + CHAPTER SELECTOR */}
              <div className="bg-white/80 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#E8E2D9] shadow-[0_2px_10px_rgba(0,0,0,0.025)] shrink-0">
                {/* Inline Context Strip (Exam · Class / Program · Subject) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Exam */}
                  <div className="min-w-0">
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                      Exam
                    </label>
                    {editingItem ? (
                      <div
                        title={selectedExam}
                        className="w-full h-[30px] px-2.5 rounded-xl bg-[#F5F3FF]/85 border border-[#DDD6FE] text-[11px] font-bold text-[#5B21B6] flex items-center truncate"
                      >
                        <span className="truncate">{selectedExam}</span>
                      </div>
                    ) : (
                      <CustomDropdown
                        value={selectedExam}
                        onChange={(val) => setSelectedExam(val)}
                        options={EXAMS_LIST.map((ex) => ({ value: ex.name, label: ex.name }))}
                        searchable={false}
                      />
                    )}
                  </div>

                  {/* Class / Program */}
                  <div className="min-w-0">
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                      Class / Program
                    </label>
                    {editingItem ? (
                      <div
                        title={selectedProgram}
                        className="w-full h-[30px] px-2.5 rounded-xl bg-[#FAF8F5]/95 border border-stone-200/80 text-[11px] font-bold text-stone-800 flex items-center truncate"
                      >
                        <span className="truncate">{selectedProgram}</span>
                      </div>
                    ) : (
                      <CustomDropdown
                        value={selectedProgram}
                        onChange={(val) => handleProgramChange(val)}
                        options={ACADEMIC_PROGRAMS}
                      />
                    )}
                  </div>

                  {/* Subject */}
                  <div className="min-w-0">
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                      Subject
                    </label>
                    {editingItem ? (
                      <div
                        title={selectedSubject}
                        className="w-full h-[30px] px-2.5 rounded-xl bg-[#FAF0F3]/75 border border-[#E6C4CD] text-[11px] font-bold text-[#72102A] flex items-center justify-between gap-1.5"
                      >
                        <span className="truncate">{selectedSubject}</span>
                        {editingItem.department && (
                          <span className="text-[9px] font-medium text-[#72102A]/65 shrink-0 hidden xl:inline">
                            {editingItem.department}
                          </span>
                        )}
                      </div>
                    ) : (
                      <CustomDropdown
                        value={selectedSubject}
                        onChange={(val) => handleSubjectChange(val)}
                        options={PROGRAM_SUBJECTS[selectedProgram] || []}
                      />
                    )}
                  </div>
                </div>

                {/* Chapter Selector Bar */}
                <div className="mt-2.5 pt-2.5 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-[10.5px] font-bold text-stone-700 uppercase tracking-wider">
                      Select Chapter
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      ({chapters.length} chapters)
                    </span>
                  </div>

                  {/* Interactive Chapter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
                    {chapters.map((ch, idx) => {
                      const isActive = ch === activeChapter;
                      const count = (chapterQuestionTypes[ch] || []).length;
                      const isConfigured = count > 0;
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => {
                            setActiveChapter(ch);
                            setShowSelectedOnly(false);
                          }}
                          style={{ outline: 'none' }}
                          title={ch}
                          className={`group shrink-0 px-3 py-1.5 rounded-xl border text-[11.5px] font-semibold transition-all duration-150 cursor-pointer inline-flex items-center gap-2 max-w-[260px] ${
                            isActive
                              ? 'bg-gradient-to-r from-[#72102A] to-[#5C0C21] text-white border-[#72102A] shadow-[0_4px_12px_-3px_rgba(114,16,42,0.35)]'
                              : isConfigured
                              ? 'bg-emerald-50/60 hover:bg-emerald-50 text-stone-800 border-emerald-200/90 hover:border-emerald-300'
                              : 'bg-[#FAF8F5] hover:bg-white text-stone-700 border-stone-200/90 hover:border-[#72102A]/40'
                          }`}
                        >
                          <span
                            className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md leading-none shrink-0 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : isConfigured
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-stone-200/80 text-stone-500'
                            }`}
                          >
                            Ch {idx + 1}
                          </span>
                          <span className="truncate">{ch}</span>
                          <span
                            className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold inline-flex items-center justify-center shrink-0 ${
                              isActive
                                ? 'bg-white text-[#72102A]'
                                : isConfigured
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 2: HIGH-DENSITY MASTER CATALOGUE FOR ACTIVE CHAPTER */}
              <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8E2D9] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex-1 min-h-0 flex flex-col gap-2.5">
                
                {/* Catalogue Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span className="text-[10.5px] font-bold text-stone-600 uppercase tracking-wider shrink-0">
                      Question Types for
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] text-[11px] font-bold truncate max-w-[260px]">
                      Ch {activeChapterIdx + 1}: {activeChapter}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleSelectAllVisible}
                      style={{ outline: 'none' }}
                      className="text-[11px] font-semibold text-[#72102A] hover:underline cursor-pointer"
                    >
                      Select Visible ({filteredMasterTypes.length})
                    </button>
                    {activeChapterTypes.length > 0 && (
                      <>
                        <span className="text-stone-300">·</span>
                        <button
                          type="button"
                          onClick={handleClearActiveChapter}
                          style={{ outline: 'none' }}
                          className="text-[11px] font-semibold text-stone-500 hover:text-rose-600 cursor-pointer"
                        >
                          Clear Chapter
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Single-Row Search + Selected Toggle + Horizontal Scrollable Categories */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="relative w-full sm:w-[205px]">
                      <svg
                        className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Search 190+ types..."
                        style={{ height: '32px', fontSize: '11.5px', borderRadius: '9999px' }}
                        className="w-full bg-[#FAF9F7] border border-stone-200/90 rounded-full pl-8 pr-6 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#72102A] focus:bg-white transition-all"
                      />
                      {catalogSearch && (
                        <button
                          type="button"
                          onClick={() => setCatalogSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-[10px] cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowSelectedOnly((prev) => !prev)}
                      style={{ outline: 'none' }}
                      className={`h-[32px] px-2.5 rounded-full text-[11px] font-bold border transition-all shrink-0 cursor-pointer inline-flex items-center gap-1 ${
                        showSelectedOnly
                          ? 'bg-[#72102A] text-white border-[#72102A]'
                          : 'bg-white text-stone-600 border-stone-200/90 hover:border-[#72102A]/40 hover:text-[#72102A]'
                      }`}
                    >
                      <span>Selected</span>
                      <span
                        className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${
                          showSelectedOnly ? 'bg-white/20 text-white' : 'bg-[#FAF0F3] text-[#72102A]'
                        }`}
                      >
                        {activeChapterTypes.length}
                      </span>
                    </button>
                  </div>

                  {/* Horizontal Single-Row Category Strip */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-1 min-w-0 custom-scrollbar">
                    {categories.map((cat) => {
                      const active = categoryFilter === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategoryFilter(cat)}
                          style={{ outline: 'none' }}
                          className={`shrink-0 px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1 ${
                            active
                              ? 'bg-[#72102A] text-white shadow-2xs'
                              : 'bg-[#FAF8F5] text-stone-600 border border-stone-200/80 hover:border-stone-300 hover:text-stone-900'
                          }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`text-[9.5px] font-bold px-1 rounded-full leading-tight ${
                              active ? 'bg-white/20 text-white' : 'bg-stone-200/75 text-stone-500'
                            }`}
                          >
                            {categoryCounts[cat] || 0}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* High-Density Scrollable Master Types Grid */}
                {filteredMasterTypes.length === 0 ? (
                  <div className="flex-1 min-h-[160px] flex flex-col items-center justify-center text-center text-xs text-stone-400 rounded-2xl border border-dashed border-stone-200 bg-stone-50/40 p-6">
                    <p className="font-semibold text-stone-500 m-0">
                      {showSelectedOnly
                        ? `No question types selected for ${activeChapter} yet.`
                        : 'No question types match your search.'}
                    </p>
                    {showSelectedOnly && (
                      <button
                        type="button"
                        onClick={() => setShowSelectedOnly(false)}
                        className="mt-2 text-[11px] font-bold text-[#72102A] hover:underline cursor-pointer"
                      >
                        Show all master question types
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 min-h-[240px] lg:min-h-0 overflow-y-auto custom-scrollbar pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                      {filteredMasterTypes.map((mType) => {
                        const isSelected = activeSelectedIds.has(mType.id);
                        return (
                          <button
                            key={mType.id}
                            type="button"
                            onClick={() => toggleMasterType(mType)}
                            style={{ outline: 'none' }}
                            className={`text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2 group ${
                              isSelected
                                ? 'bg-gradient-to-br from-[#FDF4F6] via-white to-[#FAF0F3]/70 border-[#72102A] ring-1 ring-[#72102A]/15 shadow-[0_4px_14px_-6px_rgba(114,16,42,0.2)]'
                                : 'bg-white/90 border-stone-200/85 hover:border-[#72102A]/35 hover:bg-white hover:shadow-xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`font-bold text-[12px] leading-snug transition-colors line-clamp-1 ${
                                  isSelected ? 'text-[#72102A]' : 'text-stone-900 group-hover:text-[#72102A]'
                                }`}
                                title={mType.name}
                              >
                                {mType.name}
                              </span>

                              <span
                                className={`w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ${
                                  isSelected
                                    ? 'bg-[#72102A] text-white scale-105'
                                    : 'bg-white border-2 border-stone-300 group-hover:border-[#72102A]/50'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </span>
                            </div>

                            <p className="text-[10.5px] text-stone-500 line-clamp-2 leading-relaxed m-0">
                              {mType.description}
                            </p>

                            <div className="flex items-center justify-between pt-0.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold border ${getCategoryBadgeStyle(
                                  mType.category
                                )}`}
                              >
                                {mType.category}
                              </span>
                              <span
                                className={`text-[10px] font-bold transition-opacity ${
                                  isSelected
                                    ? 'text-[#72102A] opacity-100'
                                    : 'text-stone-400 opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                {isSelected ? 'Added' : '+ Add'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL (4 Cols): CHAPTER-WISE LIVE SUMMARY & QUICK STEPPER */}
            <div className="lg:col-span-4 flex flex-col lg:h-full lg:min-h-0">
              <div className="bg-white/85 backdrop-blur-lg p-3.5 rounded-2xl border border-[#E8E2D9] shadow-[0_4px_20px_-6px_rgba(24,24,27,0.06)] flex flex-col flex-1 min-h-0">
                
                {/* Summary Header + Progress Bar */}
                <div className="pb-3 border-b border-stone-100 shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center">
                        3
                      </span>
                      <h3
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#1F2937',
                          margin: 0,
                          letterSpacing: '0.04em',
                        }}
                        className="uppercase"
                      >
                        Chapter-Wise Preview
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]">
                      {uniqueAllTypes.length} Unique
                    </span>
                  </div>

                  {/* Chapter Coverage Progress Bar */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10.5px] mb-1">
                      <span className="font-semibold text-stone-600">
                        {configuredChaptersCount} of {chapters.length} chapters configured
                      </span>
                      <span className="font-bold text-[#72102A]">{chapterProgressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${chapterProgressPct}%`,
                          background:
                            chapterProgressPct === 100
                              ? 'linear-gradient(90deg, #059669 0%, #10B981 100%)'
                              : 'linear-gradient(90deg, #72102A 0%, #B45309 100%)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chapter-Wise Grouped List */}
                <div className="flex-1 min-h-[180px] lg:min-h-0 py-2.5 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
                  {chapters.map((ch, idx) => {
                    const isActive = ch === activeChapter;
                    const types = chapterQuestionTypes[ch] || [];
                    return (
                      <div
                        key={ch}
                        onClick={() => setActiveChapter(ch)}
                        className={`rounded-xl border p-2.5 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#FDF7F8] border-[#72102A]/45 shadow-[0_2px_10px_-4px_rgba(114,16,42,0.18)]'
                            : 'bg-[#FAF8F5]/80 hover:bg-white border-stone-200/80 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md leading-none shrink-0 ${
                                isActive
                                  ? 'bg-[#72102A] text-white'
                                  : types.length > 0
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              Ch {idx + 1}
                            </span>
                            <span
                              title={ch}
                              className={`text-[11.5px] font-bold truncate ${
                                isActive ? 'text-[#72102A]' : 'text-stone-800'
                              }`}
                            >
                              {ch}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              types.length > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {types.length > 0 ? `${types.length} ${types.length === 1 ? 'type' : 'types'}` : 'Pending'}
                          </span>
                        </div>

                        {types.length === 0 ? (
                          <p className="text-[10.5px] text-stone-400 italic mt-1.5 mb-0 pl-0.5">
                            {isActive
                              ? 'Select cards on the left to assign to this chapter.'
                              : 'Click to select question types for this chapter.'}
                          </p>
                        ) : (
                          <div className="mt-2.5 pt-2 border-t border-stone-200/60 space-y-2.5">
                            {groupTypesByCategory(types, categories).map(([catName, catTypes]) => (
                              <div key={catName}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${getCategoryDotColor(catName)}`}
                                  />
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                                    {catName}
                                  </span>
                                  <span className="text-[9.5px] font-semibold text-stone-400">
                                    ({catTypes.length})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {catTypes.map((t) => (
                                    <span
                                      key={t.id}
                                      className={`inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeStyle(
                                        t.category
                                      )}`}
                                    >
                                      <span className="max-w-[140px] truncate">{t.name}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeTypeFromChapter(ch, t.id);
                                        }}
                                        style={{ outline: 'none' }}
                                        className="w-3.5 h-3.5 rounded-full hover:bg-black/10 flex items-center justify-center text-[9px] leading-none cursor-pointer"
                                        title={`Remove ${t.name} from ${ch}`}
                                      >
                                        ✕
                                      </button>
                                    </span>
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

                {/* Pinned Bottom Quick Chapter Stepper */}
                {chapters.length > 1 && (
                  <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={activeChapterIdx === 0}
                      onClick={() => handleStepChapter(-1)}
                      style={{ outline: 'none' }}
                      className={`h-8 px-3 rounded-full text-[11px] font-semibold border transition-all inline-flex items-center gap-1 ${
                        activeChapterIdx === 0
                          ? 'bg-stone-50 text-stone-300 border-stone-200/70 cursor-not-allowed'
                          : 'bg-white hover:bg-[#FAF0F3] text-stone-700 hover:text-[#72102A] border-stone-200 hover:border-[#E6C4CD] cursor-pointer'
                      }`}
                    >
                      <span>←</span>
                      <span>Prev</span>
                    </button>

                    <span className="text-[11px] font-bold text-stone-500">
                      Chapter {activeChapterIdx + 1} / {chapters.length}
                    </span>

                    <button
                      type="button"
                      disabled={activeChapterIdx === chapters.length - 1}
                      onClick={() => handleStepChapter(1)}
                      style={{ outline: 'none' }}
                      className={`h-8 px-3 rounded-full text-[11px] font-semibold border transition-all inline-flex items-center gap-1 ${
                        activeChapterIdx === chapters.length - 1
                          ? 'bg-stone-50 text-stone-300 border-stone-200/70 cursor-not-allowed'
                          : 'bg-white hover:bg-[#FAF0F3] text-stone-700 hover:text-[#72102A] border-stone-200 hover:border-[#E6C4CD] cursor-pointer'
                      }`}
                    >
                      <span>Next</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── STICKY FROSTED FOOTER BAR ── */}
        <div className="px-4 sm:px-6 py-3 bg-white/90 backdrop-blur-xl border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              style={{ outline: 'none' }}
              className="h-9 px-5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>

            {pendingChaptersCount > 0 ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {pendingChaptersCount} {pendingChaptersCount === 1 ? 'chapter' : 'chapters'} still pending
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                All {chapters.length} chapters configured
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSubmit('Draft')}
              style={{ outline: 'none' }}
              className="h-9 px-5 rounded-full border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 font-bold text-xs transition-all cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('Approved')}
              style={{ outline: 'none' }}
              className="h-9 px-6 rounded-full bg-gradient-to-r from-[#72102A] to-[#54081C] hover:from-[#851633] hover:to-[#680C25] text-white font-bold text-xs shadow-md shadow-[#72102A]/20 transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Question Types</span>
              {totalAssignments > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold leading-none">
                  {configuredChaptersCount}/{chapters.length} Ch
                </span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
