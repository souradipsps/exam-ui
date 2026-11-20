import React from 'react';

export default function QuestionViewModal({ isOpen, onClose, question, onEdit }) {
  if (!isOpen || !question) return null;

  return (
    <div
      className="fixed top-[60px] left-0 md:left-[var(--sidebar-w,240px)] transition-[left] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] right-0 bottom-0 z-40 bg-black/60 backdrop-blur-sm p-2.5 sm:p-4 lg:p-5 flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="View Question Details"
    >
      {/* Full-Area Modern Modal Surface — Matching Edit & View Sizing */}
      <div className="w-full h-full bg-[#FAF8F5] rounded-3xl border border-white/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-ios-reveal">

        {/* ── 1. CLEAN MODERN HEADER ── */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1F3A] to-[#5C0C21] text-white flex items-center justify-center font-bold text-[11px] shadow-sm shrink-0">
              {question.code?.slice(0, 3) || 'Q'}
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
                  className="truncate"
                >
                  {question.code || question.id}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]">
                  {question.type}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    question.status === 'Approved' || question.status === 'Submitted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : question.status === 'Draft'
                      ? 'bg-stone-100 text-stone-700 border-stone-300'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {question.status || 'Active'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate m-0">
                <strong className="text-stone-800">{question.program}</strong> ·{' '}
                <strong className="text-[#72102A]">{question.subject}</strong> ·{' '}
                <span className="text-stone-600">{question.chapter}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(question);
                }}
                className="h-8 px-3.5 rounded-full bg-[#FAF0F3] hover:bg-[#F5E6EA] text-[#72102A] border border-[#F2D7DF] text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Question</span>
              </button>
            )}

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

        {/* ── 2. METADATA CONTEXT BAR ── */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#FAF8F5] border-b border-[#E8E2D9] flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-stone-600 shrink-0">
          <div>
            <span className="text-stone-400 mr-1.5">Marks:</span>
            <strong className="text-[#72102A] font-bold">[{question.marks} Marks]</strong>
            {question.negativeMarks > 0 && (
              <span className="text-rose-600 text-[11px] font-semibold ml-1">(-{question.negativeMarks} penalty)</span>
            )}
          </div>
          <div>
            <span className="text-stone-400 mr-1.5">Difficulty:</span>
            <span
              className={`px-2 py-0.2 rounded-md font-bold text-[10.5px] border ${
                question.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : question.difficulty === 'Hard' || question.difficulty === 'Very Hard'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {question.difficulty}
            </span>
          </div>
          <div>
            <span className="text-stone-400 mr-1.5">Cognitive Demand:</span>
            <strong className="text-purple-800">{question.cognitiveLevel || 'Apply'}</strong>
          </div>
          <div>
            <span className="text-stone-400 mr-1.5">Assessment Mode:</span>
            <strong className="text-stone-800">{question.assessmentMode || 'Written'}</strong>
          </div>
          {question.stimulusType && question.stimulusType !== 'None' && (
            <div>
              <span className="text-stone-400 mr-1.5">Stimulus:</span>
              <strong className="text-amber-800">{question.stimulusType}</strong>
            </div>
          )}
        </div>

        {/* ── 3. LOCKED-VIEWPORT 2-COLUMN DISPLAY ── */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-3.5 sm:p-5 bg-gradient-to-br from-[#FAF8F5]/75 via-white/55 to-[#FAF0F3]/35">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-full lg:min-h-0">

            {/* LEFT MAIN DECK (8 Cols): Question Statement, Stimulus & Formatted Response */}
            <div className="lg:col-span-8 flex flex-col gap-3.5 lg:h-full lg:min-h-0 overflow-y-auto custom-scrollbar pr-1">

              {/* Stimulus Context Box (if stimulus exists) */}
              {question.stimulusText && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs space-y-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      {question.stimulusTitle || `${question.stimulusType || 'Stimulus'} Context`}
                    </span>
                  </div>
                  <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap italic m-0">
                    "{question.stimulusText}"
                  </p>
                </div>
              )}

              {/* Question Statement Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Question Statement / Stem
                  </span>
                  <span className="text-[11px] font-bold text-[#72102A]">
                    [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
                  </span>
                </div>

                <p className="text-sm font-semibold text-stone-900 leading-relaxed whitespace-pre-wrap m-0">
                  {question.questionText}
                </p>

                {/* Assertion & Reason Statements (if applicable) */}
                {question.assertionText && (
                  <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                    <div>
                      <strong className="text-stone-800">Assertion (A):</strong> {question.assertionText}
                    </div>
                    {question.reasonText && (
                      <div>
                        <strong className="text-stone-800">Reason (R):</strong> {question.reasonText}
                      </div>
                    )}
                  </div>
                )}

                {/* Answer Options (for MCQ / MSQ) */}
                {question.options && question.options.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">
                      Answer Choices
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {question.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                            opt.isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 font-bold text-emerald-950 shadow-2xs ring-1 ring-emerald-300/40'
                              : 'bg-[#FAF8F5] border-stone-200 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                              opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                            }`}>
                              {opt.id}
                            </span>
                            <span className="truncate">{opt.text}</span>
                          </div>
                          {opt.isCorrect && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                              ✓ Correct Key
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Pairs (for Match the Following) */}
                {question.matchingPairs && question.matchingPairs.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">
                      Matching Table (Column I ↔ Column II)
                    </span>
                    <div className="rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
                      {question.matchingPairs.map((pair, idx) => (
                        <div key={pair.id || idx} className="p-2.5 bg-[#FAF8F5] text-xs flex items-center justify-between">
                          <span className="font-semibold text-stone-800">{pair.left}</span>
                          <span className="text-stone-400 font-bold">↔</span>
                          <span className="font-bold text-[#72102A]">{pair.right}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coding Starter Code Specification */}
                {question.starterCode && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">
                      Programming Code Specification ({question.codeLanguage || 'Code'})
                    </span>
                    <div className="rounded-xl overflow-hidden border border-stone-300">
                      <pre className="p-3 bg-stone-900 text-emerald-400 text-xs font-mono leading-relaxed m-0 overflow-x-auto">
                        {question.starterCode}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Model Solution & Rubric Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Correct Answer Key & Model Solution
                  </span>
                  <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Evaluator Reference
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF0F3] border border-[#F2D7DF] text-xs font-bold text-[#72102A]">
                  Correct Answer: {question.correctAnswer || 'Refer to marking guidelines'}
                </div>

                {question.solution && (
                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Step-by-Step Marking Explanation
                    </label>
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                      {question.solution}
                    </div>
                  </div>
                )}

                {question.rubric && (
                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Evaluation Rubric / Criteria
                    </label>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                      {question.rubric}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT PANEL (4 Cols): Assessment Taxonomy & Metadata Summary */}
            <div className="lg:col-span-4 flex flex-col lg:h-full lg:min-h-0">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E8E2D9] shadow-xs flex flex-col flex-1 min-h-0 space-y-4 overflow-y-auto custom-scrollbar">

                <div>
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider pb-2 border-b border-stone-100 m-0">
                    Assessment Taxonomy Profile
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1 mb-0">
                    Documented standard dimensions from taxonomy template
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Curriculum Placement
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Program:</span>
                      <strong className="text-stone-900">{question.program}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Subject:</span>
                      <strong className="text-[#72102A]">{question.subject}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Chapter:</span>
                      <strong className="text-stone-800 truncate max-w-[170px]" title={question.chapter}>
                        {question.chapter}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Exam:</span>
                      <strong className="text-[#5B21B6]">{question.exam || 'Assessment'}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Cognitive & Dimension Metrics
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Response Type:</span>
                      <span className="font-bold text-stone-900">{question.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Stimulus:</span>
                      <span className="font-semibold text-stone-800">{question.stimulusType || 'None'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Bloom's Level:</span>
                      <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[10.5px]">
                        {question.cognitiveLevel || 'Apply'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Difficulty:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10.5px] border ${
                          question.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : question.difficulty === 'Hard' || question.difficulty === 'Very Hard'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Mode:</span>
                      <span className="font-semibold text-stone-800">{question.assessmentMode || 'Written'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Governance & Authoring
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Author:</span>
                      <strong className="text-stone-900">{question.author || question.assignedTeacher || 'Educator'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Created:</span>
                      <span className="text-stone-600">{question.createdAt || 'Recent'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Status:</span>
                      <span className="font-bold text-emerald-700">{question.status || 'Active'}</span>
                    </div>
                  </div>
                </div>

                {/* Tags if available */}
                {question.tags && question.tags.length > 0 && (
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                      Curriculum Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {question.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF0F3] text-[#72102A] border border-[#F2D7DF]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

        {/* ── 4. FOOTER ACTIONS ── */}
        <div className="px-6 py-3 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition-all cursor-pointer"
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
              className="h-9 px-6 rounded-full bg-gradient-to-r from-[#72102A] to-[#54081C] hover:from-[#851633] hover:to-[#680C25] text-white font-bold text-xs shadow-md shadow-[#72102A]/20 transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Edit Question</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
