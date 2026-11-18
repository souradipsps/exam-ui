import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../Components/common/Icon.jsx';
import { ModalWrapper } from '../Components/common/ModalWrapper.jsx';
import QuestionFilters from '../Components/question-bank/QuestionFilters.jsx';
import AssignmentTracking from '../Components/blueprint/AssignmentTracking.jsx';
import BlueprintWizard from '../Components/blueprint/BlueprintWizard.jsx';
import VariationEditor, { TemplatePreview } from '../Components/blueprint/VariationEditor.jsx';
import { blueprintService, SESSIONS, validateVariation } from '../data/blueprintService.js';

const inputCls = 'border border-[#E8E2D9] rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#72102a]';
const fmt = (d) => new Date(d).toLocaleDateString();

function EditModal({ bp, template, onClose, onSaved }) {
  const [session, setSession] = useState(bp.session || '');
  const [variations, setVariations] = useState(() => JSON.parse(JSON.stringify((template?.variations || []).slice(0, 1)))); // a template has a single configuration
  const [types, setTypes] = useState(null);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { blueprintService.getQuestionTypes(bp.context.id).then(setTypes); }, [bp.context.id]);

  const save = async () => {
    const errs = [];
    if (!session) errs.push('Session is required.');
    variations.forEach((v) => validateVariation(v, bp.exam.totalMarks).forEach((m) => errs.push(m)));
    setErrors(errs);
    if (errs.length) return;
    setSaving(true);
    try { await blueprintService.updateBlueprint(bp.id, { session, variations }); onSaved(); }
    catch (e) { setErrors([e.message]); setSaving(false); }
  };

  return (
    <ModalWrapper title="Edit Blueprint" subtitle={`${bp.exam.name} · ${bp.context.className} ${bp.context.subject}`} onClose={onClose} wide>
      <label className="block text-xs font-semibold text-gray-600 mb-3">Session
        <select className={`${inputCls} w-full mt-1`} value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="">Select session…</option>
          {SESSIONS.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </label>
      {!types ? <p className="text-xs text-gray-400 animate-pulse py-4 text-center">Loading question types…</p> : variations.length > 0 && (
        <VariationEditor value={variations[0]} types={types} examMarks={bp.exam.totalMarks}
          onChange={(nv) => setVariations([nv])} />
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
  const [fExam, setFExam] = useState('All');
  const [fSession, setFSession] = useState('All');
  const [fClass, setFClass] = useState('All');
  const [fSubject, setFSubject] = useState('All');
  const [fChapter, setFChapter] = useState('All');
  const [fType, setFType] = useState('All');
  const [fMarks, setFMarks] = useState('All');
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
  // Flatten each blueprint into chapter x type x marks rows so the shared QuestionFilters
  // (same component as the Question Bank) can build its cascading options from them.
  const rows = useMemo(() => (blueprints || []).flatMap((b) => {
    const rs = tplOf(b)?.variations.flatMap((v) => v.rows) || [];
    const types = [...new Set(rs.map((r) => r.name))];
    const marks = [...new Set(rs.map((r) => r.marks))];
    const chapters = b.context.chapters.length ? b.context.chapters : [undefined];
    return chapters.flatMap((chapter) => (types.length ? types : [undefined]).flatMap((type) =>
      (marks.length ? marks : [undefined]).map((m) => ({
        bpId: b.id, exam: b.exam.name, session: b.session || b.exam.session, class: b.context.className,
        subject: b.context.subject, chapter, type, marks: m,
      }))));
  }), [blueprints, templates]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const ids = new Set(rows.filter((r) =>
      (fExam === 'All' || r.exam === fExam) && (fSession === 'All' || r.session === fSession)
      && (fClass === 'All' || r.class === fClass) && (fSubject === 'All' || r.subject === fSubject)
      && (fChapter === 'All' || r.chapter === fChapter) && (fType === 'All' || r.type === fType)
      && (fMarks === 'All' || String(r.marks) === fMarks)).map((r) => r.bpId));
    const s = search.toLowerCase();
    return (blueprints || []).filter((b) => ids.has(b.id)
      && (!s || [b.name, b.session || '', b.id, b.exam.name, b.templateName, b.context.subject, b.context.className].some((x) => x.toLowerCase().includes(s))));
  }, [rows, blueprints, search, fExam, fSession, fClass, fSubject, fChapter, fType, fMarks]);

  if (view === 'tracking') return <AssignmentTracking onBack={() => setView('list')} />;

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
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setView('tracking')} className="flex items-center gap-1.5 text-xs font-bold rounded-lg px-4 py-2.5 border border-[#72102a]/30 bg-white hover:bg-[#72102a]/5" style={{ color: '#72102a' }}>
            <Icon name="users" className="w-4 h-4" /> Assignment Tracking
          </button>
          <button onClick={() => setView('create')} className="flex items-center gap-1.5 text-xs font-bold text-white rounded-lg px-4 py-2.5" style={{ backgroundColor: '#72102a' }}>
            <Icon name="plus" className="w-4 h-4" /> Create New Blueprint
          </button>
        </div>
      </div>

      <QuestionFilters
        questions={rows}
        searchPlaceholder="Search by session, ID, exam, template, or subject…"
        searchTerm={search} setSearchTerm={setSearch}
        filterExam={fExam} setFilterExam={setFExam}
        filterSession={fSession} setFilterSession={setFSession}
        filterClass={fClass} setFilterClass={setFClass}
        filterSubject={fSubject} setFilterSubject={setFSubject}
        filterChapter={fChapter} setFilterChapter={setFChapter}
        filterType={fType} setFilterType={setFType}
        filterMarks={fMarks} setFilterMarks={setFMarks}
      />

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
              ['Class / Programme', modal.bp.context.className], ['Subject / Course', modal.bp.context.subject], ['Created', fmt(modal.bp.createdAt)]].map(([k, v]) => (
                <div key={k}><dt className="text-[11px] text-gray-400">{k}</dt><dd className="font-semibold text-gray-700">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-3 text-[11px] text-gray-400">Chapters</div>
          <div className="flex flex-wrap gap-1.5 mt-1">{modal.bp.context.chapters.map((c) => <span key={c} className="text-[11px] px-2 py-1 rounded-full bg-[#faf8f5] border border-[#E8E2D9] text-gray-600">{c}</span>)}</div>
        </ModalWrapper>
      )}
      {modal?.type === 'types' && (
        <ModalWrapper title="Question Type Blueprint" subtitle={modal.bp.name} onClose={close} wide>
          {tpl?.variations[0] ? <TemplatePreview v={tpl.variations[0]} /> : <p className="text-xs text-gray-400">Template not found.</p>}
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
