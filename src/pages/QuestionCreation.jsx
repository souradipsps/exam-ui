import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ACADEMIC_PROGRAMS,
  PROGRAM_SUBJECTS,
  DIFFICULTY_LEVELS,
  INITIAL_QUESTION_TYPE_SETS,
  INITIAL_SUBMITTED_QUESTIONS
} from '../data/questionCreationData.js';

import Icon from '../Components/common/Icon.jsx';
import CustomDropdown from '../Components/question-creation/CustomDropdown.jsx';
import CreateQuestionTypeModal from '../Components/question-creation/CreateQuestionTypeModal.jsx';
import CreateQuestionModal from '../Components/question-creation/CreateQuestionModal.jsx';
import QuestionViewModal from '../Components/question-creation/QuestionViewModal.jsx';
import QuestionTypeViewModal from '../Components/question-creation/QuestionTypeViewModal.jsx';
import DeleteConfirmModal from '../Components/question-creation/DeleteConfirmModal.jsx';

// Color-coded capsule badge mapping for question types per visual design system
export const getQuestionTypeBadgeStyle = (typeName = '') => {
  const name = String(typeName).toLowerCase();
  if (name.includes('mcq') || name.includes('multiple choice')) {
    return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] hover:bg-[#FDE68A]/60';
  }
  if (name.includes('short answer') || name.includes('short math')) {
    return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] hover:bg-[#BBF7D0]/60';
  }
  if (name.includes('essay') || name.includes('derivation') || name.includes('proof')) {
    return 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE] hover:bg-[#DDD6FE]/60';
  }
  if (name.includes('numerical') || name.includes('matrix')) {
    return 'bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA] hover:bg-[#FED7AA]/60';
  }
  if (name.includes('true') || name.includes('false')) {
    return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD] hover:bg-[#BAE6FD]/60';
  }
  if (name.includes('assertion') || name.includes('reasoning')) {
    return 'bg-[#FFE4E6] text-[#9F1239] border-[#FECDD3] hover:bg-[#FECDD3]/60';
  }
  if (name.includes('case study') || name.includes('passage')) {
    return 'bg-[#CCFBF1] text-[#115E59] border-[#99F6E4] hover:bg-[#99F6E4]/60';
  }
  if (name.includes('coding') || name.includes('algorithm')) {
    return 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE] hover:bg-[#C7D2FE]/60';
  }
  if (name.includes('fill')) {
    return 'bg-[#ECFCCB] text-[#3F6212] border-[#D9F99D] hover:bg-[#D9F99D]/60';
  }
  if (name.includes('match')) {
    return 'bg-[#FAE8FF] text-[#86198F] border-[#F5D0FE] hover:bg-[#F5D0FE]/60';
  }
  return 'bg-[#F5E6EA] text-[#72102A] border-[#E6C4CD] hover:bg-[#E6C4CD]/60';
};

