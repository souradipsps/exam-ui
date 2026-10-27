import React from 'react';
import { ModalWrapper, Label } from '../common/ModalWrapper.jsx';

export default function QuestionEditModal({ editForm, setEditForm, onSave, onClose }) {
  if (!editForm) return null;

  return (
    <ModalWrapper
      title="Edit Question"
      subtitle={`Current: ${editForm.version} → New edit history on save`}
      onClose={onClose}
      wide
    >
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <Label>Question Text *</Label>
          <textarea
            rows={4}
            required
            value={editForm.questionText}
            onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-800 focus:outline-none leading-relaxed resize-none"
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(114, 16, 42, 0.25)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Subject', val: editForm.subject, key: 'subject', type: 'text' },
            { label: 'Class', val: editForm.class || editForm.grade || '', key: 'class', type: 'text' },
            { label: 'Marks', val: editForm.marks, key: 'marks', type: 'number' },
          ].map((f) => (
            <div key={f.key}>
              <Label>{f.label}</Label>
              <input
                type={f.type}
                value={f.val}
                min={f.type === 'number' ? 0 : undefined}
                step={f.type === 'number' ? 1 : undefined}
                onChange={(e) => {
                  const val = f.type === 'number' ? Number(e.target.value) : e.target.value;
                  const updated = { ...editForm, [f.key]: val };
                  if (f.key === 'class') {
                    updated.grade = val;
                  }
                  setEditForm(updated);
                }}
                className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(114, 16, 42, 0.25)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              />
            </div>
          ))}
        </div>

        <div>
          <Label>Chapter</Label>
          <input
            type="text"
            value={editForm.chapter}
            onChange={(e) => setEditForm({ ...editForm, chapter: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(114, 16, 42, 0.25)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          />
        </div>

        {editForm.options && editForm.options.length > 0 && (
          <div>
            <Label>Options & Correct Answer</Label>
            <div className="space-y-2">
              {editForm.options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={opt.isCorrect}
                    onChange={() => {
                      const newOpts = editForm.options.map((o, i) => ({ ...o, isCorrect: i === idx }));
                      setEditForm({ ...editForm, options: newOpts });
                    }}
                    className="cursor-pointer"
                    style={{ accentColor: '#72102a' }}
                  />
                  <span className="font-bold text-gray-400 w-5 text-xs">{opt.id.slice(-1)}.</span>
                  <input
                    type="text"
                    value={opt.text}
                    placeholder={`Option ${opt.id.slice(-1)}`}
                    onChange={(e) => {
                      const newOpts = [...editForm.options];
                      newOpts[idx].text = e.target.value;
                      setEditForm({ ...editForm, options: newOpts });
                    }}
                    className="flex-1 bg-transparent border-none text-xs text-gray-800 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label>Model Answer / Explanation</Label>
          <textarea
            rows={2}
            value={editForm.explanation}
            onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none resize-none"
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(114, 16, 42, 0.25)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          />
        </div>

        <div className="rounded-lg p-3 border" style={{ backgroundColor: 'rgba(114, 16, 42, 0.04)', borderColor: 'rgba(114, 16, 42, 0.2)' }}>
          <Label>Changelog / Edit History Note</Label>
          <input
            type="text"
            placeholder="e.g. Corrected option B phrasing and model answer."
            value={editForm.changelogNote}
            onChange={(e) => setEditForm({ ...editForm, changelogNote: e.target.value })}
            className="w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none mt-1"
            style={{ borderColor: 'rgba(114, 16, 42, 0.25)' }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(114, 16, 42, 0.25)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          />
          <p className="text-[11px] mt-1" style={{ color: '#72102a' }}>
            This note will be logged in the activity history ledger.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 14px', borderRadius: '8px' }}
            className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ backgroundColor: '#72102a', padding: '10px 14px', borderRadius: '8px' }}
            className="text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Save & Publish Edit History
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
