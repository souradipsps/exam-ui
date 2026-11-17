import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../Components/common/Icon.jsx';
import { ModalWrapper } from '../Components/common/ModalWrapper.jsx';
import BlueprintWizard from '../Components/blueprint/BlueprintWizard.jsx';
import VariationEditor, { VariationTabs } from '../Components/blueprint/VariationEditor.jsx';
import { blueprintService, validateVariation, variationTotals } from '../data/blueprintService.js';

const inputCls = 'border border-[#E8E2D9] rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#72102a]';
const fmt = (d) => new Date(d).toLocaleDateString();

function VariationTable({ v }) {
  const t = variationTotals(v);
  return (
    <div className="mb-4">
      <h4 className="text-xs font-bold text-gray-700 mb-1.5">{v.label} <span className="font-normal text-gray-400">— {t.questions} questions, {t.marks} marks</span></h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[420px]">
          <thead><tr className="text-left text-gray-500 border-b border-[#E8E2D9]"><th className="py-1">Type</th><th>Section</th><th>Qs</th><th>Marks each</th><th>Total</th></tr></thead>
          <tbody>
            {v.rows.map((r) => (
              <tr key={r.name} className="border-b border-gray-50"><td className="py-1.5 font-semibold">{r.name}</td><td>{r.section}</td><td>{r.count}</td><td>{r.marks}</td><td>{r.count * r.marks}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-gray-500 mt-1.5">
        Cognitive: {Object.entries(v.cognitive).filter(([, n]) => n).map(([k, n]) => `${k} ${n}%`).join(', ') || '—'}<br />
        Difficulty: {Object.entries(v.difficulty).filter(([, n]) => n).map(([k, n]) => `${k} ${n}%`).join(', ') || '—'}
      </p>
    </div>
  );
}

function EditModal({ bp, template, onClose, onSaved }) {
  const [name, setName] = useState(bp.name);
  const [variations, setVariations] = useState(() => JSON.parse(JSON.stringify(template?.variations || [])));
  const [active, setActive] = useState(0);
  const [types, setTypes] = useState(null);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { blueprintService.getQuestionTypes(bp.context.id).then(setTypes); }, [bp.context.id]);

  const save = async () => {
    const errs = [];
    if (!name.trim()) errs.push('Blueprint name is required.');
    variations.forEach((v) => validateVariation(v, bp.exam.totalMarks).forEach((m) => errs.push(`${v.label}: ${m}`)));
    setErrors(errs);
    if (errs.length) return;
    setSaving(true);
    try { await blueprintService.updateBlueprint(bp.id, { name: name.trim(), variations }); onSaved(); }
    catch (e) { setErrors([e.message]); setSaving(false); }
  };

  return (
    <ModalWrapper title="Edit Blueprint" subtitle={`${bp.exam.name} · ${bp.context.className} ${bp.context.subject}`} onClose={onClose} wide>
      <label className="block text-xs font-semibold text-gray-600 mb-3">Blueprint name
        <input className={`${inputCls} w-full mt-1`} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      {!types ? <p className="text-xs text-gray-400 animate-pulse py-4 text-center">Loading question types…</p> : variations.length > 0 && (
        <>
          <VariationTabs variations={variations} active={active} setActive={setActive}
            onAdd={() => { setVariations((vs) => [...vs, { ...JSON.parse(JSON.stringify(vs[active])), label: `Variation ${vs.length + 1}` }]); setActive(variations.length); }}
            onRemove={(i) => { setVariations((vs) => vs.filter((_, j) => j !== i)); setActive(0); }} />
          <VariationEditor value={variations[active]} types={types} examMarks={bp.exam.totalMarks}
            onChange={(nv) => setVariations((vs) => vs.map((v, i) => (i === active ? nv : v)))} />
        </>
      )}
      {errors.length > 0 && <ul className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 list-disc pl-6 mt-3" role="alert">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5">Cancel</button>
        <button onClick={save} disabled={saving} className="text-xs font-bold text-white rounded-lg px-4 py-2.5 disabled:opacity-50" style={{ backgroundColor: '#72102a' }}>{saving ? 'Saving…' : 'Save Changes'}</button>
      </div>
    </ModalWrapper>
  );
}

export default function ExamBlueprint({ showToast }) {
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [blueprints, setBlueprints] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [fClass, setFClass] = useState('All');
  const [fSubject, setFSubject] = useState('All');
  const [modal, setModal] = useState(null); // {type:'details'|'types'|'edit'|'delete', bp}
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [b, t] = await Promise.all([blueprintService.listBlueprints(), blueprintService.listTemplates()]);
      setBlueprints(b); setTemplates(t); setError('');
    } catch { setError('Could not load blueprints.'); setBlueprints([]); }
  };
  useEffect(() => { load(); }, []);

  const tplOf = (bp) => templates.find((t) => t.id === bp.templateId);
  const classes = useMemo(() => [...new Set((blueprints || []).map((b) => b.context.className))], [blueprints]);
  const subjects = useMemo(() => [...new Set((blueprints || []).map((b) => b.context.subject))], [blueprints]);
  const filtered = (blueprints || []).filter((b) => {
    const s = search.toLowerCase();
    return (!s || [b.name, b.exam.name, b.templateName, b.context.subject].some((x) => x.toLowerCase().includes(s)))
      && (fClass === 'All' || b.context.className === fClass) && (fSubject === 'All' || b.context.subject === fSubject);
  });

  if (view === 'create') {
    return <BlueprintWizard onCancel={() => setView('list')}
      onSaved={async (bp) => { await load(); setView('list'); showToast(`✓ Blueprint "${bp.name}" created successfully.`); }} />;
  }

  const close = () => setModal(null);
  const confirmDelete = async () => {
    try { await blueprintService.deleteBlueprint(modal.bp.id); showToast(`✓ Blueprint "${modal.bp.name}" deleted.`); close(); load(); }
    catch { showToast('Could not delete blueprint.'); }
  };
  const tpl = modal && tplOf(modal.bp);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] md:text-[22px] font-extrabold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>Blueprint</h1>
          <p className="text-[12.5px] text-gray-500 mt-1">Design and manage structured blueprints for exam papers</p>
        </div>
        <button onClick={() => setView('create')} className="flex items-center gap-1.5 text-xs font-bold text-white rounded-lg px-4 py-2.5" style={{ backgroundColor: '#72102a' }}>
          <Icon name="plus" className="w-4 h-4" /> Create New Blueprint
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input className={`${inputCls} w-full pl-9`} placeholder="Search blueprints, exams, templates…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={inputCls} value={fClass} onChange={(e) => setFClass(e.target.value)} aria-label="Filter by class"><option value="All">All classes</option>{classes.map((c) => <option key={c}>{c}</option>)}</select>
        <select className={inputCls} value={fSubject} onChange={(e) => setFSubject(e.target.value)} aria-label="Filter by subject"><option value="All">All subjects</option>{subjects.map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

      <div className="bg-white rounded-xl border border-[#E8E2D9] shadow-sm overflow-x-auto">
        {blueprints === null ? <p className="p-8 text-center text-xs text-gray-400 animate-pulse">Loading blueprints…</p>
          : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-sm font-semibold text-gray-700">{blueprints.length ? 'No blueprints match your search' : 'No blueprints yet'}</h3>
              <p className="text-xs text-gray-400 mt-1">{blueprints.length ? 'Try adjusting the filters.' : 'Click "Create New Blueprint" to get started.'}</p>
            </div>
          ) : (
            <table className="w-full text-xs min-w-[720px]">
              <thead><tr className="text-left text-gray-500 bg-[#faf8f5]">
                {['Blueprint', 'Exam', 'Class / Subject', 'Template', 'Created', ''].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t border-[#E8E2D9]">
                    <td className="px-4 py-3 font-semibold text-gray-800">{b.name}<div className="font-mono text-[10px] text-gray-400">{b.id}</div></td>
                    <td className="px-4 py-3">{b.exam.name}<div className="text-[11px] text-gray-400">{b.exam.totalMarks} marks</div></td>
                    <td className="px-4 py-3">{b.context.className}<div className="text-[11px] text-gray-400">{b.context.subject}</div></td>
                    <td className="px-4 py-3">{b.templateName}</td>
                    <td className="px-4 py-3">{fmt(b.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        {[['eye', 'details', 'View details'], ['grid', 'types', 'View question type blueprint'], ['edit', 'edit', 'Edit'], ['trash', 'delete', 'Delete']].map(([icon, type, label]) => (
                          <button key={type} title={label} aria-label={label} onClick={() => setModal({ type, bp: b })}
                            className={`p-1.5 rounded-lg hover:bg-gray-100 ${type === 'delete' ? 'text-red-500' : 'text-gray-500'}`}><Icon name={icon} className="w-4 h-4" /></button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {modal?.type === 'details' && (
        <ModalWrapper title={modal.bp.name} subtitle="Blueprint details" onClose={close}>
          <dl className="grid grid-cols-2 gap-3 text-xs">
            {[['Exam', modal.bp.exam.name], ['Total marks', modal.bp.exam.totalMarks], ['Duration', `${modal.bp.exam.duration} min`], ['Template', modal.bp.templateName],
              ['Class / Programme', modal.bp.context.className], ['Subject / Course', modal.bp.context.subject], ['Variations', tpl?.variations.length ?? 0], ['Created', fmt(modal.bp.createdAt)]].map(([k, v]) => (
                <div key={k}><dt className="text-[11px] text-gray-400">{k}</dt><dd className="font-semibold text-gray-700">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-3 text-[11px] text-gray-400">Chapters</div>
          <div className="flex flex-wrap gap-1.5 mt-1">{modal.bp.context.chapters.map((c) => <span key={c} className="text-[11px] px-2 py-1 rounded-full bg-[#faf8f5] border border-[#E8E2D9] text-gray-600">{c}</span>)}</div>
        </ModalWrapper>
      )}
      {modal?.type === 'types' && (
        <ModalWrapper title="Question Type Blueprint" subtitle={modal.bp.name} onClose={close} wide>
          {tpl ? tpl.variations.map((v, i) => <VariationTable key={i} v={v} />) : <p className="text-xs text-gray-400">Template not found.</p>}
        </ModalWrapper>
      )}
      {modal?.type === 'edit' && (
        <EditModal bp={modal.bp} template={tpl} onClose={close} onSaved={() => { close(); load(); showToast('✓ Blueprint changes saved.'); }} />
      )}
      {modal?.type === 'delete' && (
        <ModalWrapper title="Delete Blueprint" onClose={close} narrow>
          <p className="text-sm font-semibold text-gray-800">Are you sure?</p>
          <p className="text-xs text-gray-500 mt-1 mb-4">This will permanently remove <b>{modal.bp.name}</b>. Its template is removed too if no other blueprint uses it.</p>
          <div className="flex justify-end gap-2">
            <button onClick={close} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-3.5 py-2.5">Cancel</button>
            <button onClick={confirmDelete} className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg px-3.5 py-2.5">Confirm Delete</button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
