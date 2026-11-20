import React, { useState, useMemo } from 'react';
import {
  ACADEMIC_PROGRAMS,
  PROGRAM_SUBJECTS,
  EXAMS_LIST,
  SESSIONS_LIST,
  COGNITIVE_LEVELS,
  DIFFICULTY_LEVELS,
  RESPONSE_FORMATS,
  STIMULUS_TYPES,
  ASSESSMENT_MODES,
  DEFAULT_CHAPTERS_BY_SUBJECT
} from '../../data/questionCreationData.js';
import CustomDropdown from './CustomDropdown.jsx';

export default function CreateQuestionModal({
  isOpen,
  onClose,
  onSave,
  existingQuestions = [],
  editingItem = null
}) {
  if (!isOpen) return null;

  // 1. Academic Context State
  const [selectedSession, setSelectedSession] = useState(editingItem?.session || SESSIONS_LIST[0]);
  const [selectedExam, setSelectedExam] = useState(editingItem?.exam || EXAMS_LIST[0].name);
  const [selectedProgram, setSelectedProgram] = useState(editingItem?.program || ACADEMIC_PROGRAMS[1]); // Class 10 default
  const [selectedSubject, setSelectedSubject] = useState(
    editingItem?.subject || (PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[1]] ? PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[1]][0] : 'Mathematics')
  );

  // Chapters for selected subject
  const availableChapters = useMemo(() => {
    if (DEFAULT_CHAPTERS_BY_SUBJECT[selectedSubject]) {
      return DEFAULT_CHAPTERS_BY_SUBJECT[selectedSubject];
    }
    // Search by partial match or fallback
    const key = Object.keys(DEFAULT_CHAPTERS_BY_SUBJECT).find((k) =>
      selectedSubject.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(selectedSubject.toLowerCase())
    );
    if (key) return DEFAULT_CHAPTERS_BY_SUBJECT[key];
    return ['Unit 1: Fundamentals', 'Unit 2: Core Concepts', 'Unit 3: Applied Principles'];
  }, [selectedSubject]);

  const [selectedChapter, setSelectedChapter] = useState(
    editingItem?.chapter && availableChapters.includes(editingItem.chapter)
      ? editingItem.chapter
      : availableChapters[0] || 'General Syllabus'
  );

  // 2. Assessment Taxonomy Dimensions (Document Section 13 & 17)
  const [responseType, setResponseType] = useState(editingItem?.type || 'Multiple Choice (MCQ)');
  const [stimulusType, setStimulusType] = useState(editingItem?.stimulusType || (editingItem?.type?.includes('Case') ? 'Case Study' : 'None'));
  const [cognitiveLevel, setCognitiveLevel] = useState(editingItem?.cognitiveLevel || 'Apply');
  const [difficulty, setDifficulty] = useState(editingItem?.difficulty || 'Medium');
  const [assessmentMode, setAssessmentMode] = useState(editingItem?.assessmentMode || 'Written');
  const [marks, setMarks] = useState(editingItem?.marks ?? 2);
  const [negativeMarks, setNegativeMarks] = useState(editingItem?.negativeMarks ?? 0);
  const [tags, setTags] = useState(editingItem?.tags ? editingItem.tags.join(', ') : '');

  // 3. Question Content & Stimulus
  const [stimulusTitle, setStimulusTitle] = useState(editingItem?.stimulusTitle || '');
  const [stimulusText, setStimulusText] = useState(editingItem?.stimulusText || '');
  const [questionText, setQuestionText] = useState(editingItem?.questionText || '');

  // Dynamic Options (for MCQ & MSQ)
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

  // Dynamic True / False or Yes / No
  const [binaryKey, setBinaryKey] = useState(
    editingItem?.binaryKey || (editingItem?.correctAnswer?.includes('False') || editingItem?.correctAnswer?.includes('No') ? 'False' : 'True')
  );

  // Dynamic Assertion-Reason
  const [assertionText, setAssertionText] = useState(editingItem?.assertionText || '');
  const [reasonText, setReasonText] = useState(editingItem?.reasonText || '');
  const [arKey, setArKey] = useState(editingItem?.arKey || 'A');

  // Dynamic Match the Following
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

  // Dynamic Numerical Answer
  const [numericValue, setNumericValue] = useState(editingItem?.numericValue !== undefined ? editingItem.numericValue : '');
  const [numericTolerance, setNumericTolerance] = useState(editingItem?.numericTolerance !== undefined ? editingItem.numericTolerance : 0);
  const [numericUnit, setNumericUnit] = useState(editingItem?.numericUnit || '');

  // Dynamic Coding Question
  const [codeLanguage, setCodeLanguage] = useState(editingItem?.codeLanguage || 'Python');
  const [starterCode, setStarterCode] = useState(editingItem?.starterCode || '');
  const [expectedOutput, setExpectedOutput] = useState(editingItem?.expectedOutput || '');

  // Fill in the Blank
  const [blankKey, setBlankKey] = useState(editingItem?.blankKey || editingItem?.correctAnswer || '');

  // 4. Solution & Marking Notes
  const [solution, setSolution] = useState(editingItem?.solution || '');
  const [rubric, setRubric] = useState(editingItem?.rubric || '');

  // Sync default marks and stimulus when response format changes
  const handleResponseTypeChange = (typeName) => {
    setResponseType(typeName);
    const matched = RESPONSE_FORMATS.find((r) => r.name === typeName);
    if (matched && !editingItem) {
      setMarks(matched.defaultMarks);
      if (matched.group === 'Stimulus-Based' && stimulusType === 'None') {
        setStimulusType('Case Study');
      }
    }
  };

  const handleProgramChange = (prog) => {
    setSelectedProgram(prog);
    const subs = PROGRAM_SUBJECTS[prog] || [];
    const nextSub = subs[0] || '';
    setSelectedSubject(nextSub);
    const nextChapters = DEFAULT_CHAPTERS_BY_SUBJECT[nextSub] || ['General Syllabus'];
    setSelectedChapter(nextChapters[0] || 'General Syllabus');
  };

  const handleSubjectChange = (sub) => {
    setSelectedSubject(sub);
    const nextChapters = DEFAULT_CHAPTERS_BY_SUBJECT[sub] || ['General Syllabus'];
    setSelectedChapter(nextChapters[0] || 'General Syllabus');
  };

  // MCQ Single Correct Option Setter
  const setCorrectOptionRadio = (idx) => {
    setOptions(options.map((opt, i) => ({ ...opt, isCorrect: i === idx })));
  };

  // MSQ Multi Correct Option Toggle
  const toggleCorrectOptionCheckbox = (idx) => {
    setOptions(options.map((opt, i) => (i === idx ? { ...opt, isCorrect: !opt.isCorrect } : opt)));
  };

  const handleOptionTextChange = (idx, text) => {
    const updated = [...options];
    updated[idx].text = text;
    setOptions(updated);
  };

  const addOption = () => {
    const nextId = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: nextId, text: '', isCorrect: false }]);
  };

  const removeOption = (idx) => {
    if (options.length <= 2) return;
    const filtered = options.filter((_, i) => i !== idx).map((opt, i) => ({
      ...opt,
      id: String.fromCharCode(65 + i)
    }));
    setOptions(filtered);
  };

  // Matching pair updater
  const handlePairChange = (idx, field, value) => {
    const updated = [...matchingPairs];
    updated[idx][field] = value;
    setMatchingPairs(updated);
  };

  const addMatchingPair = () => {
    setMatchingPairs([...matchingPairs, { id: matchingPairs.length + 1, left: '', right: '' }]);
  };

  const removeMatchingPair = (idx) => {
    if (matchingPairs.length <= 2) return;
    setMatchingPairs(matchingPairs.filter((_, i) => i !== idx).map((p, i) => ({ ...p, id: i + 1 })));
  };

  // Construct readable correct answer string based on format
  const computedCorrectAnswer = useMemo(() => {
    if (responseType === 'Multiple Choice (MCQ)') {
      const correct = options.find((o) => o.isCorrect);
      return correct ? `Option ${correct.id}: ${correct.text || '(empty)'}` : 'Not set';
    }
    if (responseType === 'Multiple-select MCQ (MSQ)') {
      const corrects = options.filter((o) => o.isCorrect);
      return corrects.length > 0
        ? `Options: ${corrects.map((o) => `${o.id}`).join(', ')}`
        : 'Select at least one correct key';
    }
    if (responseType === 'True / False' || responseType === 'Yes / No') {
      return binaryKey;
    }
    if (responseType === 'Assertion–Reason') {
      return `Code ${arKey}`;
    }
    if (responseType === 'Match the Following') {
      return matchingPairs
        .filter((p) => p.left && p.right)
        .map((p) => `${p.left} → ${p.right}`)
        .join('; ');
    }
    if (responseType === 'Numerical Answer') {
      return numericValue !== ''
        ? `${numericValue}${numericUnit ? ` ${numericUnit}` : ''}${numericTolerance > 0 ? ` (±${numericTolerance})` : ''}`
        : 'Numerical value required';
    }
    if (responseType === 'Fill in the Blank') {
      return blankKey || 'Target answer required';
    }
    if (responseType.includes('Code') || responseType.includes('SQL')) {
      return expectedOutput || 'See test cases / output specification';
    }
    return rubric || 'Refer to marking guidelines';
  }, [responseType, options, binaryKey, arKey, matchingPairs, numericValue, numericUnit, numericTolerance, blankKey, expectedOutput, rubric]);

  // Save handler
  const handleSave = (status, addNext = false) => {
    if (!questionText.trim()) {
      alert('Please enter the question stem/body prompt before saving.');
      return;
    }

    const tagList = tags
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      id: editingItem ? editingItem.id : `QCR-${Date.now().toString().slice(-4)}`,
      code: editingItem ? editingItem.code : `${selectedSubject.slice(0, 3).toUpperCase()}-Q-${Date.now().toString().slice(-3)}`,
      session: selectedSession,
      exam: selectedExam,
      program: selectedProgram,
      subject: selectedSubject,
      chapter: selectedChapter,
      type: responseType,
      stimulusType: stimulusType,
      stimulusTitle: stimulusTitle.trim(),
      stimulusText: stimulusText.trim(),
      cognitiveLevel: cognitiveLevel,
      difficulty: difficulty,
      assessmentMode: assessmentMode,
      marks: Number(marks) || 1,
      negativeMarks: Number(negativeMarks) || 0,
      questionText: questionText.trim(),
      options: responseType.includes('MCQ') ? options : [],
      binaryKey: responseType === 'True / False' || responseType === 'Yes / No' ? binaryKey : undefined,
      assertionText: responseType === 'Assertion–Reason' ? assertionText.trim() : undefined,
      reasonText: responseType === 'Assertion–Reason' ? reasonText.trim() : undefined,
      arKey: responseType === 'Assertion–Reason' ? arKey : undefined,
      matchingPairs: responseType === 'Match the Following' ? matchingPairs : undefined,
      numericValue: responseType === 'Numerical Answer' ? Number(numericValue) : undefined,
      numericTolerance: responseType === 'Numerical Answer' ? Number(numericTolerance) : undefined,
      numericUnit: responseType === 'Numerical Answer' ? numericUnit.trim() : undefined,
      codeLanguage: responseType.includes('Code') || responseType.includes('SQL') ? codeLanguage : undefined,
      starterCode: starterCode.trim(),
      expectedOutput: expectedOutput.trim(),
      blankKey: blankKey.trim(),
      correctAnswer: computedCorrectAnswer,
      solution: solution.trim(),
      rubric: rubric.trim(),
      tags: tagList,
      blueprintSection: responseType.includes('MCQ') ? 'Section A (Objective)' : marks >= 5 ? 'Section D (Extended)' : 'Section B (Short)',
      author: editingItem?.author || 'Current Educator (You)',
      status: status,
      createdAt: editingItem?.createdAt || 'Just now',
      assignedTeacher: editingItem?.assignedTeacher || 'Current Educator (You)'
    };

    onSave(payload, status);

    if (addNext) {
      setQuestionText('');
      setStimulusText('');
      setStimulusTitle('');
      setSolution('');
      setRubric('');
      setBlankKey('');
      setNumericValue('');
      setStarterCode('');
      setExpectedOutput('');
      setOptions([
        { id: 'A', text: '', isCorrect: true },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
        { id: 'D', text: '', isCorrect: false }
      ]);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed top-[60px] left-0 md:left-[240px] right-0 bottom-0 z-40 bg-black/60 backdrop-blur-sm p-2.5 sm:p-4 lg:p-5 flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={editingItem ? 'Edit Question Specifications' : 'Author Question (Question Bank)'}
    >
      {/* Full-Area Modern Form Surface — Exact Same Sizing as Question Type Modal */}
      <div className="w-full h-full bg-[#FAF8F5] rounded-3xl border border-white/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-ios-reveal">

        {/* ── COMPACT MODERN HEADER ── */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1F3A] to-[#5C0C21] text-white flex items-center justify-center font-bold text-[11px] shadow-sm shrink-0">
              Q+
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
                  {editingItem ? 'Edit Question Specifications' : 'Author Question in Question Bank'}
                </h2>
                {editingItem?.code && (
                  <span className="font-mono text-[10px] font-bold text-[#72102A] bg-[#FAF0F3] border border-[#F2D7DF] px-2 py-0.5 rounded-full">
                    {editingItem.code}
                  </span>
                )}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]">
                  {responseType}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate m-0">
                Authoring for <strong className="text-amber-800 font-semibold">{selectedSession}</strong> ·{' '}
                <strong className="text-[#5B21B6]">{selectedExam}</strong> ·{' '}
                <strong className="text-stone-700">{selectedProgram}</strong> ·{' '}
                <strong className="text-[#72102A]">{selectedSubject}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F7] border border-stone-200/90 text-stone-700 font-medium text-xs shadow-2xs">
              <span className="text-stone-400">Marks:</span>
              <strong className="text-[#72102A] font-bold">[{marks} M]</strong>
              {negativeMarks > 0 && (
                <span className="text-rose-600 font-semibold ml-1">(-{negativeMarks})</span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{ outline: 'none' }}
              className="w-8 h-8 rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer text-xs"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── LOCKED-VIEWPORT OPTIMIZED SPLIT WORKSPACE ── */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-3.5 sm:p-4 bg-gradient-to-br from-[#FAF8F5]/75 via-white/55 to-[#FAF0F3]/35">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:h-full lg:min-h-0">

            {/* LEFT MAIN WORKSPACE (8 Cols): Context + Taxonomy Dimensions + Dynamic Authoring */}
            <div className="lg:col-span-8 flex flex-col gap-3 lg:h-full lg:min-h-0 overflow-y-auto custom-scrollbar pr-1">

              {/* SECTION 1: ACADEMIC CONTEXT (Session · Exam · Program · Subject · Chapter) */}
              <div className="bg-white/80 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#E8E2D9] shadow-2xs shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-[11px] font-bold text-stone-700 uppercase tracking-wider m-0">
                    Academic Context
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {/* Session */}
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Session</label>
                    <CustomDropdown
                      value={selectedSession}
                      onChange={(val) => setSelectedSession(val)}
                      options={SESSIONS_LIST.map((s) => ({ value: s, label: s }))}
                      searchable={false}
                    />
                  </div>

                  {/* Exam */}
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Exam Target</label>
                    <CustomDropdown
                      value={selectedExam}
                      onChange={(val) => setSelectedExam(val)}
                      options={EXAMS_LIST.map((e) => ({ value: e.name, label: e.name }))}
                      searchable={false}
                    />
                  </div>

                  {/* Program */}
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Class / Program</label>
                    <CustomDropdown
                      value={selectedProgram}
                      onChange={(val) => handleProgramChange(val)}
                      options={ACADEMIC_PROGRAMS}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Subject</label>
                    <CustomDropdown
                      value={selectedSubject}
                      onChange={(val) => handleSubjectChange(val)}
                      options={PROGRAM_SUBJECTS[selectedProgram] || []}
                    />
                  </div>

                  {/* Chapter */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Syllabus Chapter</label>
                    <CustomDropdown
                      value={selectedChapter}
                      onChange={(val) => setSelectedChapter(val)}
                      options={availableChapters.map((ch, idx) => ({ value: ch, label: `Ch ${idx + 1}: ${ch}` }))}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: ASSESSMENT TAXONOMY DIMENSIONS (Document Section 13, 14 & 17) */}
              <div className="bg-white/80 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-[#E8E2D9] shadow-2xs shrink-0 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-[11px] font-bold text-stone-700 uppercase tracking-wider m-0">
                      Assessment Taxonomy & Dimension Mapping
                    </h3>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">
                    Documented Production Taxonomy Standard
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Response Format */}
                  <div className="sm:col-span-2">
                    <label className="block text-[9.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Response Format / Question Type *
                    </label>
                    <CustomDropdown
                      value={responseType}
                      onChange={(val) => handleResponseTypeChange(val)}
                      options={RESPONSE_FORMATS.map((r) => ({
                        value: r.name,
                        label: r.name,
                        description: r.group
                      }))}
                    />
                  </div>

                  {/* Stimulus Type */}
                  <div>
                    <label className="block text-[9.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Stimulus Type
                    </label>
                    <CustomDropdown
                      value={stimulusType}
                      onChange={(val) => setStimulusType(val)}
                      options={STIMULUS_TYPES.map((s) => ({ value: s, label: s }))}
                      searchable={false}
                    />
                  </div>

                  {/* Assessment Mode */}
                  <div>
                    <label className="block text-[9.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Assessment Mode
                    </label>
                    <CustomDropdown
                      value={assessmentMode}
                      onChange={(val) => setAssessmentMode(val)}
                      options={ASSESSMENT_MODES.map((m) => ({ value: m, label: m }))}
                      searchable={false}
                    />
                  </div>

                  {/* Cognitive Level (Bloom's) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[9.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Cognitive Demand (Bloom's Taxonomy)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                      {COGNITIVE_LEVELS.map((cog) => {
                        const isSelected = cognitiveLevel === cog.id;
                        return (
                          <button
                            key={cog.id}
                            type="button"
                            onClick={() => setCognitiveLevel(cog.id)}
                            className={`py-1.5 px-1 rounded-xl text-[10.5px] font-bold transition-all text-center cursor-pointer border ${
                              isSelected
                                ? 'bg-[#72102A] text-white border-[#72102A] shadow-xs'
                                : 'bg-white hover:bg-[#FAF8F5] text-stone-600 border-stone-200'
                            }`}
                            title={cog.desc}
                          >
                            {cog.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <label className="block text-[9.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Difficulty
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {DIFFICULTY_LEVELS.slice(0, 3).map((dif) => {
                        const isSelected = difficulty === dif.id;
                        return (
                          <button
                            key={dif.id}
                            type="button"
                            onClick={() => setDifficulty(dif.id)}
                            className={`py-1.5 px-1 rounded-xl text-[10.5px] font-bold transition-all text-center cursor-pointer border ${
                              isSelected
                                ? `${dif.bg} ${dif.text} ${dif.border} ring-1 ring-current shadow-xs`
                                : 'bg-white hover:bg-[#FAF8F5] text-stone-600 border-stone-200'
                            }`}
                          >
                            {dif.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Marks & Negative Marks */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[9.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Marks
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        className="w-full h-[36px] bg-[#FAF9F7] border border-stone-200 rounded-xl px-2.5 text-xs text-center font-bold text-stone-900 focus:outline-none focus:border-[#72102A]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[9.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        - Penalty
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="5"
                        value={negativeMarks}
                        onChange={(e) => setNegativeMarks(e.target.value)}
                        className="w-full h-[36px] bg-[#FAF9F7] border border-stone-200 rounded-xl px-2 text-xs text-center font-bold text-rose-700 focus:outline-none focus:border-rose-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DYNAMIC QUESTION STEM & SPECIALIZED INPUT FORMAT (Document Section 12) */}
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-[11px] font-bold text-stone-700 uppercase tracking-wider m-0">
                      Question Prompt & Format-Specific Inputs
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]">
                    {responseType}
                  </span>
                </div>

                {/* Stimulus Context Box (Visible when stimulusType !== 'None') */}
                {stimulusType !== 'None' && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-900">
                          {stimulusType} Context / Source Stimulus
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-800 italic">Learner will read this before answering</span>
                    </div>

                    <input
                      type="text"
                      value={stimulusTitle}
                      onChange={(e) => setStimulusTitle(e.target.value)}
                      placeholder="Stimulus Title / Heading (e.g. Case Brief: Autonomous Navigation System)"
                      className="w-full h-8 bg-white border border-amber-300/80 rounded-xl px-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-600"
                    />

                    <textarea
                      rows={3}
                      value={stimulusText}
                      onChange={(e) => setStimulusText(e.target.value)}
                      placeholder="Enter the full passage, case scenario, data brief, or document excerpt here..."
                      className="w-full bg-white border border-amber-300/80 rounded-xl p-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-600 leading-relaxed"
                    />
                  </div>
                )}

                {/* Question Stem Prompt */}
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Question Stem / Body Prompt *
                  </label>
                  <textarea
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter the precise question or problem statement clearly..."
                    className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl p-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#72102A] focus:bg-white transition-all leading-relaxed"
                  />
                </div>

                {/* ── FORMAT-SPECIFIC DYNAMIC INPUT BUILDERS (Document Section 12) ── */}

                {/* FORMAT A: MCQ Single Choice */}
                {responseType === 'Multiple Choice (MCQ)' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-stone-600 uppercase tracking-wider">
                        Options (Click radio to mark single correct key)
                      </span>
                      <button
                        type="button"
                        onClick={addOption}
                        className="text-[11px] font-bold text-[#72102A] hover:underline cursor-pointer"
                      >
                        + Add Option
                      </button>
                    </div>

                    <div className="space-y-2">
                      {options.map((opt, idx) => (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                            opt.isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300/40 shadow-xs'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <label className="flex items-center gap-1.5 cursor-pointer shrink-0 pl-1">
                            <input
                              type="radio"
                              name="mcqSingleCorrect"
                              checked={opt.isCorrect}
                              onChange={() => setCorrectOptionRadio(idx)}
                              className="accent-emerald-600 w-4 h-4 cursor-pointer"
                            />
                            <span className="font-mono font-black text-xs text-stone-700 w-4">{opt.id}.</span>
                          </label>

                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                            placeholder={`Option ${opt.id} choice text...`}
                            className="flex-1 bg-[#FAF9F7] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#72102A] focus:bg-white"
                          />

                          {opt.isCorrect && (
                            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                              ✓ Key
                            </span>
                          )}

                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(idx)}
                              className="w-6 h-6 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                              title="Delete option"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FORMAT B: Multiple-Select MCQ (MSQ) */}
                {responseType === 'Multiple-select MCQ (MSQ)' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-stone-600 uppercase tracking-wider">
                        MSQ Options (Check all correct keys that apply)
                      </span>
                      <button
                        type="button"
                        onClick={addOption}
                        className="text-[11px] font-bold text-[#72102A] hover:underline cursor-pointer"
                      >
                        + Add Option
                      </button>
                    </div>

                    <div className="space-y-2">
                      {options.map((opt, idx) => (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                            opt.isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300/40 shadow-xs'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <label className="flex items-center gap-1.5 cursor-pointer shrink-0 pl-1">
                            <input
                              type="checkbox"
                              checked={opt.isCorrect}
                              onChange={() => toggleCorrectOptionCheckbox(idx)}
                              className="accent-emerald-600 w-4 h-4 cursor-pointer"
                            />
                            <span className="font-mono font-black text-xs text-stone-700 w-4">{opt.id}.</span>
                          </label>

                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                            placeholder={`Option ${opt.id} choice text...`}
                            className="flex-1 bg-[#FAF9F7] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#72102A] focus:bg-white"
                          />

                          {opt.isCorrect && (
                            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                              ✓ Key
                            </span>
                          )}

                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(idx)}
                              className="w-6 h-6 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                              title="Delete option"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FORMAT C: True / False or Yes / No */}
                {(responseType === 'True / False' || responseType === 'Yes / No') && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10.5px] font-bold text-stone-600 uppercase tracking-wider block">
                      Select Correct Binary Answer
                    </span>
                    <div className="grid grid-cols-2 gap-3 max-w-sm">
                      {(responseType === 'True / False' ? ['True', 'False'] : ['Yes', 'No']).map((opt) => {
                        const isSelected = binaryKey === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setBinaryKey(opt)}
                            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102'
                                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                            }`}
                          >
                            <span>{opt === 'True' || opt === 'Yes' ? '✓' : '✕'}</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FORMAT D: Assertion–Reason */}
                {responseType === 'Assertion–Reason' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Assertion Statement (A) *
                      </label>
                      <input
                        type="text"
                        value={assertionText}
                        onChange={(e) => setAssertionText(e.target.value)}
                        placeholder="Enter the Assertion (A) claim..."
                        className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Reason Statement (R) *
                      </label>
                      <input
                        type="text"
                        value={reasonText}
                        onChange={(e) => setReasonText(e.target.value)}
                        placeholder="Enter the Reason (R) explanation..."
                        className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        Select Correct Evaluation Code
                      </span>
                      <div className="space-y-1.5">
                        {[
                          { key: 'A', text: 'Both (A) and (R) are true, and (R) is the correct explanation of (A).' },
                          { key: 'B', text: 'Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).' },
                          { key: 'C', text: '(A) is true, but (R) is false.' },
                          { key: 'D', text: '(A) is false, but (R) is true.' }
                        ].map((choice) => (
                          <label
                            key={choice.key}
                            className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                              arKey === choice.key
                                ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-900 shadow-2xs'
                                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="arEvaluation"
                              checked={arKey === choice.key}
                              onChange={() => setArKey(choice.key)}
                              className="accent-emerald-600 mt-0.5 cursor-pointer"
                            />
                            <span>
                              <strong>({choice.key})</strong> {choice.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* FORMAT E: Match the Following */}
                {responseType === 'Match the Following' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-stone-600 uppercase tracking-wider">
                        Matching Pairs (Column I ↔ Column II)
                      </span>
                      <button
                        type="button"
                        onClick={addMatchingPair}
                        className="text-[11px] font-bold text-[#72102A] hover:underline cursor-pointer"
                      >
                        + Add Pair
                      </button>
                    </div>

                    <div className="space-y-2">
                      {matchingPairs.map((pair, idx) => (
                        <div key={pair.id} className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-400 w-5">{idx + 1}.</span>
                          <input
                            type="text"
                            value={pair.left}
                            onChange={(e) => handlePairChange(idx, 'left', e.target.value)}
                            placeholder={`Column I item ${idx + 1}...`}
                            className="flex-1 bg-[#FAF9F7] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                          />
                          <span className="text-stone-400 font-bold">↔</span>
                          <input
                            type="text"
                            value={pair.right}
                            onChange={(e) => handlePairChange(idx, 'right', e.target.value)}
                            placeholder={`Matching Column II pair ${idx + 1}...`}
                            className="flex-1 bg-[#FAF9F7] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                          />
                          {matchingPairs.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeMatchingPair(idx)}
                              className="w-6 h-6 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FORMAT F: Numerical Answer */}
                {responseType === 'Numerical Answer' && (
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[10.5px] font-bold text-stone-600 uppercase tracking-wider block">
                      Target Numeric Value & Tolerance
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9.5px] font-bold text-stone-400 uppercase mb-1">
                          Correct Value *
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={numericValue}
                          onChange={(e) => setNumericValue(e.target.value)}
                          placeholder="e.g. 15.5"
                          className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#72102A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-bold text-stone-400 uppercase mb-1">
                          Margin of Error (± Tolerance)
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={numericTolerance}
                          onChange={(e) => setNumericTolerance(e.target.value)}
                          placeholder="e.g. 0.2"
                          className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-bold text-stone-400 uppercase mb-1">
                          Unit of Measurement
                        </label>
                        <input
                          type="text"
                          value={numericUnit}
                          onChange={(e) => setNumericUnit(e.target.value)}
                          placeholder="e.g. m/s, cm, kg"
                          className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* FORMAT G: Code Writing / SQL */}
                {(responseType.includes('Code') || responseType.includes('SQL')) && (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-stone-600 uppercase tracking-wider">
                        Programming Language & Boilerplate
                      </span>
                      <div className="w-36">
                        <CustomDropdown
                          value={codeLanguage}
                          onChange={(val) => setCodeLanguage(val)}
                          options={['Python', 'Java', 'C++', 'SQL', 'JavaScript']}
                          searchable={false}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-bold text-stone-400 uppercase mb-1">
                        Starter Code / Function Signature
                      </label>
                      <textarea
                        rows={3}
                        value={starterCode}
                        onChange={(e) => setStarterCode(e.target.value)}
                        placeholder="def solve(input_data):\n    # Write your solution here\n    pass"
                        className="w-full font-mono bg-[#1E1E1E] text-emerald-400 border border-stone-300 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-[#72102A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-bold text-stone-400 uppercase mb-1">
                        Expected Output / Test Cases
                      </label>
                      <textarea
                        rows={2}
                        value={expectedOutput}
                        onChange={(e) => setExpectedOutput(e.target.value)}
                        placeholder="Input: [1, 2, 3] -> Expected Output: 6"
                        className="w-full font-mono bg-[#FAF9F7] border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                      />
                    </div>
                  </div>
                )}

                {/* FORMAT H: Fill in the Blank */}
                {responseType === 'Fill in the Blank' && (
                  <div className="space-y-2 pt-1">
                    <label className="block text-[10.5px] font-bold text-stone-600 uppercase tracking-wider">
                      Target Answer Key(s)
                    </label>
                    <input
                      type="text"
                      value={blankKey}
                      onChange={(e) => setBlankKey(e.target.value)}
                      placeholder="Enter exact acceptable word/phrase (comma-separate multiple acceptable answers)"
                      className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                    />
                  </div>
                )}

              </div>

              {/* SECTION 4: MODEL SOLUTION, MARKING RUBRIC & TAGS (Document Section 14) */}
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-[11px] font-bold text-stone-700 uppercase tracking-wider m-0">
                    Model Solution, Evaluation Rubric & Tags
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Model Solution / Worked Steps
                    </label>
                    <textarea
                      rows={3}
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="Provide step-by-step mathematical derivation, code logic, or explanation for evaluators..."
                      className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-[#72102A] leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Evaluation Rubric / Key Criteria
                      </label>
                      <input
                        type="text"
                        value={rubric}
                        onChange={(e) => setRubric(e.target.value)}
                        placeholder="e.g. 1m for formula, 2m for calculation, 1m for final unit"
                        className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Question Tags (Comma-Separated)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g. Algebra, Reflection, Heuristic, Optics"
                        className="w-full bg-[#FAF9F7] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#72102A]"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT PANEL (4 Cols): REAL-TIME STUDENT EXAM PREVIEW & BLUEPRINT DECK */}
            <div className="lg:col-span-4 flex flex-col lg:h-full lg:min-h-0">
              <div className="bg-white/85 backdrop-blur-lg p-3.5 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col flex-1 min-h-0">

                {/* Preview Header */}
                <div className="pb-3 border-b border-stone-100 shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#72102A] text-white text-[9px] font-extrabold flex items-center justify-center">
                        ★
                      </span>
                      <h3 className="text-[11px] font-bold text-stone-800 uppercase tracking-wider m-0">
                        Live Exam Card Preview
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]">
                      {marks} Marks
                    </span>
                  </div>
                </div>

                {/* Live Question Card Simulator */}
                <div className="flex-1 overflow-y-auto custom-scrollbar py-3 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-300 shadow-2xs space-y-3">

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 text-[10px] font-bold">
                        {selectedSubject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold truncate max-w-[150px]">
                        {selectedChapter}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF] text-[10px] font-bold">
                        {cognitiveLevel}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : difficulty === 'Hard'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {difficulty}
                      </span>
                    </div>

                    {/* Stimulus Context (if any) */}
                    {stimulusType !== 'None' && stimulusText && (
                      <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1">
                        {stimulusTitle && (
                          <div className="font-bold text-[11px] text-amber-900 uppercase tracking-wide">
                            {stimulusTitle}
                          </div>
                        )}
                        <p className="text-[11px] leading-relaxed italic m-0 line-clamp-4">
                          "{stimulusText}"
                        </p>
                      </div>
                    )}

                    {/* Question Stem */}
                    <div>
                      <p className="text-xs font-bold text-stone-900 leading-relaxed m-0">
                        {questionText || '(Question stem will render here live...)'}
                      </p>
                    </div>

                    {/* Rendered Response Format */}
                    {responseType.includes('MCQ') && options.some((o) => o.text.trim()) && (
                      <div className="space-y-1.5 pt-1">
                        {options.filter((o) => o.text.trim()).map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                              opt.isCorrect
                                ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                                : 'bg-white border-stone-200 text-stone-700'
                            }`}
                          >
                            <span className="truncate">
                              <span className="font-mono mr-1.5">{opt.id}.</span>
                              {opt.text}
                            </span>
                            {opt.isCorrect && (
                              <span className="text-[9.5px] font-bold text-emerald-700 bg-white border border-emerald-300 px-1.5 py-0.2 rounded shrink-0">
                                ✓ Key
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {(responseType === 'True / False' || responseType === 'Yes / No') && (
                      <div className="p-2 rounded-xl bg-white border border-stone-200 text-xs flex items-center justify-between">
                        <span className="text-stone-500">Correct Key:</span>
                        <span className="font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                          {binaryKey}
                        </span>
                      </div>
                    )}

                    {responseType === 'Assertion–Reason' && (assertionText || reasonText) && (
                      <div className="space-y-1.5 p-2 rounded-xl bg-white border border-stone-200 text-xs">
                        {assertionText && (
                          <div>
                            <strong className="text-stone-700">Assertion (A):</strong> {assertionText}
                          </div>
                        )}
                        {reasonText && (
                          <div>
                            <strong className="text-stone-700">Reason (R):</strong> {reasonText}
                          </div>
                        )}
                        <div className="text-[11px] font-bold text-emerald-700 pt-1 border-t border-stone-100">
                          Correct Evaluation: Option ({arKey})
                        </div>
                      </div>
                    )}

                    {responseType === 'Match the Following' && matchingPairs.some((p) => p.left || p.right) && (
                      <div className="p-2 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                        {matchingPairs.filter((p) => p.left && p.right).map((p) => (
                          <div key={p.id} className="flex items-center justify-between text-[11px]">
                            <span className="text-stone-800">{p.left}</span>
                            <span className="text-stone-400">→</span>
                            <span className="font-bold text-[#72102A]">{p.right}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {responseType === 'Numerical Answer' && numericValue !== '' && (
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs flex items-center justify-between">
                        <span className="text-stone-500">Target Value:</span>
                        <span className="font-mono font-bold text-[#72102A]">
                          {numericValue} {numericUnit} {numericTolerance > 0 && `(±${numericTolerance})`}
                        </span>
                      </div>
                    )}

                    {(responseType.includes('Code') || responseType.includes('SQL')) && starterCode && (
                      <div className="rounded-xl overflow-hidden border border-stone-300">
                        <div className="bg-stone-800 text-stone-300 px-2.5 py-1 text-[10px] font-mono flex items-center justify-between">
                          <span>{codeLanguage}</span>
                          <span className="text-emerald-400">Code Spec</span>
                        </div>
                        <pre className="p-2.5 bg-stone-900 text-stone-200 text-[10.5px] font-mono leading-relaxed m-0 overflow-x-auto">
                          {starterCode}
                        </pre>
                      </div>
                    )}

                    {/* Computed Correct Key Note */}
                    <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-600">
                      <strong className="text-[#72102A]">Answer Key: </strong>
                      <span>{computedCorrectAnswer}</span>
                    </div>

                    {solution && (
                      <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[10.5px] text-emerald-950">
                        <strong>Model Solution: </strong> {solution}
                      </div>
                    )}

                  </div>

                  {/* Readiness Checklist */}
                  <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs">
                    <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                      Validation Checklist
                    </span>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className={questionText.trim() ? 'text-emerald-600 font-bold' : 'text-stone-300'}>
                          {questionText.trim() ? '✓' : '○'}
                        </span>
                        <span className={questionText.trim() ? 'text-stone-700' : 'text-stone-400'}>
                          Question prompt entered
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={computedCorrectAnswer !== 'Not set' ? 'text-emerald-600 font-bold' : 'text-stone-300'}>
                          {computedCorrectAnswer !== 'Not set' ? '✓' : '○'}
                        </span>
                        <span className={computedCorrectAnswer !== 'Not set' ? 'text-stone-700' : 'text-stone-400'}>
                          Answer key configured
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="text-stone-700">
                          {marks} Marks assigned ({assessmentMode})
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="px-6 py-3 bg-white border-t border-stone-200 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('Draft', false)}
              className="h-9 px-4 rounded-full border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all cursor-pointer"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave('Draft', true)}
              className="h-9 px-4 rounded-full border border-[#72102A] bg-white hover:bg-[#FAF0F3] text-[#72102A] font-bold text-xs transition-all cursor-pointer"
            >
              Save & Add Next Question
            </button>

            <button
              type="button"
              onClick={() => handleSave('Approved', false)}
              className="h-9 px-5 rounded-full bg-gradient-to-r from-[#72102A] to-[#54081C] hover:from-[#851633] hover:to-[#680C25] text-white font-bold text-xs shadow-md shadow-[#72102A]/20 transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Submit to Question Bank</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
