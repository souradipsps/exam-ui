import React, { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';
import AcademicContextForm, { newClass, validateSubject } from './AcademicContextForm.jsx';
import { Section } from './VariationEditor.jsx';
import { blueprintService, SESSIONS, variationTotals } from '../../data/blueprintService.js';

const inputCls = 'w-full border border-[#E8E2D9] rounded-lg px-3 py-2.5 text-xs bg-white focus:outline-none focus:border-[#72102a]';
const Spinner = ({ text }) => <div className="text-xs text-gray-400 py-6 text-center animate-pulse">{text}</div>;
const Field = ({ label, children }) => (
  <label className="block text-xs font-semibold text-gray-600">{label}<div className="mt-1">{children}</div></label>
);
const Info = ({ rows }) => (
  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#faf8f5] rounded-lg p-3 mt-3">
    {rows.map(([k, v]) => (
      <div key={k}><dt className="text-[11px] text-gray-400">{k}</dt><dd className="text-xs font-semibold text-gray-700">{v}</dd></div>
    ))}
  </dl>
);

/**
 * Single-page bulk creation: select the examination + session once, add several classes,
 * and several subject blueprints under each class. Every subject is saved as its own blueprint.
 */
export default function BlueprintWizard({ onCancel, onSaved }) {
  const [exams, setExams] = useState(null);
  const [contexts, setContexts] = useState(null);
  const [templates, setTemplates] = useState(null);
  const [typesMap, setTypesMap] = useState({}); // contextId -> {existing, master}
  const [loadError, setLoadError] = useState('');

  const [examId, setExamId] = useState('');
  const [session, setSession] = useState(() => {
    // Auto-select current Indian academic session (April–March year)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed; April = 3
    const startYear = month >= 3 ? year : year - 1;
    const s = `${startYear}-${String(startYear + 1).slice(-2)}`;
    return SESSIONS.includes(s) ? s : SESSIONS[SESSIONS.length - 1];
  });
  const [classes, setClasses] = useState([]);

  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const loading = useRef(new Set());
  const bannerRef = useRef(null);

  const exam = exams?.find((e) => e.id === examId);
  const defaultMode = templates?.length ? 'existing' : 'new';

  useEffect(() => {
    Promise.all([blueprintService.getExams(), blueprintService.getAcademicContexts(), blueprintService.listTemplates()])
      .then(([e, c, t]) => { setExams(e); setContexts(c); setTemplates(t); setClasses([newClass(t.length ? 'existing' : 'new')]); })
      .catch(() => setLoadError('Could not load exams / academic contexts. Please retry.'));
  }, []);

  // Load question types for every selected class+subject (cached per academic context)
  useEffect(() => {
    if (!contexts) return;
    classes.forEach((c) => c.subjects.forEach((s) => {
      const ctx = contexts.find((k) => k.className === c.className && k.subject === s.subject);
      if (!ctx || typesMap[ctx.id] || loading.current.has(ctx.id)) return;
      loading.current.add(ctx.id);
      blueprintService.getQuestionTypes(ctx.id)
        .then((t) => setTypesMap((m) => ({ ...m, [ctx.id]: t })))
        .catch(() => setLoadError('Could not load question types.'))
        .finally(() => loading.current.delete(ctx.id));
    }));
  }, [classes, contexts]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateContexts = (list) => { setContexts(list); blueprintService.saveAcademicContexts(list); };

  const ctxOf = (c, s) => contexts.find((k) => k.className === c.className && k.subject === s.subject);
  const totalSubjects = classes.reduce((n, c) => n + c.subjects.length, 0);

  // ---- validation: top-level messages + per-class / per-subject messages keyed by entry key ----
  const validate = () => {
    const top = [];
    const byKey = {};
    if (!examId) top.push('Select an examination.');
    if (!session) top.push('Select an academic session.');
    classes.forEach((c, ci) => {
      if (!c.className) { byKey[c.key] = 'Select a class / programme.'; return; }
      if (classes.findIndex((x) => x.className === c.className) !== ci) byKey[c.key] = 'This class is already added.';
      const seen = new Set();
      c.subjects.forEach((s) => {
        const errs = validateSubject(s, templates, exam?.totalMarks);
        if (s.subject && seen.has(s.subject)) errs.unshift('This subject is already added for this class.');
        seen.add(s.subject);
        if (errs.length) byKey[s.key] = errs;
      });
    });
    return { top, byKey, ok: !top.length && !Object.keys(byKey).length };
  };
  const result = showErrors ? validate() : { top: [], byKey: {}, ok: true };

  const save = async () => {
    const v = validate();
    setSaveError('');
    if (!v.ok) {
      setShowErrors(true);
      // open cards with errors so the problems are visible, then jump to the summary
      setClasses((cs) => cs.map((c) => ({ ...c, subjects: c.subjects.map((s) => (v.byKey[s.key] ? { ...s, open: true } : s)) })));
      setTimeout(() => bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }
    setSaving(true);
    const failed = [];
    const savedKeys = new Set();
    for (const c of classes) {
      for (const s of c.subjects) {
        try {
          const ctx = ctxOf(c, s);
          await blueprintService.createBlueprint({
            session, exam,
            context: { id: ctx.id, className: c.className, subject: s.subject, chapters: s.chapters },
            templateId: s.tplMode === 'existing' ? s.templateId : null,
            template: s.tplMode === 'new' ? { name: s.tplName.trim(), variations: [s.config] } : null,
          });
          savedKeys.add(s.key);
        } catch (e) {
          failed.push(`${c.className} — ${s.subject}: ${e.message || 'failed to save'}`);
        }
      }
    }
    if (!failed.length) { onSaved(savedKeys.size); return; }
    // keep only the subjects that failed so a retry cannot create duplicates
    setClasses((cs) => cs.map((c) => ({ ...c, subjects: c.subjects.filter((s) => !savedKeys.has(s.key)) })).filter((c) => c.subjects.length));
    setSaveError(`${savedKeys.size} blueprint(s) saved. ${failed.length} failed — ${failed.join('; ')}`);
    setSaving(false);
  };

  const ready = exams && contexts && templates;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[18px] md:text-[22px] font-extrabold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Create New Blueprint</h1>
          <p className="text-[12.5px] text-gray-500 mt-1">Select the examination once, then add classes and subject-wise blueprints.</p>
        </div>
        <button onClick={onCancel} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2">Cancel</button>
      </div>

      {loadError && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{loadError}</div>}
      {!ready && !loadError && <Spinner text="Loading exams, academic contexts and templates…" />}

      {ready && (
        <>
          <Section title="1. Examination Details" hint="Selected once and shared by every blueprint below.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Examination Type *">
                <select className={inputCls} value={examId} onChange={(e) => setExamId(e.target.value)}>
                  <option value="">Select examination…</option>
                  {exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </Field>
              <Field label="Academic Session *">
                <select className={inputCls} value={session} onChange={(e) => setSession(e.target.value)}>
                  <option value="">Select session…</option>
                  {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            {exam && <Info rows={[['Examination', exam.name], ['Total marks', exam.totalMarks], ['Duration', `${exam.duration} min`]]} />}
          </Section>

          <Section title="2. Academic Context, Template & Configuration" hint="Add classes, then a blueprint for each subject. Every subject has its own chapters, template and configuration.">
            {exam ? (
              <AcademicContextForm contexts={contexts} setContexts={updateContexts} classes={classes} setClasses={setClasses}
                templates={templates} typesMap={typesMap} examMarks={exam.totalMarks} errors={result.byKey} defaultMode={defaultMode} />
            ) : <p className="text-xs text-gray-400">Select an examination first — its total marks are used to validate each template.</p>}
          </Section>

          <Section title="3. Review & Save" hint={`${totalSubjects} blueprint${totalSubjects === 1 ? '' : 's'} will be created — one per subject.`}>
            <Info rows={[['Examination', exam?.name || '—'], ['Session', session || '—'], ['Classes', classes.filter((c) => c.className).length], ['Blueprints', totalSubjects]]} />
            <div className="flex flex-col gap-3 mt-3">
              {classes.filter((c) => c.className).map((c) => (
                <div key={c.key} className="border border-[#E8E2D9] rounded-lg">
                  <div className="px-3 py-2 bg-[#faf8f5] text-xs font-bold text-gray-700 rounded-t-lg">{c.className}</div>
                  <ul className="divide-y divide-[#E8E2D9]">
                    {c.subjects.map((s) => {
                      const tpl = s.tplMode === 'existing' ? templates.find((t) => t.id === s.templateId)?.variations?.[0] : s.config;
                      const t = tpl && variationTotals(tpl);
                      const mismatch = exam && t && s.subject && t.marks !== exam.totalMarks;
                      return (
                        <li key={s.key} className="px-3 py-2 text-xs">
                          <div className="font-semibold text-gray-800">{s.subject || <span className="text-amber-600">Subject not selected</span>}</div>
                          <div className="text-gray-500 mt-0.5">Chapters: {s.chapters.length ? s.chapters.join(', ') : '—'}</div>
                          <div className="text-gray-500">
                            Template: {s.tplMode === 'existing' ? (templates.find((x) => x.id === s.templateId)?.name || '—') : `${s.tplName || '—'} (new)`}
                            {t && ` · ${t.questions} questions · ${t.marks} marks`}
                          </div>
                          {mismatch && <div className="text-amber-600">Marks differ from the exam total ({exam.totalMarks}).</div>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <div ref={bannerRef}>
            {showErrors && !result.ok && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                <b>Please fix the following before saving:</b>
                <ul className="list-disc pl-5 mt-1">
                  {result.top.map((e, i) => <li key={i}>{e}</li>)}
                  {!result.top.length && <li>Some classes or subjects above are incomplete — they are highlighted.</li>}
                </ul>
              </div>
            )}
            {saveError && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-2" role="alert">{saveError}</div>}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button onClick={onCancel} disabled={saving} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 disabled:opacity-40">Cancel</button>
            <button onClick={save} disabled={saving} className="text-xs font-bold text-white rounded-lg px-5 py-2.5 disabled:opacity-50 flex items-center justify-center gap-1.5" style={{ backgroundColor: '#72102a' }}>
              <Icon name="check" className="w-4 h-4" />{saving ? 'Saving…' : `Save All Blueprints (${totalSubjects})`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
