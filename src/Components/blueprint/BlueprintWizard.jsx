import React, { useEffect, useState } from 'react';
import Icon from '../common/Icon.jsx';
import VariationEditor, { VariationTabs, Section } from './VariationEditor.jsx';
import {
  blueprintService, emptyVariation, validateVariation, variationTotals,
} from '../../data/blueprintService.js';

const inputCls = 'w-full border border-[#E8E2D9] rounded-lg px-3 py-2.5 text-xs bg-white focus:outline-none focus:border-[#72102a]';
const btnPrimary = { backgroundColor: '#72102a' };
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

const STEPS = ['Exam', 'Academic Context', 'Template', 'Template Form', 'Review & Save'];

export default function BlueprintWizard({ onCancel, onSaved }) {
  const [step, setStep] = useState(0);
  const [exams, setExams] = useState(null);
  const [contexts, setContexts] = useState(null);
  const [templates, setTemplates] = useState(null);
  const [types, setTypes] = useState(null);
  const [loadError, setLoadError] = useState('');

  const [name, setName] = useState('');
  const [examId, setExamId] = useState('');
  const [contextId, setContextId] = useState('');
  const [tplMode, setTplMode] = useState('existing'); // 'existing' | 'new'
  const [templateId, setTemplateId] = useState('');
  const [tplName, setTplName] = useState('');
  const [variations, setVariations] = useState([emptyVariation()]);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const exam = exams?.find((e) => e.id === examId);
  const context = contexts?.find((c) => c.id === contextId);
  const template = templates?.find((t) => t.id === templateId);

  useEffect(() => {
    Promise.all([blueprintService.getExams(), blueprintService.getAcademicContexts(), blueprintService.listTemplates()])
      .then(([e, c, t]) => { setExams(e); setContexts(c); setTemplates(t); if (!t.length) setTplMode('new'); })
      .catch(() => setLoadError('Could not load exams / academic contexts. Please retry.'));
  }, []);

  useEffect(() => {
    if (!contextId) return;
    setTypes(null);
    blueprintService.getQuestionTypes(contextId).then(setTypes).catch(() => setLoadError('Could not load question types.'));
  }, [contextId]);

  const addVariation = () => {
    setVariations((vs) => [...vs, { ...JSON.parse(JSON.stringify(vs[active])), label: `Variation ${vs.length + 1}` }]);
    setActive(variations.length);
  };
  const removeVariation = (i) => {
    setVariations((vs) => vs.filter((_, j) => j !== i));
    setActive(0);
  };

  const needsNewTemplate = tplMode === 'new';
  const next = () => {
    const errs = [];
    if (step === 0) {
      if (!examId) errs.push('Select an exam.');
      if (!name.trim()) errs.push('Enter a blueprint name.');
    }
    if (step === 1 && !contextId) errs.push('Select an academic context.');
    if (step === 2) {
      if (tplMode === 'existing' && !templateId) errs.push('Select an existing template or choose to create a new one.');
      if (tplMode === 'new' && !tplName.trim()) errs.push('Enter a template name.');
    }
    if (step === 3) {
      variations.forEach((v) => validateVariation(v, exam.totalMarks).forEach((m) => errs.push(`${v.label}: ${m}`)));
    }
    setErrors(errs);
    if (errs.length) return;
    // existing template skips the template form
    setStep(step === 2 && !needsNewTemplate ? 4 : step + 1);
  };
  const back = () => { setErrors([]); setStep(step === 4 && !needsNewTemplate ? 2 : step - 1); };

  const save = async () => {
    setSaving(true);
    try {
      const bp = await blueprintService.createBlueprint({
        name: name.trim(), exam, context,
        templateId: needsNewTemplate ? null : templateId,
        template: needsNewTemplate ? { name: tplName.trim(), variations } : null,
      });
      onSaved(bp);
    } catch (e) {
      setErrors([e.message || 'Failed to save blueprint.']);
      setSaving(false);
    }
  };

  const shownVariations = needsNewTemplate ? variations : template?.variations || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[18px] md:text-[22px] font-extrabold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Create New Blueprint</h1>
          <p className="text-[12.5px] text-gray-500 mt-1">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>
        <button onClick={onCancel} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2">Cancel</button>
      </div>

      <ol className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1" title={s}>
            <div className="h-1.5 rounded-full" style={{ backgroundColor: i <= step ? '#72102a' : '#E8E2D9' }} />
            <span className={`hidden md:block text-[11px] mt-1 ${i === step ? 'font-bold text-gray-800' : 'text-gray-400'}`}>{s}</span>
          </li>
        ))}
      </ol>

      {loadError && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{loadError}</div>}

      {step === 0 && (
        <Section title="Blueprint & Exam" hint="Choose the exam this blueprint is for.">
          {!exams ? <Spinner text="Loading exams…" /> : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Blueprint name *"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Class 10 Physics Mid Term" /></Field>
              <Field label="Exam *">
                <select className={inputCls} value={examId} onChange={(e) => setExamId(e.target.value)}>
                  <option value="">Select exam…</option>
                  {exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </Field>
            </div>
          )}
          {exam && <Info rows={[['Type', exam.type], ['Term', exam.term], ['Total marks', exam.totalMarks], ['Duration', `${exam.duration} min`]]} />}
        </Section>
      )}

      {step === 1 && (
        <Section title="Academic Context" hint="Class, subject and chapters load automatically.">
          {!contexts ? <Spinner text="Loading academic contexts…" /> : (
            <Field label="Academic context *">
              <select className={inputCls} value={contextId} onChange={(e) => setContextId(e.target.value)}>
                <option value="">Select academic context…</option>
                {contexts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          )}
          {context && (
            <>
              <Info rows={[['Class / Programme', context.className], ['Subject / Course', context.subject], ['Chapters', context.chapters.length]]} />
              <div className="flex flex-wrap gap-1.5 mt-3">
                {context.chapters.map((c) => <span key={c} className="text-[11px] px-2 py-1 rounded-full bg-[#faf8f5] border border-[#E8E2D9] text-gray-600">{c}</span>)}
              </div>
            </>
          )}
        </Section>
      )}

      {step === 2 && (
        <Section title="Blueprint Template" hint="Reuse an existing template or define a new one.">
          <div className="grid gap-3 sm:grid-cols-2 mb-3">
            {[['existing', 'Select existing template'], ['new', 'Create a new template']].map(([m, l]) => (
              <button key={m} type="button" onClick={() => setTplMode(m)} disabled={m === 'existing' && !templates?.length}
                className={`text-left rounded-xl border p-3 text-xs font-semibold disabled:opacity-40 ${tplMode === m ? 'border-[#72102a] bg-[#72102a]/5 text-[#72102a]' : 'border-[#E8E2D9] text-gray-600'}`}>
                {l}{m === 'existing' && !templates?.length && <span className="block font-normal text-gray-400">No templates created yet</span>}
              </button>
            ))}
          </div>
          {!templates ? <Spinner text="Loading templates…" /> : tplMode === 'existing' ? (
            <Field label="Template *">
              <select className={inputCls} value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                <option value="">Select template…</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.variations.length} variation{t.variations.length > 1 ? 's' : ''})</option>)}
              </select>
            </Field>
          ) : (
            <Field label="New template name *"><input className={inputCls} value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="e.g. Standard 50-mark paper" /></Field>
          )}
        </Section>
      )}

      {step === 3 && (!types ? <Spinner text="Loading question types…" /> : (
        <div>
          <VariationTabs variations={variations} active={active} setActive={setActive} onAdd={addVariation} onRemove={removeVariation} />
          <input className={`${inputCls} mb-3`} value={variations[active].label} placeholder="Variation name"
            onChange={(e) => setVariations((vs) => vs.map((v, i) => (i === active ? { ...v, label: e.target.value } : v)))} />
          <VariationEditor value={variations[active]} types={types} examMarks={exam.totalMarks}
            onChange={(nv) => setVariations((vs) => vs.map((v, i) => (i === active ? nv : v)))} />
        </div>
      ))}

      {step === 4 && (
        <Section title="Review" hint="Confirm and save the blueprint.">
          <Info rows={[['Blueprint', name], ['Exam', `${exam.name} (${exam.totalMarks} marks)`], ['Context', context.name], ['Template', needsNewTemplate ? `${tplName} (new)` : template?.name]]} />
          <div className="mt-3 flex flex-col gap-1.5">
            {shownVariations.map((v, i) => {
              const t = variationTotals(v);
              return <div key={i} className="text-xs text-gray-600"><b>{v.label}</b> — {v.sections.length} section(s), {t.questions} questions, {t.marks} marks</div>;
            })}
          </div>
          {!needsNewTemplate && template && shownVariations.some((v) => variationTotals(v).marks !== exam.totalMarks) && (
            <p className="text-xs text-amber-600 mt-3">Note: the selected template's marks differ from the exam's total ({exam.totalMarks}).</p>
          )}
        </Section>
      )}

      {errors.length > 0 && (
        <ul className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 list-disc pl-6" role="alert">
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <div className="flex justify-between gap-2">
        <button onClick={back} disabled={step === 0 || saving} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 disabled:opacity-40">Back</button>
        {step < 4 ? (
          <button onClick={next} disabled={step === 3 && !types} className="text-xs font-bold text-white rounded-lg px-5 py-2.5 disabled:opacity-50" style={btnPrimary}>Next</button>
        ) : (
          <button onClick={save} disabled={saving} className="text-xs font-bold text-white rounded-lg px-5 py-2.5 disabled:opacity-50 flex items-center gap-1.5" style={btnPrimary}>
            <Icon name="check" className="w-4 h-4" />{saving ? 'Saving…' : 'Save Blueprint'}
          </button>
        )}
      </div>
    </div>
  );
}
