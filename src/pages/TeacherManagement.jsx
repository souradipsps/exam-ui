import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../Components/teacher-management/TeacherIcon.jsx';
import {
  PROGRAM_SUBJECT_MAP,
  DEFAULT_BLUEPRINT,
  SUBJECT_BLUEPRINTS,
  INITIAL_TEACHERS,
  QUESTION_BANK_ITEMS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ACTIVITY_LOGS,
  getSubjectBaseName,
  getSubjectChapters,
} from '../data/teacherData.js';

// Black dropdown arrow (stays black even when the text is grey)
const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2020%2020'%3E%3Cpath%20fill='none'%20stroke='black'%20stroke-width='2'%20d='M5%207l5%205%205-5'/%3E%3C/svg%3E")`;

// Multi-select dropdown (checkbox list) used for "Chapters"
const ChaptersMultiSelect = ({ options, selected, onChange }) => {
  const toggle = (opt) => onChange(selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt]);
  const detailsRef = React.useRef(null);
  // Close the list when the user clicks anywhere outside it
  useEffect(() => {
    const handleOutside = (e) => {  
      if (detailsRef.current && !detailsRef.current.contains(e.target)) detailsRef.current.open = false;
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);
  return (
    <details ref={detailsRef} className="relative group">
      <summary
        className={`relative list-none w-full appearance-none pr-8 bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem] bg-white border border-stone-300 rounded-md px-3 py-2 text-sm group-open:border-[#72102A] cursor-pointer truncate ${selected.length ? 'text-[#1A1A1A]' : 'text-stone-400'}`}
        style={{ backgroundImage: SELECT_ARROW }}
      >
        {selected.length ? selected.join(', ') : 'Select chapters'}
        <input required value={selected.length ? 'filled' : ''} onChange={() => {}} tabIndex={-1} aria-hidden="true" className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
      </summary>
      <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-stone-300 rounded-md shadow-lg">
        {options.length === 0 && <p className="px-3 py-2 text-sm text-stone-400">Select subject / course first</p>}
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5E6EA] cursor-pointer">
            <input type="checkbox" name="chapters" value={opt} checked={selected.includes(opt)} onChange={() => toggle(opt)} className="w-4 h-4 accent-[#72102A]" />
            {opt}
          </label>
        ))}
      </div>
    </details>
  );
};

