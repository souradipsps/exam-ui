import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, itemDesc }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
            ⚠
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">{title || 'Confirm Deletion'}</h3>
            <p className="text-xs text-stone-500 mt-1">
              Are you sure you want to delete <strong className="text-stone-800">{itemDesc}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 text-left">
            <strong>Permission Checked:</strong> You hold educator editing permissions for this course and academic context.
          </div>
        </div>

        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all active:scale-95"
          >
            Confirm & Delete
          </button>
        </div>

      </div>
    </div>
  );
}

