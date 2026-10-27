import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../common/Icon.jsx';
import { TYPE_BADGES } from '../../data/mockQuestions.js';

function VersionInfo() {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, placeAbove: false, arrowLeft: 20 });
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const closeTimerRef = useRef(null);

  const POPOVER_WIDTH = 290;

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Place above if space below is tight (< 190px) and there's more space above
    const placeAbove = spaceBelow < 190 && spaceAbove > 160;

    const iconCenterX = rect.left + rect.width / 2;
    const minLeft = 12;
    const maxLeft = Math.max(minLeft, window.innerWidth - POPOVER_WIDTH - 12);
    let left = iconCenterX - POPOVER_WIDTH / 2;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    // Arrow position relative to the popover card
    const arrowLeft = Math.max(14, Math.min(iconCenterX - left - 5, POPOVER_WIDTH - 24));

    setPosition({
      top: placeAbove ? rect.top - 8 : rect.bottom + 8,
      left,
      placeAbove,
      arrowLeft,
    });
  }, []);

  const handleOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    updatePosition();
    setShow(true);
  };

  const handleCloseDelayed = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setShow(false);
    }, 150);
  };

  const handleToggle = () => {
    if (show) {
      setShow(false);
    } else {
      handleOpen();
    }
  };

  // Re-calculate on resize / scroll and handle outside clicks
  useEffect(() => {
    if (!show) return;
    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShow(false);
    };

    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [show, updatePosition]);

  return (
    <>
      <span className="relative inline-flex items-center ml-1.5 normal-case font-normal tracking-normal align-middle">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          onMouseEnter={handleOpen}
          onMouseLeave={handleCloseDelayed}
          onFocus={handleOpen}
          onBlur={handleCloseDelayed}
          aria-label="Edit history info"
          className="p-0.5 rounded text-gray-400 hover:text-[#72102a] hover:bg-[#72102a]/5 transition-colors focus:outline-none"
        >
          <Icon name="info" className="w-3.5 h-3.5" />
        </button>
      </span>

      {show &&
        createPortal(
          <div
            ref={popoverRef}
            role="tooltip"
            onMouseEnter={handleOpen}
            onMouseLeave={handleCloseDelayed}
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: position.placeAbove ? 'translateY(-100%)' : 'none',
              width: `${POPOVER_WIDTH}px`,
              zIndex: 9999,
            }}
            className="select-none"
          >
            <div
              className="relative bg-white rounded-xl border p-3.5 text-xs text-gray-700"
              style={{
                borderColor: '#E8E2D9',
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 6px 12px -2px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Arrow pointing toward the info icon */}
              <div
                style={{
                  position: 'absolute',
                  left: `${position.arrowLeft}px`,
                  [position.placeAbove ? 'bottom' : 'top']: '-5px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ffffff',
                  borderTop: position.placeAbove ? 'none' : '1px solid #E8E2D9',
                  borderLeft: position.placeAbove ? 'none' : '1px solid #E8E2D9',
                  borderBottom: position.placeAbove ? '1px solid #E8E2D9' : 'none',
                  borderRight: position.placeAbove ? '1px solid #E8E2D9' : 'none',
                  transform: 'rotate(45deg)',
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-gray-100">
                <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: '#72102a' }}>
                  <span>📋</span>
                  <span>Edit History</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
                  aria-label="Close popover"
                >
                  <Icon name="close" className="w-3 h-3" />
                </button>
              </div>

              {/* Description */}
              <div className="text-[11.5px] text-gray-600 leading-relaxed whitespace-normal break-words space-y-1.5">
                <p>
                  Every question starts at <strong className="font-semibold text-gray-900">v1.0</strong>.
                </p>
                <p>
                  Editing and saving automatically increments the edit history — e.g.{' '}
                  <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-[11px] font-mono text-gray-800">
                    v1.0 → v1.1 → v1.2
                  </span>.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[10.5px] text-gray-400">
                <Icon name="history" className="w-3 h-3 text-teal-600 flex-shrink-0" />
                <span>Full history tracked in Activity Ledger</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default function QuestionTable({ questions, onOpenModal, onOpenEdit }) {
  return (
    <div
      className="bg-white rounded-xl border shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden"
      style={{ borderColor: '#E8E2D9' }}
    >
      <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="text-gray-500 uppercase tracking-wide text-[11px]">
              <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>ID</th>
              <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Class</th>
              <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Subject</th>
              <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Chapter</th>
              <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Question Type</th>
              <th className="px-4 py-3 min-w-[200px] max-w-xs bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Question</th>
              <th className="px-4 py-3 whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Marks</th>
              <th className="px-4 py-3 text-center whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>No. of Edits</th>
              <th className="px-4 py-3 text-center whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Actions</th>
              <th className="px-4 py-3 text-center whitespace-nowrap bg-[#FBF9F6]" style={{ boxShadow: 'inset 0 -1px 0 #E8E2D9' }}>Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q) => (
              <tr
                key={q.id}
                className="hover:bg-[#fdf5f6] transition-colors cursor-pointer"
                onClick={() => onOpenModal('details', q)}
                title="Click to view question details"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono font-bold text-gray-700">{q.id}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {q.class || q.grade || '—'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                  {q.subject}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[160px]">
                  <span className="line-clamp-2" title={q.chapter}>{q.chapter}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {TYPE_BADGES[q.type]?.label || q.type}
                </td>
                <td className="px-4 py-3 min-w-[200px] max-w-xs">
                  <p className="text-gray-700 line-clamp-2">{q.questionText}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                  {q.marks}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700 font-semibold">
                  {q.history?.length ?? 0}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenEdit(q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-amber-700 border border-amber-200 bg-amber-50/40 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 text-[11px] font-semibold cursor-pointer"
                      title="Edit Question"
                    >
                      <Icon name="edit" className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => onOpenModal('history', q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-teal-700 border border-teal-200 bg-teal-50/40 hover:bg-teal-100 hover:border-teal-300 hover:text-teal-800 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 text-[11px] font-semibold cursor-pointer"
                      title="Activity History"
                    >
                      <Icon name="history" className="w-3 h-3" />
                      History
                    </button>
                    <button
                      onClick={() => onOpenModal('delete', q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-red-600 border border-red-200 bg-red-50/40 hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 text-[11px] font-semibold cursor-pointer"
                      title="Delete Question"
                    >
                      <Icon name="trash" className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenModal('details', q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[#72102a] border border-[#72102a]/30 bg-[#72102a]/5 hover:bg-[#72102a]/15 hover:border-[#72102a]/50 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 text-[11px] font-semibold cursor-pointer"
                      title="View Details"
                    >
                      <Icon name="eye" className="w-3 h-3" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
