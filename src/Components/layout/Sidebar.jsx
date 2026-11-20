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

  // Instant dark tooltip (shown only when collapsed). Rendered outside <aside> so it isn't clipped.
  const [tip, setTip] = useState(null);
  const showTip = (e, label) => {
    if (!collapsed) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ label, top: r.top + r.height / 2, left: r.right + 10 });
  };
  const hideTip = () => setTip(null);

  // True while the width animation runs (avoids ellipsis flicker on labels)
  const [animating, setAnimating] = useState(false);

  const toggleCollapsed = () => {
    setAnimating(true);
    setTip(null);
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
          {/* Section label + collapse toggle (desktop only) */}
          <div className="hidden md:block relative" style={{ height: '34px', marginBottom: '8px' }}>
            <span
              className="absolute whitespace-nowrap uppercase"
              style={{
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.45)',
                opacity: collapsed ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              Menu
            </span>
            <button
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              onMouseEnter={(e) => showTip(e, 'Expand sidebar')}
              onMouseLeave={hideTip}
              className="absolute top-0 flex items-center justify-center text-white hover:bg-white/20"
              style={{
                width: '44px',
                height: '34px',
                right: collapsed ? '1px' : '0px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(201, 168, 76, 0.5)',
                transition: 'right 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.15s',
              }}
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>

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
                  onMouseEnter={(e) => showTip(e, item.label)}
                  onMouseLeave={hideTip}
                  onFocus={(e) => showTip(e, item.label)}
                  onBlur={hideTip}
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

      {collapsed && tip && (
        <div
          role="tooltip"
          className="hidden md:block fixed pointer-events-none whitespace-nowrap"
          style={{
            top: tip.top,
            left: tip.left,
            transform: 'translateY(-50%)',
            zIndex: 10000,
            background: '#111',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            padding: '7px 12px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: '-4px',
              top: '50%',
              width: '8px',
              height: '8px',
              background: '#111',
              transform: 'translateY(-50%) rotate(45deg)',
            }}
          />
          {tip.label}
        </div>
      )}
    </>
  );
}
