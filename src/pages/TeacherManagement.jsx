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
} from '../data/teacherData.js';

export default function TeacherManagement() {
  const [teachers] = useState(INITIAL_TEACHERS);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  
  // Search & Active Tab State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('assignments'); // 'teachers' | 'assignments' | 'logs'
  
  // Modal Workflow State:
  // step: 'selectOption' | 'questionTypeForm' | 'questionForm'
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentStep, setAssignmentStep] = useState('selectOption'); 
  const [selectedTeacherForAssignment, setSelectedTeacherForAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Form State for Program & Subject Selection (Question Type Assignment)
  const [selectedProgram, setSelectedProgram] = useState("B.Tech - Computer Science Engineering");
  const [selectedSubject, setSelectedSubject] = useState("Artificial Intelligence (CS-401)");

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
    if (!selectedProgram) return teachers;
    const progLower = selectedProgram.toLowerCase();

    return teachers.filter(t => {
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
  }, [teachers, selectedProgram]);

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
  }, [mappedTeachers, selectedProgram, selectedSubject, editingAssignment]);

  // Handler when Program dropdown changes
  const handleProgramChange = (e) => {
    const prog = e.target.value;
    setSelectedProgram(prog);
    const subjects = PROGRAM_SUBJECT_MAP[prog] || [];
    setSelectedSubject(subjects[0] || '');
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

      return matchesSearch && matchesDept && matchesDesignation && matchesSubject;
    });
  }, [teachers, searchTerm, teacherDeptFilter, teacherDesignationFilter, teacherSubjectFilter]);

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
      showToast(`Created Question Type assignment for ${subject}!`);
    }
  };

  // Submit Step 2B: Add / Edit Specific Question Assignment
  const handleSaveQuestionAssignment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const program = formData.get('program') || selectedProgram;
    const subject = formData.get('subject') || selectedSubject;
    const tchId = formData.get('teacherId');
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
              <p className="text-sm font-medium">{toast.message}</p>
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
            Teacher Management
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
        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white shadow-md shadow-[#72102A]/20 border border-[#8B1F3A] transition-all text-xs font-bold hover:scale-[1.02] active:scale-[0.98]"
        >
          <Icon name="plus" className="w-4 h-4 text-[#C9A84C]" />
          Create New Teacher Assignment
        </button>
      </header>

      {/* CONTROLS: SEARCH BAR & VIEW TABS */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* SEARCH INPUT */}
        <div className="relative w-full sm:w-80">
          <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'assignments'
                ? "Search assignments by course, teacher, or type..."
                : activeTab === 'teachers'
                ? "Search teachers by name, department, or subject..."
                : "Search activity logs..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#72102A] focus:ring-1 focus:ring-[#72102A] transition-all"
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

        {/* VIEW TABS SWITCHER */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-stone-200 w-full sm:w-auto justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'assignments'
                ? 'bg-[#72102A] text-white shadow-md'
                : 'text-stone-600 hover:text-[#72102A] hover:bg-[#F5E6EA]/50'
            }`}
          >
            <Icon name="documentText" className="w-4 h-4" />
            Question Type Assignments ({filteredAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'teachers'
                ? 'bg-[#72102A] text-white shadow-md'
                : 'text-stone-600 hover:text-[#72102A] hover:bg-[#F5E6EA]/50'
            }`}
          >
            <Icon name="user" className="w-4 h-4" />
            Teacher List ({filteredTeachers.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'logs'
                ? 'bg-[#72102A] text-white shadow-md'
                : 'text-stone-600 hover:text-[#72102A] hover:bg-[#F5E6EA]/50'
            }`}
          >
            <Icon name="clock" className="w-4 h-4" />
            Activity Logs ({filteredLogs.length})
          </button>
        </div>
      </div>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <div className="p-3 rounded-xl bg-[#FDF8E8] border border-[#C9A84C]/30 text-xs text-stone-700 italic">
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
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          {/* TEACHER LIST FILTER CONTROLS BAR */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#F5E6EA] text-[#72102A] border border-[#E6C4CD]">
                <Icon name="filter" className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                  Filter Faculty Directory
                  {(teacherDeptFilter !== 'All' || teacherDesignationFilter !== 'All' || teacherSubjectFilter !== 'All') && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#72102A] text-white">
                      Filtered ({filteredTeachers.length} shown)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-500">Filter teachers by department, designation, or subject taught</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-2xl">
              {/* Department Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Department</label>
                <select
                  value={teacherDeptFilter}
                  onChange={(e) => setTeacherDeptFilter(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#72102A] cursor-pointer"
                >
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                  ))}
                </select>
              </div>

              {/* Designation Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Designation</label>
                <select
                  value={teacherDesignationFilter}
                  onChange={(e) => setTeacherDesignationFilter(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#72102A] cursor-pointer"
                >
                  {uniqueDesignations.map(desig => (
                    <option key={desig} value={desig}>{desig === 'All' ? 'All Designations' : desig}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Subject Taught</label>
                <select
                  value={teacherSubjectFilter}
                  onChange={(e) => setTeacherSubjectFilter(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#72102A] cursor-pointer"
                >
                  {uniqueTeacherSubjects.map(sub => (
                    <option key={sub} value={sub}>{sub === 'All' ? 'All Subjects' : sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {(teacherDeptFilter !== 'All' || teacherDesignationFilter !== 'All' || teacherSubjectFilter !== 'All') && (
              <button
                onClick={() => {
                  setTeacherDeptFilter('All');
                  setTeacherDesignationFilter('All');
                  setTeacherSubjectFilter('All');
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-all shrink-0 self-end md:self-center"
              >
                Clear Filters
              </button>
            )}
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
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#72102A] text-white text-xs font-semibold hover:bg-[#8B1F3A] transition-all"
              >
                Reset All Filters & Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map(teacher => (
                <div
                  key={teacher.id}
                  className="bg-white border border-stone-200 hover:border-[#C9A84C] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Teacher Avatar & Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#72102A]/20"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[#1A1A1A] text-base truncate">{teacher.name}</h3>
                        <p className="text-xs text-stone-500 truncate">{teacher.designation}</p>
                        <span className="inline-block text-xs text-[#72102A] font-semibold mt-0.5">
                          {teacher.department}
                        </span>
                      </div>
                    </div>

                    {/* Subjects Badges */}
                    <div className="mb-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">
                        Assigned Subjects
                      </p>
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
                  </div>

                  {/* Assign Task Button */}
                  <button
                    onClick={() => handleOpenModal(teacher)}
                    className="w-full mt-2 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5E6EA] border border-stone-200 hover:border-[#E6C4CD] text-[#72102A] text-xs font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Icon name="clipboard" className="w-4 h-4 text-[#72102A]" />
                    Assign Task to Teacher
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: ACTIVITY LOGS */}
      {/* ========================================== */}
      {activeTab === 'logs' && (
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
      {/* MODAL: CREATE NEW TEACHER ASSIGNMENT */}
      {/* ========================================== */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-3xl md:max-w-4xl w-full p-6 sm:p-8 md:p-10 shadow-2xl relative max-h-[92vh] overflow-y-auto text-[#1A1A1A]">
            {/* Close Button */}
            <button
              onClick={() => setIsAssignmentModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-[#FAF8F5] text-stone-400 hover:text-stone-700 transition-colors border border-stone-200"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>

            {/* STEP 1: CHOICE SELECTION (ASK 2 QUESTIONS / MODES) */}
            {assignmentStep === 'selectOption' && (
              <div>
                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-stone-200">
                  <div className="p-3 bg-[#F5E6EA] border border-[#E6C4CD] rounded-xl text-[#72102A]">
                    <Icon name="clipboard" className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Create Teacher Assignment</h2>
                    <p className="text-sm text-stone-500 mt-0.5">Select how you want to structure this assignment for faculty members</p>
                  </div>
                </div>

                <div className="my-6 space-y-4">
                  {/* CHOICE 1: ADD QUESTION TYPE ASSIGNMENT */}
                  <button
                    onClick={() => setAssignmentStep('questionTypeForm')}
                    className="w-full text-left p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-[#72102A] hover:bg-[#FDF5F7] transition-all group flex items-start gap-5 shadow-sm"
                  >
                    <div className="p-3.5 rounded-xl bg-[#F5E6EA] border border-[#E6C4CD] text-[#72102A] group-hover:scale-105 transition-transform flex-shrink-0">
                      <Icon name="documentText" className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#1A1A1A] text-lg group-hover:text-[#72102A] transition-colors">
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
                    className="w-full text-left p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-[#C9A84C] hover:bg-[#FDF8E8] transition-all group flex items-start gap-5 shadow-sm"
                  >
                    <div className="p-3.5 rounded-xl bg-[#FDF8E8] border border-[#C9A84C]/40 text-[#A68A3D] group-hover:scale-105 transition-transform flex-shrink-0">
                      <Icon name="questionMarkCircle" className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#1A1A1A] text-lg group-hover:text-[#A68A3D] transition-colors">
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
                <button
                  onClick={() => setAssignmentStep('selectOption')}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#72102A] mb-4 transition-colors font-medium"
                >
                  <Icon name="arrowLeft" className="w-4 h-4" />
                  Back to options
                </button>

                <div className="mb-6 pb-4 border-b border-stone-200">
                  <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Icon name="documentText" className="w-6 h-6 text-[#72102A]" />
                    {editingAssignment ? 'Edit Question Type Assignment' : 'Add Question Type Assignment'}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {editingAssignment ? 'Modify configuration for this assignment.' : 'Structure assignment by specifying allowed question formats, subject blueprints, and mapped teachers.'}
                  </p>
                </div>

                <form onSubmit={handleSaveQuestionTypeAssignment} className="space-y-6">
                  {/* Responsive 2-column grid for Class / Program & Subject selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Select Class / Program */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                        1. Select Class / Program
                      </label>
                      <select
                        name="program"
                        value={selectedProgram}
                        onChange={handleProgramChange}
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] cursor-pointer"
                      >
                        {Object.keys(PROGRAM_SUBJECT_MAP).map(prog => (
                          <option key={prog} value={prog}>{prog}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Select Subject / Course */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                        2. Select Subject / Course
                      </label>
                      <select
                        name="subject"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] cursor-pointer font-medium"
                      >
                        {(PROGRAM_SUBJECT_MAP[selectedProgram] || []).map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. Loaded Exam Question Blueprint */}
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

                  {/* 4. Mapped Teachers Button & Selection Preview */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">
                      4. Mapped Teachers
                    </label>
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-stone-300 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5E6EA] text-[#72102A] flex items-center justify-center border border-[#E6C4CD] flex-shrink-0">
                          <Icon name="users" className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1A1A1A]">
                              {selectedTeacherIds.length} of {mappedTeachers.length} Mapped Teachers Selected
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5E6EA] text-[#72102A] border border-[#E6C4CD]">
                              Pre-selected
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex -space-x-2 overflow-hidden">
                              {teachers
                                .filter(t => selectedTeacherIds.includes(t.id))
                                .slice(0, 4)
                                .map(t => (
                                  <img
                                    key={t.id}
                                    src={t.avatar}
                                    alt={t.name}
                                    title={t.name}
                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                  />
                                ))}
                            </div>
                            <p className="text-xs text-stone-500 truncate max-w-xs sm:max-w-md">
                              {selectedTeacherIds.length === 0
                                ? 'No teachers selected'
                                : teachers
                                    .filter(t => selectedTeacherIds.includes(t.id))
                                    .map(t => t.name)
                                    .join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTeacherPickerSearch('');
                          setTeacherPickerFilter('mapped');
                          setIsTeacherPickerOpen(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#5C0C21] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 flex-shrink-0"
                      >
                        <Icon name="users" className="w-4 h-4 text-white" />
                        <span>Select Mapped Teachers</span>
                        <span className="bg-[#C9A84C] text-[#1A1A1A] px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                          {selectedTeacherIds.length}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Question Types Checkboxes */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">Select Question Types</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {['Multiple Choice (MCQ)', 'Essay', 'Short Answer', 'True / False', 'Coding Task'].map(type => (
                        <label
                          key={type}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                            selectedQuestionTypes.includes(type)
                              ? 'bg-[#F5E6EA] text-[#72102A] border-[#E6C4CD]'
                              : 'bg-[#FAF8F5] text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedQuestionTypes.includes(type)}
                            onChange={() => toggleQuestionType(type)}
                            className="w-4 h-4 rounded accent-[#72102A] cursor-pointer"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Question Count & Instructions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Question Count */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Total Question Count</label>
                      <input
                        type="number"
                        name="questionCount"
                        defaultValue={editingAssignment ? editingAssignment.questionCount : "15"}
                        min="1"
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A]"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Instructions & Guidelines</label>
                      <textarea
                        name="instructions"
                        rows="3"
                        defaultValue={editingAssignment ? editingAssignment.instructions || "" : ""}
                        placeholder="e.g. Prepare 10 MCQs and 5 Essay questions for the upcoming midterm exam..."
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-stone-200 mt-6">
                    <button
                      type="button"
                      onClick={() => setAssignmentStep('selectOption')}
                      className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white text-sm font-semibold transition-all shadow-md shadow-[#72102A]/20"
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
                <button
                  onClick={() => setAssignmentStep('selectOption')}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#72102A] mb-4 transition-colors font-medium"
                >
                  <Icon name="arrowLeft" className="w-4 h-4" />
                  Back to options
                </button>

                <div className="mb-6 pb-4 border-b border-stone-200">
                  <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Icon name="questionMarkCircle" className="w-6 h-6 text-[#A68A3D]" />
                    {editingAssignment ? 'Edit Question Assignment' : 'Add Question Assignment'}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {editingAssignment ? 'Modify assigned questions, marks, or target teacher.' : 'Select specific questions from the bank and assign them directly to a teacher.'}
                  </p>
                </div>

                <form onSubmit={handleSaveQuestionAssignment} className="space-y-6">
                  {/* Grid for Program & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Select Class / Program */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                        1. Select Class / Program
                      </label>
                      <select
                        name="program"
                        value={selectedProgram}
                        onChange={handleProgramChange}
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] cursor-pointer"
                      >
                        {Object.keys(PROGRAM_SUBJECT_MAP).map(prog => (
                          <option key={prog} value={prog}>{prog}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Select Subject / Course */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                        2. Select Subject / Course
                      </label>
                      <select
                        name="subject"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] cursor-pointer font-medium"
                      >
                        {(PROGRAM_SUBJECT_MAP[selectedProgram] || []).map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. Select Teacher */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">3. Assign To Teacher</label>
                    <select
                      name="teacherId"
                      defaultValue={selectedTeacherForAssignment ? selectedTeacherForAssignment.id : teachers[0].id}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] cursor-pointer font-medium"
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.department} - {t.designation})</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Specific Questions from Question Bank */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">
                      Select Questions from Question Bank ({selectedQuestionIds.length} selected)
                    </label>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {QUESTION_BANK_ITEMS.map(q => (
                        <label
                          key={q.id}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                            selectedQuestionIds.includes(q.id)
                              ? 'bg-[#FDF8E8] text-stone-900 border-[#C9A84C]/50 shadow-xs'
                              : 'bg-[#FAF8F5] text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedQuestionIds.includes(q.id)}
                            onChange={() => toggleQuestionId(q.id)}
                            className="w-4 h-4 rounded accent-[#A68A3D] cursor-pointer mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono font-bold text-[#72102A] text-xs">{q.id}</span>
                              <span className="text-[10px] bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded font-semibold">
                                {q.type}
                              </span>
                            </div>
                            <p className="text-[#1A1A1A] font-semibold">{q.title}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Marks & Evaluation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Total Marks */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Total Assigned Marks</label>
                      <input
                        type="number"
                        name="totalMarks"
                        defaultValue={editingAssignment ? editingAssignment.totalMarks : "50"}
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A]"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Evaluation Instructions</label>
                      <textarea
                        name="instructions"
                        rows="2"
                        defaultValue={editingAssignment ? editingAssignment.instructions || "" : ""}
                        placeholder="e.g. Please review student solution submissions for these questions..."
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#72102A] resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-stone-200 mt-6">
                    <button
                      type="button"
                      onClick={() => setAssignmentStep('selectOption')}
                      className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#72102A] hover:bg-[#8B1F3A] text-white text-sm font-semibold transition-all shadow-md shadow-[#72102A]/20"
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
