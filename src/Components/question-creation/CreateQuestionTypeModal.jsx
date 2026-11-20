import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ACADEMIC_PROGRAMS,
  PROGRAM_SUBJECTS,
  EXAMS_LIST,
  SESSIONS_LIST,
  DEFAULT_CHAPTERS_BY_SUBJECT,
  MASTER_QUESTION_TYPES
} from '../../data/questionCreationData.js';
import CustomDropdown from './CustomDropdown.jsx';

const ALL_CHAPTERS_KEY = '__ALL_CHAPTERS__';

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

const FALLBACK_DUE_DATES = {
  'QTS-REQ-10': '25 Nov 2026',
  'QTS-REQ-01': '25 Nov 2026',
  'QTS-REQ-02': '28 Nov 2026',
  'QTS-REQ-03': '30 Nov 2026',
  'QTS-REQ-04': '30 Nov 2026',
  'QTS-REQ-05': '02 Dec 2026',
  'QTS-REQ-06': '24 Nov 2026',
  'QTS-REQ-07': '05 Dec 2026',
  'QTS-REQ-08': '26 Nov 2026',
  'QTS-REQ-09': '28 Nov 2026',
  'QTS-SET-01': '15 Nov 2026',
  'QTS-SET-02': '18 Nov 2026',
  'QTS-SET-03': '20 Nov 2026',
  'QTS-SET-04': '01 Dec 2026',
  'QTS-SET-05': '10 Nov 2026',
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

  const [selectedSession, setSelectedSession] = useState(
    editingItem?.session || SESSIONS_LIST[0] || '2026-27'
  );
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
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const dueDate =
    editingItem?.dueDate ||
    (editingItem?.id && FALLBACK_DUE_DATES[editingItem.id]) ||
    '28 Nov 2026';

  // Sync local state whenever modal opens or target course changes
  useEffect(() => {
    if (!isOpen) return;
    setShowClearConfirm(false);
    const subj =
      editingItem?.subject ||
      (PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]] ? PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]][0] : '');
    const chList = buildInitialChapters(editingItem, subj);

    setSelectedSession(editingItem?.session || SESSIONS_LIST[0] || '2026-27');
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

  const chapterListContainerRef = useRef(null);
  const activeChapterCardRef = useRef(null);

  // Auto-scroll Chapter-Wise Preview list so active chapter remains comfortably visible
  const scrollToActiveChapter = useCallback((smooth = true) => {
    if (!activeChapterCardRef.current || !chapterListContainerRef.current) return;
    const container = chapterListContainerRef.current;
    const card = activeChapterCardRef.current;

    const cardTop = card.offsetTop;
    const cardBottom = cardTop + card.offsetHeight;
    const containerScrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    if (cardTop < containerScrollTop) {
      container.scrollTo({
        top: Math.max(0, cardTop - 8),
        behavior: smooth ? 'smooth' : 'auto',
      });
    } else if (cardBottom > containerScrollTop + containerHeight) {
      container.scrollTo({
        top: cardBottom - containerHeight + 8,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

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

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat,
      label: cat === 'All' ? 'All Categories' : cat,
      badge: categoryCounts[cat] || 0,
      dotColor: cat === 'All' ? undefined : getCategoryDotColor(cat),
    }));
  }, [categories, categoryCounts]);

  const isAllChapters = activeChapter === ALL_CHAPTERS_KEY;

  const chapterOptions = useMemo(() => {
    return [
      {
        value: ALL_CHAPTERS_KEY,
        label: 'All Chapters',
      },
      ...chapters.map((ch, idx) => ({
        value: ch,
        label: `Ch ${idx + 1}: ${ch}`,
      })),
    ];
  }, [chapters]);

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

  // Types that are assigned to EVERY chapter
  const typesInAllChapters = useMemo(() => {
    if (chapters.length === 0) return [];
    return uniqueAllTypes.filter((t) =>
      chapters.every((ch) => (chapterQuestionTypes[ch] || []).some((item) => item.id === t.id))
    );
  }, [chapters, chapterQuestionTypes, uniqueAllTypes]);

  const activeChapterTypes = useMemo(() => {
    if (isAllChapters) {
      return typesInAllChapters;
    }
    return chapterQuestionTypes[activeChapter] || [];
  }, [isAllChapters, typesInAllChapters, chapterQuestionTypes, activeChapter]);

  const activeSelectedIds = useMemo(() => {
    if (isAllChapters) {
      const set = new Set();
      chapters.forEach((ch) => {
        (chapterQuestionTypes[ch] || []).forEach((t) => set.add(t.id));
      });
      return set;
    }
    return new Set(activeChapterTypes.map((t) => t.id));
  }, [isAllChapters, chapters, chapterQuestionTypes, activeChapterTypes]);

  // Selected count filtered by the active category (or total for 'All')
  const currentCategorySelectedCount = useMemo(() => {
    if (isAllChapters) {
      if (categoryFilter === 'All') {
        return activeSelectedIds.size;
      }
      return MASTER_QUESTION_TYPES.filter(
        (m) => m.category === categoryFilter && activeSelectedIds.has(m.id)
      ).length;
    }
    if (categoryFilter === 'All') {
      return activeChapterTypes.length;
    }
    return activeChapterTypes.filter((t) => t.category === categoryFilter).length;
  }, [isAllChapters, activeSelectedIds, categoryFilter, activeChapterTypes]);

  // Trigger auto-scroll on active chapter change or question type assignment
  useEffect(() => {
    if (!isOpen || isAllChapters) return;
    const timer = setTimeout(() => {
      scrollToActiveChapter(true);
    }, 40);
    return () => clearTimeout(timer);
  }, [isOpen, isAllChapters, activeChapter, activeChapterTypes.length, scrollToActiveChapter]);

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
  const isAllChaptersConfigured = chapters.length > 0 && pendingChaptersCount === 0;
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

    if (isAllChapters) {
      setChapterQuestionTypes((prev) => {
        const allHaveIt =
          chapters.length > 0 &&
          chapters.every((ch) => (prev[ch] || []).some((t) => t.id === mType.id));
        const next = { ...prev };
        chapters.forEach((ch) => {
          const current = next[ch] || [];
          if (allHaveIt) {
            next[ch] = current.filter((t) => t.id !== mType.id);
          } else {
            if (!current.some((t) => t.id === mType.id)) {
              next[ch] = [
                ...current,
                {
                  id: mType.id,
                  name: mType.name,
                  category: mType.category,
                  description: mType.description,
                },
              ];
            }
          }
        });
        return next;
      });
      return;
    }

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

  const handleClearActiveChapter = () => {
    if (!activeChapter) return;
    if (isAllChapters) {
      setChapterQuestionTypes(
        chapters.reduce((acc, ch) => {
          acc[ch] = [];
          return acc;
        }, {})
      );
      return;
    }
    setChapterQuestionTypes((prev) => ({ ...prev, [activeChapter]: [] }));
  };

  const handleSubmit = (status) => {
    if (status === 'Approved' && !isAllChaptersConfigured) {
      alert(`Please assign at least one question type to all ${chapters.length} chapters before submitting (${pendingChaptersCount} still pending).`);
      return;
    }

    if (uniqueAllTypes.length === 0) {
      alert('Please assign at least one question type to a chapter before saving.');
      return;
    }

    const payload = {
      id: editingItem ? editingItem.id : `QTS-SET-${Date.now().toString().slice(-4)}`,
      session: selectedSession,
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
      dueDate: editingItem?.dueDate || dueDate,
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
      className="fixed top-[60px] left-0 md:left-[240px] right-0 bottom-0 z-40 bg-black/60 backdrop-blur-sm p-2.5 sm:p-4 lg:p-5 flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={isEditingExisting ? 'Edit Question Types' : 'Add Question Types from Master Data'}
    >
      {/* Full-Area Modern Form Surface */}
      <div className="w-full h-full bg-[#FAF8F5] rounded-3xl border border-white/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-ios-reveal">

        {/* ── COMPACT MODERN HEADER ── */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
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
                <strong className="text-amber-800 font-semibold">{selectedSession}</strong> ·{' '}
                <strong className="text-[#5B21B6]">{selectedExam}</strong> ·{' '}
                <strong className="text-stone-700">{selectedProgram}</strong> ·{' '}
                <strong className="text-[#72102A]">{selectedSubject}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Due Date Data Badge in Top Bar */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F7] border border-stone-200/90 text-stone-700 font-medium text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Due Date: <strong className="text-stone-900">{dueDate}</strong></span>
            </div>

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

              {/* SECTION 1: COMPACT ACADEMIC CONTEXT (Session · Exam · Class / Program · Subject) */}
              <div className="bg-white/80 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#E8E2D9] shadow-[0_2px_10px_rgba(0,0,0,0.025)] shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center">
                    1
                  </span>
                  <h3
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#374151',
                      margin: 0,
                      letterSpacing: '0.04em',
                    }}
                    className="uppercase"
                  >
                    Academic Context
                  </h3>
                </div>

                {/* Inline Context Strip (Session · Exam · Class / Program · Subject) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Session */}
                  <div className="min-w-0">
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                      Session
                    </label>
                    {editingItem ? (
                      <div
                        title={selectedSession}
                        className="w-full h-[30px] px-2.5 rounded-xl bg-[#FFFBEB]/90 border border-[#FDE68A] text-[11px] font-bold text-[#92400E] flex items-center truncate"
                      >
                        <span className="truncate">{selectedSession}</span>
                      </div>
                    ) : (
                      <CustomDropdown
                        value={selectedSession}
                        onChange={(val) => setSelectedSession(val)}
                        options={SESSIONS_LIST.map((s) => ({ value: s, label: s }))}
                        searchable={false}
                      />
                    )}
                  </div>

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
                      Question Types for :
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] text-[11px] font-bold truncate max-w-[450px]">
                      {isAllChapters
                        ? `All Chapters (${chapters.length} Chapters)`
                        : `Ch ${activeChapterIdx + 1}: ${activeChapter}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {((isAllChapters && uniqueAllTypes.length > 0) ||
                      (!isAllChapters && activeChapterTypes.length > 0)) && (
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(true)}
                        style={{ outline: 'none' }}
                        className="text-[11px] font-semibold text-stone-500 hover:text-rose-600 cursor-pointer"
                        title={
                          isAllChapters
                            ? 'Remove all assigned question types from all chapters'
                            : 'Remove all assigned question types from this chapter'
                        }
                      >
                        {isAllChapters ? 'Clear All Chapters' : 'Clear Chapter'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Search + Chapter Dropdown + Selected Filter Toolbar (Single-line fit with flex-nowrap) */}
                <div className="flex flex-nowrap items-center justify-start gap-2 shrink-0 min-w-0 w-full">
                  {/* Search Input (Fluid width) */}
                  <div className="relative flex-1 min-w-[160px] max-w-[260px] shrink-0">
                    <svg
                      className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
                      style={{ height: '38px', fontSize: '12px', borderRadius: '9999px' }}
                      className="w-full h-[38px] bg-[#FAF9F7] border border-stone-200/90 rounded-full pl-9 pr-7 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#72102A] focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    />
                    {catalogSearch && (
                      <button
                        type="button"
                        onClick={() => setCatalogSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Chapter Filter Dropdown (Fluid width, ample space for chapter names) */}
                  <CustomDropdown
                    value={activeChapter}
                    onChange={(val) => {
                      setActiveChapter(val);
                      setShowSelectedOnly(false);
                    }}
                    options={chapterOptions}
                    variant="default"
                    rounded="full"
                    placeholder="Select Chapter"
                    className="flex-1 min-w-[220px] max-w-[360px] shrink-0"
                  />

                  {/* Selected Only Toggle (Enabled across all categories with category-specific count) */}
                  <button
                    type="button"
                    onClick={() => setShowSelectedOnly((prev) => !prev)}
                    title={
                      showSelectedOnly
                        ? 'Show all question types in this category'
                        : `Show only selected question types (${currentCategorySelectedCount})`
                    }
                    style={{ outline: 'none' }}
                    className={`h-[38px] px-3.5 rounded-full text-xs font-bold border transition-all shrink-0 cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                      showSelectedOnly
                        ? 'bg-[#72102A] text-white border-[#72102A] shadow-xs'
                        : 'bg-[#FAF9F7] text-stone-700 border-stone-200/90 hover:border-[#72102A]/40 hover:text-[#72102A] hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    <span>Selected</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        showSelectedOnly ? 'bg-white/20 text-white' : 'bg-[#FAF0F3] text-[#72102A]'
                      }`}
                    >
                      {currentCategorySelectedCount}
                    </span>
                  </button>

                  {/* Reset Filters (Right-Aligned with ml-auto on the same line) */}
                  {(catalogSearch || categoryFilter !== 'All' || showSelectedOnly) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCatalogSearch('');
                        setCategoryFilter('All');
                        setShowSelectedOnly(false);
                      }}
                      style={{ outline: 'none' }}
                      className="ml-auto h-[38px] px-3 rounded-full bg-[#FAF0F3] hover:bg-[#F5E6EA] text-[#72102A] border border-[#F2D7DF] text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                      title="Reset search and filters"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reset Filter</span>
                    </button>
                  )}
                </div>

                {/* Separate Category Chips Row (Fit all in screen, no side scroll) */}
                <div className="flex flex-wrap items-center gap-1.5 py-0.5 shrink-0">
                  {categories.map((cat) => {
                    const isSelected = categoryFilter === cat;
                    const count = categoryCounts[cat] || 0;
                    const dotColor = cat === 'All' ? null : getCategoryDotColor(cat);
                    const label = cat === 'All' ? 'All' : cat;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(cat);
                          setShowSelectedOnly(false);
                        }}
                        style={{ outline: 'none' }}
                        className={`h-[28px] px-2.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap select-none ${
                          isSelected
                            ? 'bg-[#72102A] text-white border-[#72102A] shadow-xs'
                            : 'bg-[#FAF9F7] text-stone-700 border-stone-200/90 hover:border-[#72102A]/40 hover:text-[#72102A] hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                        }`}
                        title={`Filter by ${cat === 'All' ? 'All Categories' : cat} (${count} types)`}
                      >
                        {dotColor && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isSelected ? 'bg-amber-300' : dotColor
                            }`}
                          />
                        )}
                        <span>{label}</span>
                        <span
                          className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-stone-200/70 text-stone-600'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* High-Density Scrollable Master Types Grid */}
                {filteredMasterTypes.length === 0 ? (
                  <div className="flex-1 min-h-[160px] flex flex-col items-center justify-center text-center text-xs text-stone-400 rounded-2xl border border-dashed border-stone-200 bg-stone-50/40 p-6">
                    <p className="font-semibold text-stone-500 m-0">
                      {showSelectedOnly
                        ? isAllChapters
                          ? 'No question types assigned yet across chapters.'
                          : `No question types selected for ${activeChapter} yet.`
                        : 'No question types match your search or category filter.'}
                    </p>
                    {(catalogSearch || categoryFilter !== 'All' || showSelectedOnly) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCatalogSearch('');
                          setCategoryFilter('All');
                          setShowSelectedOnly(false);
                        }}
                        className="mt-2 text-[11px] font-bold text-[#72102A] hover:underline cursor-pointer"
                      >
                        Reset filters to view all question types
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 min-h-[240px] lg:min-h-0 overflow-y-auto custom-scrollbar pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                      {filteredMasterTypes.map((mType) => {
                        const assignedCount = chapters.filter((ch) =>
                          (chapterQuestionTypes[ch] || []).some((t) => t.id === mType.id)
                        ).length;
                        const isAllAssigned = chapters.length > 0 && assignedCount === chapters.length;
                        const isPartiallyAssigned = assignedCount > 0 && assignedCount < chapters.length;
                        const isSelected = isAllChapters ? isAllAssigned : activeSelectedIds.has(mType.id);

                        return (
                          <button
                            key={mType.id}
                            type="button"
                            onClick={() => toggleMasterType(mType)}
                            style={{ outline: 'none' }}
                            className={`text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between gap-1.5 group ${
                              isSelected
                                ? 'bg-gradient-to-br from-[#FDF4F6] via-white to-[#FAF0F3]/70 border-[#72102A] ring-1 ring-[#72102A]/15 shadow-[0_4px_14px_-6px_rgba(114,16,42,0.2)]'
                                : isPartiallyAssigned && isAllChapters
                                ? 'bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7]/40 border-amber-400 ring-1 ring-amber-400/20 shadow-xs'
                                : 'bg-white/90 border-stone-200/85 hover:border-[#72102A]/35 hover:bg-white hover:shadow-xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`font-bold text-[13.5px] leading-tight transition-colors line-clamp-1 ${
                                  isSelected
                                    ? 'text-[#72102A]'
                                    : isPartiallyAssigned && isAllChapters
                                    ? 'text-amber-900 group-hover:text-[#72102A]'
                                    : 'text-stone-900 group-hover:text-[#72102A]'
                                }`}
                                title={mType.name}
                              >
                                {mType.name}
                              </span>

                              <span
                                className={`w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ${
                                  isSelected
                                    ? 'bg-[#72102A] text-white scale-105'
                                    : isPartiallyAssigned && isAllChapters
                                    ? 'bg-amber-500 text-white border-2 border-amber-500'
                                    : 'bg-white border-2 border-stone-300 group-hover:border-[#72102A]/50'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {!isSelected && isPartiallyAssigned && isAllChapters && (
                                  <span className="w-2 h-0.5 bg-white rounded-full" />
                                )}
                              </span>
                            </div>

                            <p className="text-[11.5px] text-stone-600 line-clamp-2 leading-snug m-0">
                              {mType.description}
                            </p>

                            <div className="flex items-center justify-between pt-0.5">
                              <span
                                className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-semibold border ${getCategoryBadgeStyle(
                                  mType.category
                                )}`}
                              >
                                {mType.category}
                              </span>
                              <span
                                className={`text-[10px] font-bold transition-opacity ${
                                  isSelected
                                    ? 'text-[#72102A] opacity-100'
                                    : isPartiallyAssigned && isAllChapters
                                    ? 'text-amber-800 opacity-100'
                                    : 'text-stone-400 opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                {isSelected
                                  ? isAllChapters ? 'All Chapters' : 'Added'
                                  : isPartiallyAssigned && isAllChapters
                                  ? `${assignedCount}/${chapters.length} Chapters`
                                  : isAllChapters ? '+ Add All' : '+ Add'}
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

                {/* Chapter-Wise Grouped List (Maximum Height & High Tile Visibility) */}
                <div
                  ref={chapterListContainerRef}
                  className="relative flex-1 min-h-[220px] lg:min-h-0 py-2 overflow-y-auto custom-scrollbar space-y-2.5 pr-0.5"
                >
                  {/* All Chapters Master Selector Card */}
                  <div
                    ref={isAllChapters ? activeChapterCardRef : null}
                    onClick={() => {
                      setActiveChapter(ALL_CHAPTERS_KEY);
                      setShowSelectedOnly(false);
                    }}
                    className={`rounded-2xl border p-3 transition-all duration-150 cursor-pointer ${
                      isAllChapters
                        ? 'bg-[#FFF9FA] border-[#72102A]/55 shadow-[0_4px_16px_-4px_rgba(114,16,42,0.18)] ring-1 ring-[#72102A]/20'
                        : 'bg-white/95 hover:bg-[#FAF8F5] border-stone-200/85 hover:border-[#72102A]/30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg leading-none shrink-0 ${
                            isAllChapters
                              ? 'bg-[#72102A] text-white shadow-xs'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          ALL
                        </span>
                        <span
                          className={`text-xs font-extrabold truncate ${
                            isAllChapters ? 'text-[#72102A]' : 'text-stone-850'
                          }`}
                        >
                          All Chapters
                        </span>
                      </div>

                      <span
                        className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                          typesInAllChapters.length > 0
                            ? 'bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]'
                            : 'bg-stone-50 text-stone-500 border border-stone-200'
                        }`}
                      >
                        {typesInAllChapters.length > 0
                          ? `${typesInAllChapters.length} Shared`
                          : `${uniqueAllTypes.length} Total`}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-stone-500 mt-1 mb-0 pl-0.5">
                      {isAllChapters
                        ? 'Selecting cards assigns question types to all chapters together.'
                        : 'Click to select and assign question types to all chapters at once.'}
                    </p>
                  </div>

                  {chapters.map((ch, idx) => {
                    const isActive = ch === activeChapter;
                    const types = chapterQuestionTypes[ch] || [];
                    return (
                      <div
                        key={ch}
                        ref={isActive ? activeChapterCardRef : null}
                        onClick={() => {
                          setActiveChapter(ch);
                          setShowSelectedOnly(false);
                        }}
                        className={`rounded-2xl border p-3 transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-[#FFF9FA] border-[#72102A]/55 shadow-[0_4px_16px_-4px_rgba(114,16,42,0.18)] ring-1 ring-[#72102A]/20'
                            : types.length > 0
                            ? 'bg-white/95 hover:bg-[#FAF8F5] border-emerald-200/90 hover:border-emerald-300 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                            : 'bg-[#FAF8F5]/85 hover:bg-white border-stone-200/85 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg leading-none shrink-0 ${
                                isActive
                                  ? 'bg-[#72102A] text-white shadow-xs'
                                  : types.length > 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              Ch {idx + 1}
                            </span>
                            <span
                              title={ch}
                              className={`text-xs font-extrabold truncate ${
                                isActive ? 'text-[#72102A]' : 'text-stone-850'
                              }`}
                            >
                              {ch}
                            </span>
                          </div>

                          <span
                            className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                              types.length > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
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

                {/* Section 3 Action Buttons (Integrated into Chapter-Wise Preview) */}
                <div className="pt-3 mt-1 border-t border-stone-200/80 flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSubmit('Draft')}
                    style={{ outline: 'none' }}
                    className="flex-1 h-9 px-3 rounded-full border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    disabled={!isAllChaptersConfigured}
                    onClick={() => isAllChaptersConfigured && handleSubmit('Approved')}
                    title={
                      isAllChaptersConfigured
                        ? 'Submit Question Types'
                        : `Assign at least one question type to all chapters to submit (${pendingChaptersCount} pending)`
                    }
                    style={{ outline: 'none' }}
                    className={`flex-1 h-9 px-3 rounded-full font-bold text-xs transition-all inline-flex items-center justify-center gap-1.5 ${
                      isAllChaptersConfigured
                        ? 'bg-gradient-to-r from-[#72102A] to-[#54081C] hover:from-[#851633] hover:to-[#680C25] text-white shadow-md shadow-[#72102A]/20 active:scale-95 cursor-pointer'
                        : 'bg-stone-200 text-stone-400 border border-stone-300/80 cursor-not-allowed select-none shadow-none'
                    }`}
                  >
                    <span>Submit Question Types</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Clear Chapter Confirmation Popup Warning */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowClearConfirm(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-ios-reveal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-[19px] font-black text-stone-900 m-0 leading-tight">
                  {isAllChapters ? 'Clear Question Types for All Chapters?' : 'Clear Question Types for this Chapter?'}
                </h3>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed m-0">
                  {isAllChapters ? (
                    <>
                      You are about to remove all <strong>{totalAssignments}</strong> question type assignments across all <strong>{chapters.length}</strong> chapters.
                    </>
                  ) : (
                    <>
                      You are about to remove all <strong>{activeChapterTypes.length}</strong> assigned question type{activeChapterTypes.length === 1 ? '' : 's'} from:
                    </>
                  )}
                </p>
                <div className="mt-3 px-3.5 py-2.5 rounded-2xl bg-[#FAF0F3] border border-[#F2D7DF] text-[13.5px] font-black text-[#72102A] truncate">
                  {isAllChapters ? `All ${chapters.length} Chapters` : `Ch ${activeChapterIdx + 1}: ${activeChapter}`}
                </div>
                <div className="mt-3.5 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-700">•</span>
                    <span>
                      {isAllChapters
                        ? 'All chapters will reset to Pending status.'
                        : "This chapter's configuration status will reset to Pending."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-700">•</span>
                    <span>You can re-add question types from the catalogue at any time.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="h-10 px-5 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-sm font-bold transition-all cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClearActiveChapter();
                  setShowClearConfirm(false);
                }}
                className="h-10 px-6 sm:px-7 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-extrabold transition-all shadow-md shadow-red-600/30 hover:shadow-lg active:scale-95 cursor-pointer inline-flex items-center gap-2 border border-red-700/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{isAllChapters ? 'Yes, Clear All Chapters' : 'Yes, Clear Chapter'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
