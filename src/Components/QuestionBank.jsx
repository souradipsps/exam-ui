import React, { useState, useMemo, useRef, useEffect } from 'react';
import TopBar from './layout/TopBar.jsx';
import Sidebar from './layout/Sidebar.jsx';
import ComingSoonPlaceholder from './layout/ComingSoonPlaceholder.jsx';
import QuestionFilters from './question-bank/QuestionFilters.jsx';
import Pagination from './question-bank/Pagination.jsx';
import QuestionTable from './question-bank/QuestionTable.jsx';
import QuestionDetailsModal from './modals/QuestionDetailsModal.jsx';
import QuestionEditModal from './modals/QuestionEditModal.jsx';
import QuestionHistoryModal from './modals/QuestionHistoryModal.jsx';
import QuestionDeleteModal from './modals/QuestionDeleteModal.jsx';
import Icon from './common/Icon.jsx';
import { INITIAL_QUESTIONS } from '../data/mockQuestions.js';
import { NAV_ITEMS } from '../data/navigation.js';
import TeacherManagement from './TeacherManagement.jsx';

export default function QuestionBank() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterChapter, setFilterChapter] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterMarks, setFilterMarks] = useState('All');
  const [activeNav, setActiveNav] = useState('questionBank');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [modal, setModal] = useState(null); // 'details' | 'edit' | 'history' | 'delete'
  const [current, setCurrent] = useState(null);
  const [toast, setToast] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const navButtonRefs = useRef([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const openModal = (type, q) => {
    setCurrent(q);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setCurrent(null);
  };

  // Keyboard navigation for sidebar (ArrowUp, ArrowDown, Home, End)
  const handleNavKeyDown = (e, index) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % NAV_ITEMS.length;
      navButtonRefs.current[nextIndex]?.focus();
      setActiveNav(NAV_ITEMS[nextIndex].id);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + NAV_ITEMS.length) % NAV_ITEMS.length;
      navButtonRefs.current[prevIndex]?.focus();
      setActiveNav(NAV_ITEMS[prevIndex].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      navButtonRefs.current[0]?.focus();
      setActiveNav(NAV_ITEMS[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      navButtonRefs.current[NAV_ITEMS.length - 1]?.focus();
      setActiveNav(NAV_ITEMS[NAV_ITEMS.length - 1].id);
    }
  };

  // Global hotkeys: Alt + 1..6 jumps directly to sidebar sections
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }
      if (e.altKey && e.key >= '1' && e.key <= String(NAV_ITEMS.length)) {
        e.preventDefault();
        const targetIndex = Number(e.key) - 1;
        if (NAV_ITEMS[targetIndex]) {
          setActiveNav(NAV_ITEMS[targetIndex].id);
          navButtonRefs.current[targetIndex]?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const s = searchTerm.toLowerCase();
      const matchSearch =
        q.questionText.toLowerCase().includes(s) ||
        q.id.toLowerCase().includes(s) ||
        q.chapter.toLowerCase().includes(s) ||
        q.author.toLowerCase().includes(s);
      return (
        matchSearch &&
        (filterClass === 'All' || q.class === filterClass || q.grade === filterClass) &&
        (filterSubject === 'All' || q.subject === filterSubject) &&
        (filterChapter === 'All' || q.chapter === filterChapter) &&
        (filterType === 'All' || q.type === filterType) &&
        (filterMarks === 'All' || String(q.marks) === filterMarks)
      );
    });
  }, [questions, searchTerm, filterClass, filterSubject, filterChapter, filterType, filterMarks]);

  // Reset to first page when any search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterClass, filterSubject, filterChapter, filterType, filterMarks]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedQuestions = filtered.slice(startIndex, startIndex + pageSize);

  // Edit Handlers
  const handleOpenEdit = (q) => {
    setEditForm({ ...q, options: q.options ? JSON.parse(JSON.stringify(q.options)) : [], changelogNote: '' });
    openModal('edit', q);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const parts = editForm.version.replace('v', '').split('.').map(Number);
    const newVer = `v${parts[0]}.${(parts[1] || 0) + 1}`;
    const updated = {
      ...editForm,
      version: newVer,
      history: [
        { action: 'Edit History', date: new Date().toLocaleString(), user: 'System', note: `Updated to ${newVer}` },
        { action: 'Edited', date: new Date().toLocaleString(), user: 'Teacher', note: editForm.changelogNote || 'Updated content.' },
        ...(editForm.history || []),
      ],
    };
    setQuestions((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    closeModal();
    showToast(`✓ Question ${updated.id} saved as ${newVer}`);
  };

  // Delete Handler
  const handleConfirmDelete = () => {
    if (!current) return;
    setQuestions((prev) => prev.filter((q) => q.id !== current.id));
    closeModal();
    showToast(`✓ Question ${current.id} deleted.`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterClass('All');
    setFilterSubject('All');
    setFilterChapter('All');
    setFilterType('All');
    setFilterMarks('All');
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#faf8f5',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Top Bar Header */}
      <TopBar />

      {/* Main Body */}
      <div style={{ display: 'flex', flex: '1 1 0%', minHeight: '0px', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          navButtonRefs={navButtonRefs}
          handleNavKeyDown={handleNavKeyDown}
        />

        {/* Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="animate-fade-in-up"
          style={{
            flex: '1 1 0%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '0px',
            overflow: 'hidden',
            padding: '20px 32px',
            outline: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 0%',
              minHeight: '0px',
              gap: '14px',
            }}
          >
            {/* Toast Notification */}
            {toast && (
              <div className="fixed top-16 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-sm font-medium">
                <Icon name="check" className="w-4 h-4" />
                {toast}
              </div>
            )}

            {/* ── QUESTION BANK VIEW ── */}
            {activeNav === 'questionBank' && (
              <>
                {/* ── Page Header: Title & Subtitle ── */}
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
                    Question Bank
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
                    All sanctioned questions across subjects and classes
                  </p>
                </div>

                {/* ── Summary Cards (4 Compact Cards: Questions, Subjects, Types, Last Updated) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Questions',
                      value: questions.length,
                      color: '#72102a',
                      onClick: handleResetFilters,
                      tooltip: 'Total questions in repository (Click to view all)',
                    },
                    {
                      label: 'Subjects',
                      value: [...new Set(questions.map((q) => q.subject).filter(Boolean))].length,
                      color: '#059669',
                      tooltip: 'Total academic subjects covered',
                    },
                    {
                      label: 'Question Types',
                      value: [...new Set(questions.map((q) => q.type).filter(Boolean))].length,
                      color: '#7a422bff',
                      tooltip: 'Unique question formats and types',
                    },
                    {
                      label: 'Last Updated',
                      value: 'Today',
                      color: '#0f766e',
                      tooltip: 'Latest question bank activity recorded',
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      onClick={stat.onClick}
                      className={`bg-white rounded-xl border border-[#E8E2D9] px-5 py-3.5 transition-all duration-150 shadow-sm flex flex-col justify-center ${stat.onClick ? 'cursor-pointer hover:shadow-md hover:border-[#72102a]/40' : 'hover:shadow'
                        }`}
                      title={stat.tooltip}
                    >
                      <div
                        className="text-2xl md:text-3xl font-extrabold leading-none mb-1.5 tracking-tight"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs font-semibold text-gray-700">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Search & Filter Controls */}
                <div className="flex-shrink-0">
                  <QuestionFilters
                    questions={questions}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterClass={filterClass}
                    setFilterClass={setFilterClass}
                    filterSubject={filterSubject}
                    setFilterSubject={setFilterSubject}
                    filterChapter={filterChapter}
                    setFilterChapter={setFilterChapter}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    filterMarks={filterMarks}
                    setFilterMarks={setFilterMarks}
                  />
                </div>

                {/* Questions Display — Table only with paginated subset */}
                <QuestionTable
                  questions={paginatedQuestions}
                  onOpenModal={openModal}
                  onOpenEdit={handleOpenEdit}
                />

                {/* Bottom Full-Featured Pagination Bar */}
                {filtered.length > 0 && (
                  <div className="flex-shrink-0">
                    <Pagination
                      totalItems={filtered.length}
                      pageSize={pageSize}
                      onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                      }}
                      currentPage={safeCurrentPage}
                      onPageChange={setCurrentPage}
                      pageSizeOptions={[5, 10, 20, 50]}
                      totalUnfiltered={questions.length}
                      isFiltered={filtered.length !== questions.length}
                    />
                  </div>
                )}

                {/* Empty State */}
                {filtered.length === 0 && (
                  <div className="bg-white rounded-xl border p-12 text-center shadow-sm flex-1 flex flex-col items-center justify-center min-h-0" style={{ borderColor: '#E8E2D9' }}>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Icon name="search" className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">No questions found</h3>
                    <p className="text-xs text-gray-400 mb-4">Try adjusting your search or filter criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
                      style={{ backgroundColor: '#72102a' }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── TEACHER MANAGEMENT VIEW ── */}
            {activeNav === 'teacherManagement' && (
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <TeacherManagement />
              </div>
            )}

            {/* ── COMING SOON VIEW FOR OTHER SECTIONS ── */}
            {activeNav !== 'questionBank' && activeNav !== 'teacherManagement' && (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ComingSoonPlaceholder activeNav={activeNav} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {modal === 'details' && (
        <QuestionDetailsModal
          current={current}
          onClose={closeModal}
          onOpenEdit={handleOpenEdit}
          onOpenHistory={(q) => openModal('history', q)}
          onOpenDelete={(q) => openModal('delete', q)}
        />
      )}

      {modal === 'edit' && (
        <QuestionEditModal
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSaveEdit}
          onClose={closeModal}
        />
      )}

      {modal === 'history' && (
        <QuestionHistoryModal
          current={current}
          onClose={closeModal}
        />
      )}

      {modal === 'delete' && (
        <QuestionDeleteModal
          current={current}
          onConfirm={handleConfirmDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
