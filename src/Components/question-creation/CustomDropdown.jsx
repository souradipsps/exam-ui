import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

export default function CustomDropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  variant = 'default', // 'default' | 'amber' | 'emerald' | 'maroon'
  searchable,
  align = 'left', // 'left' | 'right'
  rounded = 'xl', // 'xl' | 'full'
  className = '',
  menuClassName = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [menuStyle, setMenuStyle] = useState(null);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to objects: { value, label, icon, badge, dotColor, tone, description }
  const normalizedOptions = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === 'string'
          ? { value: opt, label: opt }
          : opt
      ),
    [options]
  );

  const selectedOption = useMemo(
    () => normalizedOptions.find((o) => o.value === value) || null,
    [normalizedOptions, value]
  );

  const showSearch = searchable !== undefined ? searchable : normalizedOptions.length > 6;

  const filteredOptions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return normalizedOptions;
    return normalizedOptions.filter(
      (o) =>
        o.label.toLowerCase().includes(term) ||
        (o.description && o.description.toLowerCase().includes(term))
    );
  }, [normalizedOptions, query]);

  // Calculate fixed viewport coordinates for the portal menu
  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const padding = 12;
    const gap = 6;
    const estimatedMenuHeight = Math.min(320, (showSearch ? 52 : 0) + normalizedOptions.length * 38 + 16);

    const spaceBelow = viewportH - rect.bottom - padding;
    const spaceAbove = rect.top - padding;
    const openUpward = spaceBelow < Math.min(estimatedMenuHeight, 220) && spaceAbove > spaceBelow;

    const minWidth = Math.max(rect.width, 190);
    const maxWidth = Math.min(310, viewportW - padding * 2);

    const style = {
      position: 'fixed',
      minWidth: `${minWidth}px`,
      maxWidth: `${maxWidth}px`,
      zIndex: 9999,
    };

    if (openUpward) {
      style.bottom = `${viewportH - rect.top + gap}px`;
      style.maxHeight = `${Math.max(160, Math.min(320, spaceAbove - gap))}px`;
    } else {
      style.top = `${rect.bottom + gap}px`;
      style.maxHeight = `${Math.max(160, Math.min(320, spaceBelow - gap))}px`;
    }

    if (align === 'right') {
      const rightOffset = Math.max(padding, viewportW - rect.right);
      // Ensure left side doesn't overflow viewport
      if (viewportW - rightOffset - minWidth < padding) {
        style.left = `${padding}px`;
      } else {
        style.right = `${rightOffset}px`;
      }
    } else {
      const leftOffset = Math.max(padding, Math.min(rect.left, viewportW - minWidth - padding));
      style.left = `${leftOffset}px`;
    }

    setMenuStyle(style);
  }, [align, showSearch, normalizedOptions.length]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
  }, [isOpen, updateMenuPosition]);

  // Keep menu anchored on scroll or resize
  useEffect(() => {
    if (!isOpen) return;
    const handleReposition = (e) => {
      if (e?.type === 'scroll' && menuRef.current && menuRef.current.contains(e.target)) return;
      updateMenuPosition();
    };
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, updateMenuPosition]);

  // Close on outside click (checking both trigger container and portal menu) or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      const clickedInContainer = containerRef.current && containerRef.current.contains(e.target);
      const clickedInMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!clickedInContainer && !clickedInMenu) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Focus search input and reset highlight when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      const currentIdx = normalizedOptions.findIndex((o) => o.value === value);
      setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
      if (showSearch) {
        setTimeout(() => searchInputRef.current?.focus(), 20);
      }
    }
  }, [isOpen, showSearch, normalizedOptions, value]);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filteredOptions.length === 0 ? -1 : (prev + 1) % filteredOptions.length
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filteredOptions.length === 0
          ? -1
          : (prev - 1 + filteredOptions.length) % filteredOptions.length
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex]);
    }
  };

  // Trigger styling by variant + open state
  const getTriggerStyles = () => {
    if (variant === 'amber') {
      return isOpen
        ? 'bg-[#FFFBEB] border-[#D97706] text-[#92400E] ring-2 ring-[#F59E0B]/20 shadow-xs'
        : 'bg-[#FFFBEB] border-[#F59E0B]/80 text-[#92400E] hover:border-[#D97706] hover:bg-[#FEF3C7]/60 shadow-[0_1px_2px_rgba(245,158,11,0.08)]';
    }
    if (variant === 'emerald') {
      return isOpen
        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
        : 'bg-emerald-50/70 border-emerald-300 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-50 shadow-[0_1px_2px_rgba(16,185,129,0.08)]';
    }
    if (variant === 'maroon') {
      return isOpen
        ? 'bg-[#FAF0F3] border-[#72102A] text-[#72102A] ring-2 ring-[#72102A]/15 shadow-xs'
        : 'bg-[#FAF0F3]/60 border-[#E6C4CD] text-[#72102A] hover:border-[#72102A]/60 hover:bg-[#FAF0F3]';
    }
    return isOpen
      ? 'bg-white border-[#72102A] text-stone-900 ring-2 ring-[#72102A]/12 shadow-xs'
      : 'bg-[#FAF9F7] border-stone-200/90 text-stone-800 hover:border-stone-300 hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
  };

  const getOptionToneClasses = (opt, isSelected, isHighlighted) => {
    if (isSelected) {
      if (opt.tone === 'amber') return 'bg-[#FEF3C7]/80 text-[#92400E] font-bold';
      if (opt.tone === 'emerald') return 'bg-emerald-50 text-emerald-800 font-bold';
      return 'bg-[#FAF0F3] text-[#72102A] font-bold';
    }
    if (isHighlighted) {
      return 'bg-stone-100/90 text-stone-900';
    }
    return 'text-stone-700 hover:bg-[#FAF5F6] hover:text-[#72102A]';
  };

  const menuContent =
    isOpen && menuStyle
      ? createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={menuStyle}
            className={`flex flex-col bg-white rounded-2xl border border-stone-200/90 shadow-[0_18px_44px_-8px_rgba(24,24,27,0.18),0_4px_14px_-2px_rgba(24,24,27,0.08)] overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
          >
            {/* Optional Search Box inside Dropdown */}
            {showSearch && (
              <div className="p-2 border-b border-stone-100 bg-stone-50/70 shrink-0">
                <div className="relative">
                  <svg
                    className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Filter options..."
                    className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-6 py-1.5 text-[11.5px] text-stone-800 placeholder-stone-400 outline-none focus:outline-none focus:border-[#72102A] focus:ring-2 focus:ring-[#72102A]/12 transition-all"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-[10px]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="p-1.5 overflow-y-auto flex-1 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-[11.5px] text-stone-400">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      onClick={() => handleSelect(opt)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors duration-100 cursor-pointer outline-none ${getOptionToneClasses(
                        opt,
                        isSelected,
                        isHighlighted
                      )}`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        {opt.icon && <span className="shrink-0 flex items-center">{opt.icon}</span>}
                        {opt.dotColor && (
                          <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate leading-snug">{opt.label}</span>
                          {opt.description && (
                            <span className="block text-[10px] font-normal text-stone-400 truncate mt-0.5">
                              {opt.description}
                            </span>
                          )}
                        </span>
                      </span>

                      {opt.badge !== undefined && opt.badge !== null && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none shrink-0 ${
                            isSelected
                              ? opt.tone === 'amber'
                                ? 'bg-[#D97706] text-white'
                                : opt.tone === 'emerald'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#72102A] text-white'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <span className="block text-[9.5px] font-bold text-stone-400 uppercase tracking-wider mb-1 select-none leading-none">
          {label}
        </span>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={selectedOption?.label || placeholder}
        style={{ outline: 'none' }}
        className={`w-full h-[36px] flex items-center justify-between gap-2 border text-xs font-semibold transition-all duration-150 cursor-pointer outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
          rounded === 'full' ? 'rounded-full px-3.5' : 'rounded-xl px-3'
        } ${getTriggerStyles()}`}
      >
        <span className="flex items-center gap-2 min-w-0 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 flex items-center">{selectedOption.icon}</span>
          )}
          {selectedOption?.dotColor && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.dotColor}`} />
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0">
          {selectedOption?.badge !== undefined && selectedOption?.badge !== null && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold leading-none ${
                variant === 'amber'
                  ? 'bg-[#F59E0B]/20 text-[#92400E]'
                  : variant === 'emerald'
                  ? 'bg-emerald-200/70 text-emerald-900'
                  : 'bg-stone-200/80 text-stone-700'
              }`}
            >
              {selectedOption.badge}
            </span>
          )}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen
                ? variant === 'amber'
                  ? 'rotate-180 text-[#D97706]'
                  : variant === 'emerald'
                  ? 'rotate-180 text-emerald-600'
                  : 'rotate-180 text-[#72102A]'
                : variant === 'amber'
                ? 'text-[#B45309]/70'
                : variant === 'emerald'
                ? 'text-emerald-600/70'
                : 'text-stone-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.25}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {menuContent}
    </div>
  );
}
