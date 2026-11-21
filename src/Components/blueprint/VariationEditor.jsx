import React from 'react';
import Icon from '../common/Icon.jsx';
import {
  COGNITIVE_LEVELS, DIFFICULTY_LEVELS, variationTotals,
} from '../../data/blueprintService.js';

const inputCls = 'w-full border border-[#E8E2D9] rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#72102a] disabled:bg-gray-50 disabled:text-gray-500';

export const Section = ({ title, hint, children }) => (
  <section className="border border-[#E8E2D9] rounded-xl bg-white p-4">
    <h4 className="text-[13px] font-bold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h4>
    {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
    <div className="mt-3">{children}</div>
  </section>
);

function PercentGrid({ levels, values, onChange }) {
  const total = levels.reduce((s, l) => s + (Number(values[l]) || 0), 0);
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {levels.map((l) => (
          <label key={l} className="text-[11px] font-semibold text-gray-600">
            {l} (%)
            <input type="number" min="0" max="100" className={`${inputCls} mt-1`} value={values[l]}
              onChange={(e) => onChange({ ...values, [l]: e.target.value === '' ? '' : Number(e.target.value) })} />
          </label>
        ))}
      </div>
      <p className={`text-[11px] mt-2 font-semibold ${total === 100 ? 'text-green-600' : 'text-amber-600'}`}>Total: {total}% / 100%</p>
    </>
  );
}

/**
 * Edits one blueprint template variation.
 * props: value, onChange, types {existing, master}, examMarks
 */
