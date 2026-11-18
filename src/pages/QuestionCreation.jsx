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
          if (!ref) return item;
          return {
            ...item,
            assessmentTag: item.assessmentTag || ref.assessmentTag,
            chapters: item.chapters && item.chapters.length > 0 ? item.chapters : ref.chapters,
          };
        });
        const existingIds = new Set(hydrated.map(p => p.id));
        const missing = INITIAL_QUESTION_TYPE_SETS.filter(init => !existingIds.has(init.id));
        return missing.length > 0 ? [...hydrated, ...missing] : hydrated;
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

  // Filter States - Questions Tab
  const [searchTerm, setSearchTerm] = useState('');
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
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Modals
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [viewingType, setViewingType] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pending, Configured & Question Overview Counts
  const pendingRequests = useMemo(() => {
    return questionTypeSets.filter(q => !q.questionTypes || q.questionTypes.length === 0);
  }, [questionTypeSets]);
  const pendingCount = pendingRequests.length;
  const configuredCount = questionTypeSets.length - pendingCount;
  const completionPct = questionTypeSets.length > 0
    ? Math.round((configuredCount / questionTypeSets.length) * 100)
    : 0;
  const approvedQuestionsCount = useMemo(
    () => questions.filter(q => q.status === 'Approved').length,
    [questions]
  );
  const draftQuestionsCount = questions.length - approvedQuestionsCount;

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
      badge: questionTypeSets.length,
      icon: (
        <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      value: 'new',
      label: 'New Requests Only',
      badge: pendingCount,
      tone: 'amber',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#D97706]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      value: 'configured',
      label: 'Types Added',
      badge: configuredCount,
      tone: 'emerald',
      icon: (
        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
  ], [questionTypeSets.length, pendingCount, configuredCount]);

  const typeProgramOptions = useMemo(() => (
    uniqueTypePrograms.map(p => ({
      value: p,
      label: p === 'All' ? 'All Classes/Programs' : p,
      badge: p === 'All'
        ? questionTypeSets.length
        : questionTypeSets.filter(qt => qt.program === p).length,
    }))
  ), [uniqueTypePrograms, questionTypeSets]);

  const typeExamOptions = useMemo(() => (
    uniqueTypeExams.map(ex => ({
      value: ex,
      label: ex === 'All' ? 'All Exams' : ex,
      badge: ex === 'All'
        ? questionTypeSets.length
        : questionTypeSets.filter(qt => (qt.assessmentTag || 'Term Assessment') === ex).length,
    }))
  ), [uniqueTypeExams, questionTypeSets]);

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
  }, [questions, searchTerm, filterProgram, filterSubject, filterType, filterDifficulty]);

  // Filtered Question Type Sets
  const filteredQuestionTypeSets = useMemo(() => {
    const term = typeSearchTerm.toLowerCase().trim();
    return questionTypeSets.filter(set => {
      const isConfigured = set.questionTypes && set.questionTypes.length > 0;
      if (requestStatusFilter === 'new' && isConfigured) return false;
      if (requestStatusFilter === 'configured' && !isConfigured) return false;

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
    const exists = questionTypeSets.some(qt => qt.id === savedSet.id);
    const updated = exists
      ? questionTypeSets.map(qt => qt.id === savedSet.id ? savedSet : qt)
      : [savedSet, ...questionTypeSets];

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

      {/* ── COMPACT OVERVIEW DASHBOARD (4 Interactive KPI Cards) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Card 1: Total Assignments */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('types');
            setRequestStatusFilter('all');
          }}
          title="View all subject assignments"
          className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
            activeTab === 'types' && requestStatusFilter === 'all'
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
          onClick={() => {
            setActiveTab('types');
            setRequestStatusFilter('new');
          }}
          title="Filter subjects waiting for question types"
          className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
            activeTab === 'types' && requestStatusFilter === 'new'
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

        {/* Card 3: Types Added */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('types');
            setRequestStatusFilter('configured');
          }}
          title="Filter subjects with question types added"
          className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
            activeTab === 'types' && requestStatusFilter === 'configured'
              ? 'border-emerald-500/70 ring-1 ring-emerald-500/20'
              : 'border-[#E8E2D9] hover:border-emerald-400/60'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight"
                style={{ color: '#059669' }}
              >
                {configuredCount}
              </span>
              <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-full leading-none">
                {completionPct}%
              </span>
            </div>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <div className="text-xs font-semibold text-gray-800 leading-tight">
            Types Added
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </button>

        {/* Card 4: Questions Created */}
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          title="Switch to Questions list"
          className={`text-left bg-white rounded-xl border px-5 py-3.5 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
            activeTab === 'questions'
              ? 'border-[#0f766e]/60 ring-1 ring-[#0f766e]/15'
              : 'border-[#E8E2D9] hover:border-[#0f766e]/40'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className="text-2xl md:text-[26px] font-extrabold leading-none tracking-tight"
              style={{ color: '#0f766e' }}
            >
              {questions.length}
            </span>
            <span className="w-7 h-7 rounded-lg bg-teal-50 text-[#0f766e] flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
          </div>
          <div className="text-xs font-semibold text-gray-800 leading-tight">
            Questions Created
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {approvedQuestionsCount} approved · {draftQuestionsCount} draft
          </div>
        </button>
      </div>

      {/* ── iOS LIQUID GLASS SLIDING SEGMENTED CONTROL ── */}
      <div
        role="tablist"
        aria-label="Question Creation Sections"
        className="relative grid grid-cols-2 w-full rounded-full p-1.5 mb-4 select-none backdrop-blur-xl border border-white/80"
        style={{
          background: 'linear-gradient(180deg, rgba(232, 226, 218, 0.78) 0%, rgba(239, 235, 229, 0.65) 100%)',
          boxShadow:
            'inset 0 1.5px 3px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(114, 16, 42, 0.05), 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
      >
        {/* Sliding Liquid Glass Pill Thumb (Silky Spring Glide + Mid-Flight Glass Lensing) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 will-change-transform"
          style={{
            width: 'calc(50% - 6px)',
            transform: activeTab === 'types' ? 'translate3d(0%, 0, 0)' : 'translate3d(100%, 0, 0)',
            transition: 'transform 580ms cubic-bezier(0.22, 1.16, 0.36, 1)',
          }}
        >
          <div
            className="w-full h-full rounded-full will-change-transform"
            style={{
              transform: isTabGliding ? 'scaleX(1.03) scaleY(1.08)' : 'scaleX(1) scaleY(1)',
              transition:
                'transform 340ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 340ms ease, background 340ms ease',
              background: isTabGliding
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 250, 252, 0.78) 55%, rgba(247, 236, 240, 0.88) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 248, 249, 0.93) 60%, rgba(246, 237, 240, 0.96) 100%)',
              backdropFilter: 'blur(16px)',
              boxShadow: isTabGliding
                ? '0 10px 26px -4px rgba(114, 16, 42, 0.24), 0 4px 10px -2px rgba(0, 0, 0, 0.08), inset 0 2px 2px rgba(255, 255, 255, 1), inset 0 -1.5px 2px rgba(114, 16, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.9)'
                : '0 6px 18px -4px rgba(114, 16, 42, 0.16), 0 2px 6px -1px rgba(0, 0, 0, 0.06), inset 0 1.5px 1px rgba(255, 255, 255, 1), inset 0 -1px 1px rgba(114, 16, 42, 0.08), 0 0 0 1px rgba(114, 16, 42, 0.12)',
            }}
          />
        </div>

        {/* Tab 1: Question Types */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'types'}
          onClick={() => setActiveTab('types')}
          style={{ outline: 'none', boxShadow: 'none' }}
          className={`relative z-10 py-2 px-4 rounded-full text-xs sm:text-[13px] transition-all duration-500 ease-out flex items-center justify-center gap-2.5 cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:scale-[0.98] ${
            activeTab === 'types'
              ? 'text-[#72102A] font-bold'
              : 'text-stone-500 hover:text-stone-800 font-semibold'
          }`}
        >
          {/* Illuminated iOS-style status icon orb */}
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
              activeTab === 'types'
                ? 'scale-100 bg-gradient-to-b from-[#8B1F3A] to-[#630B22] text-white shadow-[0_2px_8px_rgba(114,16,42,0.42),inset_0_1px_0.5px_rgba(255,255,255,0.35)]'
                : 'scale-95 bg-stone-300/70 text-stone-500'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10m-10 6h16" />
            </svg>
          </span>
          <span>Question Types</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold leading-none transition-all duration-500 ease-out ${
              activeTab === 'types'
                ? 'bg-[#72102A] text-white shadow-[0_2px_6px_rgba(114,16,42,0.28)]'
                : 'bg-black/[0.06] text-stone-600'
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
          onClick={() => setActiveTab('questions')}
          style={{ outline: 'none', boxShadow: 'none' }}
          className={`relative z-10 py-2 px-4 rounded-full text-xs sm:text-[13px] transition-all duration-500 ease-out flex items-center justify-center gap-2.5 cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:scale-[0.98] ${
            activeTab === 'questions'
              ? 'text-[#72102A] font-bold'
              : 'text-stone-500 hover:text-stone-800 font-semibold'
          }`}
        >
          {/* Illuminated iOS-style status icon orb */}
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
              activeTab === 'questions'
                ? 'scale-100 bg-gradient-to-b from-[#8B1F3A] to-[#630B22] text-white shadow-[0_2px_8px_rgba(114,16,42,0.42),inset_0_1px_0.5px_rgba(255,255,255,0.35)]'
                : 'scale-95 bg-stone-300/70 text-stone-500'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <span>Questions</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold leading-none transition-all duration-500 ease-out ${
              activeTab === 'questions'
                ? 'bg-[#72102A] text-white shadow-[0_2px_6px_rgba(114,16,42,0.28)]'
                : 'bg-black/[0.06] text-stone-600'
            }`}
          >
            {questions.length}
          </span>
        </button>
      </div>

      {/* ── TAB 1: QUESTION TYPES (First / Default Tab) ── */}
      {activeTab === 'types' && (
        <div key="tab-types" className="space-y-4 animate-ios-reveal">
          
          {/* TOP NOTIFICATION CALLOUT BANNER (New Course Assignments) */}
          {!isBannerDismissed && pendingCount > 0 && (
            <div className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border border-[#FDE68A] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#D97706] text-white px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                      NEW REQUESTS ARRIVED
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                      You have <u className="decoration-[#D97706] font-extrabold">{pendingCount} new course assignments</u> waiting for Question Type setup
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-stone-600 mt-1 leading-relaxed">
                    The Examination Cell has assigned new subjects below. Please configure their question types (MCQ, Short Answer, Case Study, etc.) to unlock question paper generation.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setRequestStatusFilter(requestStatusFilter === 'new' ? 'all' : 'new')}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {requestStatusFilter === 'new' ? `Showing Only New (${pendingCount}) — View All` : `Show Only New Requests (${pendingCount})`}
                </button>
                <button
                  onClick={() => setIsBannerDismissed(true)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
                  title="Dismiss Banner"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* FILTER BAR FOR TYPES (Left-Aligned Fixed-Size Controls + Extreme-Right Clear Button) */}
          <div className="bg-white border border-stone-200/80 rounded-2xl px-5 pt-3.5 pb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-wrap items-end justify-start gap-4">
            
            <div
              className="w-9 h-[36px] rounded-xl bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] flex items-center justify-center shrink-0"
              title="Filters"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>

            {/* Search Input (Fixed Wider Width & Longer Descriptive Placeholder) */}
            <div className="w-full sm:w-[285px] shrink-0">
              <span className="block text-[9.5px] font-bold text-stone-400 uppercase tracking-wider mb-1 select-none leading-none">
                SEARCH
              </span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search by ID, exam, class, subject or type..."
                  value={typeSearchTerm}
                  onChange={(e) => setTypeSearchTerm(e.target.value)}
                  style={{ height: '36px', fontSize: '12px', borderRadius: '12px' }}
                  className="w-full h-[36px] bg-[#FAF9F7] border border-stone-200/90 rounded-xl pl-8 pr-7 text-xs text-stone-800 placeholder-stone-400 hover:border-stone-300 focus:outline-none focus:border-[#72102A] focus:bg-white transition-all"
                />
                {typeSearchTerm && (
                  <button
                    onClick={() => setTypeSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Fixed-Width Custom Dropdowns */}
            <CustomDropdown
              label="REQUEST STATUS"
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
              className="w-[190px] shrink-0"
            />

            <CustomDropdown
              label="EXAM"
              value={typeFilterExam}
              onChange={(val) => setTypeFilterExam(val)}
              options={typeExamOptions}
              variant={typeFilterExam !== 'All' ? 'maroon' : 'default'}
              className="w-[175px] shrink-0"
            />

            <CustomDropdown
              label="CLASS / PROGRAM"
              value={typeFilterProgram}
              onChange={(val) => {
                setTypeFilterProgram(val);
                setTypeFilterSubject('All');
              }}
              options={typeProgramOptions}
              variant={typeFilterProgram !== 'All' ? 'maroon' : 'default'}
              className="w-[205px] shrink-0"
            />

            <CustomDropdown
              label="SUBJECT"
              value={typeFilterSubject}
              onChange={(val) => setTypeFilterSubject(val)}
              options={typeSubjectOptions}
              variant={typeFilterSubject !== 'All' ? 'maroon' : 'default'}
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
                className="ml-auto h-[36px] px-4 rounded-xl bg-[#FAF0F3] hover:bg-[#F5E6EA] text-[#72102A] border border-[#F2D7DF] hover:border-[#E6C4CD] text-xs font-semibold transition-all whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1.5"
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
                      <th className="px-4 py-3 text-center whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Chapters</th>
                      <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Assigned Question Types</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredQuestionTypeSets.map((set) => {
                      const isNewRequest = !set.questionTypes || set.questionTypes.length === 0;
                      return (
                        <tr
                          key={set.id}
                          onClick={() => {
                            if (isNewRequest) {
                              setEditingType(set);
                              setIsTypeModalOpen(true);
                            } else {
                              setViewingType(set);
                            }
                          }}
                          title={isNewRequest ? 'Click to add question types' : 'Click to view question types details'}
                          style={isNewRequest ? { boxShadow: 'inset 3px 0 0 #F59E0B' } : undefined}
                          className={`transition-colors cursor-pointer ${
                            isNewRequest
                              ? 'bg-[#FFFDF7] hover:bg-[#FEF9EE]'
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

                          {/* 5. Chapters (Count Only) */}
                          <td
                            className="px-4 py-3 whitespace-nowrap text-center text-gray-700 font-semibold"
                            title={set.chapters && set.chapters.length > 0 ? set.chapters.join(', ') : undefined}
                          >
                            {set.chapters && set.chapters.length > 0 ? set.chapters.length : '—'}
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
                            {set.questionTypes && set.questionTypes.length > 0 ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setViewingType(set)}
                                  className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-[#72102a] border border-[#72102a]/30 bg-[#72102a]/5 hover:bg-[#72102a]/15 hover:border-[#72102a]/50 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 text-[11px] font-semibold cursor-pointer"
                                  title="View Details"
                                >
                                  <Icon name="eye" className="w-3.5 h-3.5" />
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingType(set);
                                    setIsTypeModalOpen(true);
                                  }}
                                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-amber-700 border border-amber-200 bg-amber-50/40 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                                  title="Edit Question Types"
                                  aria-label="Edit Question Types"
                                >
                                  <Icon name="edit" className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: 'type', item: set })}
                                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-red-600 border border-red-200 bg-red-50/40 hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                                  title="Delete Question Types"
                                  aria-label="Delete Question Types"
                                >
                                  <Icon name="trash" className="w-3.5 h-3.5" />
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
          
          {/* FILTER BAR FOR QUESTIONS (Left-Aligned with Custom Dropdowns) */}
          <div className="bg-white border border-stone-200/80 rounded-2xl px-5 pt-3.5 pb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-wrap items-end justify-start gap-4">
            
            <div
              className="w-9 h-[36px] rounded-xl bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] flex items-center justify-center shrink-0"
              title="Filters"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>

            <div className="w-full sm:w-[265px] shrink-0">
              <span className="block text-[9.5px] font-bold text-stone-400 uppercase tracking-wider mb-1 select-none leading-none">
                SEARCH
              </span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search by ID, subject, chapter, or question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: '36px', fontSize: '12px', borderRadius: '12px' }}
                  className="w-full h-[36px] bg-[#FAF9F7] border border-stone-200/90 rounded-xl pl-8 pr-7 text-xs text-stone-800 placeholder-stone-400 hover:border-stone-300 focus:outline-none focus:border-[#72102A] focus:bg-white transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <CustomDropdown
              label="CLASS / PROGRAM"
              value={filterProgram}
              onChange={(val) => {
                setFilterProgram(val);
                setFilterSubject('All');
              }}
              options={questionProgramOptions}
              variant={filterProgram !== 'All' ? 'maroon' : 'default'}
              className="w-[180px] shrink-0"
            />

            <CustomDropdown
              label="SUBJECT"
              value={filterSubject}
              onChange={(val) => setFilterSubject(val)}
              options={questionSubjectOptions}
              variant={filterSubject !== 'All' ? 'maroon' : 'default'}
              className="w-[175px] shrink-0"
            />

            <CustomDropdown
              label="QUESTION TYPE"
              value={filterType}
              onChange={(val) => setFilterType(val)}
              options={questionTypeOptions}
              variant={filterType !== 'All' ? 'maroon' : 'default'}
              className="w-[175px] shrink-0"
            />

            <CustomDropdown
              label="DIFFICULTY"
              value={filterDifficulty}
              onChange={(val) => setFilterDifficulty(val)}
              options={difficultyOptions}
              variant={filterDifficulty !== 'All' ? 'maroon' : 'default'}
              searchable={false}
              className="w-[155px] shrink-0"
            />

            {(searchTerm || filterProgram !== 'All' || filterSubject !== 'All' || filterType !== 'All' || filterDifficulty !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterProgram('All');
                  setFilterSubject('All');
                  setFilterType('All');
                  setFilterDifficulty('All');
                }}
                className="h-[36px] px-4 rounded-xl bg-stone-100 hover:bg-[#FAF0F3] text-stone-700 hover:text-[#72102A] border border-stone-200/90 hover:border-[#E6C4CD] text-xs font-semibold transition-all whitespace-nowrap shrink-0 inline-flex items-center justify-center"
              >
                Clear
              </button>
            )}

            <button
              onClick={() => {
                setEditingQuestion(null);
                setIsQuestionModalOpen(true);
              }}
              className="lg:ml-auto h-[36px] px-4 rounded-xl bg-gradient-to-r from-[#72102A] to-[#54081C] hover:from-[#851633] hover:to-[#680C25] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span className="text-[#E5C158] font-black text-sm leading-none">+</span>
              New Question
            </button>
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
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewingQuestion(q)}
                              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-[#72102a] border border-[#72102a]/30 bg-[#72102a]/5 hover:bg-[#72102a]/15 hover:border-[#72102a]/50 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 text-[11px] font-semibold cursor-pointer"
                              title="View Question Details"
                            >
                              <Icon name="eye" className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                setEditingQuestion(q);
                                setIsQuestionModalOpen(true);
                              }}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-amber-700 border border-amber-200 bg-amber-50/40 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                              title="Edit Question"
                              aria-label="Edit Question"
                            >
                              <Icon name="edit" className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'question', item: q })}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-red-600 border border-red-200 bg-red-50/40 hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                              title="Delete Question"
                              aria-label="Delete Question"
                            >
                              <Icon name="trash" className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* ── MODALS ── */}
      <CreateQuestionTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSave={handleSaveQuestionTypeSet}
        editingItem={editingType}
      />

      <CreateQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        existingQuestions={questions}
        editingItem={editingQuestion}
      />

      <QuestionViewModal
        isOpen={!!viewingQuestion}
        question={viewingQuestion}
        onClose={() => setViewingQuestion(null)}
        onEdit={(q) => {
          setEditingQuestion(q);
          setIsQuestionModalOpen(true);
        }}
      />

      <QuestionTypeViewModal
        isOpen={!!viewingType}
        questionType={viewingType}
        onClose={() => setViewingType(null)}
        onEdit={(qt) => {
          setEditingType(qt);
          setIsTypeModalOpen(true);
        }}
      />

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
