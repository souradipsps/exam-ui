import React, { useMemo } from 'react';
import Icon from '../common/Icon.jsx';

function getOptionLabel(label, option) {
  if (option === 'All') {
    if (label === 'Marks') return 'All Marks';
    if (label === 'Class') return 'All Classes';
    if (label === 'Chapter') return 'All Chapters';
    if (label === 'Types' || label === 'Type') return 'All Types';
    return `All ${label}s`;
  }
  if (label === 'Marks') {
    return `${option} Mark${option === '1' ? '' : 's'}`;
  }
  return option;
}

export default function QuestionFilters({
  questions = [],
  searchTerm,
  setSearchTerm,
  filterClass = 'All',
  setFilterClass,
  filterSubject = 'All',
  setFilterSubject,
  filterChapter = 'All',
  setFilterChapter,
  filterType = 'All',
  setFilterType,
  filterMarks = 'All',
  setFilterMarks,
}) {
  const currentClass = filterClass;
  const setClass = setFilterClass;

  // 1. CLASS options (chain step 1)
  const classOptions = useMemo(() => {
    const set = new Set();
    questions.forEach((q) => {
      const c = q.class || q.grade;
      if (c) set.add(c);
    });
    const list = Array.from(set).sort();
    return ['All', ...(list.length ? list : ['Class 9', 'Class 10', 'Class 11', 'Class 12'])];
  }, [questions]);

  // 2. SUBJECT options (chain step 2: depends on selected Class)
  const subjectOptions = useMemo(() => {
    const set = new Set();
    questions
      .filter((q) => currentClass === 'All' || q.class === currentClass || q.grade === currentClass)
      .forEach((q) => {
        if (q.subject) set.add(q.subject);
      });
    const list = Array.from(set).sort();
    return ['All', ...(list.length ? list : ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English Literature'])];
  }, [questions, currentClass]);

  // 3. CHAPTER options (chain step 3: depends on Class and Subject)
  const chapterOptions = useMemo(() => {
    const set = new Set();
    questions
      .filter((q) => {
        const matchClass = currentClass === 'All' || q.class === currentClass || q.grade === currentClass;
        const matchSubject = filterSubject === 'All' || q.subject === filterSubject;
        return matchClass && matchSubject;
      })
      .forEach((q) => {
        if (q.chapter) set.add(q.chapter);
      });
    const list = Array.from(set).sort();
    return ['All', ...list];
  }, [questions, currentClass, filterSubject]);

  // 4. TYPES options (chain step 4: depends on Class, Subject, Chapter)
  const typeOptions = useMemo(() => {
    const set = new Set();
    questions
      .filter((q) => {
        const matchClass = currentClass === 'All' || q.class === currentClass || q.grade === currentClass;
        const matchSubject = filterSubject === 'All' || q.subject === filterSubject;
        const matchChapter = filterChapter === 'All' || q.chapter === filterChapter;
        return matchClass && matchSubject && matchChapter;
      })
      .forEach((q) => {
        if (q.type) set.add(q.type);
      });
    const list = Array.from(set).sort();
    return ['All', ...(list.length ? list : ['Multiple Choice (MCQ)', 'Short Answer', 'Long Essay / Problem', 'Assertion & Reasoning', 'True / False'])];
  }, [questions, currentClass, filterSubject, filterChapter]);

  // 5. MARKS options (chain step 5: depends on Class, Subject, Chapter, Type)
  const marksOptions = useMemo(() => {
    const set = new Set();
    questions
      .filter((q) => {
        const matchClass = currentClass === 'All' || q.class === currentClass || q.grade === currentClass;
        const matchSubject = filterSubject === 'All' || q.subject === filterSubject;
        const matchChapter = filterChapter === 'All' || q.chapter === filterChapter;
        const matchType = filterType === 'All' || q.type === filterType;
        return matchClass && matchSubject && matchChapter && matchType;
      })
      .forEach((q) => {
        if (q.marks !== undefined && q.marks !== null) set.add(String(q.marks));
      });
    const list = Array.from(set).sort((a, b) => Number(a) - Number(b));
    return ['All', ...(list.length ? list : ['1', '2', '3', '5'])];
  }, [questions, currentClass, filterSubject, filterChapter, filterType]);

  // Cascading change handlers to prune downstream filters
  const handleClassChange = (newClass) => {
    if (setClass) setClass(newClass);

    const matchingQs = questions.filter(
      (q) => newClass === 'All' || q.class === newClass || q.grade === newClass
    );
    const validSubjects = new Set(matchingQs.map((q) => q.subject));
    if (filterSubject !== 'All' && !validSubjects.has(filterSubject)) {
      setFilterSubject('All');
      if (setFilterChapter) setFilterChapter('All');
      setFilterType('All');
      setFilterMarks('All');
      return;
    }

    const validChapters = new Set(
      matchingQs
        .filter((q) => filterSubject === 'All' || q.subject === filterSubject)
        .map((q) => q.chapter)
    );
    if (filterChapter !== 'All' && !validChapters.has(filterChapter)) {
      if (setFilterChapter) setFilterChapter('All');
      setFilterType('All');
      setFilterMarks('All');
      return;
    }

    const validTypes = new Set(
      matchingQs
        .filter(
          (q) =>
            (filterSubject === 'All' || q.subject === filterSubject) &&
            (filterChapter === 'All' || q.chapter === filterChapter)
        )
        .map((q) => q.type)
    );
    if (filterType !== 'All' && !validTypes.has(filterType)) {
      setFilterType('All');
      setFilterMarks('All');
      return;
    }

    const validMarks = new Set(
      matchingQs
        .filter(
          (q) =>
            (filterSubject === 'All' || q.subject === filterSubject) &&
            (filterChapter === 'All' || q.chapter === filterChapter) &&
            (filterType === 'All' || q.type === filterType)
        )
        .map((q) => String(q.marks))
    );
    if (filterMarks !== 'All' && !validMarks.has(filterMarks)) {
      setFilterMarks('All');
    }
  };

  const handleSubjectChange = (newSubject) => {
    setFilterSubject(newSubject);

    const matchingQs = questions.filter(
      (q) =>
        (currentClass === 'All' || q.class === currentClass || q.grade === currentClass) &&
        (newSubject === 'All' || q.subject === newSubject)
    );
    const validChapters = new Set(matchingQs.map((q) => q.chapter));
    if (filterChapter !== 'All' && !validChapters.has(filterChapter)) {
      if (setFilterChapter) setFilterChapter('All');
      setFilterType('All');
      setFilterMarks('All');
      return;
    }

    const validTypes = new Set(
      matchingQs
        .filter((q) => filterChapter === 'All' || q.chapter === filterChapter)
        .map((q) => q.type)
    );
    if (filterType !== 'All' && !validTypes.has(filterType)) {
      setFilterType('All');
      setFilterMarks('All');
      return;
    }

    const validMarks = new Set(
      matchingQs
        .filter(
          (q) =>
            (filterChapter === 'All' || q.chapter === filterChapter) &&
            (filterType === 'All' || q.type === filterType)
        )
        .map((q) => String(q.marks))
    );
    if (filterMarks !== 'All' && !validMarks.has(filterMarks)) {
      setFilterMarks('All');
    }
  };

  const handleChapterChange = (newChapter) => {
    if (setFilterChapter) setFilterChapter(newChapter);

    const matchingQs = questions.filter(
      (q) =>
        (currentClass === 'All' || q.class === currentClass || q.grade === currentClass) &&
        (filterSubject === 'All' || q.subject === filterSubject) &&
        (newChapter === 'All' || q.chapter === newChapter)
    );
    const validTypes = new Set(matchingQs.map((q) => q.type));
    if (filterType !== 'All' && !validTypes.has(filterType)) {
      setFilterType('All');
      setFilterMarks('All');
      return;
    }

    const validMarks = new Set(
      matchingQs
        .filter((q) => filterType === 'All' || q.type === filterType)
        .map((q) => String(q.marks))
    );
    if (filterMarks !== 'All' && !validMarks.has(filterMarks)) {
      setFilterMarks('All');
    }
  };

  const handleTypeChange = (newType) => {
    setFilterType(newType);

    const matchingQs = questions.filter(
      (q) =>
        (currentClass === 'All' || q.class === currentClass || q.grade === currentClass) &&
        (filterSubject === 'All' || q.subject === filterSubject) &&
        (filterChapter === 'All' || q.chapter === filterChapter) &&
        (newType === 'All' || q.type === newType)
    );
    const validMarks = new Set(matchingQs.map((q) => String(q.marks)));
    if (filterMarks !== 'All' && !validMarks.has(filterMarks)) {
      setFilterMarks('All');
    }
  };

  const handleMarksChange = (newMarks) => {
    setFilterMarks(newMarks);
  };

  // Filter chain configuration in exact requested sequence: CLASS > SUBJECT > CHAPTER > TYPES > MARKS
  const filterConfigs = [
    {
      label: 'Class',
      value: currentClass,
      set: handleClassChange,
      opts: classOptions,
      maxWidth: '140px',
    },
    {
      label: 'Subject',
      value: filterSubject,
      set: handleSubjectChange,
      opts: subjectOptions,
      maxWidth: '170px',
    },
    {
      label: 'Chapter',
      value: filterChapter,
      set: handleChapterChange,
      opts: chapterOptions,
      maxWidth: '220px',
    },
    {
      label: 'Types',
      value: filterType,
      set: handleTypeChange,
      opts: typeOptions,
      maxWidth: '170px',
    },
    {
      label: 'Marks',
      value: filterMarks,
      set: handleMarksChange,
      opts: marksOptions,
      maxWidth: '130px',
    },
  ];

  const activeFiltersCount = [currentClass, filterSubject, filterChapter, filterType, filterMarks].filter(
    (v) => v && v !== 'All'
  ).length;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #E8E2D9',
        borderRadius: '14px',
        padding: '16px 18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Icon
          name="search"
          className="w-4 h-4"
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search by question text, ID, chapter, or author…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '42px',
            paddingRight: searchTerm ? '40px' : '16px',
            paddingTop: '10px',
            paddingBottom: '10px',
            fontSize: '13px',
            color: '#1A1A1A',
            background: '#FAFAF9',
            border: '1.5px solid #E8E2D9',
            borderRadius: '10px',
            outline: 'none',
            transition: 'border-color 0.18s, box-shadow 0.18s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#72102a';
            e.target.style.boxShadow = '0 0 0 3px rgba(114,16,42,0.10)';
            e.target.style.background = '#ffffff';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E8E2D9';
            e.target.style.boxShadow = 'none';
            e.target.style.background = '#FAFAF9';
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Row - Chain: CLASS > SUBJECT > CHAPTER > TYPES > MARKS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginRight: '4px',
          }}
        >
          Filters
        </span>

        {filterConfigs.map((f, idx) => {
          const isActive = f.value !== 'All';
          return (
            <React.Fragment key={f.label}>
              {idx > 0 && (
                <span
                  style={{
                    color: '#D1D5DB',
                    fontSize: '11px',
                    fontWeight: 700,
                    userSelect: 'none',
                    padding: '0 1px',
                  }}
                  title="Chain sequence"
                >
                  ›
                </span>
              )}
              <select
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                title={`${f.label}: ${f.value}`}
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#72102a' : '#4B5563',
                  background: isActive ? 'rgba(114,16,42,0.07)' : '#F9F9F8',
                  border: `1.5px solid ${isActive ? 'rgba(114,16,42,0.3)' : '#E8E2D9'}`,
                  borderRadius: '999px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.15s',
                  boxShadow: isActive ? '0 0 0 3px rgba(114,16,42,0.08)' : 'none',
                  maxWidth: f.maxWidth || '180px',
                  textOverflow: 'ellipsis',
                }}
              >
                {f.opts.map((o) => (
                  <option key={o} value={o}>
                    {getOptionLabel(f.label, o)}
                  </option>
                ))}
              </select>
            </React.Fragment>
          );
        })}

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={() => {
              if (setClass) setClass('All');
              setFilterSubject('All');
              if (setFilterChapter) setFilterChapter('All');
              setFilterType('All');
              setFilterMarks('All');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              marginLeft: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#72102a',
              background: 'rgba(114,16,42,0.06)',
              border: '1.5px solid rgba(114,16,42,0.2)',
              borderRadius: '999px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(114,16,42,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(114,16,42,0.06)';
            }}
          >
            <Icon name="close" className="w-3 h-3" />
            Clear ({activeFiltersCount})
          </button>
        )}
      </div>
    </div>
  );
}