export default function VariationEditor({ value: v, onChange, types, examMarks }) {
  const set = (patch) => onChange({ ...v, ...patch });
  const totals = variationTotals(v);
  const selected = (name) => v.rows.some((r) => r.name === name);

  const toggleType = (t, source) => {
    if (selected(t.name)) return set({ rows: v.rows.filter((r) => r.name !== t.name) });
    const existing = types.existing.find((e) => e.name === t.name);
    set({
      rows: [...v.rows, {
        name: t.name, source,
        section: v.sections[0]?.name || '',
        count: v.mode === 'existing' && existing ? existing.available : 1,
        marks: existing ? existing.marks : 1,
      }],
    });
  };

  const setRow = (name, patch) => set({ rows: v.rows.map((r) => (r.name === name ? { ...r, ...patch } : r)) });

  const setMode = (mode) => {
    // "Existing" fills counts/marks from the question bank; "Custom" leaves them editable
    const rows = mode === 'existing'
      ? v.rows.map((r) => {
        const e = types.existing.find((x) => x.name === r.name);
        return e ? { ...r, count: e.available, marks: e.marks } : r;
      })
      : v.rows;
    set({ mode, rows });
  };

  const renameSection = (i, name) => {
    const old = v.sections[i].name;
    set({
      sections: v.sections.map((s, j) => (j === i ? { name } : s)),
      rows: v.rows.map((r) => (r.section === old ? { ...r, section: name } : r)),
    });
  };
  const removeSection = (i) => {
    const gone = v.sections[i].name;
    const sections = v.sections.filter((_, j) => j !== i);
    set({ sections, rows: v.rows.map((r) => (r.section === gone ? { ...r, section: sections[0]?.name || '' } : r)) });
  };

  return (
    <div className="flex flex-col gap-3">
      <Section title="1. Question Distribution" hint="Summary of what this template currently distributes.">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[['Sections', v.sections.length], ['Questions', totals.questions],
            ['Marks', `${totals.marks}${examMarks ? ` / ${examMarks}` : ''}`]].map(([l, n]) => (
              <div key={l} className="bg-[#faf8f5] rounded-lg py-2">
                <div className="text-lg font-extrabold" style={{ color: '#72102a' }}>{n}</div>
                <div className="text-[11px] text-gray-500">{l}</div>
              </div>
          ))}
        </div>
      </Section>

      <Section title="2. Sections">
        <div className="flex flex-col gap-2">
          {v.sections.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} value={s.name} placeholder="Section name" onChange={(e) => renameSection(i, e.target.value)} />
              <button type="button" disabled={v.sections.length === 1} onClick={() => removeSection(i)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30" aria-label="Remove section">
                <Icon name="trash" className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => set({ sections: [...v.sections, { name: `Section ${String.fromCharCode(65 + v.sections.length)}` }] })}
            className="self-start text-xs font-semibold" style={{ color: '#72102a' }}>+ Add section</button>
        </div>
      </Section>

      <Section title="3. Question Type Selection" hint="Existing types come from the Question Bank for this academic context; master types come from the system catalogue.">
        {[['In your Question Bank', types.existing, 'existing'], ['Master Question Types', types.master, 'master']].map(([label, list, source]) => (
          <div key={source} className="mb-3 last:mb-0">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</div>
            {list.length === 0 && <p className="text-xs text-gray-400">None available.</p>}
            <div className="flex flex-wrap gap-2">
              {list.map((t) => (
                <button type="button" key={`${source}-${t.name}`} onClick={() => toggleType(t, source)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selected(t.name) ? 'text-white border-transparent' : 'text-gray-600 border-[#E8E2D9] bg-white hover:border-[#72102a]'}`}
                  style={selected(t.name) ? { backgroundColor: '#72102a' } : undefined}>
                  {t.name}{source === 'existing' ? ` (${t.available})` : ''}
                </button>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="4–6. Type Distribution, Number of Questions & Marks">
        <div className="flex gap-2 mb-3">
          {[['existing', 'Existing (from Question Bank)'], ['custom', 'Custom']].map(([m, l]) => (
            <button type="button" key={m} onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${v.mode === m ? 'text-white border-transparent' : 'text-gray-600 border-[#E8E2D9]'}`}
              style={v.mode === m ? { backgroundColor: '#72102a' } : undefined}>{l}</button>
          ))}
        </div>
        {v.rows.length === 0 ? <p className="text-xs text-gray-400">Select question types above.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-1 pr-2">Type</th><th className="pr-2">Section</th>
                  <th className="pr-2 w-24">Questions</th><th className="pr-2 w-24">Marks each</th><th className="w-16">Total</th>
                </tr>
              </thead>
              <tbody>
                {v.rows.map((r) => (
                  <tr key={r.name} className="align-top">
                    <td className="py-1 pr-2 font-semibold text-gray-700">{r.name}</td>
                    <td className="pr-2 py-1">
                      <select className={inputCls} value={r.section} onChange={(e) => setRow(r.name, { section: e.target.value })}>
                        {v.sections.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                      </select>
                    </td>
                    <td className="pr-2 py-1"><input type="number" min="0" className={inputCls} disabled={v.mode === 'existing' && r.source === 'existing'} value={r.count}
                      onChange={(e) => setRow(r.name, { count: e.target.value === '' ? '' : Number(e.target.value) })} /></td>
                    <td className="pr-2 py-1"><input type="number" min="0" className={inputCls} disabled={v.mode === 'existing' && r.source === 'existing'} value={r.marks}
                      onChange={(e) => setRow(r.name, { marks: e.target.value === '' ? '' : Number(e.target.value) })} /></td>
                    <td className="py-2 font-bold text-gray-700">{(Number(r.count) || 0) * (Number(r.marks) || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="7. Cognitive Level Distribution">
        <PercentGrid levels={COGNITIVE_LEVELS} values={v.cognitive} onChange={(cognitive) => set({ cognitive })} />
      </Section>
      <Section title="8. Difficulty Distribution">
        <PercentGrid levels={DIFFICULTY_LEVELS} values={v.difficulty} onChange={(difficulty) => set({ difficulty })} />
      </Section>
    </div>
  );
}

/** Read-only view of a template's configuration (used to preview a selected template). */
export function TemplatePreview({ v }) {
  const t = variationTotals(v);
  const pct = (o) => Object.entries(o).filter(([, n]) => n).map(([k, n]) => `${k} ${n}%`).join(', ') || '—';
  return (
    <div className="mt-3 border border-[#E8E2D9] rounded-xl bg-[#faf8f5] p-4">
      <div className="grid grid-cols-3 gap-3 text-center mb-3">
        {[['Sections', v.sections.length], ['Questions', t.questions], ['Marks', t.marks]].map(([l, n]) => (
          <div key={l} className="bg-white rounded-lg py-2">
            <div className="text-lg font-extrabold" style={{ color: '#72102a' }}>{n}</div>
            <div className="text-[11px] text-gray-500">{l}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[420px]">
          <thead><tr className="text-left text-gray-500 border-b border-[#E8E2D9]"><th className="py-1">Type</th><th>Section</th><th>Qs</th><th>Marks each</th><th>Total</th></tr></thead>
          <tbody>
            {v.rows.map((r) => (
              <tr key={r.name} className="border-b border-[#E8E2D9]/60"><td className="py-1.5 font-semibold">{r.name}</td><td>{r.section}</td><td>{r.count}</td><td>{r.marks}</td><td>{r.count * r.marks}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
        <b>Cognitive:</b> {pct(v.cognitive)}<br />
        <b>Difficulty:</b> {pct(v.difficulty)}
      </p>
    </div>
  );
}
