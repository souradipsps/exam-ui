import React from 'react';
import Icon from '../common/Icon.jsx';

function NavBtn({ onClick, disabled, title, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-1 h-8 rounded-lg border text-xs font-semibold transition-all px-2.5 ${
        disabled
          ? 'bg-[#F7F5F0] text-[#B0AAA0] border-[#E8E2D9] cursor-not-allowed'
          : 'bg-white text-[#4A4A4A] border-[#E8E2D9] hover:border-[#72102a] hover:text-[#72102a] hover:bg-[#FAF6F4] cursor-pointer'
      }`}
    >
      {children}
    </button>
  );
}

export default function Pagination({
  totalItems,
  pageSize = 20,
  onPageSizeChange,
  currentPage,
  onPageChange,
  pageSizeOptions = [5, 10, 20, 50],
  totalUnfiltered,
  isFiltered,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safeCurrentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (safeCurrentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages];
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 18px',
        background: '#ffffff',
        border: '1px solid #E8E2D9',
        borderRadius: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      }}
    >
      {/* Left: Range and Per-page */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Showing</span>
          <strong style={{ color: '#1A1A1A' }}>{startItem}–{endItem}</strong>
          <span>of</span>
          <strong style={{ color: '#1A1A1A' }}>{totalItems}</strong>
          <span>question{totalItems !== 1 ? 's' : ''}</span>

          {isFiltered && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#72102a',
                background: 'rgba(114, 16, 42, 0.08)',
                padding: '2px 8px',
                borderRadius: '999px',
                border: '1px solid rgba(114, 16, 42, 0.18)',
              }}
            >
              Filtered from {totalUnfiltered}
            </span>
          )}
        </div>
      </div>

      {/* Right: Page navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#666',
            marginRight: '6px',
            background: '#F5F2EC',
            padding: '3px 9px',
            borderRadius: '6px',
          }}
        >
          Page {safeCurrentPage} of {totalPages}
        </span>

        <NavBtn onClick={() => onPageChange(1)} disabled={safeCurrentPage === 1} title="First Page">
          <Icon name="chevronsLeft" className="w-3.5 h-3.5" />
        </NavBtn>

        <NavBtn onClick={() => onPageChange(safeCurrentPage - 1)} disabled={safeCurrentPage === 1} title="Previous Page">
          <Icon name="chevronLeft" className="w-3.5 h-3.5" />
          <span>Prev</span>
        </NavBtn>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span key={`el-${idx}`} style={{ padding: '0 4px', fontSize: '12px', color: '#999' }}>
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 6px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: p === safeCurrentPage ? 700 : 500,
                  cursor: 'pointer',
                  border: p === safeCurrentPage ? '1px solid #72102a' : '1px solid #E8E2D9',
                  background: p === safeCurrentPage ? 'linear-gradient(135deg, #72102a 0%, #901736 100%)' : '#FFFFFF',
                  color: p === safeCurrentPage ? '#FFFFFF' : '#4A4A4A',
                  boxShadow: p === safeCurrentPage ? '0 2px 6px rgba(114, 16, 42, 0.28)' : 'none',
                }}
              >
                {p}
              </button>
            )
          )}
        </div>

        <NavBtn onClick={() => onPageChange(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages} title="Next Page">
          <span>Next</span>
          <Icon name="chevronRight" className="w-3.5 h-3.5" />
        </NavBtn>

        <NavBtn onClick={() => onPageChange(totalPages)} disabled={safeCurrentPage === totalPages} title="Last Page">
          <Icon name="chevronsRight" className="w-3.5 h-3.5" />
        </NavBtn>
      </div>
    </div>
  );
}
