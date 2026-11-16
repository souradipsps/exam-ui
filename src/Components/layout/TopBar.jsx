import React from 'react';
import spsLogo from '../../assets/images/sps_logo.png';

export default function TopBar({ onMenuToggle, menuOpen }) {
  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #72102a 0%, #8B1F3A 100%)',
        borderBottom: '2px solid #c9a84c',
        padding: '0px 16px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 100,
      }}
    >
      {/* Left: Hamburger (mobile) + School Crest + Name */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Hamburger – only visible on mobile */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg transition-colors"
            style={{
              background: menuOpen ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(201,168,76,0.3)',
              flexShrink: 0,
            }}
          >
            <span
              className="block w-5 h-0.5 bg-white rounded transition-all duration-200"
              style={{ transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-0.5 bg-white rounded my-1 transition-all duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-0.5 bg-white rounded transition-all duration-200"
              style={{ transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none' }}
            />
          </button>
        )}

        <img
          src={spsLogo}
          alt="South Point School Crest"
          className="h-[34px] md:h-[44px] w-auto object-contain flex-shrink-0 drop-shadow"
        />
        <div className="flex flex-col">
          <span
            className="text-[12px] md:text-[16px] leading-tight"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              color: '#c9a84c',
              letterSpacing: '-0.01em',
            }}
          >
            South Point School
          </span>
          <span
            className="hidden sm:block text-[10px] uppercase leading-none mt-1"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.12em',
            }}
          >
            GUWAHATI, ASSAM
          </span>
        </div>
      </div>

      {/* Right: Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="px-3 md:px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all shadow-sm"
          style={{
            backgroundColor: 'rgba(92, 12, 33, 0.75)',
            border: '1px solid rgba(201, 168, 76, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
            e.currentTarget.style.borderColor = '#c9a84c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(92, 12, 33, 0.75)';
            e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.4)';
          }}
          title="Back"
        >
          Back
        </button>
      </div>
    </header>
  );
}
