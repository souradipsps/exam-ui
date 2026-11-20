import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import { NAV_ITEMS } from '../../data/navigation.js';

const STORAGE_KEY = 'sidebarCollapsed';

export default function Sidebar({ activeNav, setActiveNav, navButtonRefs, handleNavKeyDown, isOpen, onClose }) {
  const [collapsedPref, setCollapsedPref] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  // The mobile drawer is always shown expanded
  const collapsed = collapsedPref && !isOpen;

  // Publish the sidebar width so full-screen forms/modals can align to it
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', collapsedPref ? '68px' : '240px');
  }, [collapsedPref]);

  // True while the width animation runs (avoids ellipsis flicker on labels)
  const [animating, setAnimating] = useState(false);

  const toggleCollapsed = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 280);
    setCollapsedPref((c) => {
      try {
        localStorage.setItem(STORAGE_KEY, c ? '0' : '1');
      } catch {
        /* ignore */
      }
      return !c;
    });
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          width: collapsed ? '68px' : '240px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #6B0E25 0%, #4D0719 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          boxShadow: '4px 0px 24px rgba(0, 0, 0, 0.18)',
          // Mobile: fixed drawer; Desktop: static
          position: undefined,
          zIndex: 50,
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
        className={`
          fixed top-0 left-0 h-full z-50 md:static md:z-auto md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:flex
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 md:hidden">
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              color: '#c9a84c',
              fontSize: '14px',
              letterSpacing: '-0.01em',
            }}
          >
            Navigation
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ padding: '12px 10px 12px 10px' }}
          role="tablist"
          aria-label="Sidebar Navigation"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    if (navButtonRefs?.current) {
                      navButtonRefs.current[index] = el;
                    }
                  }}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : 0}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (onClose) onClose(); // close drawer on mobile after nav
                  }}
                  onKeyDown={(e) => handleNavKeyDown && handleNavKeyDown(e, index)}
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={`w-full flex items-center text-[13px] transition-all text-left relative overflow-hidden outline-none focus:outline-none ${
                    isActive
                      ? 'font-bold text-white'
                      : 'font-medium text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    gap: '11px',
                    outline: 'none',
                    ...(isActive
                      ? {
                          color: '#ffffff',
                          backgroundColor: 'rgba(255, 255, 255, 0.14)',
                        }
                      : {}),
                  }}
                >
                  {/* Active gold vertical bar indicator */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-[7px] bottom-[7px] w-[3.5px] rounded-full"
                      style={{ backgroundColor: '#D4B24C' }}
                    />
                  )}
                  <Icon
                    name={item.icon}
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)' }}
                  />
                  <span
                    className="whitespace-nowrap"
                    style={{
                      opacity: collapsed ? 0 : 1,
                      transition: 'opacity 0.2s ease',
                      overflow: 'hidden',
                      textOverflow: collapsed || animating ? 'clip' : 'ellipsis',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapse / expand toggle (desktop only) */}
        <div className="hidden md:block" style={{ padding: '0 10px 10px' }}>
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full flex items-center text-[12px] font-semibold text-white transition-colors hover:bg-white/20"
            style={{
              gap: '8px',
              padding: '9px 0',
              paddingLeft: '14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(201, 168, 76, 0.5)',
            }}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4B24C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}
            >
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
            <span
              className="whitespace-nowrap overflow-hidden"
              style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s ease' }}
            >
              Collapse menu
            </span>
          </button>
        </div>

        {/* User Footer */}
        <div
          className="mt-auto"
          style={{
            padding: '14px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Fixed-width row: the aside clips it, so text slides behind the avatar instead of reflowing */}
          <div className="flex items-center justify-between" style={{ width: '204px' }}>
            <div className="flex items-center min-w-0 flex-1" style={{ gap: '10px' }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 text-white shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  border: '1px solid rgba(201, 168, 76, 0.45)',
                }}
              >
                LN
              </div>
              <div
                className="flex-1 min-w-0"
                style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s ease' }}
              >
                <div className="text-white text-[12px] font-bold leading-tight truncate">lam nin</div>
                <div className="text-white/60 text-[10px] leading-tight mt-0.5 truncate">lamjingbasps@gma...</div>
              </div>
            </div>

            {/* Log Out button */}
            <button
              className="px-2.5 py-1.5 rounded-[8px] text-[10px] font-bold text-white text-center leading-tight hover:bg-white/15 flex-shrink-0"
              tabIndex={collapsed ? -1 : 0}
              style={{
                backgroundColor: 'rgba(92, 12, 33, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                opacity: collapsed ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
              title="Log Out"
            >
              <div>Log</div>
              <div>Out</div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
