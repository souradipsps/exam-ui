import React from 'react';
import spsLogo from '../../assets/images/sps_logo.png';

export default function TopBar() {
  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #72102a 0%, #8B1F3A 100%)',
        borderBottom: '2px solid #c9a84c',
        padding: '0px 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 100,
      }}
    >
      {/* Left: School Crest + Name & Location */}
      <div className="flex items-center gap-3">
        <img
          src={spsLogo}
          alt="South Point School Crest"
          className="h-[36px] md:h-[44px] w-auto object-contain flex-shrink-0 drop-shadow"
        />
        <div className="flex flex-col">
          <span
            className="text-[13px] md:text-[16px] leading-tight"
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
            className="text-[10px] uppercase leading-none mt-1"
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
          className="px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all shadow-sm"
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
