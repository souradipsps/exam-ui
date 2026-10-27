import React from 'react';
import Icon from '../common/Icon.jsx';
import { NAV_ITEMS } from '../../data/navigation.js';

export default function Sidebar({ activeNav, setActiveNav, navButtonRefs, handleNavKeyDown }) {
  return (
    <aside
      style={{
        width: '240px',
        background: 'linear-gradient(180deg, #72102a 0%, #5C0C21 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: 'rgba(0, 0, 0, 0.15) 4px 0px 20px',
      }}
    >
      {/* Nav Links */}
      <nav
        className="flex-1 overflow-y-auto"
        style={{
          padding: '24px 10px 12px 10px',
        }}
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
                onClick={() => setActiveNav(item.id)}
                onKeyDown={(e) => handleNavKeyDown && handleNavKeyDown(e, index)}
                className={`w-full flex items-center text-[13px] transition-all text-left relative outline-none focus:outline-none ${
                  isActive
                    ? 'font-bold text-white'
                    : 'font-medium text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                style={{
                  padding: '10px 14px',
                  borderRadius: '9px',
                  gap: '11px',
                  outline: 'none',
                  ...(isActive
                    ? {
                        color: '#ffffff',
                      }
                    : {}),
                }}
              >
                {/* Active gold vertical bar indicator */}
                {isActive && (
                  <span
                    className="absolute left-1 top-2 bottom-2 w-1 rounded-full"
                    style={{ backgroundColor: '#c9a84c' }}
                  />
                )}
                <Icon
                  name={item.icon}
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)' }}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Footer with small top border line separator */}
      <div
        className="mt-auto"
        style={{
          padding: '14px 18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center min-w-0 flex-1"
            style={{ gap: '10px' }}
          >
            {/* 32x32 Avatar with white-ish transparency gradient */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 text-white shadow-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%)',
                border: '1px solid rgba(201, 168, 76, 0.45)',
              }}
            >
              LN
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[12px] font-bold leading-tight truncate">
                lam nin
              </div>
              <div className="text-white/60 text-[10px] leading-tight mt-0.5 truncate">
                lamjingbasps@gma...
              </div>
            </div>
          </div>

          {/* Log Out button */}
          <button
            className="px-2.5 py-1.5 rounded-[8px] text-[10px] font-bold text-white transition-all text-center leading-tight hover:bg-white/15 flex-shrink-0"
            style={{
              backgroundColor: 'rgba(92, 12, 33, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            title="Log Out"
          >
            <div>Log</div>
            <div>Out</div>
          </button>
        </div>
      </div>
    </aside>
  );
}