export const FALLBACK_DUE_DATES = {
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

export const getFallbackDueDate = (id) => FALLBACK_DUE_DATES[id] || '28 Nov 2026';

export default function QuestionCreation({ showToast }) {
  // Questions Data
  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('sps_submitted_questions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMITTED_QUESTIONS;
    } catch {
      return INITIAL_SUBMITTED_QUESTIONS;
    }
  });

  // Question Type Sets Data (Each course has multiple question types from master catalogue)
  const [questionTypeSets, setQuestionTypeSets] = useState(() => {
    try {
      const saved = localStorage.getItem('sps_question_type_sets');
      if (saved) {
        const parsed = JSON.parse(saved);
        const initById = new Map(INITIAL_QUESTION_TYPE_SETS.map(init => [init.id, init]));
        const hydrated = parsed.map(item => {
          const ref = initById.get(item.id);
          if (!ref) return { ...item, dueDate: item.dueDate || getFallbackDueDate(item.id) };
          const isPending = (!item.questionTypes || item.questionTypes.length === 0) && item.status !== 'Draft';
          const mergedChapters = isPending && ref.chapters
            ? ref.chapters
            : (ref.chapters && ref.chapters.length > (item.chapters?.length || 0)
                ? ref.chapters
                : (item.chapters && item.chapters.length > 0 ? item.chapters : ref.chapters || []));
          return {
            ...item,
            session: item.session || ref.session || '2026-27',
            assessmentTag: item.assessmentTag || ref.assessmentTag,
            chapters: mergedChapters,
            chapterQuestionTypes: item.chapterQuestionTypes || ref.chapterQuestionTypes,
            dueDate: item.dueDate || ref.dueDate || getFallbackDueDate(item.id),
          };
        });
        const existingIds = new Set(hydrated.map(p => p.id));
        const missing = INITIAL_QUESTION_TYPE_SETS.filter(init => !existingIds.has(init.id));
        return missing.length > 0 ? [...missing, ...hydrated] : hydrated;
      }
      return INITIAL_QUESTION_TYPE_SETS;
    } catch {
      return INITIAL_QUESTION_TYPE_SETS;
    }
  });

  const saveQuestionsData = (newData) => {
    setQuestions(newData);
    try { localStorage.setItem('sps_submitted_questions', JSON.stringify(newData)); } catch {}
  };

  const saveQuestionTypeSetsData = (newData) => {
    setQuestionTypeSets(newData);
    try { localStorage.setItem('sps_question_type_sets', JSON.stringify(newData)); } catch {}
  };

  // Active Tab: persists across page refresh (defaults to 'types')
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const saved = localStorage.getItem('sps_qc_active_tab');
      return saved === 'questions' || saved === 'types' ? saved : 'types';
    } catch {
      return 'types';
    }
  });
  const [isTabGliding, setIsTabGliding] = useState(false);
  const glideTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (glideTimerRef.current) clearTimeout(glideTimerRef.current);
    };
  }, []);

  const setActiveTab = (tab) => {
    if (tab !== activeTab) {
      setIsTabGliding(true);
      if (glideTimerRef.current) clearTimeout(glideTimerRef.current);
      glideTimerRef.current = setTimeout(() => setIsTabGliding(false), 320);
    }
    setActiveTabState(tab);
    try { localStorage.setItem('sps_qc_active_tab', tab); } catch {}
  };

  // Interactive iOS Drag-to-Slide Segmented Control State
  const tabTrackRef = useRef(null);
  const [isDraggingTab, setIsDraggingTab] = useState(false);
  const [dragProgress, setDragProgress] = useState(null); // null when resting, 0..1 (with rubber-band) when dragging
  const dragMetaRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startProgress: 0,
    travelDistance: 1,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
    hasMoved: false,
    suppressNextClick: false,
  });

  const handleTabPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const track = tabTrackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const travel = Math.max(1, (rect.width - 12) / 2);
    const startProg = activeTab === 'types' ? 0 : 1;

    dragMetaRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startProgress: startProg,
      travelDistance: travel,
      lastX: e.clientX,
      lastTime: Date.now(),
      velocityX: 0,
      hasMoved: false,
      suppressNextClick: false,
    };

    try {
      track.setPointerCapture(e.pointerId);
    } catch {}
    setIsDraggingTab(true);
  };

  const handleTabPointerMove = (e) => {
    const meta = dragMetaRef.current;
    if (!meta.active || e.pointerId !== meta.pointerId) return;

    const dx = e.clientX - meta.startX;
    if (!meta.hasMoved && Math.abs(dx) > 5) {
      meta.hasMoved = true;
    }
    if (!meta.hasMoved) return;

    const now = Date.now();
    const dt = Math.max(1, now - meta.lastTime);
    meta.velocityX = (e.clientX - meta.lastX) / dt; // px/ms
    meta.lastX = e.clientX;
    meta.lastTime = now;

    const raw = meta.startProgress + dx / meta.travelDistance;
    // Constrain thumb strictly within track bounds so it cannot poke out past the rounded pill
    const clamped = Math.max(0, Math.min(1, raw));
    setDragProgress(clamped);
  };

  const handleTabPointerUp = (e) => {
    const meta = dragMetaRef.current;
    if (!meta.active || e.pointerId !== meta.pointerId) return;
    meta.active = false;

    const track = tabTrackRef.current;
    try {
      if (track && track.hasPointerCapture(e.pointerId)) {
        track.releasePointerCapture(e.pointerId);
      }
    } catch {}

    meta.suppressNextClick = true;
    setTimeout(() => {
      dragMetaRef.current.suppressNextClick = false;
    }, 80);

    if (meta.hasMoved) {
      const finalProg = dragProgress !== null ? dragProgress : meta.startProgress;
      let targetTab;
      if (meta.velocityX > 0.35) {
        targetTab = 'questions';
      } else if (meta.velocityX < -0.35) {
        targetTab = 'types';
      } else {
        targetTab = finalProg >= 0.5 ? 'questions' : 'types';
      }
      setDragProgress(null);
      setIsDraggingTab(false);
      setActiveTab(targetTab);
    } else {
      setDragProgress(null);
      setIsDraggingTab(false);
      if (track && e.type === 'pointerup') {
        const rect = track.getBoundingClientRect();
        const tappedTab = e.clientX < rect.left + rect.width / 2 ? 'types' : 'questions';
        setActiveTab(tappedTab);
      }
    }
  };

  const visualTab = dragProgress !== null
    ? (dragProgress >= 0.5 ? 'questions' : 'types')
    : activeTab;
  const isThumbLensed = isDraggingTab || isTabGliding;
  const thumbTranslatePct = dragProgress !== null
    ? dragProgress * 100
    : (activeTab === 'types' ? 0 : 100);

  // Filter States - Questions Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [questionStatusFilter, setQuestionStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  // Filter States - Question Types Tab
  const [typeSearchTerm, setTypeSearchTerm] = useState('');
  const [typeFilterProgram, setTypeFilterProgram] = useState('All');
  const [typeFilterExam, setTypeFilterExam] = useState('All');
  const [typeFilterSubject, setTypeFilterSubject] = useState('All');
  const [requestStatusFilter, setRequestStatusFilter] = useState('new'); // 'all' | 'new' | 'configured'

  // Modals
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [viewingType, setViewingType] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pending, Completed, Draft & Question Overview Counts
  const draftTypesCount = useMemo(
    () => questionTypeSets.filter(q => q.status === 'Draft').length,
    [questionTypeSets]
  );
  const pendingRequests = useMemo(() => {
    return questionTypeSets.filter(q => (!q.questionTypes || q.questionTypes.length === 0) && q.status !== 'Draft');
  }, [questionTypeSets]);
  const pendingCount = pendingRequests.length;
  const configuredCount = useMemo(
    () => questionTypeSets.filter(q => q.questionTypes && q.questionTypes.length > 0 && q.status !== 'Draft').length,
    [questionTypeSets]
  );

  const approvedQuestionsCount = useMemo(
    () => questions.filter(q => q.status === 'Approved' || q.status === 'Submitted').length,
    [questions]
  );
  const draftQuestionsCount = useMemo(
    () => questions.filter(q => q.status === 'Draft').length,
    [questions]
  );

  // Filter dropdown options for Questions
  const uniquePrograms = useMemo(() => ['All', ...new Set(questions.map(q => q.program))], [questions]);
  const uniqueSubjects = useMemo(() => {
    if (filterProgram === 'All') return ['All', ...new Set(questions.map(q => q.subject))];
    return ['All', ...(PROGRAM_SUBJECTS[filterProgram] || [])];
  }, [filterProgram, questions]);
  const uniqueQuestionTypes = useMemo(() => ['All', ...new Set(questions.map(q => q.type))], [questions]);

  // Filter dropdown options for Question Types
  const uniqueTypePrograms = useMemo(() => ['All', ...new Set(questionTypeSets.map(qt => qt.program))], [questionTypeSets]);
  const uniqueTypeExams = useMemo(
    () => ['All', ...new Set(questionTypeSets.map(qt => qt.assessmentTag || 'Term Assessment'))],
    [questionTypeSets]
  );
  const uniqueTypeSubjects = useMemo(() => {
    if (typeFilterProgram === 'All') return ['All', ...new Set(questionTypeSets.map(qt => qt.subject))];
    return ['All', ...(PROGRAM_SUBJECTS[typeFilterProgram] || [])];
  }, [typeFilterProgram, questionTypeSets]);

  // Rich CustomDropdown Options for Question Types Tab
  const requestStatusOptions = useMemo(() => [
    {
      value: 'all',
      label: 'All Statuses',
      icon: (
        <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      value: 'new',
      label: 'New Requests Only',
      tone: 'amber',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#D97706]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      value: 'configured',
      label: 'Completed',
      tone: 'emerald',
      icon: (
        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      value: 'draft',
      label: 'Draft',
      icon: (
        <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ], []);

  // Rich CustomDropdown Status Options for Questions Tab
  const questionStatusOptions = useMemo(() => [
    {
      value: 'all',
      label: 'All Statuses',
      icon: (
        <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      value: 'pending',
      label: 'Pending / Draft',
      tone: 'amber',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#D97706]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      value: 'completed',
      label: 'Completed',
      tone: 'emerald',
      icon: (
        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      value: 'draft',
      label: 'Draft Only',
      icon: (
        <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ], []);

  const typeProgramOptions = useMemo(() => (
    uniqueTypePrograms.map(p => ({
      value: p,
      label: p === 'All' ? 'All Classes/Programs' : p,
    }))
  ), [uniqueTypePrograms]);

  const typeExamOptions = useMemo(() => (
    uniqueTypeExams.map(ex => ({
      value: ex,
      label: ex === 'All' ? 'All Exams' : ex,
    }))
  ), [uniqueTypeExams]);

  const typeSubjectOptions = useMemo(() => (
    uniqueTypeSubjects.map(sub => ({
      value: sub,
      label: sub === 'All' ? 'All Subjects' : sub,
    }))
  ), [uniqueTypeSubjects]);

  // Rich CustomDropdown Options for Questions Tab
  const questionProgramOptions = useMemo(() => (
    uniquePrograms.map(p => ({
      value: p,
      label: p === 'All' ? 'All Classes' : p,
    }))
  ), [uniquePrograms]);

  const questionSubjectOptions = useMemo(() => (
    uniqueSubjects.map(sub => ({
      value: sub,
      label: sub === 'All' ? 'All Subjects' : sub,
    }))
  ), [uniqueSubjects]);

  const questionTypeOptions = useMemo(() => (
    uniqueQuestionTypes.map(t => ({
      value: t,
      label: t === 'All' ? 'All Types' : t,
    }))
  ), [uniqueQuestionTypes]);

  const difficultyOptions = useMemo(() => [
    { value: 'All', label: 'All Difficulties' },
    ...DIFFICULTY_LEVELS.map(d => ({
      value: d.id,
      label: d.name,
      dotColor:
        d.id === 'Easy'
          ? 'bg-emerald-500'
          : d.id === 'Medium'
          ? 'bg-amber-500'
          : 'bg-rose-500',
    })),
  ], []);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return questions.filter(q => {
      const isCompleted = q.status === 'Approved' || q.status === 'Submitted';
      if (questionStatusFilter === 'pending' && isCompleted) return false;
      if (questionStatusFilter === 'completed' && !isCompleted) return false;
      if (questionStatusFilter === 'draft' && q.status !== 'Draft') return false;

      const matchSearch = !term || (
        (q.code && q.code.toLowerCase().includes(term)) ||
        (q.questionText && q.questionText.toLowerCase().includes(term)) ||
        (q.subject && q.subject.toLowerCase().includes(term)) ||
        (q.chapter && q.chapter.toLowerCase().includes(term))
      );
      const matchProg = filterProgram === 'All' || q.program === filterProgram;
      const matchSub = filterSubject === 'All' || q.subject === filterSubject;
      const matchType = filterType === 'All' || q.type === filterType;
      const matchDiff = filterDifficulty === 'All' || q.difficulty === filterDifficulty;

      return matchSearch && matchProg && matchSub && matchType && matchDiff;
    });
  }, [questions, searchTerm, questionStatusFilter, filterProgram, filterSubject, filterType, filterDifficulty]);

  // Filtered Question Type Sets
  const filteredQuestionTypeSets = useMemo(() => {
    const term = typeSearchTerm.toLowerCase().trim();
    return questionTypeSets.filter(set => {
      const isConfigured = set.questionTypes && set.questionTypes.length > 0 && set.status !== 'Draft';
      const isDraft = set.status === 'Draft';
      const isPending = (!set.questionTypes || set.questionTypes.length === 0) && !isDraft;

      if (requestStatusFilter === 'new' && !isPending) return false;
      if (requestStatusFilter === 'configured' && !isConfigured) return false;
      if (requestStatusFilter === 'draft' && !isDraft) return false;

      const matchSearch = !term || (
        (set.id && set.id.toLowerCase().includes(term)) ||
        (set.subject && set.subject.toLowerCase().includes(term)) ||
        (set.program && set.program.toLowerCase().includes(term)) ||
        (set.assessmentTag && set.assessmentTag.toLowerCase().includes(term)) ||
        (set.chapters && set.chapters.some(ch => ch.toLowerCase().includes(term))) ||
        (set.department && set.department.toLowerCase().includes(term)) ||
        (set.questionTypes && set.questionTypes.some(t => ((typeof t === 'string' ? t : t.name) || '').toLowerCase().includes(term)))
      );
      const matchProg = typeFilterProgram === 'All' || set.program === typeFilterProgram;
      const matchExam = typeFilterExam === 'All' || (set.assessmentTag || 'Term Assessment') === typeFilterExam;
      const matchSub = typeFilterSubject === 'All' || set.subject === typeFilterSubject;

      return matchSearch && matchProg && matchExam && matchSub;
    });
  }, [questionTypeSets, typeSearchTerm, typeFilterProgram, typeFilterExam, typeFilterSubject, requestStatusFilter]);

  // Save / Delete Handlers
  const handleSaveQuestion = (savedItem, status) => {
    const exists = questions.some(q => q.id === savedItem.id);
    const updated = exists
      ? questions.map(q => q.id === savedItem.id ? savedItem : q)
      : [savedItem, ...questions];

    saveQuestionsData(updated);
    if (showToast) {
      showToast(status === 'Approved' ? 'Question saved & submitted!' : 'Question saved as draft.');
    }
  };

  const handleSaveQuestionTypeSet = (savedSet, status) => {
    const itemToSave = {
      ...savedSet,
      dueDate: savedSet.dueDate || getFallbackDueDate(savedSet.id),
    };
    const exists = questionTypeSets.some(qt => qt.id === itemToSave.id);
    const updated = exists
      ? questionTypeSets.map(qt => qt.id === itemToSave.id ? itemToSave : qt)
      : [itemToSave, ...questionTypeSets];

    saveQuestionTypeSetsData(updated);
    if (showToast) {
      showToast(status === 'Approved' ? 'Question types set registered in Question Bank!' : 'Question types set saved as draft.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'question') {
      saveQuestionsData(questions.filter(q => q.id !== deleteTarget.item.id));
      if (showToast) showToast('Question deleted.');
    } else {
      const updated = questionTypeSets.map(qt => {
        if (qt.id === deleteTarget.item.id) {
          return {
            ...qt,
            questionTypes: [],
            chapterQuestionTypes: {},
            totalMarks: 0,
            totalQuestions: 0,
            status: 'Draft',
            updatedAt: 'Just now'
          };
        }
        return qt;
      });
      saveQuestionTypeSetsData(updated);
      if (showToast) showToast('Question types removed. You can re-add them at any time.');
    }
    setDeleteTarget(null);
  };

  const hasActiveTypeFilters =
    Boolean(typeSearchTerm) ||
    typeFilterProgram !== 'All' ||
    typeFilterExam !== 'All' ||
    typeFilterSubject !== 'All' ||
    requestStatusFilter !== 'all';

  return (
    <div className="min-h-full bg-transparent text-[#1A1A1A] font-sans selection:bg-[#72102A] selection:text-white pb-10">
      
      {/* ── SIMPLE HEADER ── */}
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-3.5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1
              style={{
                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                fontSize: '22px',
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Question Creation
            </h1>
            {pendingCount > 0 && (
              <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                {pendingCount} Pending Subject Requests
              </span>
            )}
          </div>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '12.5px',
              color: '#6B7280',
              marginTop: '4px',
              marginBottom: 0,
            }}
          >
            Create, curate, and configure syllabus-aligned questions and question types.
          </p>
        </div>
      </header>

      {/* ── COMPACT OVERVIEW DASHBOARD (4 Context-Aware KPI Cards) ── */}
      {activeTab === 'types' ? (
        <div key="kpi-types" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 animate-ios-reveal">
          {/* Card 1: Assigned Subjects */}
          <button
            type="button"
            style={{ outline: 'none' }}
            onClick={() => setRequestStatusFilter('all')}
            title="View all subject assignments"
            className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              requestStatusFilter === 'all'
                ? 'border-[#72102a]/45 ring-1 ring-[#72102a]/15'
                : 'border-[#E8E2D9] hover:border-[#72102a]/35'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight"
                style={{ color: '#72102a' }}
              >
                {questionTypeSets.length}
              </span>
              <span className="w-7 h-7 rounded-lg bg-[#FAF0F3] text-[#72102A] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              Assigned Subjects
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              All exam &amp; subject sets
            </div>
          </button>

          {/* Card 2: Pending Setup */}
          <button
            type="button"
            style={{ outline: 'none' }}
            onClick={() => setRequestStatusFilter('new')}
            title="Filter subjects waiting for question types"
            className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              requestStatusFilter === 'new'
                ? 'border-[#F59E0B] ring-1 ring-[#F59E0B]/20'
                : 'border-[#E8E2D9] hover:border-[#F59E0B]/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight"
                style={{ color: '#D97706' }}
              >
                {pendingCount}
              </span>
              <span className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              Pending Setup
            </div>
            <div className="text-[11px] text-amber-700/80 mt-0.5">
              Waiting for question types
            </div>
          </button>

          {/* Card 3: Completed */}
          <button
            type="button"
            style={{ outline: 'none' }}
            onClick={() => setRequestStatusFilter('configured')}
            title="Filter completed subjects"
            className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              requestStatusFilter === 'configured'
                ? 'border-emerald-500/70 ring-1 ring-emerald-500/20'
                : 'border-[#E8E2D9] hover:border-emerald-400/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight"
                style={{ color: '#059669' }}
              >
                {configuredCount}
              </span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              Completed
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-0.5">
              Question types added
            </div>
          </button>

          {/* Card 4: Draft */}
          <button
            type="button"
            style={{ outline: 'none' }}
            onClick={() => setRequestStatusFilter('draft')}
            title="Filter draft question types"
            className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              requestStatusFilter === 'draft'
                ? 'border-stone-500/80 ring-1 ring-stone-500/20'
                : 'border-[#E8E2D9] hover:border-stone-400/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight text-stone-700"
              >
                {draftTypesCount}
              </span>
              <span className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              Draft
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Saved as draft
            </div>
          </button>
        </div>
      ) : (
        <div key="kpi-questions" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 animate-ios-reveal">
          {/* Card 1: Total Questions */}
          <button
            type="button"
            style={{ outline: 'none' }}
            onClick={() => setQuestionStatusFilter('all')}
            title="View all created questions"
            className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              questionStatusFilter === 'all'
                ? 'border-[#72102a]/45 ring-1 ring-[#72102a]/15'
                : 'border-[#E8E2D9] hover:border-[#72102a]/35'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight"
                style={{ color: '#72102a' }}
              >
                {questions.length}
              </span>
              <span className="w-7 h-7 rounded-lg bg-[#FAF0F3] text-[#72102A] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              Total Questions
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              All created questions
            </div>
          </button>

          {/* Card 2: Pending / Draft */}
          <button
            type="button"
            style={{ outline: 'none' }}
            onClick={() => setQuestionStatusFilter('pending')}
            title="Filter draft questions"
            className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              questionStatusFilter === 'pending'
                ? 'border-[#F59E0B] ring-1 ring-[#F59E0B]/20'
                : 'border-[#E8E2D9] hover:border-[#F59E0B]/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight"
                style={{ color: '#D97706' }}
              >
                {draftQuestionsCount}
              </span>
              <span className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              Pending Setup
            </div>
            <div className="text-[11px] text-amber-700/80 mt-0.5">
              Drafts awaiting submission
            </div>
          </button>

          {/* Card 3: Completed */}
          <button
            type="button"
            style={{ outline: 'none' }}
            onClick={() => setQuestionStatusFilter('completed')}
            title="Filter completed questions"
            className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              questionStatusFilter === 'completed'
                ? 'border-emerald-500/70 ring-1 ring-emerald-500/20'
                : 'border-[#E8E2D9] hover:border-emerald-400/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight"
                style={{ color: '#059669' }}
              >
                {approvedQuestionsCount}
              </span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              Completed
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-0.5">
              Questions added
            </div>
          </button>

          {/* Card 4: Draft */}
          <button
            type="button"
            style={{ outline: 'none' }}
            onClick={() => setQuestionStatusFilter('draft')}
            title="Filter draft questions"
            className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              questionStatusFilter === 'draft'
                ? 'border-stone-500/80 ring-1 ring-stone-500/20'
                : 'border-[#E8E2D9] hover:border-stone-400/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight text-stone-700"
              >
                {draftQuestionsCount}
              </span>
              <span className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              Draft
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Saved as draft
            </div>
          </button>
        </div>
      )}

      {/* ── iOS LIQUID GLASS DRAGGABLE SEGMENTED CONTROL ── */}
      <div
        ref={tabTrackRef}
        role="tablist"
        aria-label="Question Creation Sections"
        onPointerDown={handleTabPointerDown}
        onPointerMove={handleTabPointerMove}
        onPointerUp={handleTabPointerUp}
        onPointerCancel={handleTabPointerUp}
        className={`relative grid grid-cols-2 w-full rounded-full p-1.5 mb-4 select-none backdrop-blur-xl border border-white/80 touch-none overflow-hidden ${
          isDraggingTab ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(232, 226, 218, 0.78) 0%, rgba(239, 235, 229, 0.65) 100%)',
          boxShadow:
            'inset 0 1.5px 3px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(114, 16, 42, 0.05), 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
      >
        {/* Sliding Liquid Glass Pill Thumb (Smooth 1:1 Tracking — No Squeeze / Deformation) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 will-change-transform"
          style={{
            width: 'calc(50% - 6px)',
            transform: `translate3d(${thumbTranslatePct}%, 0, 0)`,
            transition:
              dragProgress !== null
                ? 'none'
                : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(255, 254, 254, 0.96) 65%, rgba(251, 248, 249, 0.97) 100%)',
              backdropFilter: 'blur(18px)',
              boxShadow: isDraggingTab
                ? '0 6px 18px -2px rgba(24, 24, 27, 0.14), 0 2px 6px -1px rgba(114, 16, 42, 0.10), inset 0 1.5px 1px rgba(255, 255, 255, 1), 0 0 0 1px rgba(114, 16, 42, 0.08)'
                : '0 4px 14px -3px rgba(24, 24, 27, 0.10), 0 2px 4px -1px rgba(114, 16, 42, 0.05), inset 0 1.5px 1px rgba(255, 255, 255, 1), 0 0 0 1px rgba(114, 16, 42, 0.06)',
              transition: 'box-shadow 150ms ease',
            }}
          />
        </div>

        {/* Tab 1: Question Types */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'types'}
          onClick={() => {
            if (!dragMetaRef.current.suppressNextClick) setActiveTab('types');
          }}
          style={{ outline: 'none', boxShadow: 'none' }}
          className={`group relative z-10 py-2 px-4 rounded-full text-xs sm:text-[13px] transition-all duration-200 ease-out flex items-center justify-center gap-2.5 overflow-hidden outline-none focus:outline-none focus-visible:outline-none ${
            isDraggingTab ? 'cursor-grabbing' : 'cursor-pointer'
          } ${
            visualTab === 'types'
              ? 'text-[#72102A] font-bold'
              : 'text-stone-500 font-semibold hover:text-stone-900 hover:font-bold'
          }`}
        >
          {/* Soft hover sheen that fades away toward the centre seam */}
          {visualTab !== 'types' && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0.62) 52%, rgba(255, 255, 255, 0) 96%)',
              }}
            />
          )}
          {/* Illuminated iOS-style status icon orb */}
          <span
            className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ease-out ${
              visualTab === 'types'
                ? 'bg-gradient-to-b from-[#8B1F3A] to-[#630B22] text-white shadow-[0_2px_8px_rgba(114,16,42,0.42),inset_0_1px_0.5px_rgba(255,255,255,0.35)]'
                : 'bg-stone-300/70 text-stone-500  group-hover:bg-[#72102A]/15 group-hover:text-[#72102A]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10m-10 6h16" />
            </svg>
          </span>
          <span
            className={`relative z-10 inline-block transition-transform duration-200 ease-out ${
              visualTab === 'types' ? 'scale-100' : ''
            }`}
          >
            Question Types
          </span>
          <span
            className={`relative z-10 px-2 py-0.5 rounded-full text-[10.5px] font-bold leading-none transition-all duration-200 ease-out ${
              visualTab === 'types'
                ? 'bg-[#72102A] text-white shadow-[0_2px_6px_rgba(114,16,42,0.28)]'
                : 'bg-black/[0.06] text-stone-600 group-hover:bg-[#72102A]/12 group-hover:text-[#72102A] '
            }`}
          >
            {questionTypeSets.length}
          </span>
        </button>

        {/* Tab 2: Questions */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'questions'}
          onClick={() => {
            if (!dragMetaRef.current.suppressNextClick) setActiveTab('questions');
          }}
          style={{ outline: 'none', boxShadow: 'none' }}
          className={`group relative z-10 py-2 px-4 rounded-full text-xs sm:text-[13px] transition-all duration-200 ease-out flex items-center justify-center gap-2.5 overflow-hidden outline-none focus:outline-none focus-visible:outline-none ${
            isDraggingTab ? 'cursor-grabbing' : 'cursor-pointer'
          } ${
            visualTab === 'questions'
              ? 'text-[#72102A] font-bold'
              : 'text-stone-500 font-semibold hover:text-stone-900 hover:font-bold'
          }`}
        >
          {/* Soft hover sheen that fades away toward the centre seam */}
          {visualTab !== 'questions' && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
              style={{
                background:
                  'linear-gradient(270deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0.62) 52%, rgba(255, 255, 255, 0) 96%)',
              }}
            />
          )}
          {/* Illuminated iOS-style status icon orb */}
          <span
            className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ease-out ${
              visualTab === 'questions'
                ? 'bg-gradient-to-b from-[#8B1F3A] to-[#630B22] text-white shadow-[0_2px_8px_rgba(114,16,42,0.42),inset_0_1px_0.5px_rgba(255,255,255,0.35)]'
                : 'bg-stone-300/70 text-stone-500  group-hover:bg-[#72102A]/15 group-hover:text-[#72102A]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <span
            className={`relative z-10 inline-block transition-transform duration-200 ease-out ${
              visualTab === 'questions' ? 'scale-100' : ''
            }`}
          >
            Questions
          </span>
          <span
            className={`relative z-10 px-2 py-0.5 rounded-full text-[10.5px] font-bold leading-none transition-all duration-200 ease-out ${
              visualTab === 'questions'
                ? 'bg-[#72102A] text-white shadow-[0_2px_6px_rgba(114,16,42,0.28)]'
                : 'bg-black/[0.06] text-stone-600 group-hover:bg-[#72102A]/12 group-hover:text-[#72102A] '
            }`}
          >
            {questions.length}
          </span>
        </button>
      </div>

      {/* ── TAB 1: QUESTION TYPES (First / Default Tab) ── */}
      {activeTab === 'types' && (
        <div key="tab-types" className="space-y-4 animate-ios-reveal">

          {/* FILTER BAR FOR TYPES (Clean Curved Pill Controls, No Top Headers) */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-3 shadow-sm flex flex-wrap items-center justify-start gap-3.5">
            
            <div
              className="w-9 h-[36px] rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] flex items-center justify-center shrink-0"
              title="Filters"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>

            {/* Curved Pill Search Input */}
            <div className="relative w-full sm:w-[285px] shrink-0">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by ID, exam, class, subject or type..."
                value={typeSearchTerm}
                onChange={(e) => setTypeSearchTerm(e.target.value)}
                style={{ height: '36px', fontSize: '12px', borderRadius: '9999px' }}
                className="w-full h-[36px] bg-[#FAF9F7] border border-stone-200/90 rounded-full pl-9 pr-8 text-xs text-stone-800 placeholder-stone-400 hover:border-stone-300 focus:outline-none focus:border-[#72102A] focus:bg-white transition-all"
              />
              {typeSearchTerm && (
                <button
                  onClick={() => setTypeSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Curved Fixed-Width Pill Dropdowns */}
            <CustomDropdown
              value={requestStatusFilter}
              onChange={(val) => setRequestStatusFilter(val)}
              options={requestStatusOptions}
              variant={
                requestStatusFilter === 'new'
                  ? 'amber'
                  : requestStatusFilter === 'configured'
                  ? 'emerald'
                  : 'default'
              }
              searchable={false}
              rounded="full"
              className="w-[195px] shrink-0"
            />

            <CustomDropdown
              value={typeFilterExam}
              onChange={(val) => setTypeFilterExam(val)}
              options={typeExamOptions}
              variant={typeFilterExam !== 'All' ? 'maroon' : 'default'}
              rounded="full"
              className="w-[175px] shrink-0"
            />

            <CustomDropdown
              value={typeFilterProgram}
              onChange={(val) => {
                setTypeFilterProgram(val);
                setTypeFilterSubject('All');
              }}
              options={typeProgramOptions}
              variant={typeFilterProgram !== 'All' ? 'maroon' : 'default'}
              rounded="full"
              className="w-[210px] shrink-0"
            />

            <CustomDropdown
              value={typeFilterSubject}
              onChange={(val) => setTypeFilterSubject(val)}
              options={typeSubjectOptions}
              variant={typeFilterSubject !== 'All' ? 'maroon' : 'default'}
              rounded="full"
              className="w-[180px] shrink-0"
            />

            {hasActiveTypeFilters && (
              <button
                type="button"
                onClick={() => {
                  setTypeSearchTerm('');
                  setTypeFilterProgram('All');
                  setTypeFilterExam('All');
                  setTypeFilterSubject('All');
                  setRequestStatusFilter('all');
                }}
                style={{ outline: 'none' }}
                className="ml-auto h-[36px] px-4 rounded-full bg-[#FAF0F3] hover:bg-[#F5E6EA] text-[#72102A] border border-[#F2D7DF] hover:border-[#E6C4CD] text-xs font-semibold transition-all whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear</span>
              </button>
            )}

          </div>

          {/* QUESTION TYPES TABLE (Matching Question Bank Table UI) */}
          <div
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
            style={{ borderColor: '#E8E2D9' }}
          >
            {filteredQuestionTypeSets.length === 0 ? (
              <div className="p-10 text-center text-stone-400 text-xs">
                No question types configured matching your filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="text-gray-500 uppercase tracking-wide text-[11px]">
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>ID</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Exam</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Class / Program</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Subject</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Due Date</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Assigned Question Types</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredQuestionTypeSets.map((set) => {
                      const isDraft = set.status === 'Draft';
                      const isNewRequest = (!set.questionTypes || set.questionTypes.length === 0) && !isDraft;
                      return (
                        <tr
                          key={set.id}
                          onClick={() => {
                            if (isNewRequest || isDraft) {
                              setEditingType(set);
                              setIsTypeModalOpen(true);
                            } else {
                              setViewingType(set);
                            }
                          }}
                          title={isNewRequest ? 'Click to add question types' : isDraft ? 'Click to resume draft' : 'Click to view question types details'}
                          style={isNewRequest ? { boxShadow: 'inset 3px 0 0 #F59E0B' } : isDraft ? { boxShadow: 'inset 3px 0 0 #78716C' } : undefined}
                          className={`transition-colors cursor-pointer ${
                            isNewRequest
                              ? 'bg-[#FFFDF7] hover:bg-[#FEF9EE]'
                              : isDraft
                              ? 'bg-stone-50/50 hover:bg-stone-100/60'
                              : 'hover:bg-[#fdf5f6]'
                          }`}
                        >
                          {/* 1. ID */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-mono font-bold text-gray-700">{set.id}</span>
                          </td>

                          {/* 2. Exam */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border whitespace-nowrap ${
                                isNewRequest
                                  ? 'bg-[#FFE4E6]/80 text-[#9F1239] border-[#FECDD3]'
                                  : 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]'
                              }`}
                            >
                              {set.assessmentTag || 'Term Assessment'}
                            </span>
                          </td>

                          {/* 3. Class / Program */}
                          <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                            {set.program}
                          </td>

                          {/* 4. Subject */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-medium text-gray-800">{set.subject}</div>
                            <span className="text-[10.5px] text-gray-400 block">
                              {set.department || 'Department Faculty'}
                            </span>
                          </td>

                          {/* 5. Due Date */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F7] border border-stone-200/90 text-stone-700 font-medium text-[11.5px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                              <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{set.dueDate || getFallbackDueDate(set.id)}</span>
                            </div>
                          </td>

                          {/* 6. Assigned Question Types (Single-Line Badges + Overflow) */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {set.questionTypes && set.questionTypes.length > 0 ? (
                              <div className="flex items-center gap-1.5 flex-nowrap">
                                {set.questionTypes.slice(0, 2).map((t, idx) => {
                                  const typeName = typeof t === 'string' ? t : t.name;
                                  const badgeClass = getQuestionTypeBadgeStyle(typeName);
                                  return (
                                    <span
                                      key={idx}
                                      title={typeName}
                                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap truncate max-w-[165px] border transition-all ${badgeClass}`}
                                    >
                                      {typeName}
                                    </span>
                                  );
                                })}
                                {set.questionTypes.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingType(set);
                                    }}
                                    title={set.questionTypes
                                      .slice(2)
                                      .map((t) => (typeof t === 'string' ? t : t.name))
                                      .join(', ')}
                                    className="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border border-stone-200 bg-stone-100 text-stone-600 hover:bg-[#FAF0F3] hover:text-[#72102A] hover:border-[#E6C4CD] transition-all shrink-0 cursor-pointer"
                                  >
                                    +{set.questionTypes.length - 2} ...
                                  </button>
                                )}
                              </div>
                            ) : isDraft ? (
                              <div className="flex items-center gap-2">
                                <span className="bg-stone-100 text-stone-700 border border-stone-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                  SAVED AS DRAFT
                                </span>
                                <span
                                  title="Draft saved, awaiting completion"
                                  className="text-gray-400 italic text-[11.5px] font-normal truncate max-w-[200px]"
                                >
                                  — In progress
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                  NEW REQUEST ARRIVED
                                </span>
                                <span
                                  title="Waiting for teacher to assign question types"
                                  className="text-gray-400 italic text-[11.5px] font-normal truncate max-w-[200px]"
                                >
                                  — Waiting for teacher...
                                </span>
                              </div>
                            )}
                          </td>

                          {/* 6. Actions */}
                          <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            {isDraft ? (
                              <div className="flex items-center justify-center gap-1.5 w-[140px] mx-auto">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingType(set);
                                    setIsTypeModalOpen(true);
                                  }}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-lg border border-amber-300 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-400 text-stone-700 hover:text-stone-900 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm hover:scale-105 active:scale-95 text-xs font-semibold"
                                  title="Resume Draft"
                                >
                                  Draft
                                  <Icon name="edit" className="w-4 h-4 text-stone-500 shrink-0" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: 'type', item: set })}
                                  className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-lg text-red-600 border border-red-200 bg-red-50/40 hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                                  title="Delete Draft"
                                  aria-label="Delete Draft"
                                >
                                  <Icon name="trash" className="w-4 h-4" />
                                </button>
                              </div>
                            ) : set.questionTypes && set.questionTypes.length > 0 ? (
                              <div className="flex items-center justify-center gap-1.5 w-[140px] mx-auto">
                                <button
                                  onClick={() => setViewingType(set)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-lg text-[#72102a] border border-[#72102a]/30 bg-[#72102a]/5 hover:bg-[#72102a]/15 hover:border-[#72102a]/50 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 text-xs font-semibold cursor-pointer"
                                  title="View Details"
                                >
                                  <Icon name="eye" className="w-4 h-4 shrink-0" />
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingType(set);
                                    setIsTypeModalOpen(true);
                                  }}
                                  className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-lg text-amber-700 border border-amber-200 bg-amber-50/40 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                                  title="Edit Question Types"
                                  aria-label="Edit Question Types"
                                >
                                  <Icon name="edit" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: 'type', item: set })}
                                  className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-lg text-red-600 border border-red-200 bg-red-50/40 hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                                  title="Delete Question Types"
                                  aria-label="Delete Question Types"
                                >
                                  <Icon name="trash" className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <div className="relative inline-block">
                                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#F59E0B] border-2 border-white rounded-full shadow-xs z-10 animate-pulse" />
                                  <button
                                    onClick={() => {
                                      setEditingType(set);
                                      setIsTypeModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#72102A] to-[#54081C] hover:from-[#851633] hover:to-[#680C25] text-white text-[11px] font-bold transition-all shadow-xs hover:shadow active:scale-95 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                                    title="Add Question Types from Master Data"
                                  >
                                    <span className="text-[#E5C158] font-black text-xs leading-none">+</span>
                                    Add Question Types
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: QUESTIONS ── */}
      {activeTab === 'questions' && (
        <div key="tab-questions" className="space-y-4 animate-ios-reveal">
          
          {/* FILTER BAR FOR QUESTIONS (Clean Curved Pill Controls, No Top Headers) */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-3 shadow-sm flex flex-wrap items-center justify-start gap-3.5">
            
            <div
              className="w-9 h-[36px] rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] flex items-center justify-center shrink-0"
              title="Filters"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>

            <div className="relative w-full sm:w-[270px] shrink-0">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by ID, subject, chapter, or question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: '36px', fontSize: '12px', borderRadius: '9999px' }}
                className="w-full h-[36px] bg-[#FAF9F7] border border-stone-200/90 rounded-full pl-9 pr-8 text-xs text-stone-800 placeholder-stone-400 hover:border-stone-300 focus:outline-none focus:border-[#72102A] focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <CustomDropdown
              value={questionStatusFilter}
              onChange={(val) => setQuestionStatusFilter(val)}
              options={questionStatusOptions}
              variant={
                questionStatusFilter === 'pending'
                  ? 'amber'
                  : questionStatusFilter === 'completed'
                  ? 'emerald'
                  : 'default'
              }
              searchable={false}
              rounded="full"
              className="w-[175px] shrink-0"
            />

            <CustomDropdown
              value={filterProgram}
              onChange={(val) => {
                setFilterProgram(val);
                setFilterSubject('All');
              }}
              options={questionProgramOptions}
              variant={filterProgram !== 'All' ? 'maroon' : 'default'}
              rounded="full"
              className="w-[170px] shrink-0"
            />

            <CustomDropdown
              value={filterSubject}
              onChange={(val) => setFilterSubject(val)}
              options={questionSubjectOptions}
              variant={filterSubject !== 'All' ? 'maroon' : 'default'}
              rounded="full"
              className="w-[165px] shrink-0"
            />

            <CustomDropdown
              value={filterType}
              onChange={(val) => setFilterType(val)}
              options={questionTypeOptions}
              variant={filterType !== 'All' ? 'maroon' : 'default'}
              rounded="full"
              className="w-[165px] shrink-0"
            />

            <CustomDropdown
              value={filterDifficulty}
              onChange={(val) => setFilterDifficulty(val)}
              options={difficultyOptions}
              variant={filterDifficulty !== 'All' ? 'maroon' : 'default'}
              searchable={false}
              rounded="full"
              className="w-[155px] shrink-0"
            />

            {(searchTerm || questionStatusFilter !== 'all' || filterProgram !== 'All' || filterSubject !== 'All' || filterType !== 'All' || filterDifficulty !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setQuestionStatusFilter('all');
                  setFilterProgram('All');
                  setFilterSubject('All');
                  setFilterType('All');
                  setFilterDifficulty('All');
                }}
                style={{ outline: 'none' }}
                className="ml-auto h-[36px] px-4 rounded-full bg-[#FAF0F3] hover:bg-[#F5E6EA] text-[#72102A] border border-[#F2D7DF] hover:border-[#E6C4CD] text-xs font-semibold transition-all whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* QUESTIONS TABLE (Matching Question Bank Table UI) */}
          <div
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
            style={{ borderColor: '#E8E2D9' }}
          >
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                No questions found matching your filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="text-gray-500 uppercase tracking-wide text-[11px]">
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>ID</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Class / Program</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Subject</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Chapter</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Question Type</th>
                      <th className="px-4 py-3 min-w-[200px] max-w-xs bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Question</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Marks</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Difficulty</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredQuestions.map((q) => (
                      <tr
                        key={q.id}
                        className="hover:bg-[#fdf5f6] transition-colors cursor-pointer"
                        onClick={() => setViewingQuestion(q)}
                        title="Click to view question details"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono font-bold text-gray-700">{q.code || q.id}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                          {q.program}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                          {q.subject}
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-[160px]">
                          <span className="line-clamp-2" title={q.chapter}>{q.chapter}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                          {q.type}
                        </td>
                        <td className="px-4 py-3 min-w-[200px] max-w-xs">
                          <p className="text-gray-700 line-clamp-2">{q.questionText}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                          {q.marks}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10.5px] border ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          {q.status === 'Draft' ? (
                            <div className="flex items-center justify-center gap-1.5 w-[140px] mx-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingQuestion(q);
                                  setIsQuestionModalOpen(true);
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-lg border border-amber-300 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-400 text-stone-700 hover:text-stone-900 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm hover:scale-105 active:scale-95 text-xs font-semibold"
                                title="Resume Draft Question"
                              >
                                Draft
                                <Icon name="edit" className="w-4 h-4 text-stone-500 shrink-0" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'question', item: q })}
                                className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-lg text-red-600 border border-red-200 bg-red-50/40 hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                                title="Delete Question"
                                aria-label="Delete Question"
                              >
                                <Icon name="trash" className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5 w-[140px] mx-auto">
                              <button
                                onClick={() => setViewingQuestion(q)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-lg text-[#72102a] border border-[#72102a]/30 bg-[#72102a]/5 hover:bg-[#72102a]/15 hover:border-[#72102a]/50 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 text-xs font-semibold cursor-pointer"
                                title="View Question Details"
                              >
                                <Icon name="eye" className="w-4 h-4 shrink-0" />
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setEditingQuestion(q);
                                  setIsQuestionModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-lg text-amber-700 border border-amber-200 bg-amber-50/40 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                                title="Edit Question"
                                aria-label="Edit Question"
                              >
                                <Icon name="edit" className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'question', item: q })}
                                className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-lg text-red-600 border border-red-200 bg-red-50/40 hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                                title="Delete Question"
                                aria-label="Delete Question"
                              >
                                <Icon name="trash" className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODALS (Keyed & Conditionally Mounted for Instant Rendering) ── */}
      {isTypeModalOpen && (
        <CreateQuestionTypeModal
          key={editingType?.id || 'new-type'}
          isOpen={isTypeModalOpen}
          onClose={() => setIsTypeModalOpen(false)}
          onSave={handleSaveQuestionTypeSet}
          editingItem={editingType}
        />
      )}

      {isQuestionModalOpen && (
        <CreateQuestionModal
          key={editingQuestion?.id || 'new-q'}
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          onSave={handleSaveQuestion}
          existingQuestions={questions}
          editingItem={editingQuestion}
        />
      )}

      {!!viewingQuestion && (
        <QuestionViewModal
          isOpen={!!viewingQuestion}
          question={viewingQuestion}
          onClose={() => setViewingQuestion(null)}
          onEdit={(q) => {
            setEditingQuestion(q);
            setIsQuestionModalOpen(true);
          }}
        />
      )}

      {!!viewingType && (
        <QuestionTypeViewModal
          key={viewingType?.id || 'view-type'}
          isOpen={!!viewingType}
          questionType={viewingType}
          onClose={() => setViewingType(null)}
          onEdit={(qt) => {
            setEditingType(qt);
            setIsTypeModalOpen(true);
          }}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === 'question' ? 'Delete Question' : 'Remove Question Types'}
        itemDesc={
          deleteTarget?.type === 'question'
            ? (deleteTarget.item.code || deleteTarget.item.id)
            : `Question types for ${deleteTarget?.item.program} - ${deleteTarget?.item.subject}`
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
}