// Single-select dropdown that always opens downward (used for "Class / Program")
const ProgramSelect = ({ options, value, onChange }) => {
  const detailsRef = React.useRef(null);
  // Close the list when the user clicks anywhere outside it
  useEffect(() => {
    const handleOutside = (e) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target)) detailsRef.current.open = false;
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);
  return (
    <details ref={detailsRef} className="relative group">
      <summary
        className={`relative list-none w-full appearance-none pr-8 bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem] bg-white border border-stone-300 rounded-md px-3 py-2 text-sm group-open:border-[#72102A] cursor-pointer truncate ${value ? 'text-[#1A1A1A]' : 'text-stone-400'}`}
        style={{ backgroundImage: SELECT_ARROW }}
      >
        {value || 'Select class / program'}
        <input required name="program" value={value} onChange={() => {}} tabIndex={-1} aria-hidden="true" className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
      </summary>
      <div className="group/list absolute z-20 mt-0.5 w-full max-h-48 overflow-y-auto bg-white border border-stone-500">
        <button
          type="button"
          onClick={() => { onChange({ target: { value: '' } }); detailsRef.current.open = false; }}
          className={`block w-full text-left px-3 py-0.5 text-sm text-[#1A1A1A] hover:!bg-[#1A6ADB] hover:!text-white cursor-pointer ${!value ? 'bg-[#1A6ADB] text-white group-hover/list:bg-white group-hover/list:text-[#1A1A1A]' : ''}`}
        >
          Select class / program
        </button>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => { onChange({ target: { value: opt } }); detailsRef.current.open = false; }}
            className={`block w-full text-left px-3 py-0.5 text-sm text-[#1A1A1A] hover:!bg-[#1A6ADB] hover:!text-white cursor-pointer ${value === opt ? 'bg-[#1A6ADB] text-white group-hover/list:bg-white group-hover/list:text-[#1A1A1A]' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </details>
  );
};

// "Subject & Chapter Mapping" panel: one column per selected subject, chapter names shown on "See Chapters"
const ChapterMapping = ({ subjects, gold, selectedChapters, onRemoveChapter }) => {
  const [showChapters, setShowChapters] = useState(false);
  // Chapters of a subject that are still selected (the X button removes one)
  const chaptersOf = (sub) => getSubjectChapters(sub)
    .map((name, idx) => ({ name, idx, key: `${getSubjectBaseName(sub)} - Chapter ${idx + 1} : ${name}` }))
    .filter(c => selectedChapters.includes(c.key));
  const t = gold
    ? { panel: '#FDF8E8', panelBorder: 'rgba(201,168,76,0.5)', border: '#C9A84C', pillBg: 'rgba(201,168,76,0.25)', pillText: '#A68A3D' }
    : { panel: '#F5E6EA', panelBorder: '#E6C4CD', border: '#72102A', pillBg: '#E6C4CD', pillText: '#72102A' };
  const cols = { gridTemplateColumns: `repeat(${subjects.length}, minmax(150px, 1fr))` };
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div>
          <h4 className="text-base font-bold text-[#1A1A1A] leading-tight">Subject & Chapter Mapping</h4>
          <p className="text-xs text-stone-600">Review the chapters mapped for each selected subject.</p>
        </div>
          <button
            type="button"
            onClick={() => setShowChapters(prev => !prev)}
            className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white shadow-md shadow-[#72102A]/20 border border-[#8B1F3A] transition-all text-xs font-bold whitespace-nowrap"
          >
            {showChapters ? 'Hide Chapters' : 'See Chapters'}
            <svg className={`w-3 h-3 transition-transform ${showChapters ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 7l5 6 5-6H5z" />
            </svg>
          </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
        <div className="flex-1 overflow-x-auto">
          <div className="rounded-xl border border-stone-200 bg-white overflow-hidden min-w-max md:min-w-0">
            <div className="grid" style={cols}>
              {subjects.map((sub, i) => (
                <div key={sub} className={`px-4 py-3 text-left bg-[#FAF8F5] ${i ? 'border-l border-stone-200' : ''}`}>
                  <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">{getSubjectBaseName(sub)}</p>
                  <span className="inline-block mt-1.5 text-xs font-bold px-3 py-0.5 rounded-full" style={{ backgroundColor: '#E6C4CD', color: '#72102A' }}>
                    {chaptersOf(sub).length} Chapters
                  </span>
                </div>
              ))}
            </div>
            {showChapters && (
              <div className="grid border-t border-stone-200" style={cols}>
                {subjects.map((sub, i) => (
                  <div key={sub} className={`px-4 py-3 space-y-1.5 text-xs text-stone-600 ${i ? 'border-l border-stone-200' : ''}`}>
                    {chaptersOf(sub).map(c => (
                      <p key={c.key}>Chapter {c.idx + 1} : {c.name}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Multi-select dropdown styled like the Chapters list (used for "Subject / Course")
const SubjectSelect = ({ options, selected, onChange }) => {
  const toggle = (opt) => onChange(selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt]);
  const detailsRef = React.useRef(null);
  // Close the list when the user clicks anywhere outside it
  useEffect(() => {
    const handleOutside = (e) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target)) detailsRef.current.open = false;
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);
  return (
    <details ref={detailsRef} className="relative group">
      <summary
        className={`relative list-none w-full appearance-none pr-8 bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem] bg-white border border-stone-300 rounded-md px-3 py-2 text-sm font-medium group-open:border-[#72102A] cursor-pointer truncate ${selected.length ? 'text-[#1A1A1A]' : 'text-stone-400'}`}
        style={{ backgroundImage: SELECT_ARROW }}
      >
        {selected.length ? selected.join(', ') : 'Select subject / course'}
        <input required name="subject" value={selected.join(', ')} onChange={() => {}} tabIndex={-1} aria-hidden="true" className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
      </summary>
      <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-stone-300 rounded-md shadow-lg">
        {options.length === 0 && <p className="px-3 py-2 text-sm text-stone-400">Select class / program first</p>}
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5E6EA] cursor-pointer">
            <input type="checkbox" value={opt} checked={selected.includes(opt)} onChange={() => toggle(opt)} className="w-4 h-4 accent-[#72102A]" />
            {opt}
          </label>
        ))}
      </div>
    </details>
  );
};

// ---- Dynamic Instructions & Guidelines ----
const INSTRUCTION_KEYS = ['intro'];

// Builds the auto-generated sentence (empty array = nothing selected yet)
const buildInstructionItems = ({ kind, exam, session, program, subject, chapters, dueDate }) => {
  const [y, m, d] = (dueDate || '').split('-');
  const sentence = `Please send ${kind}${exam ? ` for the ${exam}` : ''}${session ? ` for the Session: ${session}` : ''}${program ? ` for the Class/Program: ${program}` : ''}${subject ? ' for your subjects' : ''}${dueDate ? ` by the Due Date: ${d}-${m}-${y}` : ''}`;
  return {
    intro: (exam || session || program || subject || chapters.length || dueDate) ? [sentence] : [],
  };
};

// Finds the [start, end) line range of the auto-generated sentence inside the text
const findInstructionBlock = (lines) => {
  const start = lines.findIndex(l => l.startsWith('Please send '));
  return start === -1 ? null : [start, start + 1];
};

// Updates only the auto-generated lines; every other line the user typed is left untouched.
// A line the user deleted is not re-added; a line removed automatically (field cleared) comes back when the field is filled again.
const syncInstructions = ({ text, removed }, fields) => {
  const items = buildInstructionItems(fields);
  const lines = text ? text.split('\n') : [];
  const nextRemoved = [...removed];
  INSTRUCTION_KEYS.forEach((key, idx) => {
    const block = findInstructionBlock(lines);
    const newLines = items[key];
    if (block) {
      lines.splice(block[0], block[1] - block[0], ...newLines);
      if (!newLines.length && !nextRemoved.includes(key)) nextRemoved.push(key);
    } else if (newLines.length && nextRemoved.includes(key)) {
      let at = 0;
      for (let i = idx - 1; i >= 0; i--) {
        const prev = findInstructionBlock(lines);
        if (prev) { at = prev[1]; break; }
      }
      lines.splice(at, 0, ...newLines);
      nextRemoved.splice(nextRemoved.indexOf(key), 1);
    }
  });
  return { text: lines.join('\n'), removed: nextRemoved, def: INSTRUCTION_KEYS.flatMap(k => items[k]).join('\n') };
};

// Current academic session (April to March), e.g. "2026-27"
const getCurrentSession = () => {
  const now = new Date();
  const start = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}-${String(start + 1).slice(-2)}`;
};

// Display helper: "Class 9" -> "IX"
const toRomanClass = (cls) => {
  const n = parseInt(String(cls).replace(/\D/g, ''), 10);
  if (!n) return cls;
  const map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let r = '', rem = n;
  for (const [v, s] of map) { while (rem >= v) { r += s; rem -= v; } }
  return r;
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function TeacherManagement() {
  const [teachers] = useState(INITIAL_TEACHERS);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const instructionsRef = React.useRef(null);
  const [instr, setInstr] = useState({ text: '', removed: INSTRUCTION_KEYS, def: '' });
  
  // Search & Active Tab State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('teachers'); // 'teachers' | 'assignments' | 'logs'
  const [activeStatus, setActiveStatus] = useState('All'); // display-only status tabs
  
  // Modal Workflow State:
  // step: 'selectOption' | 'questionTypeForm' | 'questionForm'
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentStep, setAssignmentStep] = useState('selectOption'); 
  const [selectedTeacherForAssignment, setSelectedTeacherForAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Form State for Program & Subject Selection (Question Type Assignment)
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  // Subject / Course is multi-select; the rest of the form reads it as one joined string
  const selectedSubject = selectedSubjects.join(', ');
  const setSelectedSubject = (v) => setSelectedSubjects(Array.isArray(v) ? v : (v ? v.split(', ') : []));
  const [selectedExam, setSelectedExam] = useState("");
  const [lastCreatedExam, setLastCreatedExam] = useState("");
  const [selectedSession, setSelectedSession] = useState(getCurrentSession());

  // Form State for Question Types Assignment (Step 2A)
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(['Multiple Choice (MCQ)', 'Essay']);

  // Form State for Selected Teachers in Step 2A (Defaulted to ALL mapped teachers)
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);

  // Teacher Picker Modal State (opens from Step 4 button)
  const [isTeacherPickerOpen, setIsTeacherPickerOpen] = useState(false);
  const [teacherPickerSearch, setTeacherPickerSearch] = useState('');
  const [teacherPickerFilter, setTeacherPickerFilter] = useState('mapped'); // 'mapped' | 'all'

  // Form State for Specific Questions Assignment (Step 2B)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState(['Q-101', 'Q-102']);

  // Toast Feedback
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Compute Exam Question Blueprint for the selected subject
  const currentBlueprint = useMemo(() => {
    return SUBJECT_BLUEPRINTS[selectedSubject] || DEFAULT_BLUEPRINT;
  }, [selectedSubject]);

  // Auto-populate Question Types from Blueprint when subject changes (unless editing)
  useEffect(() => {
    if (!editingAssignment && currentBlueprint) {
      const blueprintTypes = currentBlueprint.sections.map(s => s.type);
      setSelectedQuestionTypes([...new Set(blueprintTypes)]);
    }
  }, [currentBlueprint, editingAssignment]);

  // Compute Mapped Teachers based on Program & Subject
  const mappedTeachers = useMemo(() => {
    if (!selectedProgram || !selectedSubject) return [];
    const progLower = selectedProgram.toLowerCase();

    const deptTeachers = teachers.filter(t => {
      const deptLower = t.department.toLowerCase();
      if (progLower.includes('computer science') || progLower.includes('technology')) {
        return deptLower.includes('computer') || deptLower.includes('technology');
      }
      if (progLower.includes('mathematics')) {
        return deptLower.includes('math');
      }
      if (progLower.includes('physics')) {
        return deptLower.includes('physics');
      }
      if (progLower.includes('english')) {
        return deptLower.includes('english') || deptLower.includes('literature');
      }
      if (progLower.includes('chemistry')) {
        return deptLower.includes('chemistry');
      }
      return true;
    });

    // With several subjects selected, map every teacher who teaches any of them
    const subjectTeachers = deptTeachers.filter(t => (t.subjects || []).some(ts =>
      selectedSubject.split(', ').some(sel => {
        const base = sel.replace(/\s*\(.*\)\s*$/, '').toLowerCase();
        return base.includes(ts.toLowerCase()) || ts.toLowerCase().includes(base);
      })
    ));
    return subjectTeachers.length ? subjectTeachers : deptTeachers;
  }, [teachers, selectedProgram, selectedSubject]);

  // Computed Teachers List for Picker Modal
  const pickerTeachersList = useMemo(() => {
    const baseList = teacherPickerFilter === 'mapped' ? mappedTeachers : teachers;
    if (!teacherPickerSearch.trim()) return baseList;
    const term = teacherPickerSearch.toLowerCase();
    return baseList.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.department.toLowerCase().includes(term) ||
      t.designation.toLowerCase().includes(term)
    );
  }, [teachers, mappedTeachers, teacherPickerFilter, teacherPickerSearch]);

  // AUTO-SELECT ALL MAPPED TEACHERS BY DEFAULT when Program or Subject changes (unless editing)
  useEffect(() => {
    if (!editingAssignment) {
      if (mappedTeachers.length > 0) {
        setSelectedTeacherIds(mappedTeachers.map(t => t.id));
      } else {
        setSelectedTeacherIds([]);
      }
    }
  }, [mappedTeachers, selectedProgram, selectedSubject, editingAssignment, isAssignmentModalOpen]);

  // Keep the generated instructions in sync with the form fields (manual edits are preserved)
  useEffect(() => {
    if (isAssignmentModalOpen && !editingAssignment) {
      setInstr(prev => syncInstructions(prev, { kind: assignmentStep === 'questionTypeForm' ? 'Question Type Data' : 'Questions Data', exam: selectedExam, session: selectedSession, program: selectedProgram, subject: selectedSubject, chapters: selectedChapters, dueDate: selectedDueDate }));
    }
  }, [selectedExam, selectedSession, selectedProgram, selectedSubject, selectedChapters, selectedDueDate]);

  // Chapters depend on the subject: pre-select all lesson-plan chapters when the subject changes
  useEffect(() => {
    setSelectedChapters(selectedSubjects.flatMap(sub => getSubjectChapters(sub).map((name, idx) => `${getSubjectBaseName(sub)} - Chapter ${idx + 1} : ${name}`)));
  }, [selectedSubject]);

  // Start every new assignment form with the details empty
  useEffect(() => {
    if (isAssignmentModalOpen && !editingAssignment) {
      setSelectedExam(lastCreatedExam);
      setSelectedSession(getCurrentSession());
      setSelectedProgram('');
      setSelectedSubject('');
      setSelectedChapters([]);
      setSelectedDueDate('');
      setInstr({ text: '', removed: INSTRUCTION_KEYS, def: '' });
    } else if (isAssignmentModalOpen && editingAssignment) {
      setInstr({ text: editingAssignment.instructions || '', removed: [], def: editingAssignment.instructions || '' });
    }
  }, [isAssignmentModalOpen, assignmentStep]);

  // Grow the instructions box with its text (the Due Date box stretches to match it)
  useEffect(() => {
    const el = instructionsRef.current;
    if (el) { el.style.minHeight = '0px'; el.style.height = 'auto'; el.style.minHeight = (el.scrollHeight + 2) + 'px'; }
  }, [instr.text, assignmentStep]);

  // True when the user changed the text away from the last auto-generated default
  const isInstructionsEdited = instr.text !== instr.def;

  // Regenerate the default instructions from the current selections
  const handleResetInstructions = () => {
    const fields = { kind: assignmentStep === 'questionTypeForm' ? 'Question Type Data' : 'Questions Data', exam: selectedExam, session: selectedSession, program: selectedProgram, subject: selectedSubject, chapters: selectedChapters, dueDate: selectedDueDate };
    const items = buildInstructionItems(fields);
    setInstr({
      text: INSTRUCTION_KEYS.flatMap(k => items[k]).join('\n'),
      removed: INSTRUCTION_KEYS.filter(k => !items[k].length),
      def: INSTRUCTION_KEYS.flatMap(k => items[k]).join('\n'),
    });
  };

  // Handler when Program dropdown changes
  const handleProgramChange = (e) => {
    const prog = e.target.value;
    setSelectedProgram(prog);
    const subjects = PROGRAM_SUBJECT_MAP[prog] || [];
    setSelectedSubject('');
  };

  // Toggle individual teacher selection
  const toggleTeacherSelection = (tId) => {
    setSelectedTeacherIds(prev =>
      prev.includes(tId) ? prev.filter(id => id !== tId) : [...prev, tId]
    );
  };

  // Toggle select all teachers
  const toggleSelectAllTeachers = () => {
    if (selectedTeacherIds.length === mappedTeachers.length) {
      setSelectedTeacherIds([]);
    } else {
      setSelectedTeacherIds(mappedTeachers.map(t => t.id));
    }
  };

  // Dedicated Filters for Teacher List Directory
  const [teacherDeptFilter, setTeacherDeptFilter] = useState('All');
  const [teacherDesignationFilter, setTeacherDesignationFilter] = useState('All');
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState('All');
  const [teacherClassFilter, setTeacherClassFilter] = useState('All');
  const [teacherSectionFilter, setTeacherSectionFilter] = useState('All');

  // Derived options for Teacher List Filters
  const uniqueDepartments = useMemo(() => {
    return ['All', ...new Set(teachers.map(t => t.department))];
  }, [teachers]);

  const uniqueDesignations = useMemo(() => {
    return ['All', ...new Set(teachers.map(t => t.designation))];
  }, [teachers]);

  const uniqueTeacherSubjects = useMemo(() => {
    return ['All', ...new Set(teachers.flatMap(t => t.subjects))];
  }, [teachers]);

  const uniqueTeacherClasses = useMemo(() => {
    return ['All', ...new Set(teachers.flatMap(t => t.classes || []))];
  }, [teachers]);

  const uniqueTeacherSections = useMemo(() => {
    return ['All', ...new Set(teachers.flatMap(t => t.sections || []))];
  }, [teachers]);

  // Filtered Teachers List
  const filteredTeachers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return teachers.filter(teacher => {
      const matchesSearch = !term || (
        (teacher.name && teacher.name.toLowerCase().includes(term)) ||
        (teacher.department && teacher.department.toLowerCase().includes(term)) ||
        (teacher.designation && teacher.designation.toLowerCase().includes(term)) ||
        (teacher.id && teacher.id.toLowerCase().includes(term)) ||
        (Array.isArray(teacher.subjects) && teacher.subjects.some(sub => sub.toLowerCase().includes(term)))
      );

      const matchesDept = teacherDeptFilter === 'All' || teacher.department === teacherDeptFilter;
      const matchesDesignation = teacherDesignationFilter === 'All' || teacher.designation === teacherDesignationFilter;
      const matchesSubject = teacherSubjectFilter === 'All' || (Array.isArray(teacher.subjects) && teacher.subjects.includes(teacherSubjectFilter));

      const matchesClass = teacherClassFilter === 'All' || (Array.isArray(teacher.classes) && teacher.classes.includes(teacherClassFilter));
      const matchesSection = teacherSectionFilter === 'All' || (Array.isArray(teacher.sections) && teacher.sections.includes(teacherSectionFilter));

      return matchesSearch && matchesDept && matchesDesignation && matchesSubject && matchesClass && matchesSection;
    });
  }, [teachers, searchTerm, teacherDeptFilter, teacherDesignationFilter, teacherSubjectFilter, teacherClassFilter, teacherSectionFilter]);

  // Filtered Assignments List
  const filteredAssignments = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return assignments;

    return assignments.filter(asn => {
      const matchProgram = Boolean(asn.program && asn.program.toLowerCase().includes(term));
      const matchSubject = Boolean(asn.subject && asn.subject.toLowerCase().includes(term));
      const matchId = Boolean(asn.id && asn.id.toLowerCase().includes(term));
      const matchInstructions = Boolean(asn.instructions && asn.instructions.toLowerCase().includes(term));
      const matchType = Boolean(
        (asn.type === 'question' && 'specific questions assignment'.includes(term)) ||
        (asn.type === 'questionType' && 'question type assignment'.includes(term))
      );

      // Question types (MCQ, Essay, etc.)
      const matchQuestionTypes = Boolean(
        Array.isArray(asn.questionTypes) &&
        asn.questionTypes.some(qt => qt.toLowerCase().includes(term))
      );

      // Assigned Teachers: match by Name, Department, or ID
      const assignedIds = asn.teacherIds || (asn.teacherId ? [asn.teacherId] : []);
      const matchTeachers = assignedIds.some(id => {
        const t = teachers.find(teacher => teacher.id === id);
        return t && (
          t.name.toLowerCase().includes(term) ||
          t.department.toLowerCase().includes(term) ||
          t.id.toLowerCase().includes(term)
        );
      });

      // Specific Question IDs/titles
      const matchQuestions = Boolean(
        Array.isArray(asn.selectedQuestionIds) &&
        asn.selectedQuestionIds.some(qId => {
          if (qId.toLowerCase().includes(term)) return true;
          const qItem = QUESTION_BANK_ITEMS.find(q => q.id === qId);
          return qItem && (
            qItem.title.toLowerCase().includes(term) ||
            qItem.subject.toLowerCase().includes(term) ||
            qItem.type.toLowerCase().includes(term)
          );
        })
      );

      return (
        matchProgram ||
        matchSubject ||
        matchId ||
        matchInstructions ||
        matchType ||
        matchQuestionTypes ||
        matchTeachers ||
        matchQuestions
      );
    });
  }, [assignments, teachers, searchTerm]);

  // Filtered Activity Logs
  const filteredLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return activityLogs;

    return activityLogs.filter(log =>
      (log.teacherName && log.teacherName.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term)) ||
      (log.department && log.department.toLowerCase().includes(term)) ||
      (log.id && log.id.toLowerCase().includes(term))
    );
  }, [activityLogs, searchTerm]);

  // Open Modal Helper for New Assignment
  const handleOpenModal = (teacher = null) => {
    setEditingAssignment(null);
    setSelectedTeacherForAssignment(teacher);
    setAssignmentStep('selectOption');
    setIsAssignmentModalOpen(false);
    setTimeout(() => setIsAssignmentModalOpen(true), 10);
  };

  // Edit Assignment Helper
  const handleEditAssignment = (asn) => {
    setEditingAssignment(asn);
    setSelectedProgram(asn.program);
    setSelectedSubject(asn.subject);
    if (asn.type === 'questionType') {
      setSelectedTeacherIds(asn.teacherIds || []);
      setSelectedQuestionTypes(asn.questionTypes || []);
      setAssignmentStep('questionTypeForm');
    } else {
      setSelectedTeacherForAssignment(teachers.find(t => t.id === (asn.teacherId || (asn.teacherIds && asn.teacherIds[0]))) || teachers[0]);
      setSelectedQuestionIds(asn.selectedQuestionIds || ['Q-101']);
      setAssignmentStep('questionForm');
    }
    setIsAssignmentModalOpen(true);
  };

  // Delete Assignment Helper
  const handleDeleteAssignment = (id) => {
    const target = assignments.find(a => a.id === id);
    if (!target) return;

    setAssignments(prev => prev.filter(a => a.id !== id));

    const newLog = {
      id: `LOG-${5000 + activityLogs.length + 1}`,
      teacherName: "Administrator",
      teacherAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      department: target.program,
      action: `Deleted Assignment (${target.subject})`,
      details: `Assignment ${target.id} (${target.subject}) was deleted from active assignments.`,
      timestamp: "Just now"
    };

    setActivityLogs(prev => [newLog, ...prev]);
    showToast(`Deleted assignment ${target.id} (${target.subject})!`);
  };

  // Submit Step 2A: Add / Edit Question Type Assignment
  const handleSaveQuestionTypeAssignment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const program = formData.get('program') || selectedProgram;
    const subject = formData.get('subject') || selectedSubject;
    const totalCount = formData.get('questionCount') || '10';
    const instructions = formData.get('instructions');

    const assignedTeachers = teachers.filter(t => selectedTeacherIds.includes(t.id));
    const teacherNames = assignedTeachers.length > 0
      ? assignedTeachers.map(t => t.name).join(', ')
      : 'All Mapped Teachers';
    const primaryTeacher = assignedTeachers[0] || teachers[0];

    if (editingAssignment) {
      // UPDATE EXISTING ASSIGNMENT
      setAssignments(prev => prev.map(asn => {
        if (asn.id === editingAssignment.id) {
          return {
            ...asn,
            program,
            subject,
            teacherIds: selectedTeacherIds,
            questionTypes: selectedQuestionTypes,
            questionCount: totalCount,
            instructions,
            updatedAt: "Just now"
          };
        }
        return asn;
      }));

      const newLog = {
        id: `LOG-${5000 + activityLogs.length + 1}`,
        teacherName: primaryTeacher.name,
        teacherAvatar: primaryTeacher.avatar,
        department: primaryTeacher.department,
        action: `Updated Question Type Assignment (${subject})`,
        details: `Updated assignment ${editingAssignment.id} for ${subject} (${totalCount} questions, types: ${selectedQuestionTypes.join(', ')}).`,
        timestamp: "Just now"
      };

      setActivityLogs(prev => [newLog, ...prev]);
      setIsAssignmentModalOpen(false);
      setEditingAssignment(null);
      showToast(`Updated Question Type assignment ${editingAssignment.id}!`);
    } else {
      // CREATE NEW ASSIGNMENT
      const newAsn = {
        id: `ASN-${2000 + assignments.length + 1}`,
        type: 'questionType',
        program,
        subject,
        teacherIds: selectedTeacherIds,
        questionTypes: selectedQuestionTypes,
        questionCount: totalCount,
        instructions,
        createdAt: "Just now"
      };

      setAssignments(prev => [newAsn, ...prev]);

      const newLog = {
        id: `LOG-${5000 + activityLogs.length + 1}`,
        teacherName: assignedTeachers.length > 1 ? `${assignedTeachers.length} Mapped Teachers` : primaryTeacher.name,
        teacherAvatar: primaryTeacher.avatar,
        department: primaryTeacher.department,
        action: `Created Question Type Assignment (${subject})`,
        details: `Program: ${program} | Course: ${subject} | Assigned to ${assignedTeachers.length} teacher(s): [${teacherNames}] | Target: ${totalCount} questions (${selectedQuestionTypes.join(', ')}). Instructions: ${instructions || 'Prepare question sets.'}`,
        timestamp: "Just now"
      };

      setActivityLogs(prev => [newLog, ...prev]);
      setIsAssignmentModalOpen(false);
      setLastCreatedExam(selectedExam);
      showToast(`Created Question Type assignment for ${subject}!`);
    }
  };

  // Submit Step 2B: Add / Edit Specific Question Assignment
  const handleSaveQuestionAssignment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const program = formData.get('program') || selectedProgram;
    const subject = formData.get('subject') || selectedSubject;
    const tchId = selectedTeacherIds[0];
    const teacher = teachers.find(t => t.id === tchId) || teachers[0];
    const totalMarks = formData.get('totalMarks') || '50';
    const instructions = formData.get('instructions');

    if (editingAssignment) {
      // UPDATE EXISTING SPECIFIC QUESTION ASSIGNMENT
      setAssignments(prev => prev.map(asn => {
        if (asn.id === editingAssignment.id) {
          return {
            ...asn,
            program,
            subject,
            teacherId: teacher.id,
            teacherIds: [teacher.id],
            selectedQuestionIds,
            totalMarks,
            instructions,
            updatedAt: "Just now"
          };
        }
        return asn;
      }));

      const newLog = {
        id: `LOG-${5000 + activityLogs.length + 1}`,
        teacherName: teacher.name,
        teacherAvatar: teacher.avatar,
        department: teacher.department,
        action: `Updated Question Assignment (${subject})`,
        details: `Updated assignment ${editingAssignment.id} for ${subject} (${selectedQuestionIds.length} questions, ${totalMarks} marks).`,
        timestamp: "Just now"
      };

      setActivityLogs(prev => [newLog, ...prev]);
      setIsAssignmentModalOpen(false);
      setEditingAssignment(null);
      showToast(`Updated Question Assignment ${editingAssignment.id}!`);
    } else {
      // CREATE NEW SPECIFIC QUESTION ASSIGNMENT
      const newAsn = {
        id: `ASN-${2000 + assignments.length + 1}`,
        type: 'question',
        program,
        subject,
        teacherId: teacher.id,
        teacherIds: [teacher.id],
        selectedQuestionIds,
        totalMarks,
        instructions,
        createdAt: "Just now"
      };

      setAssignments(prev => [newAsn, ...prev]);

      const newLog = {
        id: `LOG-${5000 + activityLogs.length + 1}`,
        teacherName: teacher.name,
        teacherAvatar: teacher.avatar,
        department: teacher.department,
        action: `Created Question Assignment (${subject})`,
        details: `Program: ${program} | Course: ${subject} | Assigned ${selectedQuestionIds.length} questions [${selectedQuestionIds.join(', ')}] worth ${totalMarks} marks to ${teacher.name}. ${instructions || ''}`,
        timestamp: "Just now"
      };

      setActivityLogs(prev => [newLog, ...prev]);
      setIsAssignmentModalOpen(false);
      setLastCreatedExam(selectedExam);
      showToast(`Assigned ${selectedQuestionIds.length} questions for ${subject} to ${teacher.name}!`);
    }
  };

  const toggleQuestionType = (type) => {
    setSelectedQuestionTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleQuestionId = (qId) => {
    setSelectedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  return (
    <div className="min-h-full bg-transparent text-[#1A1A1A] font-sans selection:bg-[#72102A] selection:text-white pb-12">
      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-xl shadow-2xl bg-[#72102A] border border-[#C9A84C] text-white flex items-center justify-between backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-[#C9A84C]/25 text-[#FDF8E8]">
                <Icon name="check" className="w-4 h-4" />
              </span>
              <p className="text-sm font-medium text-white">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-[#F5E6EA] hover:text-white p-1"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* HEADER SECTION */}
      <header className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
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
            Educator Management
          </h1>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '12.5px',
              color: '#6B7280',
              marginTop: '4px',
              marginBottom: 0,
            }}
          >
            Assign question-based tasks, view teacher directory, and inspect activity logs.
          </p>
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => { setEditingAssignment(null); setAssignmentStep('questionTypeForm'); setIsAssignmentModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white shadow-md shadow-[#72102A]/20 border border-[#8B1F3A] transition-all text-xs font-bold hover:scale-[1.02] active:scale-[0.98]"
        >
          <Icon name="plus" className="w-4 h-4 text-[#C9A84C]" />
          Request Question Type Assignment
        </button>
        <button
          onClick={() => { setEditingAssignment(null); setAssignmentStep('questionForm'); setIsAssignmentModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white shadow-md shadow-[#72102A]/20 border border-[#8B1F3A] transition-all text-xs font-bold hover:scale-[1.02] active:scale-[0.98]"
        >
          <Icon name="plus" className="w-4 h-4 text-[#C9A84C]" />
          Request Question Assignment
        </button>
        </div>
        </div>
      </header>

      {/* CONTROLS: SEARCH BAR & VIEW TABS */}
      <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-4">
        {/* STATUS TABS (display only) — hidden for now, remove this comment marker and the closing one below to restore
        <div className="flex items-center gap-2 w-full sm:basis-full sm:order-last flex-wrap">
          {[
            { label: 'All', count: filteredAssignments.length },
            { label: 'Pending', count: 0 },
            { label: 'Approved', count: 0 },
            { label: 'Rejected', count: 0 },
            { label: 'Cancelled', count: 0 },
            { label: 'Send Back', count: 0 },
          ].map(st => (
            <button
              key={st.label}
              onClick={() => setActiveStatus(st.label)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
                activeStatus === st.label
                  ? 'bg-[#72102A] text-white border-[#72102A]'
                  : 'bg-white text-[#1A1A1A] border-stone-200 hover:border-[#72102A]'
              }`}
            >
              {st.label}
              <span className={`px-1.5 py-px rounded-full text-[10px] font-extrabold ${
                activeStatus === st.label ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                {st.count}
              </span>
            </button>
          ))}
        </div>
        */}
      </div>

      {/* ========================================== */}
      {/* MODAL: CREATE NEW TEACHER ASSIGNMENT */}
      {/* ========================================== */}
      {isAssignmentModalOpen && (
        <div className={(assignmentStep === 'questionTypeForm' || assignmentStep === 'questionForm') ? "mb-6 animate-fadeIn" : "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"}>
          <div className={(assignmentStep === 'questionTypeForm' || assignmentStep === 'questionForm') ? "w-full relative text-[#1A1A1A]" : "bg-white border border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 md:p-10 shadow-2xl relative max-h-[92vh] overflow-y-auto text-[#1A1A1A]"}>
            {/* Close Button */}
            {assignmentStep !== 'selectOption' && (
            <button
              onClick={() => setIsAssignmentModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#FAF8F5] text-stone-400 hover:text-stone-700 transition-colors border border-stone-200"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
            )}

            {/* STEP 1: CHOICE SELECTION (ASK 2 QUESTIONS / MODES) */}
            {assignmentStep === 'selectOption' && (
              <div>
                <div className="flex items-center justify-between gap-3.5 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 md:-mx-10 md:-mt-10 mb-6 px-6 sm:px-8 py-8 rounded-t-3xl bg-gradient-to-br from-[#72102A] to-[#3D0716]">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-white/15 border border-white/20 rounded-xl text-white">
                      <Icon name="clipboard" className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Create Teacher Assignment</h2>
                      <p className="text-sm text-white/75 mt-0.5">Select how you want to structure this assignment for faculty members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAssignmentModalOpen(false)}
                    className="flex-shrink-0 p-2 rounded-lg bg-white text-stone-400 hover:text-stone-700 transition-colors border border-stone-200"
                  >
                    <Icon name="close" className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-6 space-y-4">
                  {/* CHOICE 1: ADD QUESTION TYPE ASSIGNMENT */}
                  <button
                    onClick={() => setAssignmentStep('questionTypeForm')}
                    className="w-full text-left p-6 rounded-2xl bg-[#FDF5F7] border border-[#72102A] transition-all group flex items-start gap-5 shadow-sm"
                  >
                    <div className="p-3.5 rounded-xl bg-[#F5E6EA] border border-[#E6C4CD] text-[#72102A] scale-105 transition-transform flex-shrink-0">
                      <Icon name="documentText" className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#72102A] text-lg transition-colors">
                          Add Question Type Assignment
                        </h3>
                        <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-[#F5E6EA] text-[#72102A] border border-[#E6C4CD]">
                          Option 1
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
                        Assign tasks based on question formats (Multiple Choice, Essay, Short Answer, True/False, or Coding Tasks) mapped to curriculum courses.
                      </p>
                    </div>
                  </button>

                  {/* CHOICE 2: ADD QUESTION ASSIGNMENT */}
                  <button
                    onClick={() => setAssignmentStep('questionForm')}
                    className="w-full text-left p-6 rounded-2xl bg-[#FDF8E8] border border-[#C9A84C] transition-all group flex items-start gap-5 shadow-sm"
                  >
                    <div className="p-3.5 rounded-xl bg-[#FDF8E8] border border-[#C9A84C]/40 text-[#A68A3D] scale-105 transition-transform flex-shrink-0">
                      <Icon name="questionMarkCircle" className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#A68A3D] text-lg transition-colors">
                          Add Question Assignment
                        </h3>
                        <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-[#FDF8E8] text-[#A68A3D] border border-[#C9A84C]/40">
                          Option 2
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
                        Assign specific questions selected directly from the Question Bank to a teacher for evaluation or grading.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2A: FORM FOR QUESTION TYPE ASSIGNMENT */}
            {assignmentStep === 'questionTypeForm' && (
              <div>
                <div className="mb-6 pb-4 border-b border-stone-200">
                  <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Icon name="documentText" className="w-6 h-6 text-[#72102A]" />
                    {editingAssignment ? 'Edit Question Type Assignment' : 'Add Question Type Assignment'}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {editingAssignment ? 'Modify configuration for this assignment.' : 'Structure assignment by specifying allowed question formats, subject blueprints, and mapped teachers.'}
                  </p>
                </div>

                <form onSubmit={handleSaveQuestionTypeAssignment} className="space-y-6 bg-white border border-stone-200 border-t-2 border-t-[#72102A] rounded-lg p-5 shadow-sm">
                  {/* Responsive 2-column grid for Class / Program & Subject selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Select Exam Details */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        1. Select Exam Details
                      </label>
                      <select
                        name="exam"
                        required
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className={`w-full appearance-none pr-8 bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem] bg-white border border-stone-300 rounded-md px-3 py-2 text-sm ${selectedExam ? 'text-[#1A1A1A]' : 'text-stone-400'} focus:outline-none focus:border-[#72102A] cursor-pointer`}
                        style={{ backgroundImage: SELECT_ARROW }}
                      >
                        <option value="">Select exam</option>
                        {['Term I Exam', 'Half-Yearly Exam', 'Term II Exam', 'Annual Exam'].map(ex => (
                          <option key={ex} className="text-[#1A1A1A]" value={ex}>{ex}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Select Session */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        2. Select Session
                      </label>
                      <input
                        type="text"
                        name="session"
                        required
                        readOnly
                        value={selectedSession}
                        className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none cursor-default"
                      />
                    </div>

                    {/* 3. Select Class / Program */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        3. Select Class / Program
                      </label>
                      <ProgramSelect value={selectedProgram} onChange={handleProgramChange} options={Object.keys(PROGRAM_SUBJECT_MAP)} />
                    </div>

                    {/* 4. Select Subject / Course */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        4. Select Subject / Course
                      </label>
                      <SubjectSelect selected={selectedSubjects} onChange={setSelectedSubjects} options={PROGRAM_SUBJECT_MAP[selectedProgram] || []} />
                    </div>

                    {/* 5. Chapters (pre-selected from the lesson plan) */}
                    <div className="md:col-span-2 relative">
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-2">
                        5. Chapters
                      </label>
                      <input required value={selectedChapters.length ? 'filled' : ''} onChange={() => {}} tabIndex={-1} aria-hidden="true" className="absolute left-0 bottom-0 w-full h-1 opacity-0 pointer-events-none" />
                      {!selectedSubject && <p className="px-3 py-2 text-sm text-stone-400 border border-stone-300 rounded-md bg-white">Select subject / course first</p>}
                      {selectedSubject && <ChapterMapping subjects={selectedSubjects} gold={false} selectedChapters={selectedChapters} onRemoveChapter={(key) => setSelectedChapters(prev => prev.filter(c => c !== key))} />}
                    </div>
                  </div>

                  {/* 3. Loaded Exam Question Blueprint — hidden for now, remove this comment marker and the closing one below to restore
                  {currentBlueprint && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FDF8E8] border border-[#C9A84C]/40 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-[#C9A84C]/20 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-[#C9A84C]/20 text-[#A68A3D]">
                            <Icon name="documentText" className="w-5 h-5" />
                          </span>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A68A3D]">Exam Question Blueprint (Auto-Loaded)</span>
                            <h4 className="text-sm font-bold text-[#1A1A1A]">{selectedSubject}</h4>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#72102A] bg-[#F5E6EA] px-3 py-1 rounded-lg border border-[#E6C4CD] self-start sm:self-auto">
                          {currentBlueprint.totalMarks} Total Marks ({currentBlueprint.duration})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {currentBlueprint.sections.map((sec, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-stone-200 text-xs flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-[#1A1A1A]">{sec.name}</p>
                              <p className="text-[11px] text-stone-500">{sec.count} Qs ({sec.type})</p>
                            </div>
                            <span className="font-mono text-xs font-bold text-[#72102A] bg-[#F5E6EA] px-2 py-0.5 rounded border border-[#E6C4CD]">
                              {sec.marks} Marks
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  */}

                  {/* 4. Mapped Teachers Button & Selection Preview */}
                  {selectedProgram && selectedSubject && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-2">
                      7. Mapped Teachers
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {mappedTeachers.map(teacher => {
                        const isSelected = selectedTeacherIds.includes(teacher.id);
                        return (
                          <label
                            key={teacher.id}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#F5E6EA] text-[#72102A] border-[#E6C4CD] shadow-sm'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleTeacherSelection(teacher.id)}
                                className="w-4 h-4 rounded accent-[#72102A] cursor-pointer flex-shrink-0"
                              />
                              <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-200 flex-shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-[#1A1A1A]">{teacher.name}</p>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#A68A3D] border border-[#C9A84C]/40">
                                    Course Mapped
                                  </span>
                                </div>
                                <p className="text-xs text-stone-500">
                                  {teacher.designation} • {teacher.department}
                                </p>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  )}

                  {/* Instructions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Due Date */}
                    <div className="flex flex-col">
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        required
                        max="9999-12-31"
                        onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) { /* picker not supported */ } }}
                        value={selectedDueDate}
                        onChange={(e) => { setSelectedDueDate(e.target.value); e.target.classList.toggle('text-stone-400', !e.target.value); e.target.classList.toggle('text-[#1A1A1A]', !!e.target.value); }}
                        className="w-full flex-1 bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-400 focus:outline-none focus:border-[#72102A] cursor-pointer"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="md:col-span-1 flex flex-col">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide">Instructions & Guidelines</label>
                        {isInstructionsEdited && (
                          <button type="button" onClick={handleResetInstructions} className="text-[11px] font-semibold text-[#72102A] hover:underline">Reset to Default</button>
                        )}
                      </div>
                      <textarea
                        name="instructions"
                        ref={instructionsRef}
                        required
                        rows="1"
                        value={instr.text}
                        onChange={(e) => setInstr(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="e.g. Prepare 10 MCQs and 5 Essay questions for the upcoming midterm exam..."
                        className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] flex-1 resize-none overflow-hidden min-h-[38px]"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-stone-200 mt-6">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-md bg-[#72102A] hover:bg-[#8B1F3A] text-white text-sm font-semibold transition-all shadow-md shadow-[#72102A]/20"
                    >
                      {editingAssignment ? 'Save Changes' : 'Create Question Type Assignment'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2B: FORM FOR SPECIFIC QUESTION ASSIGNMENT */}
            {assignmentStep === 'questionForm' && (
              <div>
                <div className="mb-6 pb-4 border-b border-stone-200">
                  <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Icon name="questionMarkCircle" className="w-6 h-6 text-[#A68A3D]" />
                    {editingAssignment ? 'Edit Question Assignment' : 'Add Question Assignment'}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {editingAssignment ? 'Modify assigned questions, marks, or target teacher.' : 'Select specific questions from the bank and assign them directly to a teacher.'}
                  </p>
                </div>

                <form onSubmit={handleSaveQuestionAssignment} className="space-y-6 bg-white border border-stone-200 border-t-2 border-t-[#C9A84C] rounded-lg p-5 shadow-sm">
                  {/* Grid for Program & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Select Exam Details */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        1. Select Exam Details
                      </label>
                      <select
                        name="exam"
                        required
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className={`w-full appearance-none pr-8 bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem] bg-white border border-stone-300 rounded-md px-3 py-2 text-sm ${selectedExam ? 'text-[#1A1A1A]' : 'text-stone-400'} focus:outline-none focus:border-[#72102A] cursor-pointer`}
                        style={{ backgroundImage: SELECT_ARROW }}
                      >
                        <option value="">Select exam</option>
                        {['Term I Exam', 'Half-Yearly Exam', 'Term II Exam', 'Annual Exam'].map(ex => (
                          <option key={ex} className="text-[#1A1A1A]" value={ex}>{ex}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Select Session */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        2. Select Session
                      </label>
                      <input
                        type="text"
                        name="session"
                        required
                        readOnly
                        value={selectedSession}
                        className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none cursor-default"
                      />
                    </div>

                    {/* 3. Select Class / Program */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        3. Select Class / Program
                      </label>
                      <ProgramSelect value={selectedProgram} onChange={handleProgramChange} options={Object.keys(PROGRAM_SUBJECT_MAP)} />
                    </div>

                    {/* 2. Select Subject / Course */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        4. Select Subject / Course
                      </label>
                      <SubjectSelect selected={selectedSubjects} onChange={setSelectedSubjects} options={PROGRAM_SUBJECT_MAP[selectedProgram] || []} />
                    </div>

                    {/* 5. Chapters (pre-selected from the lesson plan) */}
                    <div className="md:col-span-2 relative">
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-2">
                        5. Chapters
                      </label>
                      <input required value={selectedChapters.length ? 'filled' : ''} onChange={() => {}} tabIndex={-1} aria-hidden="true" className="absolute left-0 bottom-0 w-full h-1 opacity-0 pointer-events-none" />
                      {!selectedSubject && <p className="px-3 py-2 text-sm text-stone-400 border border-stone-300 rounded-md bg-white">Select subject / course first</p>}
                      {selectedSubject && <ChapterMapping subjects={selectedSubjects} gold={true} selectedChapters={selectedChapters} onRemoveChapter={(key) => setSelectedChapters(prev => prev.filter(c => c !== key))} />}
                    </div>
                  </div>

                  {/* 3. Select Teacher */}
                  {selectedProgram && selectedSubject && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-2">7. Mapped Teachers</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {mappedTeachers.map(teacher => {
                        const isSelected = selectedTeacherIds.includes(teacher.id);
                        return (
                          <label
                            key={teacher.id}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#FDF8E8] text-stone-900 border-[#C9A84C]/50 shadow-sm'
                                : 'bg-[#FAF8F5] text-stone-600 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleTeacherSelection(teacher.id)}
                                className="w-4 h-4 rounded accent-[#A68A3D] cursor-pointer flex-shrink-0"
                              />
                              <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-200 flex-shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-[#1A1A1A]">{teacher.name}</p>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#A68A3D] border border-[#C9A84C]/40">
                                    Course Mapped
                                  </span>
                                </div>
                                <p className="text-xs text-stone-500">
                                  {teacher.designation} • {teacher.department}
                                </p>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  )}

                  {/* Instructions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Due Date */}
                    <div className="flex flex-col">
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        required
                        max="9999-12-31"
                        onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) { /* picker not supported */ } }}
                        value={selectedDueDate}
                        onChange={(e) => { setSelectedDueDate(e.target.value); e.target.classList.toggle('text-stone-400', !e.target.value); e.target.classList.toggle('text-[#1A1A1A]', !!e.target.value); }}
                        className="w-full flex-1 bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-400 focus:outline-none focus:border-[#72102A] cursor-pointer"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="md:col-span-1 flex flex-col">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wide">Instructions & Guidelines</label>
                        {isInstructionsEdited && (
                          <button type="button" onClick={handleResetInstructions} className="text-[11px] font-semibold text-[#72102A] hover:underline">Reset to Default</button>
                        )}
                      </div>
                      <textarea
                        name="instructions"
                        ref={instructionsRef}
                        required
                        rows="1"
                        value={instr.text}
                        onChange={(e) => setInstr(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="e.g. Prepare 10 MCQs and 5 Essay questions for the upcoming midterm exam..."
                        className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] flex-1 resize-none overflow-hidden min-h-[38px]"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-stone-200 mt-6">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-md bg-[#72102A] hover:bg-[#8B1F3A] text-white text-sm font-semibold transition-all shadow-md shadow-[#72102A]/20"
                    >
                      {editingAssignment ? 'Save Changes' : 'Create Question Assignment'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 1: QUESTION TYPE ASSIGNMENTS */}
      {/* ========================================== */}
      {activeTab === 'assignments' && (
        <div>
          {filteredAssignments.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-stone-300 rounded-3xl bg-white">
              <Icon name="documentText" className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-stone-700">No assignments found</h3>
              <p className="text-xs text-stone-500 mt-1">
                {searchTerm ? 'No assignments match your search term.' : 'Click "Create New Teacher Assignment" above to add one.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#72102A] text-white text-xs font-semibold hover:bg-[#8B1F3A] transition-all"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="hidden grid-cols-1 md:grid-cols-3 gap-6">
              {filteredAssignments.map(asn => {
                const assignedTeachersList = teachers.filter(t => (asn.teacherIds || []).includes(t.id));
                return (
                  <div
                    key={asn.id}
                    className="bg-white border border-[#C9A84C] rounded-2xl p-6 min-h-[480px] shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Header Badge & Action Buttons (Edit / Delete) */}
                      <div className="flex items-start justify-between gap-3 mb-4 -mx-6 -mt-6 px-6 py-4 border-b border-stone-200">
                        <div>
                          <h3 className="font-bold text-[#1A1A1A] text-lg">{asn.subject}</h3>
                        </div>

                        {/* EDIT & DELETE ACTION BUTTONS */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleEditAssignment(asn)}
                            title="Edit Assignment"
                            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5E6EA] border border-stone-200 text-stone-600 hover:text-[#72102A] transition-all"
                          >
                            <Icon name="pencil" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(asn.id)}
                            title="Delete Assignment"
                            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-rose-50 border border-stone-200 text-stone-600 hover:text-rose-600 transition-all"
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#72102A] bg-[#F5E6EA] px-2 py-0.5 rounded border border-[#E6C4CD]">
                          {asn.id}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          asn.type === 'question'
                            ? 'bg-[#FDF8E8] text-[#A68A3D] border-[#C9A84C]/40'
                            : 'bg-[#F5E6EA] text-[#72102A] border-[#E6C4CD]'
                        }`}>
                          {asn.type === 'question' ? 'Specific Questions Assignment' : 'Question Type Assignment'}
                        </span>
                        <div className="basis-full h-0" />
                        <span className="text-[11px] font-semibold text-stone-600 bg-[#FAF8F5] px-2 py-0.5 rounded border border-stone-200">
                          {asn.program}
                        </span>
                      </div>

                      {/* Content details depending on assignment type */}
                      {asn.type === 'questionType' ? (
                        <div className="mb-4">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">
                            Configured Question Types ({asn.questionCount} Total Questions)
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(asn.questionTypes || []).map((qt, idx) => (
                              <span
                                key={idx}
                                className="bg-[#F5E6EA] text-[#72102A] text-xs px-2.5 py-1 rounded-lg border border-[#E6C4CD] font-medium"
                              >
                                {qt}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                              Selected Questions from Bank ({(asn.selectedQuestionIds || []).length} Items)
                            </p>
                            <span className="font-mono text-xs font-bold text-[#A68A3D] bg-[#FDF8E8] px-2 py-0.5 rounded border border-[#C9A84C]/30">
                              {asn.totalMarks} Marks
                            </span>
                          </div>
                          <div className="space-y-1">
                            {(asn.selectedQuestionIds || []).map((qId) => {
                              const item = QUESTION_BANK_ITEMS.find(q => q.id === qId);
                              return (
                                <div key={qId} className="flex items-center gap-2 text-xs bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-stone-200">
                                  <span className="font-mono font-bold text-[#72102A]">{qId}</span>
                                  <span className="text-stone-700 truncate">{item ? item.title : 'Question Item'}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Assigned Mapped Teachers */}
                      <div className="mb-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">
                          Assigned Teachers ({assignedTeachersList.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {assignedTeachersList.map(t => (
                            <div
                              key={t.id}
                              className="flex items-center gap-2 bg-[#FAF8F5] px-2.5 py-1 rounded-xl border border-stone-200"
                            >
                              <img src={t.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-xs font-semibold text-stone-800">{t.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Instructions Preview */}
                      {asn.instructions && (
                        <div className="p-3 rounded-xl bg-[#FDF8E8] border border-[#C9A84C]/30 text-xs text-stone-700 italic whitespace-pre-line">
                          "{asn.instructions}"
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-stone-500 font-mono">
                        <span>Created: {asn.createdAt}</span>
                        {asn.updatedAt && <span className="text-[#72102A] font-semibold">Updated: {asn.updatedAt}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: TEACHER LIST */}
      {/* ========================================== */}
      {activeTab === 'teachers' && !(isAssignmentModalOpen && (assignmentStep === 'questionTypeForm' || assignmentStep === 'questionForm')) && (
        <div className="space-y-6">
          {/* TEACHER LIST FILTER CONTROLS BAR */}
          <div className="bg-white border border-[#E8E2D9] rounded-[14px] p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em] mr-1">Filters</span>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-auto md:flex-1 md:min-w-[14rem]">
            <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'assignments'
                  ? "Search assignments by course, teacher, or type..."
                  : activeTab === 'teachers'
                  ? "Educators or Departments"
                  : "Search activity logs..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAFAF9] border-[1.5px] border-[#E8E2D9] rounded-[10px] pl-10 pr-10 py-2.5 text-[13px] text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#72102A] focus:bg-white focus:ring-[3px] focus:ring-[#72102A]/10 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            )}
          </div>

            <div className="flex flex-wrap items-center gap-[6px]">
              {/* Department Filter */}
              <div className="flex items-center gap-[6px]">
                <select
                  title="Department"
                  value={teacherDeptFilter}
                  onChange={(e) => setTeacherDeptFilter(e.target.value)}
                  className={`min-w-[90px] px-3 py-[5px] text-sm border-[1.5px] rounded-full focus:outline-none cursor-pointer transition-all ${teacherDeptFilter !== 'All' ? 'bg-[rgba(114,16,42,0.07)] border-[rgba(114,16,42,0.3)] text-[#72102A] font-bold' : 'bg-[#F9F9F8] border-[#E8E2D9] text-[#4B5563] font-medium'}`}
                >
                  {uniqueDepartments.map(dept => (
                    <option key={dept} className="bg-white text-[#1A1A1A] font-normal" value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                  ))}
                </select>
              </div>

              {/* Designation Filter */}
              <div className="flex items-center gap-[6px]">
                <span className="text-[#D1D5DB] text-[11px] font-bold select-none px-px">›</span>
                <select
                  title="Designation"
                  value={teacherDesignationFilter}
                  onChange={(e) => setTeacherDesignationFilter(e.target.value)}
                  className={`min-w-[90px] px-3 py-[5px] text-sm border-[1.5px] rounded-full focus:outline-none cursor-pointer transition-all ${teacherDesignationFilter !== 'All' ? 'bg-[rgba(114,16,42,0.07)] border-[rgba(114,16,42,0.3)] text-[#72102A] font-bold' : 'bg-[#F9F9F8] border-[#E8E2D9] text-[#4B5563] font-medium'}`}
                >
                  {uniqueDesignations.map(desig => (
                    <option key={desig} className="bg-white text-[#1A1A1A] font-normal" value={desig}>{desig === 'All' ? 'All Designations' : desig}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-[6px]">
                <span className="text-[#D1D5DB] text-[11px] font-bold select-none px-px">›</span>
                <select
                  title="Subject/Course"
                  value={teacherSubjectFilter}
                  onChange={(e) => setTeacherSubjectFilter(e.target.value)}
                  className={`min-w-[90px] px-3 py-[5px] text-sm border-[1.5px] rounded-full focus:outline-none cursor-pointer transition-all ${teacherSubjectFilter !== 'All' ? 'bg-[rgba(114,16,42,0.07)] border-[rgba(114,16,42,0.3)] text-[#72102A] font-bold' : 'bg-[#F9F9F8] border-[#E8E2D9] text-[#4B5563] font-medium'}`}
                >
                  {uniqueTeacherSubjects.map(sub => (
                    <option key={sub} className="bg-white text-[#1A1A1A] font-normal" value={sub}>{sub === 'All' ? 'Subject/Course' : sub}</option>
                  ))}
                </select>
              </div>

              {/* Class Filter */}
              <div className="flex items-center gap-[6px]">
                <span className="text-[#D1D5DB] text-[11px] font-bold select-none px-px">›</span>
                <select
                  title="Class/Program"
                  value={teacherClassFilter}
                  onChange={(e) => setTeacherClassFilter(e.target.value)}
                  className={`min-w-[90px] px-3 py-[5px] text-sm border-[1.5px] rounded-full focus:outline-none cursor-pointer transition-all ${teacherClassFilter !== 'All' ? 'bg-[rgba(114,16,42,0.07)] border-[rgba(114,16,42,0.3)] text-[#72102A] font-bold' : 'bg-[#F9F9F8] border-[#E8E2D9] text-[#4B5563] font-medium'}`}
                >
                  {uniqueTeacherClasses.map(cls => (
                    <option key={cls} className="bg-white text-[#1A1A1A] font-normal" value={cls}>{cls === 'All' ? 'Class/Program' : toRomanClass(cls)}</option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div className="flex items-center gap-[6px]">
                <span className="text-[#D1D5DB] text-[11px] font-bold select-none px-px">›</span>
                <select
                  title="Section"
                  value={teacherSectionFilter}
                  onChange={(e) => setTeacherSectionFilter(e.target.value)}
                  className={`min-w-[90px] px-3 py-[5px] text-sm border-[1.5px] rounded-full focus:outline-none cursor-pointer transition-all ${teacherSectionFilter !== 'All' ? 'bg-[rgba(114,16,42,0.07)] border-[rgba(114,16,42,0.3)] text-[#72102A] font-bold' : 'bg-[#F9F9F8] border-[#E8E2D9] text-[#4B5563] font-medium'}`}
                >
                  {uniqueTeacherSections.map(sec => (
                    <option key={sec} className="bg-white text-[#1A1A1A] font-normal" value={sec}>{sec === 'All' ? 'All Sections' : sec}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setTeacherDeptFilter('All');
                  setTeacherDesignationFilter('All');
                  setTeacherSubjectFilter('All');
                  setTeacherClassFilter('All');
                  setTeacherSectionFilter('All');
                }}
                className={`inline-flex items-center gap-[5px] px-3 py-[5px] ml-1 rounded-full bg-[rgba(114,16,42,0.06)] hover:bg-[rgba(114,16,42,0.12)] border-[1.5px] border-[rgba(114,16,42,0.2)] text-[#72102A] text-xs font-semibold transition-all shrink-0 focus:outline-none ${
                  (teacherDeptFilter !== 'All' || teacherDesignationFilter !== 'All' || teacherSubjectFilter !== 'All' || teacherClassFilter !== 'All' || teacherSectionFilter !== 'All') ? '' : 'invisible'
                }`}
              >
                <Icon name="close" className="w-3 h-3" />
              Clear ({[teacherDeptFilter, teacherDesignationFilter, teacherSubjectFilter, teacherClassFilter, teacherSectionFilter].filter(f => f !== 'All').length})
              </button>
            </div>
          </div>

          {filteredTeachers.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-stone-300 rounded-3xl bg-white">
              <Icon name="search" className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-stone-700">No teachers found matching filters</h3>
              <p className="text-xs text-stone-500 mt-1">Try resetting your filter options or search term.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTeacherDeptFilter('All');
                  setTeacherDesignationFilter('All');
                  setTeacherSubjectFilter('All');
                  setTeacherClassFilter('All');
                  setTeacherSectionFilter('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#72102A] text-white text-xs font-semibold hover:bg-[#8B1F3A] transition-all"
              >
                Reset All Filters & Search
              </button>
            </div>
          ) : (
            <>
            {/* Mobile card view */}
            <div className="md:hidden space-y-4">
              {filteredTeachers.map(teacher => (
                <div key={teacher.id} onClick={() => setViewingTeacher(teacher)} className="bg-white border border-stone-300 rounded-2xl shadow-sm p-4 space-y-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#72102A]/20"
                    />
                    <div>
                      <p className="font-bold text-[#1A1A1A]">{teacher.name}</p>
                      <p className="text-xs text-stone-600">{teacher.designation}</p>
                    </div>
                  </div>
                  <div className="border-t border-stone-200 pt-3 space-y-3 text-sm">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">Department</p>
                      <p className="text-[#72102A] font-semibold">{teacher.department}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">Assigned Subjects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.subjects.map((subject, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FAF8F5] text-stone-700 text-xs px-2.5 py-1 rounded-lg border border-stone-200 font-medium"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">Assigned Classes</p>
                        <p className="text-stone-700">{(teacher.classes || []).map(toRomanClass).join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">Assigned Sections</p>
                        <p className="text-stone-700">{(teacher.sections || []).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block bg-white border border-stone-300 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-sm text-left">
                <thead>
                  <tr className="bg-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                    <th className="border border-stone-300 px-4 py-3">Educator</th>
                    <th className="border border-stone-300 px-4 py-3">Designation</th>
                    <th className="border border-stone-300 px-4 py-3">Department</th>
                    <th className="border border-stone-300 px-4 py-3">Assigned Subjects</th>
                    <th className="border border-stone-300 px-4 py-3">Assigned Classes/Program</th>
                    <th className="border border-stone-300 px-4 py-3">Assigned Sections</th>
                    <th className="border border-stone-300 px-4 py-3">Activity Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map(teacher => (
                    <tr key={teacher.id} onClick={() => setViewingTeacher(teacher)} className="hover:bg-[#FDF5F7] transition-colors cursor-pointer">
                      <td className="border border-stone-300 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#72102A]/20"
                          />
                          <span className="font-bold text-[#1A1A1A]">{teacher.name}</span>
                        </div>
                      </td>
                      <td className="border border-stone-300 px-4 py-3 text-stone-600">{teacher.designation}</td>
                      <td className="border border-stone-300 px-4 py-3 text-[#72102A] font-semibold">{teacher.department}</td>
                      <td className="border border-stone-300 px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {teacher.subjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="bg-[#FAF8F5] text-stone-700 text-xs px-2.5 py-1 rounded-lg border border-stone-200 font-medium"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="border border-stone-300 px-4 py-3 text-stone-700">{(teacher.classes || []).map(toRomanClass).join(', ')}</td>
                      <td className="border border-stone-300 px-4 py-3 text-stone-700">{(teacher.sections || []).join(', ')}</td>
                      <td className="border border-stone-300 px-4 py-3">
                        {(() => {
                          const teacherLogs = activityLogs.filter(log => (log.teacherName || '').includes(teacher.name));
                          return teacherLogs.length === 0 ? (
                            <span className="text-xs text-stone-400">No recent activity</span>
                          ) : (
                            <div className="space-y-2">
                              {teacherLogs.map(log => (
                                <div key={log.id}>
                                  <p className="text-xs font-semibold text-[#72102A]">{log.action}</p>
                                  <p className="text-[11px] text-stone-500 font-mono">{log.timestamp}</p>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      )}

      {/* EDUCATOR DETAILS POPUP */}
      {viewingTeacher && (() => {
        const t = viewingTeacher;
        const logs = activityLogs.filter(log => (log.teacherName || '').includes(t.name));
        const assigned = assignments.filter(asn => (asn.teacherIds || []).includes(t.id));
        const typeEdits = logs.filter(log => log.action.startsWith('Updated Question Type')).length;
        const questionEdits = logs.filter(log => log.action.startsWith('Updated Question Assignment')).length;
        const stat = (label, value) => (
          <div className="bg-[#FAF8F5] border border-stone-200 rounded-lg px-3 py-2">
            <p className="text-[11px] text-stone-500">{label}</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">{value}</p>
          </div>
        );
        const renderLogs = (title, list, edits, editLabel, assignedList) => (
          <div>
            {assignedList.length === 0 ? (
              <p className="text-xs text-stone-400 bg-[#FAF8F5] border border-stone-200 rounded-lg px-3 py-3 mb-4">Nothing assigned yet</p>
            ) : (
              <div className="space-y-2 mb-4">
                {assignedList.map(asn => (
                  <div key={asn.id} className="bg-[#FAF8F5] border border-stone-200 rounded-lg px-3 py-2.5">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{asn.type === 'questionType' ? 'Question Type Assignment' : 'Question Assignment'} &bull; {asn.subject}</p>
                    <p className="text-xs text-stone-600 mt-0.5">{asn.program}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">{title}</p>
            {list.length === 0 ? (
              <p className="text-xs text-stone-400 bg-[#FAF8F5] border border-stone-200 rounded-lg px-3 py-3">No recent activity</p>
            ) : (
              <div className="relative pl-6">
                <span className="absolute left-[5px] top-3 bottom-3 w-px bg-stone-300" />
                <div className="space-y-3">
                  {list.map(log => {
                    const edited = log.action.startsWith('Updated');
                    return (
                      <div key={log.id} className="relative">
                        <span className={`absolute -left-6 top-4 w-2.5 h-2.5 rounded-full ${edited ? 'bg-[#0B5E8E]' : 'bg-[#0B8F5B]'}`} />
                        <div className="bg-[#F8F9FB] border border-stone-200 rounded-xl px-4 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${edited ? 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]' : 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'}`}>{edited ? 'Edited' : log.action.startsWith('Created') ? 'Created' : 'Assigned'}</span>
                            <p className="text-xs text-stone-500 whitespace-nowrap">{log.timestamp}</p>
                          </div>
                          <p className="text-sm text-[#1A1A1A] mt-2">{log.action}</p>
                          <p className="text-sm text-stone-700 mt-0.5">{log.details}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="relative">
                    <span className="absolute -left-6 top-4 w-2.5 h-2.5 rounded-full bg-[#7E22CE]" />
                    <div className="bg-[#F8F9FB] border border-stone-200 rounded-xl px-4 py-3">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md border bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]">Edits</span>
                      <p className="text-sm font-semibold text-[#1A1A1A] mt-2">Edited {edits} {edits === 1 ? 'time' : 'times'}</p>
                      <p className="text-sm text-stone-700 mt-0.5">{editLabel} edited {edits}.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setViewingTeacher(null)}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between flex-shrink-0 px-6 py-5 bg-gradient-to-r from-[#72102A] to-[#3F0716]">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#72102A]/20" />
                  <div>
                    <h3 className="text-xl font-extrabold text-white uppercase tracking-wide">{t.name}</h3>
                    <p className="text-xs text-white/80">{t.id}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setViewingTeacher(null)} className="bg-white/90 hover:bg-white text-stone-600 rounded-lg p-2">
                  <Icon name="close" className="w-4 h-4" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4 overflow-y-auto">
                <p className="text-xs font-semibold text-[#1A1A1A] text-center">Assigned To This Educator</p>
                {(() => {
                  const typeAssigned = assigned.filter(asn => asn.type === 'questionType');
                  const dataAssigned = assigned.filter(asn => asn.type !== 'questionType');
                  const typeSection = renderLogs('Activity Logs - Question Type Assignment', logs.filter(log => log.action.includes('Question Type')), typeEdits, 'Question Type', typeAssigned);
                  const dataSection = renderLogs('Activity Logs - Question Data', logs.filter(log => !log.action.includes('Question Type')), questionEdits, 'Question', dataAssigned);
                  if (typeAssigned.length && dataAssigned.length) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x md:divide-stone-200">
                        {typeSection}
                        <div className="md:pl-6">{dataSection}</div>
                      </div>
                    );
                  }
                  if (typeAssigned.length) return typeSection;
                  if (dataAssigned.length) return dataSection;
                  return <p className="text-xs text-stone-400 bg-[#FAF8F5] border border-stone-200 rounded-lg px-3 py-3">Nothing assigned yet</p>;
                })()}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================== */}
      {/* TAB 3: ACTIVITY LOGS */}
      {/* ========================================== */}
      {activeTab === 'logs' && !(isAssignmentModalOpen && (assignmentStep === 'questionTypeForm' || assignmentStep === 'questionForm')) && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2 border-b border-stone-200 pb-3">
            <Icon name="clock" className="w-5 h-5 text-[#72102A]" />
            Teacher Activity Logs
          </h2>

          {filteredLogs.length === 0 ? (
            <p className="text-xs text-stone-500 py-8 text-center">No activity logs matching your search.</p>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map(log => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/90 flex items-start gap-4 hover:border-[#C9A84C]/60 transition-all"
                >
                  <img
                    src={log.teacherAvatar}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-300 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A1A]">{log.teacherName}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#F5E6EA] border border-[#E6C4CD] text-[#72102A] font-semibold">
                          {log.department}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono">{log.timestamp}</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#72102A] mb-0.5">{log.action}</h4>
                    <p className="text-xs text-stone-600">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TEACHER SELECTION POPUP MODAL */}
      {/* ========================================== */}
      {isTeacherPickerOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#72102A] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#C9A84C] text-[#1A1A1A]">
                  <Icon name="users" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Select Mapped Teachers
                  </h3>
                  <p className="text-xs text-[#F5E6EA] mt-0.5">
                    {selectedSubject} • {selectedProgram}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTeacherPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#5C0C21] hover:bg-[#8B1F3A] flex items-center justify-center text-[#F5E6EA] hover:text-white transition-all"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Controls & Search */}
            <div className="p-4 bg-[#FAF8F5] border-b border-stone-200 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search bar */}
                <div className="relative flex-1 w-full">
                  <Icon name="search" className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search teacher by name or department..."
                    value={teacherPickerSearch}
                    onChange={(e) => setTeacherPickerSearch(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-4 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#72102A]"
                  />
                </div>

                {/* Mapped vs All Filter */}
                <div className="flex items-center bg-white p-1 rounded-xl border border-stone-200 text-xs w-full sm:w-auto justify-center">
                  <button
                    type="button"
                    onClick={() => setTeacherPickerFilter('mapped')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                      teacherPickerFilter === 'mapped'
                        ? 'bg-[#72102A] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Mapped ({mappedTeachers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeacherPickerFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                      teacherPickerFilter === 'all'
                        ? 'bg-[#72102A] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    All Faculty ({teachers.length})
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>
                  Showing {pickerTeachersList.length} teacher(s) ({selectedTeacherIds.length} selected)
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleSelectAllTeachers}
                    className="text-[#72102A] hover:text-[#8B1F3A] font-bold underline underline-offset-2"
                  >
                    {selectedTeacherIds.length === mappedTeachers.length ? 'Deselect All Mapped' : 'Select All Mapped'}
                  </button>
                </div>
              </div>
            </div>

            {/* Teachers List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[50vh] bg-stone-50/50">
              {pickerTeachersList.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No teachers found matching your search.
                </div>
              ) : (
                pickerTeachersList.map(teacher => {
                  const isMapped = mappedTeachers.some(m => m.id === teacher.id);
                  const isSelected = selectedTeacherIds.includes(teacher.id);

                  return (
                    <label
                      key={teacher.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#F5E6EA] text-[#72102A] border-[#E6C4CD] shadow-sm'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleTeacherSelection(teacher.id)}
                          className="w-4 h-4 rounded accent-[#72102A] cursor-pointer flex-shrink-0"
                        />
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-200 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#1A1A1A]">{teacher.name}</p>
                            {isMapped && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#A68A3D] border border-[#C9A84C]/40">
                                Course Mapped
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500">
                            {teacher.designation} • {teacher.department}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            {teacher.email}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-lg border ${
                          isSelected
                            ? 'bg-[#72102A] text-white border-[#72102A]'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
              <div className="text-xs text-stone-600">
                <span className="font-bold text-[#72102A]">{selectedTeacherIds.length}</span> teacher(s) currently selected for this assignment.
              </div>
              <button
                type="button"
                onClick={() => setIsTeacherPickerOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
