import React, { useState } from 'react';
import {
  ACADEMIC_PROGRAMS,
  PROGRAM_SUBJECTS,
  MASTER_QUESTION_TYPES
} from '../../data/questionCreationData.js';
import CustomDropdown from './CustomDropdown.jsx';

export default function CreateQuestionTypeModal({ isOpen, onClose, onSave, editingItem }) {
  if (!isOpen) return null;

  // 1. Academic Context State (Class & Subject)
  const [selectedProgram, setSelectedProgram] = useState(editingItem?.program || ACADEMIC_PROGRAMS[0]);
  const [selectedSubject, setSelectedSubject] = useState(
    editingItem?.subject || (PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]] ? PROGRAM_SUBJECTS[ACADEMIC_PROGRAMS[0]][0] : '')
  );

  // 2. Selected Question Types from Master Data (pure question type identifiers & names)
  const [selectedTypes, setSelectedTypes] = useState(() => {
    if (editingItem && Array.isArray(editingItem.questionTypes)) {
      return editingItem.questionTypes;
    }
    return [];
  });

  const handleProgramChange = (prog) => {
    setSelectedProgram(prog);
    const subs = PROGRAM_SUBJECTS[prog] || [];
    setSelectedSubject(subs[0] || '');
  };

  // Toggle master type inclusion
  const toggleMasterType = (mType) => {
    const isPresent = selectedTypes.some(t => t.id === mType.id);
    if (isPresent) {
      setSelectedTypes(selectedTypes.filter(t => t.id !== mType.id));
    } else {
      setSelectedTypes([
        ...selectedTypes,
        {
          id: mType.id,
          name: mType.name,
          category: mType.category,
          description: mType.description
        }
      ]);
    }
  };

  const removeSelectedType = (id) => {
    setSelectedTypes(selectedTypes.filter(t => t.id !== id));
  };

  const handleSubmit = (status) => {
    if (selectedTypes.length === 0) {
      alert('Please select at least one question type from the master catalogue.');
      return;
    }
    const payload = {
      id: editingItem ? editingItem.id : `QTS-SET-${Date.now().toString().slice(-4)}`,
      program: selectedProgram,
      subject: selectedSubject,
      department: editingItem?.department || (selectedProgram.includes('Science') || selectedProgram.includes('Physics') ? 'Science' : 'General Faculty'),
      assignedTeacher: editingItem?.assignedTeacher || 'Current Educator (You)',
      status: status, // 'Draft' | 'Submitted' | 'Approved'
      updatedAt: 'Just now',
      questionTypes: selectedTypes,
      chapters: editingItem?.chapters || [],
      assessmentTag: editingItem?.assessmentTag,
      requestedBy: editingItem?.requestedBy,
      requestedAt: editingItem?.requestedAt,
      isNewRequest: false
    };

    onSave(payload, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#72102A] to-[#5C0C21] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#C9A84C]/25 text-[#FDF8E8] border border-[#C9A84C]/50 flex items-center justify-center font-bold text-lg">
              QT
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif leading-tight">
                {editingItem && editingItem.questionTypes && editingItem.questionTypes.length > 0
                  ? 'Edit Question Types'
                  : 'Add Question Types from Master Data'}
              </h2>
              <p className="text-xs text-[#F5E6EA]/80 mt-0.5">
                {editingItem
                  ? `Configure question types for ${editingItem.program} • ${editingItem.subject}`
                  : `Select question types for ${selectedSubject || 'selected course'}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-stone-50/40">

          {/* 1. ACADEMIC CONTEXT SELECTOR */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#72102A]" />
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                1. Academic Context / Course Assignment
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Class / Program</label>
                {editingItem ? (
                  <div className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-bold">
                    {selectedProgram}
                  </div>
                ) : (
                  <CustomDropdown
                    value={selectedProgram}
                    onChange={(val) => handleProgramChange(val)}
                    options={ACADEMIC_PROGRAMS}
                  />
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Subject</label>
                {editingItem ? (
                  <div className="w-full bg-[#F5E6EA]/50 border border-[#E6C4CD] rounded-xl px-3 py-2 text-xs text-[#72102A] font-bold">
                    {selectedSubject}
                  </div>
                ) : (
                  <CustomDropdown
                    value={selectedSubject}
                    onChange={(val) => setSelectedSubject(val)}
                    options={PROGRAM_SUBJECTS[selectedProgram] || []}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 2. MASTER DATA SELECTOR: SELECT QUESTION TYPES */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#72102A]" />
                <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                  2. Select Question Types from Master Catalogue
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#72102A]">
                {selectedTypes.length} Types Selected
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Select all question types that are allowed and applicable for this subject syllabus.
            </p>

            {/* Master Types Selection Grid (Cards with checkboxes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {MASTER_QUESTION_TYPES.map((mType) => {
                const isSelected = selectedTypes.some(t => t.id === mType.id);
                return (
                  <label
                    key={mType.id}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#F5E6EA] border-[#72102A] text-[#72102A] shadow-xs'
                        : 'bg-[#FAF8F5] border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMasterType(mType)}
                      className="accent-[#72102A] w-4 h-4 rounded cursor-pointer mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className="font-bold text-xs truncate">{mType.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/80 font-medium text-stone-600 border border-stone-200 shrink-0">
                          {mType.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {mType.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. PREVIEW SELECTED QUESTION TYPES (Per Workflow: Preview Questions Types) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#72102A]" />
                <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                  3. Preview Selected Question Types
                </h3>
              </div>
              <span className="text-xs text-stone-600 font-semibold">
                Total: <strong className="text-[#72102A]">{selectedTypes.length} Types</strong>
              </span>
            </div>

            {selectedTypes.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-stone-300 bg-stone-50/60">
                <p className="text-stone-600 text-xs font-semibold">No question types selected yet.</p>
                <p className="text-stone-400 text-[11px] mt-1">Select the question types from the master catalogue above to add them to this course.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((t) => (
                    <div
                      key={t.id}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-2 shadow-2xs hover:border-[#72102A] transition-all"
                    >
                      <span>{t.name}</span>
                      <span className="text-[10px] text-stone-400 font-normal">({t.category})</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedType(t.id)}
                        className="text-stone-400 hover:text-rose-600 text-xs ml-1 transition-colors"
                        title="Remove type"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Course Setup Summary Banner */}
                <div className="mt-3 p-3 rounded-xl bg-[#F5E6EA]/60 border border-[#E6C4CD] flex items-center justify-between text-xs">
                  <span className="text-stone-700">
                    Course: <strong>{selectedProgram} • {selectedSubject}</strong>
                  </span>
                  <span className="font-bold text-[#72102A]">
                    {selectedTypes.length} Question Types Assigned
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('Draft')}
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('Approved')}
              className="px-5 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white font-bold text-xs shadow-md shadow-[#72102A]/20 transition-all active:scale-95"
            >
              Submit Question Types (Save IN Question Bank)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
