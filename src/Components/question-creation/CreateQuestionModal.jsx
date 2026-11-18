import React, { useState, useMemo } from 'react';
import {
  ACADEMIC_PROGRAMS,
  PROGRAM_SUBJECTS,
  EXAMS_LIST,
  SESSIONS_LIST,
  COGNITIVE_LEVELS,
  DIFFICULTY_LEVELS,
  MASTER_QUESTION_TYPES,
  BLUEPRINT_SPECIFICATIONS,
  getBlueprintStatus
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

  // Step state: 1: Academic Context & Blueprint, 2: Type, Difficulty, Cognitive, 3: Question & Options, 4: Solution & Preview
  const [step, setStep] = useState(editingItem ? 3 : 1);

  // 1. Academic Context State
  const [selectedProgram, setSelectedProgram] = useState(editingItem?.program || ACADEMIC_PROGRAMS[0]);
  const [selectedSubject, setSelectedSubject] = useState(
    editingItem?.subject || (PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]] ? PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]][0] : '')
  );
  const [selectedExam, setSelectedExam] = useState(editingItem?.exam || EXAMS_LIST[0].name);
  const [selectedSession, setSelectedSession] = useState(editingItem?.session || SESSIONS_LIST[0]);
  const [chapter, setChapter] = useState(editingItem?.chapter || 'General Chapter');

  // Loaded Blueprint Specification
  const blueprintKey = `${selectedProgram}|${selectedSubject}`;
  const blueprint = BLUEPRINT_SPECIFICATIONS[blueprintKey] || null;

  // Live Blueprint Status
  const blueprintStatus = useMemo(() => {
    return getBlueprintStatus(selectedProgram, selectedSubject, existingQuestions);
  }, [selectedProgram, selectedSubject, existingQuestions]);

  // 2. Question Metadata
  const [selectedType, setSelectedType] = useState(editingItem?.type || 'Multiple Choice (MCQ)');
  const [difficulty, setDifficulty] = useState(editingItem?.difficulty || 'Medium');
  const [cognitiveLevel, setCognitiveLevel] = useState(editingItem?.cognitiveLevel || 'Apply');
  const [marks, setMarks] = useState(editingItem?.marks || (selectedType === 'Multiple Choice (MCQ)' ? 2 : 5));

  // 3. Question Content
  const [questionText, setQuestionText] = useState(editingItem?.questionText || '');
  const [options, setOptions] = useState(
    editingItem?.options?.length
      ? editingItem.options
      : [
          { id: 'A', text: '', isCorrect: true },
          { id: 'B', text: '', isCorrect: false },
          { id: 'C', text: '', isCorrect: false },
          { id: 'D', text: '', isCorrect: false }
        ]
  );
  const [correctAnswer, setCorrectAnswer] = useState(editingItem?.correctAnswer || '');
  const [solution, setSolution] = useState(editingItem?.solution || '');

  // Calculate current section requirement based on chosen type
  const matchedSection = blueprint?.sections?.find(s => s.type === selectedType) || blueprint?.sections?.[0];
  const sectionDraftedCount = existingQuestions.filter(
    q => q.program === selectedProgram && q.subject === selectedSubject && q.type === selectedType
  ).length;
  const sectionTargetCount = matchedSection?.targetCount || 10;
  const sectionRemaining = Math.max(0, sectionTargetCount - sectionDraftedCount);

  const handleProgramChange = (prog) => {
    setSelectedProgram(prog);
    const subs = PROGRAM_SUBJECTS[prog] || [];
    setSelectedSubject(subs[0] || '');
  };

  const handleOptionChange = (idx, text) => {
    const updated = [...options];
    updated[idx].text = text;
    setOptions(updated);
  };

  const setCorrectOption = (idx) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === idx
    }));
    setOptions(updated);
    setCorrectAnswer(`Option ${options[idx].id}: ${options[idx].text}`);
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

  const handleSaveQuestion = (status, addNext = false) => {
    if (!questionText.trim()) {
      alert('Please enter question prompt before saving.');
      return;
    }

    const payload = {
      id: editingItem ? editingItem.id : `QCR-${Date.now().toString().slice(-4)}`,
      code: editingItem ? editingItem.code : `Q-${selectedSubject.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
      program: selectedProgram,
      subject: selectedSubject,
      exam: selectedExam,
      session: selectedSession,
      chapter: chapter.trim() || 'Unit Syllabus',
      type: selectedType,
      difficulty: difficulty,
      cognitiveLevel: cognitiveLevel,
      marks: Number(marks),
      questionText: questionText.trim(),
      options: selectedType.includes('MCQ') || selectedType.includes('Assertion') || selectedType.includes('True / False') ? options : [],
      correctAnswer: correctAnswer || (options.find(o => o.isCorrect)?.text ? `Option ${options.find(o => o.isCorrect).id}: ${options.find(o => o.isCorrect).text}` : 'Refer to marking rubric'),
      solution: solution.trim(),
      blueprintSection: matchedSection?.name || 'Section A',
      author: 'Current Educator (You)',
      status: status, // 'Draft' | 'Submitted' | 'Approved'
      createdAt: 'Just now',
      assignedTeacher: 'Current Educator'
    };

    onSave(payload, status);

    if (addNext) {
      // Reset question fields for next question in the same academic context
      setQuestionText('');
      setSolution('');
      setOptions([
        { id: 'A', text: '', isCorrect: true },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
        { id: 'D', text: '', isCorrect: false }
      ]);
      setStep(2);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed top-[60px] left-0 md:left-[240px] right-0 bottom-0 z-40 bg-[#FAF8F5]/70 backdrop-blur-md p-3 sm:p-5 lg:p-6 flex flex-col overflow-hidden">
      <div className="relative w-full h-full bg-white/85 backdrop-blur-xl rounded-3xl shadow-[0_14px_44px_-10px_rgba(24,24,27,0.12),0_0_0_1px_rgba(232,226,217,0.9)] border border-white/90 overflow-hidden flex flex-col animate-ios-reveal">
        
        {/* MODAL HEADER */}
        <div className="px-5 sm:px-7 py-4 bg-white/80 backdrop-blur-lg border-b border-[#E8E2D9] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8B1F3A] to-[#5C0C21] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              Q+
            </span>
            <div className="min-w-0">
              <h2
                style={{
                  fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#111827',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {editingItem ? 'Edit Question Specifications' : 'Create Question Form'}
              </h2>
              <p className="text-[11.5px] text-stone-500 mt-0.5 truncate">
                Workflow Step {step} of 4 • Author questions aligned with examination blueprint
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ outline: 'none' }}
            className="w-9 h-9 rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* WORKFLOW STEPPER BAR */}
        <div className="bg-[#FAF8F5] border-b border-stone-200 px-6 py-3 flex items-center justify-between text-xs font-semibold overflow-x-auto">
          {[
            { num: 1, label: '1. Academic Context & Blueprint' },
            { num: 2, label: '2. Type, Cognitive & Marks' },
            { num: 3, label: '3. Question & Options' },
            { num: 4, label: '4. Solution, Preview & Submit' }
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => {
                if (st.num <= step || (st.num === 2 && selectedSubject) || (st.num === 3 && selectedType)) {
                  setStep(st.num);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                step === st.num
                  ? 'bg-[#72102A] text-white shadow-sm'
                  : step > st.num
                  ? 'text-[#72102A] hover:bg-[#F5E6EA]/50'
                  : 'text-stone-400 cursor-not-allowed'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                step === st.num ? 'bg-[#C9A84C] text-[#1A1A1A] font-bold' : 'bg-stone-200 text-stone-600'
              }`}>
                {st.num}
              </span>
              <span className="whitespace-nowrap">{st.label}</span>
            </button>
          ))}
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-stone-50/30">

          {/* STEP 1: ACADEMIC CONTEXT & SYSTEM LOADS BLUEPRINT */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Academic Context Selector Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#72102A]" />
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
                    Step 1: Select / Confirm Academic Context
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Session */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Session
                    </label>
                    <CustomDropdown
                      value={selectedSession}
                      onChange={(val) => setSelectedSession(val)}
                      options={SESSIONS_LIST}
                      searchable={false}
                    />
                  </div>

                  {/* Exam */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Exam Target
                    </label>
                    <CustomDropdown
                      value={selectedExam}
                      onChange={(val) => setSelectedExam(val)}
                      options={EXAMS_LIST.map(ex => ({ value: ex.name, label: ex.name }))}
                      searchable={false}
                    />
                  </div>

                  {/* Program / Class */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Class / Program
                    </label>
                    <CustomDropdown
                      value={selectedProgram}
                      onChange={(val) => handleProgramChange(val)}
                      options={ACADEMIC_PROGRAMS}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Subject / Course
                    </label>
                    <CustomDropdown
                      value={selectedSubject}
                      onChange={(val) => setSelectedSubject(val)}
                      options={PROGRAM_SUBJECTS[selectedProgram] || []}
                    />
                  </div>

                  {/* Chapter / Topic */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Chapter / Curriculum Unit
                    </label>
                    <input
                      type="text"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      placeholder="e.g. Heuristic Search / Optics & Reflection / Calculus"
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#72102A]"
                    />
                  </div>
                </div>
              </div>

              {/* SYSTEM LOADS EXISTING BLUEPRINT (Diagram Step 2) */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#C9A84C]/25 text-[#A68A3D] font-bold text-xs">
                      ★
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                        System Loaded Blueprint: {blueprint?.examName || selectedExam}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Total Marks Target: <strong>{blueprint?.totalMarks || 100} Marks</strong> • Duration: {blueprint?.duration || '3 Hours'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                    Blueprint Linked
                  </span>
                </div>

                {/* Blueprint Section Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(blueprint?.sections || [
                    { name: 'Section A (Objective)', type: 'Multiple Choice (MCQ)', targetCount: 15, marksPerQ: 2, sectionMarks: 30 },
                    { name: 'Section B (Conceptual)', type: 'Short Answer', targetCount: 6, marksPerQ: 5, sectionMarks: 30 },
                    { name: 'Section C (Analytical)', type: 'Long Essay / Problem', targetCount: 4, marksPerQ: 10, sectionMarks: 40 }
                  ]).map((sec, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#72102A]">
                          {sec.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                          {sec.sectionMarks} Marks
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1A1A1A]">{sec.type}</p>
                      <p className="text-[11px] text-stone-500">
                        Requires: <strong>{sec.targetCount} Questions</strong> ({sec.marksPerQ} marks each)
                      </p>
                    </div>
                  ))}
                </div>

                {/* Blueprint Progress */}
                {blueprintStatus && (
                  <div className="p-3 rounded-xl bg-[#F5E6EA]/50 border border-[#E6C4CD] text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-[#72102A]">Current Blueprint Alignment Status</span>
                      <span className="font-bold text-[#72102A]">{blueprintStatus.overallPct}% Completed</span>
                    </div>
                    <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E6C4CD]">
                      <div
                        className="bg-gradient-to-r from-[#72102A] to-[#C9A84C] h-full transition-all duration-300"
                        style={{ width: `${blueprintStatus.overallPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT QUESTION TYPE & COGNITIVE / DIFFICULTY */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Type Selection */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
                    Step 2: Select Question Type & Blueprint Requirements
                  </h3>
                  <span className="text-xs text-stone-500">
                    Target: {selectedSubject}
                  </span>
                </div>

                {/* System shows blueprint requirements for selected type */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-300 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#72102A]">Blueprint Quota for {selectedType}: </span>
                    <span className="text-stone-700">
                      {sectionDraftedCount} / {sectionTargetCount} drafted ({sectionRemaining} remaining for {matchedSection?.name || 'Section'})
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#72102A] text-white text-[10px] font-bold">
                    Quota Active
                  </span>
                </div>

                {/* Question Type Radio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {MASTER_QUESTION_TYPES.map((mType) => {
                    const isSelected = selectedType === mType.name;
                    return (
                      <div
                        key={mType.id}
                        onClick={() => {
                          setSelectedType(mType.name);
                          setMarks(mType.defaultMarks);
                        }}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#F5E6EA] border-[#72102A] shadow-sm ring-1 ring-[#72102A]'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-[#1A1A1A]">{mType.name}</h4>
                          <span className="text-[10px] font-semibold text-stone-500">{mType.category}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{mType.description}</p>
                        <p className="text-[11px] font-bold text-[#72102A] mt-2">Default: {mType.defaultMarks} Marks</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty & Cognitive Levels */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Difficulty */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-2">
                      Difficulty Level
                    </label>
                    <div className="flex flex-col gap-2">
                      {DIFFICULTY_LEVELS.map(dif => (
                        <label
                          key={dif.id}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                            difficulty === dif.id
                              ? `${dif.bg} ${dif.text} border-current font-bold shadow-xs`
                              : 'bg-[#FAF8F5] border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <span>{dif.name}</span>
                          <input
                            type="radio"
                            name="difficulty"
                            value={dif.id}
                            checked={difficulty === dif.id}
                            onChange={() => setDifficulty(dif.id)}
                            className="accent-[#72102A]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cognitive Level (Bloom's Taxonomy) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-2">
                      Cognitive Level (Bloom's Taxonomy)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {COGNITIVE_LEVELS.map(cog => (
                        <label
                          key={cog.id}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            cognitiveLevel === cog.id
                              ? 'bg-[#F5E6EA] text-[#72102A] border-[#72102A] font-bold shadow-xs'
                              : 'bg-[#FAF8F5] border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold">{cog.id}</span>
                            <input
                              type="radio"
                              name="cognitive"
                              value={cog.id}
                              checked={cognitiveLevel === cog.id}
                              onChange={() => setCognitiveLevel(cog.id)}
                              className="accent-[#72102A]"
                            />
                          </div>
                          <p className="text-[10px] text-stone-500 font-normal line-clamp-1">{cog.desc}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Marks input */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase">Allocated Marks: </label>
                    <span className="text-xs text-stone-500 ml-1">Must align with blueprint section weights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="w-20 bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-center font-bold text-[#1A1A1A] focus:outline-none focus:border-[#72102A]"
                    />
                    <span className="text-xs font-bold text-stone-600">Marks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ENTER QUESTION & OPTIONS */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
                      Step 3: Enter Question Prompt & Choices
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Draft clear, unambiguous questions adhering to curriculum guidelines.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-stone-200 text-stone-700">
                    {marks} Marks • {difficulty} • {cognitiveLevel}
                  </span>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Question Stem / Body Prompt *
                  </label>
                  <textarea
                    rows={4}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter full question text. You can specify equations, variables, or code snippets..."
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#72102A]"
                  />
                </div>

                {/* If MCQ / Assertion / Objective: Options Builder */}
                {(selectedType.includes('MCQ') || selectedType.includes('Assertion') || selectedType.includes('True / False')) && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-stone-600 uppercase">
                        Answer Options (Select the correct option with the radio button)
                      </label>
                      <button
                        type="button"
                        onClick={addOption}
                        className="text-[11px] font-bold text-[#72102A] hover:underline"
                      >
                        + Add Another Option
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {options.map((opt, idx) => (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            opt.isCorrect
                              ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                              : 'bg-[#FAF8F5] border-stone-200'
                          }`}
                        >
                          <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={opt.isCorrect}
                              onChange={() => setCorrectOption(idx)}
                              className="accent-emerald-600 w-4 h-4 cursor-pointer"
                            />
                            <span className="font-bold text-xs text-stone-700 w-5">
                              {opt.id}.
                            </span>
                          </label>

                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            placeholder={`Enter text for Option ${opt.id}...`}
                            className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#72102A]"
                          />

                          {opt.isCorrect && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex-shrink-0">
                              Correct Key
                            </span>
                          )}

                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(idx)}
                              className="text-stone-400 hover:text-rose-600 p-1 text-xs"
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
              </div>
            </div>
          )}

          {/* STEP 4: ENTER ANSWER/SOLUTION & PREVIEW & SUBMIT */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Optional Solution Entry */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
                      Step 4: Enter Answer / Solution
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      OPTIONAL
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Model Solution / Step-by-Step Marking Explanation (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Provide worked derivation, algorithm steps, or grading hints for the evaluating teacher..."
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#72102A]"
                  />
                </div>
              </div>

              {/* PREVIEW QUESTION (Real-time student card rendering) */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                    Live Question Card Preview
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5E6EA] text-[#72102A]">
                    {selectedType}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-300 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                          {selectedSubject}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                          {chapter}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5E6EA] text-[#72102A] border border-[#E6C4CD]">
                          Bloom's: {cognitiveLevel}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                        {questionText || '(Question text preview will appear here)'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-[#72102A] bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                        [{marks} Marks]
                      </span>
                    </div>
                  </div>

                  {/* Options render */}
                  {options.some(o => o.text.trim()) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {options.filter(o => o.text.trim()).map(opt => (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                            opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800'
                              : 'bg-white border-stone-200 text-stone-700'
                          }`}
                        >
                          <span>{opt.id}. {opt.text}</span>
                          {opt.isCorrect && <span className="text-[10px] text-emerald-600 font-bold">✓ Key</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {solution && (
                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900">
                      <strong>Solution Note:</strong> {solution}
                    </div>
                  )}
                </div>
              </div>

              {/* BLUEPRINT COMPLETION STATUS CALLOUT (Diagram Step 12) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF8F5] to-[#F5E6EA] border border-[#E6C4CD] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#72102A]">Blueprint Alignment Status</span>
                  <span className="font-bold text-[#72102A]">
                    {blueprintStatus ? `${blueprintStatus.totalCompletedQuestions} / ${blueprintStatus.totalTargetQuestions} Questions` : 'Ready'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  {blueprintStatus?.isFullyAligned
                    ? '★ All blueprint section targets and marks quotas have been fully met for this exam paper!'
                    : `Currently drafting questions for ${matchedSection?.name || 'Exam'}. You can save this draft and immediately proceed to add the next question, or submit the full set to the Question Bank.`}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onClose();
            }}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition-all"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                Proceed to Step {step + 1} →
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSaveQuestion('Draft', false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveQuestion('Draft', true)}
                  className="px-4 py-2.5 rounded-xl border border-[#72102A] text-[#72102A] hover:bg-[#F5E6EA] font-bold text-xs transition-all"
                >
                  Save & Add Next Question
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveQuestion('Approved', false)}
                  className="px-5 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white font-bold text-xs shadow-md shadow-[#72102A]/20 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  Submit Question Set (Save IN Question Bank)
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

