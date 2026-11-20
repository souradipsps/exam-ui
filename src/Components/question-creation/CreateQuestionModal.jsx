import React, { useState, useMemo, useEffect } from 'react';
import {
  ACADEMIC_PROGRAMS,
  PROGRAM_SUBJECTS,
  EXAMS_LIST,
  SESSIONS_LIST,
  COGNITIVE_LEVELS,
  DIFFICULTY_LEVELS,
  DEFAULT_CHAPTERS_BY_SUBJECT
} from '../../data/questionCreationData.js';
import { findBlueprintByContext, INITIAL_BLUEPRINTS } from '../../data/blueprintService.js';
import CustomDropdown from './CustomDropdown.jsx';
import Icon from '../common/Icon.jsx';

export default function CreateQuestionModal({
  isOpen,
  onClose,
  onSave,
  existingQuestions = [],
  editingItem = null
}) {
  if (!isOpen) return null;

  // ── 1. ACADEMIC CONTEXT STATE ──
  const [selectedSession, setSelectedSession] = useState(editingItem?.session || SESSIONS_LIST[0] || '2026-27');
  const [selectedExam, setSelectedExam] = useState(editingItem?.exam || 'Mid Term Examination');
  const [selectedProgram, setSelectedProgram] = useState(editingItem?.program || 'Class 10');
  const [selectedSubject, setSelectedSubject] = useState(editingItem?.subject || 'Physics');

  // Chapters list for academic context
  const availableChapters = useMemo(() => {
    if (DEFAULT_CHAPTERS_BY_SUBJECT[selectedSubject]) {
      return DEFAULT_CHAPTERS_BY_SUBJECT[selectedSubject];
    }
    const key = Object.keys(DEFAULT_CHAPTERS_BY_SUBJECT).find(
      (k) => selectedSubject.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(selectedSubject.toLowerCase())
    );
    if (key) return DEFAULT_CHAPTERS_BY_SUBJECT[key];
    return ['Optics & Light Reflection', 'Electricity & Circuits', 'Magnetic Effects of Electric Current', 'Human Eye and Colourful World'];
  }, [selectedSubject]);

  const [selectedChapter, setSelectedChapter] = useState(
    editingItem?.chapter && availableChapters.includes(editingItem.chapter)
      ? editingItem.chapter
      : availableChapters[0] || 'General Syllabus'
  );

  // ── 2. RETRIEVE BLUEPRINT ──
  const activeBlueprint = useMemo(() => {
    // If editingItem has a specific blueprint linked, or match by context
    const found = findBlueprintByContext({
      examName: selectedExam,
      className: selectedProgram,
      subjectName: selectedSubject
    });
    return found || INITIAL_BLUEPRINTS[0];
  }, [selectedExam, selectedProgram, selectedSubject]);

  // Active variation from template
  const activeVariation = useMemo(() => {
    return activeBlueprint?.template?.variations?.[0] || {
      label: 'Variation 1',
      sections: [{ name: 'Section A', description: 'Objective' }, { name: 'Section B', description: 'Short Answer' }, { name: 'Section C', description: 'Long Essay' }],
      rows: [
        { name: 'Multiple Choice (MCQ)', source: 'master', section: 'Section A', count: 5, marks: 1 },
        { name: 'Assertion & Reasoning', source: 'master', section: 'Section A', count: 2, marks: 1 },
        { name: 'Short Answer', source: 'master', section: 'Section B', count: 6, marks: 3 },
        { name: 'Long Essay / Problem', source: 'master', section: 'Section C', count: 5, marks: 5 }
      ],
      cognitive: { Remember: 20, Understand: 30, Apply: 30, Analyze: 15, Evaluate: 5, Create: 0 },
      difficulty: { Easy: 40, Medium: 40, Hard: 20 }
    };
  }, [activeBlueprint]);

  const sectionsList = useMemo(() => {
    return activeVariation.sections || [{ name: 'Section A' }];
  }, [activeVariation]);

  // Section Selection (Step 3)
  const [activeSectionName, setActiveSectionName] = useState(() => {
    if (editingItem?.blueprintSection) {
      const match = sectionsList.find(s => s.name === editingItem.blueprintSection || editingItem.blueprintSection.startsWith(s.name));
      if (match) return match.name;
    }
    return sectionsList[0]?.name || 'Section A';
  });

  // Ensure activeSectionName is valid when blueprint changes
  useEffect(() => {
    if (!sectionsList.some(s => s.name === activeSectionName)) {
      setActiveSectionName(sectionsList[0]?.name || 'Section A');
    }
  }, [sectionsList, activeSectionName]);

  // ── 3. MANAGING CREATED QUESTIONS FOR THIS BLUEPRINT SET ──
  // Initialize with existing questions matching this blueprint / exam / subject
  const [sectionQuestions, setSectionQuestions] = useState(() => {
    if (editingItem) {
      return [editingItem];
    }
    const matching = existingQuestions.filter(q =>
      (q.exam === selectedExam || !q.exam) &&
      (q.subject === selectedSubject || !q.subject) &&
      (q.program === selectedProgram || !q.program)
    );
    return matching.length > 0 ? matching : [];
  });

  // Track currently active question being authored
  const [editingQuestionId, setEditingQuestionId] = useState(editingItem?.id || null);

  // ── 4. QUESTION FORM STATE (Step 5) ──
  // Allowed question types for active section
  const sectionBlueprintRows = useMemo(() => {
    return activeVariation.rows.filter(r => r.section === activeSectionName);
  }, [activeVariation, activeSectionName]);

  const allowedTypes = useMemo(() => {
    const types = sectionBlueprintRows.map(r => r.name);
    return types.length > 0 ? types : ['Multiple Choice (MCQ)', 'Short Answer'];
  }, [sectionBlueprintRows]);

  const [questionType, setQuestionType] = useState(() => {
    if (editingItem?.type && allowedTypes.includes(editingItem.type)) return editingItem.type;
    return allowedTypes[0] || 'Multiple Choice (MCQ)';
  });

  // Auto-update question type if active section changes and current type isn't allowed
  useEffect(() => {
    if (!allowedTypes.includes(questionType)) {
      setQuestionType(allowedTypes[0] || 'Multiple Choice (MCQ)');
    }
  }, [allowedTypes, questionType]);

  // Current row in blueprint for selected type and section
  const currentRowInBlueprint = useMemo(() => {
    return sectionBlueprintRows.find(r => r.name === questionType) || sectionBlueprintRows[0] || { marks: 1, count: 1 };
  }, [sectionBlueprintRows, questionType]);

  const [difficulty, setDifficulty] = useState(editingItem?.difficulty || 'Medium');
  const [cognitiveLevel, setCognitiveLevel] = useState(editingItem?.cognitiveLevel || 'Apply');
  const [marks, setMarks] = useState(editingItem?.marks ?? currentRowInBlueprint?.marks ?? 1);

  // Sync marks when question type changes
  useEffect(() => {
    if (currentRowInBlueprint?.marks) {
      setMarks(currentRowInBlueprint.marks);
    }
  }, [currentRowInBlueprint]);

  // Question content
  const [questionText, setQuestionText] = useState(editingItem?.questionText || '');
  const [solution, setSolution] = useState(editingItem?.solution || '');
  const [rubric, setRubric] = useState(editingItem?.rubric || '');

  // Options for MCQ / MSQ
  const [options, setOptions] = useState(
    editingItem?.options && editingItem.options.length > 0
      ? editingItem.options
      : [
        { id: 'A', text: '', isCorrect: true },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
        { id: 'D', text: '', isCorrect: false }
      ]
  );

  // True / False
  const [binaryKey, setBinaryKey] = useState(
    editingItem?.binaryKey || (editingItem?.correctAnswer?.includes('False') ? 'False' : 'True')
  );

  // Assertion & Reason
  const [assertionText, setAssertionText] = useState(editingItem?.assertionText || '');
  const [reasonText, setReasonText] = useState(editingItem?.reasonText || '');
  const [arKey, setArKey] = useState(editingItem?.arKey || 'A');

  // Match the following
  const [matchingPairs, setMatchingPairs] = useState(
    editingItem?.matchingPairs && editingItem.matchingPairs.length > 0
      ? editingItem.matchingPairs
      : [
        { id: 1, left: '', right: '' },
        { id: 2, left: '', right: '' },
        { id: 3, left: '', right: '' },
        { id: 4, left: '', right: '' }
      ]
  );

  // Numerical answer
  const [numericValue, setNumericValue] = useState(editingItem?.numericValue !== undefined ? editingItem.numericValue : '');
  const [numericUnit, setNumericUnit] = useState(editingItem?.numericUnit || '');
  const [numericTolerance, setNumericTolerance] = useState(editingItem?.numericTolerance || 0);

  // UI state
  const [previewTab, setPreviewTab] = useState('split'); // 'split' | 'preview_only' | 'questions_list'
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formValidationMsg, setFormValidationMsg] = useState('');

  // ── 5. BLUEPRINT PROGRESS & VALIDATION ENGINE (Step 3, 4, 6) ──
  const sectionStats = useMemo(() => {
    const stats = {};
    sectionsList.forEach(sec => {
      const secRows = activeVariation.rows.filter(r => r.section === sec.name);
      const reqQuestions = secRows.reduce((sum, r) => sum + (Number(r.count) || 0), 0);
      const reqMarks = secRows.reduce((sum, r) => sum + (Number(r.count) || 0) * (Number(r.marks) || 0), 0);

      const entered = sectionQuestions.filter(q => (q.blueprintSection || '').startsWith(sec.name));
      const completedCount = entered.filter(q => q.status !== 'Draft').length;
      const draftCount = entered.filter(q => q.status === 'Draft').length;

      // Type-wise breakdown
      const typeBreakdown = {};
      secRows.forEach(r => {
        const typeEntered = entered.filter(q => q.type === r.name);
        typeBreakdown[r.name] = {
          required: Number(r.count) || 0,
          marksEach: Number(r.marks) || 0,
          enteredCount: typeEntered.length,
          remaining: Math.max(0, (Number(r.count) || 0) - typeEntered.length)
        };
      });

      // Difficulty breakdown
      const diffBreakdown = {
        Easy: entered.filter(q => q.difficulty === 'Easy').length,
        Medium: entered.filter(q => q.difficulty === 'Medium').length,
        Hard: entered.filter(q => q.difficulty === 'Hard').length
      };

      // Cognitive breakdown
      const cogBreakdown = {};
      COGNITIVE_LEVELS.forEach(lvl => {
        cogBreakdown[lvl] = entered.filter(q => q.cognitiveLevel === lvl).length;
      });

      const isCompleted = reqQuestions > 0 && completedCount >= reqQuestions;
      const inProgress = entered.length > 0 && !isCompleted;

      stats[sec.name] = {
        requiredQuestions: reqQuestions,
        completedCount,
        draftCount,
        totalEntered: entered.length,
        remaining: Math.max(0, reqQuestions - entered.length),
        requiredMarks: reqMarks,
        isCompleted,
        inProgress,
        status: isCompleted ? 'Completed' : inProgress ? 'In Progress' : 'Pending',
        typeBreakdown,
        diffBreakdown,
        cogBreakdown,
        enteredQuestions: entered
      };
    });
    return stats;
  }, [sectionsList, activeVariation, sectionQuestions]);

  const activeSectionStats = sectionStats[activeSectionName] || {
    requiredQuestions: 5,
    completedCount: 0,
    remaining: 5,
    requiredMarks: 5,
    typeBreakdown: {},
    diffBreakdown: { Easy: 0, Medium: 0, Hard: 0 },
    cogBreakdown: {},
    isCompleted: false
  };

  // Overall totals across all sections
  const overallStats = useMemo(() => {
    let totalReq = 0;
    let totalDone = 0;
    let totalDraft = 0;
    let totalReqMarks = 0;
    let allSectionsComplete = true;

    sectionsList.forEach(s => {
      const stat = sectionStats[s.name];
      if (stat) {
        totalReq += stat.requiredQuestions;
        totalDone += stat.completedCount;
        totalDraft += stat.draftCount;
        totalReqMarks += stat.requiredMarks;
        if (!stat.isCompleted) allSectionsComplete = false;
      }
    });

    return {
      totalRequiredQuestions: totalReq,
      totalCompletedQuestions: totalDone,
      totalDraftQuestions: totalDraft,
      totalRequiredMarks: totalReqMarks,
      allSectionsComplete: totalReq > 0 && allSectionsComplete,
      progressPercent: totalReq > 0 ? Math.min(100, Math.round((totalDone / totalReq) * 100)) : 0
    };
  }, [sectionsList, sectionStats]);

  // Dynamic remaining quota check for current selection
  const currentTypeQuota = activeSectionStats.typeBreakdown[questionType] || { required: 5, enteredCount: 0, remaining: 5 };
  const isCurrentTypeFull = currentTypeQuota.remaining <= 0 && !editingQuestionId;

  // Construct computed correct answer string
  const computedCorrectAnswer = useMemo(() => {
    if (questionType === 'Multiple Choice (MCQ)') {
      const correct = options.find((o) => o.isCorrect);
      return correct ? `Option ${correct.id}: ${correct.text || '(empty)'}` : 'Not set';
    }
    if (questionType === 'Multiple-select MCQ (MSQ)') {
      const corrects = options.filter((o) => o.isCorrect);
      return corrects.length > 0 ? `Options: ${corrects.map((o) => o.id).join(', ')}` : 'Select correct options';
    }
    if (questionType === 'True / False' || questionType === 'Yes / No') {
      return binaryKey;
    }
    if (questionType === 'Assertion & Reasoning') {
      return `Code ${arKey}`;
    }
    if (questionType === 'Match the Following') {
      return matchingPairs.filter(p => p.left && p.right).map(p => `${p.left} → ${p.right}`).join('; ');
    }
    if (questionType === 'Numerical Answer') {
      return numericValue !== '' ? `${numericValue}${numericUnit ? ` ${numericUnit}` : ''}${numericTolerance > 0 ? ` (±${numericTolerance})` : ''}` : 'Numerical value';
    }
    return solution ? solution.slice(0, 80) : rubric || 'Standard evaluation rubric';
  }, [questionType, options, binaryKey, arKey, matchingPairs, numericValue, numericUnit, numericTolerance, solution, rubric]);

  // Form Reset / Load Helper
  const loadQuestionIntoForm = (q) => {
    setEditingQuestionId(q.id);
    if (q.blueprintSection) {
      const matchedSec = sectionsList.find(s => s.name === q.blueprintSection || q.blueprintSection.startsWith(s.name));
      if (matchedSec) setActiveSectionName(matchedSec.name);
    }
    setQuestionType(q.type || allowedTypes[0]);
    setDifficulty(q.difficulty || 'Medium');
    setCognitiveLevel(q.cognitiveLevel || 'Apply');
    setMarks(q.marks || 1);
    setSelectedChapter(q.chapter || availableChapters[0]);
    setQuestionText(q.questionText || '');
    setSolution(q.solution || '');
    setRubric(q.rubric || '');
    if (q.options && q.options.length > 0) setOptions(q.options);
    if (q.binaryKey) setBinaryKey(q.binaryKey);
    if (q.assertionText) setAssertionText(q.assertionText);
    if (q.reasonText) setReasonText(q.reasonText);
    if (q.arKey) setArKey(q.arKey);
    if (q.matchingPairs && q.matchingPairs.length > 0) setMatchingPairs(q.matchingPairs);
    if (q.numericValue !== undefined) setNumericValue(q.numericValue);
    if (q.numericUnit) setNumericUnit(q.numericUnit);
    if (q.numericTolerance !== undefined) setNumericTolerance(q.numericTolerance);
    setFormValidationMsg('');
  };

  const resetFormFields = () => {
    setEditingQuestionId(null);
    setQuestionText('');
    setSolution('');
    setRubric('');
    setOptions([
      { id: 'A', text: '', isCorrect: true },
      { id: 'B', text: '', isCorrect: false },
      { id: 'C', text: '', isCorrect: false },
      { id: 'D', text: '', isCorrect: false }
    ]);
    setBinaryKey('True');
    setAssertionText('');
    setReasonText('');
    setArKey('A');
    setMatchingPairs([
      { id: 1, left: '', right: '' },
      { id: 2, left: '', right: '' },
      { id: 3, left: '', right: '' },
      { id: 4, left: '', right: '' }
    ]);
    setNumericValue('');
    setNumericUnit('');
    setNumericTolerance(0);
    setFormValidationMsg('');
  };

  // Sync state when modal is opened or editingItem changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        if (editingItem.session) setSelectedSession(editingItem.session);
        if (editingItem.exam) setSelectedExam(editingItem.exam);
        if (editingItem.program) setSelectedProgram(editingItem.program);
        if (editingItem.subject) setSelectedSubject(editingItem.subject);
        loadQuestionIntoForm(editingItem);
      }
    }
  }, [isOpen, editingItem]);

  // ── 6. SAVE QUESTION HANDLER (Step 8) ──
  const handleSaveQuestionEntry = (status = 'Approved', addAnother = false) => {
    if (!questionText.trim()) {
      setFormValidationMsg('Please enter the question stem/prompt text before saving.');
      return;
    }

    if (questionType === 'Multiple Choice (MCQ)' && options.filter(o => o.text.trim()).length < 2) {
      setFormValidationMsg('Please provide at least 2 non-empty options for the MCQ.');
      return;
    }

    if (questionType === 'Assertion & Reasoning' && (!assertionText.trim() || !reasonText.trim())) {
      setFormValidationMsg('Please provide both Assertion and Reason statements.');
      return;
    }

    const questionId = editingQuestionId || `QCR-${Date.now().toString().slice(-4)}`;
    const questionCode = `${selectedSubject.slice(0, 3).toUpperCase()}-${activeSectionName.replace(/\s+/g, '')}-Q${(activeSectionStats.totalEntered + 1).toString().padStart(2, '0')}`;

    const newQuestionObj = {
      id: questionId,
      code: editingItem?.code || questionCode,
      exam: selectedExam,
      program: selectedProgram,
      subject: selectedSubject,
      session: selectedSession,
      chapter: selectedChapter,
      blueprintSection: activeSectionName,
      blueprintName: activeBlueprint?.name || 'Standard Examination Blueprint',
      type: questionType,
      difficulty,
      cognitiveLevel,
      marks: Number(marks) || 1,
      questionText: questionText.trim(),
      solution: solution.trim(),
      rubric: rubric.trim(),
      options: questionType.includes('MCQ') ? options : [],
      binaryKey: questionType.includes('True') || questionType.includes('Yes') ? binaryKey : undefined,
      assertionText: questionType === 'Assertion & Reasoning' ? assertionText.trim() : undefined,
      reasonText: questionType === 'Assertion & Reasoning' ? reasonText.trim() : undefined,
      arKey: questionType === 'Assertion & Reasoning' ? arKey : undefined,
      matchingPairs: questionType === 'Match the Following' ? matchingPairs : undefined,
      numericValue: questionType === 'Numerical Answer' ? numericValue : undefined,
      numericUnit: questionType === 'Numerical Answer' ? numericUnit : undefined,
      numericTolerance: questionType === 'Numerical Answer' ? numericTolerance : undefined,
      correctAnswer: computedCorrectAnswer,
      status: status, // 'Draft' | 'Approved'
      createdAt: 'Just now',
      author: 'Current Educator (You)'
    };

    // Update state
    const exists = sectionQuestions.some(q => q.id === questionId);
    const updatedQuestions = exists
      ? sectionQuestions.map(q => q.id === questionId ? newQuestionObj : q)
      : [...sectionQuestions, newQuestionObj];

    setSectionQuestions(updatedQuestions);

    // Call onSave to update global questions list
    onSave(newQuestionObj, status);

    if (addAnother) {
      resetFormFields();
      setFormValidationMsg('✓ Question saved! Ready for next question in ' + activeSectionName + '.');
    } else {
      setEditingQuestionId(newQuestionObj.id);
      setFormValidationMsg('✓ Question saved successfully as ' + status + '.');
    }
  };

  // Final Submit Question Set
  const handleFinalSubmitSet = () => {
    const finalQuestions = sectionQuestions.map(q => ({
      ...q,
      status: 'Submitted'
    }));
    onSave(finalQuestions, 'Submitted');
    setShowSubmitModal(false);
    onClose();
  };

  // Delete question from section
  const handleDeleteFromSection = (qid) => {
    const updated = sectionQuestions.filter(q => q.id !== qid);
    setSectionQuestions(updated);
    if (editingQuestionId === qid) {
      resetFormFields();
    }
  };

  return (
    <div
      className="fixed top-[60px] left-0 md:left-[240px] right-0 bottom-0 z-40 bg-black/60 backdrop-blur-sm p-2 sm:p-3.5 lg:p-4 flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Blueprint-Driven Question Creation"
    >
      <div className="w-full h-full bg-[#FAF8F5] rounded-3xl border border-white/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-ios-reveal">

        {/* ── HEADER & BREADCRUMB ── */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#72102A] to-[#450514] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              <Icon name="clipboard" className="w-4 h-4 text-[#FDE68A]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight m-0">
                  Question Creation — Blueprint Driven
                </h1>
                <span className="bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MIS Blueprint Aligned
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {overallStats.totalCompletedQuestions} / {overallStats.totalRequiredQuestions} Completed ({overallStats.progressPercent}%)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 m-0 truncate">
                Configure questions strictly matching administrator blueprint requirements for examination sections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View toggles */}
            <div className="hidden sm:inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewTab('split')}
                className={`px-2.5 py-1 rounded-md transition-all ${previewTab === 'split' ? 'bg-white shadow-xs text-[#72102A]' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('questions_list')}
                className={`px-2.5 py-1 rounded-md transition-all ${previewTab === 'questions_list' ? 'bg-white shadow-xs text-[#72102A]' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Section Qs ({activeSectionStats.totalEntered})
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('preview_only')}
                className={`px-2.5 py-1 rounded-md transition-all ${previewTab === 'preview_only' ? 'bg-white shadow-xs text-[#72102A]' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Exam Paper
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── STEP 1: ACADEMIC CONTEXT SELECTION & BLUEPRINT SUMMARY (Step 1 & 2) ── */}
        <div className="bg-[#FAF8F5] border-b border-[#E8E2D9] px-4 sm:px-6 py-2 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 items-center">
            {/* 1. Exam */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">1. Examination</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#72102A]"
              >
                {EXAMS_LIST.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
              </select>
            </div>

            {/* 2. Class / Program */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">2. Class / Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => {
                  setSelectedProgram(e.target.value);
                  const subs = PROGRAM_SUBJECTS[e.target.value] || [];
                  if (subs[0]) setSelectedSubject(subs[0]);
                }}
                className="w-full h-8 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#72102A]"
              >
                {ACADEMIC_PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* 3. Subject */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">3. Subject / Course</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-semibold text-[#72102A] focus:outline-none focus:border-[#72102A]"
              >
                {(PROGRAM_SUBJECTS[selectedProgram] || ['Physics', 'Mathematics', 'Chemistry']).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 4. Session */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">4. Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-medium text-stone-700 focus:outline-none focus:border-[#72102A]"
              >
                {SESSIONS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* 5. Chapter */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">5. Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-medium text-stone-700 focus:outline-none focus:border-[#72102A] truncate"
              >
                {availableChapters.map(ch => <option key={ch} value={ch}>{ch}</option>)}
              </select>
            </div>

            {/* 6. Loaded Blueprint Info Pill */}
            <div className="flex flex-col justify-end">
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">Blueprint Status</label>
              <div
                title={activeBlueprint?.name}
                className="h-8 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 truncate shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">{activeBlueprint?.name || 'Standard Blueprint'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STEP 2 & 3: BLUEPRINT SECTION SELECTOR TABS (Cards) ── */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-[#E8E2D9] shrink-0">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Select Examination Section:
              </span>
              <span className="text-[11px] text-stone-500">
                (Click section card to author questions strictly for that section)
              </span>
            </div>
            <div className="text-xs font-bold text-[#72102A]">
              Blueprint Total: {overallStats.totalRequiredMarks} Marks · {overallStats.totalRequiredQuestions} Questions
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {sectionsList.map((sec, idx) => {
              const stat = sectionStats[sec.name] || {
                requiredQuestions: 5,
                completedCount: 0,
                requiredMarks: 5,
                status: 'Pending',
                isCompleted: false
              };
              const isSelected = activeSectionName === sec.name;

              return (
                <button
                  key={sec.name}
                  type="button"
                  onClick={() => {
                    setActiveSectionName(sec.name);
                    resetFormFields();
                  }}
                  className={`text-left p-2.5 rounded-xl border transition-all duration-150 cursor-pointer relative overflow-hidden flex flex-col justify-between ${isSelected
                    ? 'border-[#72102A] ring-2 ring-[#72102A]/20 bg-gradient-to-b from-[#FFFDF7] to-white shadow-sm'
                    : 'border-[#E8E2D9] hover:border-stone-400 bg-white hover:bg-stone-50/50'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-extrabold text-xs text-stone-900 tracking-tight flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#72102A]' : 'bg-stone-400'}`} />
                      {sec.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${stat.isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : stat.totalEntered > 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                    >
                      {stat.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-600 font-medium my-0.5">
                    <span>
                      <strong>{stat.totalEntered}</strong> / {stat.requiredQuestions} Questions
                    </span>
                    <span className="font-bold text-[#72102A]">
                      {stat.requiredMarks} Marks
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden mt-1 border border-stone-200/60">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${stat.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      style={{
                        width: `${stat.requiredQuestions > 0 ? Math.min(100, (stat.totalEntered / stat.requiredQuestions) * 100) : 0}%`
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MAIN WORKSPACE: BLUEPRINT REQUIREMENTS (STEP 4) + QUESTION FORM (STEP 5) + PREVIEW (STEP 7) ── */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">

          {/* LEFT / MAIN WORKSPACE: Requirements & Question Input Form */}
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-3 sm:p-5 border-r border-[#E8E2D9]">

            {/* ── STEP 4: ACTIVE SECTION BLUEPRINT REQUIREMENTS PANEL (READ-ONLY) ── */}
            <div className="bg-white rounded-2xl border border-amber-200/80 p-3.5 mb-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                    🔒
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-stone-900 tracking-tight m-0">
                      {activeSectionName} Blueprint Requirements (Read-Only)
                    </h3>
                    <p className="text-[10.5px] text-stone-500 m-0">
                      Allowed question types and target distribution from <strong className="text-stone-700">{activeBlueprint?.name}</strong>.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Target: {activeSectionStats.requiredQuestions} Questions ({activeSectionStats.requiredMarks} Marks)
                </span>
              </div>

              {/* Requirement Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {/* 1. Allowed Types */}
                <div className="bg-stone-50/70 rounded-xl p-2.5 border border-stone-200/70">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Allowed Types & Counts
                  </div>
                  <div className="space-y-1">
                    {Object.entries(activeSectionStats.typeBreakdown).map(([typeName, tStat]) => (
                      <div key={typeName} className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-800 font-semibold truncate max-w-[150px]" title={typeName}>
                          • {typeName}
                        </span>
                        <span className={`font-mono text-[10.5px] font-bold ${tStat.enteredCount >= tStat.required ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {tStat.enteredCount}/{tStat.required} ({tStat.marksEach}M)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Difficulty Progress */}
                <div className="bg-stone-50/70 rounded-xl p-2.5 border border-stone-200/70">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Difficulty Distribution
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 font-semibold">Easy:</span>
                      <span className="font-mono text-[10.5px] font-bold text-stone-700">
                        {activeSectionStats.diffBreakdown.Easy} entered
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700 font-semibold">Medium:</span>
                      <span className="font-mono text-[10.5px] font-bold text-stone-700">
                        {activeSectionStats.diffBreakdown.Medium} entered
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-rose-700 font-semibold">Hard:</span>
                      <span className="font-mono text-[10.5px] font-bold text-stone-700">
                        {activeSectionStats.diffBreakdown.Hard} entered
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Cognitive Progress */}
                <div className="bg-stone-50/70 rounded-xl p-2.5 border border-stone-200/70">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Cognitive Distribution
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {COGNITIVE_LEVELS.map(lvl => {
                      const count = activeSectionStats.cogBreakdown[lvl] || 0;
                      return (
                        <span key={lvl} className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${count > 0 ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-white text-stone-500 border-stone-200'}`}>
                          {lvl}: {count}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── STEP 5: QUESTION CREATION FORM ── */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#E8E2D9]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#72102A] uppercase tracking-wider">
                    {editingQuestionId ? 'Edit Question in ' + activeSectionName : 'Create New Question for ' + activeSectionName}
                  </span>
                  {editingQuestionId && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Editing Mode
                    </span>
                  )}
                </div>
                {editingQuestionId && (
                  <button
                    type="button"
                    onClick={resetFormFields}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                  >
                    + Switch to Blank Entry
                  </button>
                )}
              </div>

              {/* Form Controls Row 1: Section (Locked), Type (from Blueprint), Difficulty, Cognitive, Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                {/* Section (Locked) */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Section
                  </label>
                  <div className="h-9 px-3 rounded-lg bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5">
                    <span>📌</span>
                    <span>{activeSectionName}</span>
                  </div>
                </div>

                {/* Question Type (strictly populated from Blueprint allowed types) */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Question Type *
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#72102A]"
                  >
                    {allowedTypes.map(t => {
                      const qStat = activeSectionStats.typeBreakdown[t];
                      const rem = qStat ? qStat.remaining : 1;
                      return (
                        <option key={t} value={t}>
                          {t} ({rem > 0 ? `${rem} left` : 'Full'})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#72102A]"
                  >
                    {DIFFICULTY_LEVELS.map(d => (
                      <option key={d} value={d}>
                        {d} ({activeSectionStats.diffBreakdown[d] || 0} entered)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cognitive Level */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Cognitive Level
                  </label>
                  <select
                    value={cognitiveLevel}
                    onChange={(e) => setCognitiveLevel(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#72102A]"
                  >
                    {COGNITIVE_LEVELS.map(c => (
                      <option key={c} value={c}>
                        {c} ({activeSectionStats.cogBreakdown[c] || 0} entered)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marks (Configured by Blueprint) */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Marks (Blueprint)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value) || 1)}
                    className="w-full h-9 px-3 rounded-lg border border-[#E8E2D9] bg-[#FAF8F5] text-xs font-extrabold text-[#72102A] focus:outline-none focus:border-[#72102A]"
                  />
                </div>
              </div>

              {/* Validation Warning Notice if quota is full */}
              {isCurrentTypeFull && (
                <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>
                    Notice: <strong>{questionType}</strong> has already reached its target ({currentTypeQuota.required}/{currentTypeQuota.required}) in {activeSectionName}. Please choose another allowed type or edit an existing question.
                  </span>
                </div>
              )}

              {/* Question Text Stem (Rich Text Formatted) */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Question Text Prompt *
                  </label>
                  <span className="text-[10px] text-stone-400">
                    {questionText.length} characters · {questionText.trim() ? questionText.trim().split(/\s+/).length : 0} words
                  </span>
                </div>

                {/* Minimalist Editor Toolbar */}
                <div className="flex items-center gap-1 p-1 bg-stone-50 border border-b-0 border-[#E8E2D9] rounded-t-lg text-xs text-stone-600">
                  <button
                    type="button"
                    onClick={() => setQuestionText(t => t + '**bold text**')}
                    className="px-2 py-0.5 rounded hover:bg-stone-200 font-bold"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionText(t => t + '*italic text*')}
                    className="px-2 py-0.5 rounded hover:bg-stone-200 italic"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionText(t => t + ' `code/formula` ')}
                    className="px-2 py-0.5 rounded hover:bg-stone-200 font-mono text-[11px]"
                    title="Formula / Code"
                  >
                    &lt;/&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionText(t => t + '\n• Bullet point')}
                    className="px-2 py-0.5 rounded hover:bg-stone-200"
                    title="Bullet List"
                  >
                    • List
                  </button>
                </div>

                <textarea
                  rows="3"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the complete question stem, formula, or problem statement here..."
                  className="w-full p-3 rounded-b-lg border border-[#E8E2D9] text-xs font-normal text-stone-900 focus:outline-none focus:border-[#72102A] leading-relaxed resize-y"
                />
              </div>

              {/* ── DYNAMIC QUESTION TYPE INPUTS ── */}
              <div className="mb-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9]">
                {/* Case 1: Multiple Choice (MCQ) */}
                {questionType === 'Multiple Choice (MCQ)' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                        Options & Correct Answer (Select Radio to Mark Correct)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextId = String.fromCharCode(65 + options.length);
                          setOptions([...options, { id: nextId, text: '', isCorrect: false }]);
                        }}
                        className="text-[11px] font-bold text-[#72102A] hover:underline cursor-pointer"
                      >
                        + Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {options.map((opt, i) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="mcq-correct-choice"
                              checked={opt.isCorrect}
                              onChange={() => setOptions(options.map((o, idx) => ({ ...o, isCorrect: idx === i })))}
                              className="w-4 h-4 text-[#72102A] focus:ring-[#72102A] cursor-pointer"
                            />
                            <span className="w-5 text-xs font-bold text-stone-700">({opt.id})</span>
                          </label>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const updated = [...options];
                              updated[i].text = e.target.value;
                              setOptions(updated);
                            }}
                            placeholder={`Option ${opt.id} text...`}
                            className={`flex-1 h-8 px-3 rounded-lg border text-xs bg-white focus:outline-none ${opt.isCorrect ? 'border-emerald-400 ring-1 ring-emerald-200 font-semibold' : 'border-[#E8E2D9]'}`}
                          />
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setOptions(options.filter((_, idx) => idx !== i).map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) })))}
                              className="text-stone-400 hover:text-red-500 p-1 text-xs"
                              title="Remove option"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case 2: Multiple-select MCQ (MSQ) */}
                {questionType === 'Multiple-select MCQ (MSQ)' && (
                  <div>
                    <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Options (Checkboxes for Multiple Correct Answers)
                    </div>
                    <div className="space-y-2">
                      {options.map((opt, i) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={opt.isCorrect}
                            onChange={() => setOptions(options.map((o, idx) => idx === i ? { ...o, isCorrect: !o.isCorrect } : o))}
                            className="w-4 h-4 rounded text-[#72102A] focus:ring-[#72102A] cursor-pointer"
                          />
                          <span className="w-5 text-xs font-bold text-stone-700">({opt.id})</span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const updated = [...options];
                              updated[i].text = e.target.value;
                              setOptions(updated);
                            }}
                            placeholder={`Option ${opt.id} text...`}
                            className="flex-1 h-8 px-3 rounded-lg border border-[#E8E2D9] text-xs bg-white focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case 3: True / False */}
                {(questionType === 'True / False' || questionType === 'Yes / No') && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Target Key
                    </label>
                    <div className="flex gap-3">
                      {['True', 'False'].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setBinaryKey(val)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${binaryKey === val
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200'
                            : 'bg-white text-stone-700 border-[#E8E2D9] hover:bg-stone-50'
                            }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case 4: Assertion & Reasoning */}
                {questionType === 'Assertion & Reasoning' && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Assertion (A):</label>
                      <input
                        type="text"
                        value={assertionText}
                        onChange={(e) => setAssertionText(e.target.value)}
                        placeholder="Enter statement for Assertion (A)..."
                        className="w-full h-8 px-3 rounded-lg border border-[#E8E2D9] bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Reason (R):</label>
                      <input
                        type="text"
                        value={reasonText}
                        onChange={(e) => setReasonText(e.target.value)}
                        placeholder="Enter statement for Reason (R)..."
                        className="w-full h-8 px-3 rounded-lg border border-[#E8E2D9] bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Correct Evaluation Code:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                        {[
                          { id: 'A', desc: 'Both A and R are true, and R is the correct explanation of A' },
                          { id: 'B', desc: 'Both A and R are true, but R is NOT the correct explanation of A' },
                          { id: 'C', desc: 'A is true, but R is false' },
                          { id: 'D', desc: 'A is false, but R is true' }
                        ].map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setArKey(c.id)}
                            className={`p-1.5 rounded-lg border text-left flex items-start gap-2 cursor-pointer ${arKey === c.id ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200 font-bold text-amber-900' : 'bg-white border-[#E8E2D9] text-stone-700'
                              }`}
                          >
                            <span className="font-mono font-bold shrink-0">({c.id})</span>
                            <span className="text-[10.5px] leading-tight">{c.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Case 5: Match the Following */}
                {questionType === 'Match the Following' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-stone-700 uppercase">Column I (Premise) → Column II (Response)</span>
                      <button
                        type="button"
                        onClick={() => setMatchingPairs([...matchingPairs, { id: matchingPairs.length + 1, left: '', right: '' }])}
                        className="text-[11px] font-bold text-[#72102A] hover:underline"
                      >
                        + Add Pair
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {matchingPairs.map((p, i) => (
                        <div key={p.id} className="flex items-center gap-2">
                          <span className="w-5 text-xs font-bold text-stone-500">{i + 1}.</span>
                          <input
                            type="text"
                            value={p.left}
                            onChange={(e) => {
                              const updated = [...matchingPairs];
                              updated[i].left = e.target.value;
                              setMatchingPairs(updated);
                            }}
                            placeholder="Premise item..."
                            className="flex-1 h-8 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs"
                          />
                          <span className="text-stone-400">→</span>
                          <input
                            type="text"
                            value={p.right}
                            onChange={(e) => {
                              const updated = [...matchingPairs];
                              updated[i].right = e.target.value;
                              setMatchingPairs(updated);
                            }}
                            placeholder="Matching response..."
                            className="flex-1 h-8 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case 6: Numerical Answer */}
                {questionType === 'Numerical Answer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Numerical Value *</label>
                      <input
                        type="number"
                        step="any"
                        value={numericValue}
                        onChange={(e) => setNumericValue(e.target.value)}
                        placeholder="e.g. 48.5"
                        className="w-full h-8 px-3 rounded-lg border border-[#E8E2D9] bg-white text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Unit (optional)</label>
                      <input
                        type="text"
                        value={numericUnit}
                        onChange={(e) => setNumericUnit(e.target.value)}
                        placeholder="e.g. m/s², cm, Joules"
                        className="w-full h-8 px-3 rounded-lg border border-[#E8E2D9] bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">Tolerance (±)</label>
                      <input
                        type="number"
                        step="any"
                        value={numericTolerance}
                        onChange={(e) => setNumericTolerance(Number(e.target.value) || 0)}
                        placeholder="e.g. 0.05"
                        className="w-full h-8 px-3 rounded-lg border border-[#E8E2D9] bg-white text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Case 7: Short Answer / Long Essay / Problem */}
                {(questionType.includes('Short') || questionType.includes('Essay') || questionType.includes('Long')) && (
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                      Model Answer / Key Points (Optional)
                    </label>
                    <textarea
                      rows="2"
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="Outline key expected points, essential formulas, or step-by-step model answer..."
                      className="w-full p-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-normal text-stone-800"
                    />
                  </div>
                )}
              </div>

              {/* Solution / Rubric Note */}
              <div className="mb-2">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Step-by-step Solution & Scoring Rubric (Optional)
                </label>
                <textarea
                  rows="2"
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  placeholder="Detailed marking scheme (e.g. 1 mark for formula, 2 marks for calculation)..."
                  className="w-full p-2.5 rounded-lg border border-[#E8E2D9] bg-white text-xs font-normal text-stone-800 focus:outline-none focus:border-[#72102A]"
                />
              </div>

              {/* Form Validation Feedback */}
              {formValidationMsg && (
                <div className={`p-2.5 rounded-xl text-xs font-semibold mb-2 ${formValidationMsg.startsWith('✓')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {formValidationMsg}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT WORKSPACE: LIVE QUESTION PREVIEW (STEP 7) & SECTION QUESTIONS DRAWER */}
          <div className="w-full lg:w-[420px] bg-[#FAF8F5] p-3 sm:p-5 flex flex-col overflow-y-auto shrink-0">

            {/* PREVIEW TABS HEADER */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                  Examination Paper Preview
                </span>
              </div>
              <span className="text-[10.5px] font-bold text-[#72102A] bg-[#FAF0F3] px-2 py-0.5 rounded-full border border-[#F2D7DF]">
                Live Paper Format
              </span>
            </div>

            {/* LIVE EXAMINATION PAPER CARD (Step 7) */}
            <div className="bg-white rounded-2xl border border-stone-300 shadow-sm p-4 relative mb-4">
              {/* Paper Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#72102A] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {activeSectionName}
                  </span>
                  <span className="text-[11px] font-bold text-stone-600">
                    [{marks} {marks === 1 ? 'Mark' : 'Marks'}]
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-500">
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">{difficulty}</span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">{cognitiveLevel}</span>
                </div>
              </div>

              {/* Question Number & Stem */}
              <div className="text-xs font-medium text-stone-900 leading-relaxed mb-3">
                <strong className="text-[#72102A] mr-1">
                  Q{activeSectionStats.totalEntered + 1}.
                </strong>
                {questionText || (
                  <span className="text-stone-400 italic">
                    (Question stem prompt will preview here as you type in real time...)
                  </span>
                )}
              </div>

              {/* Options in Exam Paper Format */}
              {questionType === 'Multiple Choice (MCQ)' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                  {options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-2 rounded-lg border flex items-center gap-2 ${opt.isCorrect
                        ? 'border-emerald-300 bg-emerald-50/70 text-emerald-900 font-semibold'
                        : 'border-stone-200 bg-white text-stone-700'
                        }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600 border border-stone-300'
                        }`}>
                        {opt.id}
                      </span>
                      <span className="truncate">{opt.text || `Option ${opt.id}`}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Assertion & Reason Preview */}
              {questionType === 'Assertion & Reasoning' && (
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs mb-3 space-y-1">
                  <div><strong>Assertion (A):</strong> {assertionText || '(Pending statement...)'}</div>
                  <div><strong>Reason (R):</strong> {reasonText || '(Pending statement...)'}</div>
                  <div className="text-emerald-700 font-bold pt-1 border-t border-stone-200">
                    Correct Code: ({arKey})
                  </div>
                </div>
              )}

              {/* Numerical Answer Preview */}
              {questionType === 'Numerical Answer' && (
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs mb-3">
                  <span className="text-stone-500 font-semibold">Answer Key: </span>
                  <strong className="text-emerald-700 font-mono font-bold">
                    {numericValue !== '' ? `${numericValue} ${numericUnit}` : '(Pending value)'}
                  </strong>
                  {numericTolerance > 0 && <span className="text-stone-500 ml-1">(±{numericTolerance})</span>}
                </div>
              )}

              {/* Solution Drawer in Preview */}
              {(solution || rubric) && (
                <div className="mt-2 pt-2 border-t border-stone-200 text-[11px] text-stone-600">
                  <div className="font-bold text-[#72102A] mb-0.5">Solution / Marking Notes:</div>
                  <p className="m-0 leading-normal">{solution || rubric}</p>
                </div>
              )}
            </div>

            {/* ── SECTION QUESTIONS LIST / DRAFT MANAGER ── */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-3 shadow-2xs flex-1 flex flex-col min-h-[180px]">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E8E2D9]">
                <span className="text-xs font-bold text-stone-800">
                  Questions in {activeSectionName} ({activeSectionStats.totalEntered} of {activeSectionStats.requiredQuestions})
                </span>
                <span className="text-[10px] text-stone-400">
                  Click item to edit
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                {activeSectionStats.enteredQuestions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-400 italic">
                    No questions added for {activeSectionName} yet. Fill the form on the left and click "Save Question" or "Save & Add Another".
                  </div>
                ) : (
                  activeSectionStats.enteredQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      onClick={() => loadQuestionIntoForm(q)}
                      className={`p-2 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${editingQuestionId === q.id
                        ? 'border-[#72102A] bg-[#FAF0F3]/60 ring-1 ring-[#72102A]/20'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                        }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="font-bold text-[#72102A]">Q{idx + 1}.</span>
                          <span className="font-semibold text-stone-800 truncate max-w-[140px]">{q.type}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700">{q.marks}M</span>
                          <span className={`text-[9.5px] font-bold px-1.5 rounded ${q.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {q.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 line-clamp-1 m-0">
                          {q.questionText}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => loadQuestionIntoForm(q)}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
                          title="Edit question"
                        >
                          <Icon name="edit" className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFromSection(q.id)}
                          className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center cursor-pointer"
                          title="Delete from section"
                        >
                          <Icon name="trash" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── STEP 8: BOTTOM ACTION BAR & SUBMIT QUESTION SET ── */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Section Progress Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">
              {activeSectionName}:
            </span>
            <span className="text-xs font-extrabold text-[#72102A]">
              {activeSectionStats.totalEntered} / {activeSectionStats.requiredQuestions} Questions
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs text-stone-500">
              Total Blueprint: <strong>{overallStats.totalCompletedQuestions}/{overallStats.totalRequiredQuestions}</strong> ({overallStats.totalRequiredMarks} Marks)
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleSaveQuestionEntry('Draft', false)}
              className="h-9 px-3.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSaveQuestionEntry('Approved', true)}
              className="h-9 px-4 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              + Save & Add Another
            </button>

            <button
              type="button"
              onClick={() => handleSaveQuestionEntry('Approved', false)}
              className="h-9 px-4 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Save Question
            </button>

            {/* SUBMIT COMPLETED QUESTION SET (Enabled ONLY when blueprint is 100% satisfied!) */}
            <button
              type="button"
              disabled={!overallStats.allSectionsComplete}
              onClick={() => setShowSubmitModal(true)}
              title={
                overallStats.allSectionsComplete
                  ? 'Click to review and submit complete question set to Question Bank'
                  : `Fulfill all ${overallStats.totalRequiredQuestions} blueprint requirements to submit (Current: ${overallStats.totalCompletedQuestions}/${overallStats.totalRequiredQuestions})`
              }
              className={`h-9 px-5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${overallStats.allSectionsComplete
                ? 'bg-gradient-to-r from-[#72102A] to-[#450514] hover:from-[#851633] hover:to-[#54081C] text-white shadow-md hover:scale-105 active:scale-95'
                : 'bg-stone-200 text-stone-400 border border-stone-300 cursor-not-allowed opacity-60'
                }`}
            >
              <span>🚀</span>
              <span>Submit Question Set</span>
              {overallStats.allSectionsComplete && (
                <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-ping ml-1" />
              )}
            </button>
          </div>
        </div>

      </div>

      {/* ── BLUEPRINT COMPLETION SUMMARY & SUBMISSION MODAL ── */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-ios-reveal"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
                ✓
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 m-0">
                  Ready to Submit Question Set
                </h3>
                <p className="text-xs text-stone-500 m-0">
                  All blueprint validation criteria across all examination sections are 100% satisfied.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E8E2D9] mb-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold pb-2 border-b border-stone-200 text-stone-800">
                <span>{activeBlueprint?.name}</span>
                <span className="text-[#72102A]">{overallStats.totalRequiredMarks} Marks Total</span>
              </div>

              <div className="space-y-1.5 pt-1">
                {sectionsList.map(s => {
                  const stat = sectionStats[s.name];
                  return (
                    <div key={s.name} className="flex items-center justify-between text-stone-700">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <span className="text-emerald-600 font-bold">✓</span>
                        {s.name}
                      </span>
                      <span className="font-mono font-bold text-stone-800">
                        {stat?.completedCount} / {stat?.requiredQuestions} Qs ({stat?.requiredMarks} Marks)
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500">
                Total questions submitted: <strong>{overallStats.totalCompletedQuestions} Questions</strong>. All questions will be published to the official School Question Bank.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Back to Editing
              </button>
              <button
                type="button"
                onClick={handleFinalSubmitSet}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#72102A] to-[#450514] hover:from-[#851633] hover:to-[#54081C] shadow-md cursor-pointer transition-all active:scale-95"
              >
                Confirm & Submit to Question Bank
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
