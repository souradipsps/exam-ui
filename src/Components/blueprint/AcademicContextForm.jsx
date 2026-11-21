import React, { useState } from 'react';
import Icon from '../common/Icon.jsx';
import VariationEditor, { TemplatePreview } from './VariationEditor.jsx';
import { emptyVariation, validateVariation } from '../../data/blueprintService.js';

const inputCls = 'w-full border border-[#E8E2D9] rounded-lg px-3 py-2.5 text-xs bg-white focus:outline-none focus:border-[#72102a]';
const maroon = { color: '#72102a' };
const uid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`.toUpperCase();
const uniq = (a) => [...new Set(a.filter(Boolean))];

export const newSubject = (defaultMode = 'new') => ({
  key: uid('S'), subject: '', chapters: [], tplMode: defaultMode, templateId: '', tplName: '',
  config: emptyVariation('Template'), open: true,
});
export const newClass = (defaultMode) => ({ key: uid('C'), className: '', subjects: [newSubject(defaultMode)] });

/** Validation for one subject entry; returns a list of messages. */
export function validateSubject(s, templates, examMarks) {
  const errs = [];
  if (!s.subject) return ['Select a subject / course.'];
  if (!s.chapters.length) errs.push('Select at least one chapter.');
  if (s.tplMode === 'existing') {
    if (!s.templateId) errs.push('Select an existing template or create a new one.');
    else if (!templates.some((t) => t.id === s.templateId)) errs.push('The selected template no longer exists.');
  } else {
    if (!s.tplName.trim()) errs.push('Enter a template name.');
    validateVariation(s.config, examMarks).forEach((m) => errs.push(m));
  }
  return errs;
}

export function NameEditor({ initial = '', label, onSave, onCancel, existing }) {
  const [v, setV] = useState(initial);
  const [err, setErr] = useState('');
  const submit = () => {
    const name = v.trim();
    if (!name) return setErr('Enter a name.');
    if (name !== initial && existing.some((x) => x.toLowerCase() === name.toLowerCase())) return setErr('That name already exists.');
    onSave(name);
  };
  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input autoFocus className={inputCls} value={v} placeholder={label}
          onChange={(e) => { setV(e.target.value); setErr(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } if (e.key === 'Escape') onCancel(); }} />
        <button type="button" onClick={submit} className="px-3 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: '#72102a' }}>Save</button>
        <button type="button" onClick={onCancel} className="px-3 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100">Cancel</button>
      </div>
      {err && <p className="text-[11px] text-red-600 mt-1">{err}</p>}
    </div>
  );
}

const LinkBtn = ({ onClick, children, disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled} className="text-[11px] font-semibold disabled:opacity-30 disabled:cursor-not-allowed" style={maroon}>{children}</button>
);

/** One subject blueprint: subject, chapters, template, template configuration. */
function SubjectCard({ index, s, cls, contexts, setContexts, templates, typesMap, examMarks, errors, canRemove, upd, remove }) {
  const [edit, setEdit] = useState(null); // {field:'subject'|'chapter', mode, chapter?}
  const ctx = contexts.find((c) => c.className === cls.className && c.subject === s.subject);
  const allChapters = ctx?.chapters || [];
  const usedSubjects = cls.subjects.filter((x) => x.key !== s.key).map((x) => x.subject);
  const subjectOptions = uniq(contexts.filter((c) => c.className === cls.className).map((c) => c.subject)).filter((x) => !usedSubjects.includes(x));
  const template = templates.find((t) => t.id === s.templateId);
  const types = ctx && typesMap[ctx.id];
  const done = () => setEdit(null);

  const pickSubject = (sub) => {
    const x = contexts.find((c) => c.className === cls.className && c.subject === sub);
    upd({ subject: sub, chapters: x ? [...x.chapters] : [] }); // all chapters pre-selected
    done();
  };
  const saveSubject = (name) => {
    if (edit.mode === 'add') {
      const blank = contexts.find((c) => c.className === cls.className && !c.subject);
      setContexts(blank ? contexts.map((c) => (c === blank ? { ...c, subject: name } : c)) : [...contexts, { id: uid('AC'), className: cls.className, subject: name, chapters: [] }]);
      upd({ subject: name, chapters: [] });
    } else {
      setContexts(contexts.map((c) => (c.className === cls.className && c.subject === s.subject ? { ...c, subject: name } : c)));
      upd({ subject: name });
    }
    done();
  };
  const saveChapter = (name) => {
    if (edit.mode === 'add') {
      setContexts(contexts.map((c) => (c === ctx ? { ...c, chapters: [...c.chapters, name] } : c)));
      upd({ chapters: [...s.chapters, name] });
    } else {
      const swap = (l) => l.map((x) => (x === edit.chapter ? name : x));
      setContexts(contexts.map((c) => (c === ctx ? { ...c, chapters: swap(c.chapters) } : c)));
      upd({ chapters: swap(s.chapters) });
    }
    done();
  };
  const toggle = (ch) => upd({ chapters: s.chapters.includes(ch) ? s.chapters.filter((x) => x !== ch) : [...s.chapters, ch] });

  const status = s.subject && !validateSubject(s, templates, examMarks).length;

  return (
    <div className={`rounded-xl border bg-white ${errors?.length ? 'border-red-300' : 'border-[#E8E2D9]'}`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button type="button" onClick={() => upd({ open: !s.open })} className="flex-1 min-w-0 flex items-center gap-2 text-left" aria-expanded={s.open}>
          <Icon name="chevronRight" className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${s.open ? 'rotate-90' : ''}`} />
          <span className="min-w-0">
            <span className="block text-[13px] font-bold text-gray-800 truncate">{s.subject || `Subject ${index + 1}`}</span>
            <span className="block text-[11px] text-gray-400 truncate">
              {s.chapters.length} chapter{s.chapters.length === 1 ? '' : 's'} · {s.tplMode === 'existing' ? (template?.name || 'No template') : (s.tplName || 'New template')}
            </span>
          </span>
        </button>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${status ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>{status ? 'Ready' : 'Incomplete'}</span>
        <button type="button" disabled={!canRemove} onClick={remove} aria-label="Remove subject" title={canRemove ? 'Remove subject' : 'A class needs at least one subject'}
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30"><Icon name="trash" className="w-4 h-4" /></button>
      </div>

      {s.open && (
        <div className="px-3 sm:px-4 pb-4 pt-1 border-t border-[#E8E2D9] flex flex-col gap-4">
          {/* Subject */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-600">Subject / Course *</span>
              <span className="flex gap-3">
                <LinkBtn disabled={!s.subject} onClick={() => setEdit({ field: 'subject', mode: 'rename' })}>Edit name</LinkBtn>
                <LinkBtn disabled={!cls.className} onClick={() => setEdit({ field: 'subject', mode: 'add' })}>+ Add new</LinkBtn>
              </span>
            </div>
            <select className={inputCls} value={s.subject} disabled={!cls.className} onChange={(e) => pickSubject(e.target.value)}>
              <option value="">{cls.className ? 'Select subject / course…' : 'Select a class first'}</option>
              {subjectOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            {edit?.field === 'subject' && (
              <NameEditor key={edit.mode} label={edit.mode === 'add' ? 'New subject name' : 'Rename subject'} initial={edit.mode === 'rename' ? s.subject : ''}
                existing={uniq(contexts.filter((c) => c.className === cls.className).map((c) => c.subject))} onSave={saveSubject} onCancel={done} />
            )}
          </div>

          {/* Chapters */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-600">Chapters * <span className="font-normal text-gray-400">({s.chapters.length}/{allChapters.length})</span></span>
              <span className="flex gap-3">
                <LinkBtn disabled={!ctx} onClick={() => upd({ chapters: s.chapters.length === allChapters.length ? [] : [...allChapters] })}>
                  {s.chapters.length === allChapters.length && allChapters.length ? 'Clear all' : 'Select all'}
                </LinkBtn>
                <LinkBtn disabled={!ctx} onClick={() => setEdit({ field: 'chapter', mode: 'add' })}>+ Add new</LinkBtn>
              </span>
            </div>
            {!ctx ? <p className="text-xs text-gray-400">Select a subject to load its chapters.</p>
              : allChapters.length === 0 ? <p className="text-xs text-gray-400">No chapters yet — add one.</p> : (
                <div className="flex flex-wrap gap-2">
                  {allChapters.map((ch) => {
                    const on = s.chapters.includes(ch);
                    return (
                      <span key={ch} className={`inline-flex items-center rounded-full border text-[11px] font-semibold ${on ? 'text-white border-transparent' : 'text-gray-600 border-[#E8E2D9] bg-white'}`} style={on ? { backgroundColor: '#72102a' } : undefined}>
                        <button type="button" className="pl-3 pr-1.5 py-1 text-left" onClick={() => toggle(ch)}>{ch}</button>
                        <button type="button" className="pr-2 py-1 opacity-70 hover:opacity-100" aria-label={`Edit ${ch}`} title="Edit name" onClick={() => setEdit({ field: 'chapter', mode: 'rename', chapter: ch })}>
                          <Icon name="edit" className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            {edit?.field === 'chapter' && (
              <NameEditor key={`${edit.mode}${edit.chapter}`} label={edit.mode === 'add' ? 'New chapter name' : 'Rename chapter'} initial={edit.chapter || ''}
                existing={allChapters} onSave={saveChapter} onCancel={done} />
            )}
          </div>

          {/* Template */}
          <div>
            <span className="text-xs font-semibold text-gray-600">Blueprint Template *</span>
            <div className="grid gap-2 sm:grid-cols-2 mt-1.5">
              {[['existing', 'Select existing template'], ['new', 'Create a new template']].map(([m, l]) => (
                <button key={m} type="button" onClick={() => upd({ tplMode: m })} disabled={m === 'existing' && !templates.length}
                  className={`text-left rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-40 ${s.tplMode === m ? 'border-[#72102a] bg-[#72102a]/5 text-[#72102a]' : 'border-[#E8E2D9] text-gray-600'}`}>
                  {l}{m === 'existing' && !templates.length && <span className="block font-normal text-gray-400">No templates created yet</span>}
                </button>
              ))}
            </div>
            {s.tplMode === 'existing' ? (
              <div className="mt-2">
                <select className={inputCls} value={s.templateId} onChange={(e) => upd({ templateId: e.target.value })} aria-label="Template">
                  <option value="">Select template…</option>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                {template?.variations?.[0] && <TemplatePreview v={template.variations[0]} />}
              </div>
            ) : (
              <div className="mt-2">
                <input className={inputCls} value={s.tplName} placeholder="New template name, e.g. Standard 50-mark paper" onChange={(e) => upd({ tplName: e.target.value })} />
                <div className="mt-3">
                  {!ctx ? <p className="text-xs text-gray-400">Select a subject to configure the template.</p>
                    : !types ? <p className="text-xs text-gray-400 py-6 text-center animate-pulse">Loading question types…</p>
                      : <VariationEditor value={s.config} types={types} examMarks={examMarks} onChange={(config) => upd({ config })} />}
                </div>
              </div>
            )}
          </div>

          {errors?.length > 0 && (
            <ul className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 list-disc pl-6" role="alert">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
          )}
        </div>
      )}
    </div>
  );
}

/** Class sections, each with its own subject blueprints. */
export default function AcademicContextForm({ contexts, setContexts, classes, setClasses, templates, typesMap, examMarks, errors, defaultMode }) {
  const [edit, setEdit] = useState(null); // {key, mode}
  const updClass = (ck, fn) => setClasses((cs) => cs.map((c) => (c.key === ck ? fn(c) : c)));
  const updSubj = (ck, sk, patch) => updClass(ck, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.key === sk ? { ...s, ...patch } : s)) }));
  const allClassNames = uniq(contexts.map((c) => c.className));

  const pickClass = (ck, name) => {
    // changing the class re-validates each subject against the new class's options
    updClass(ck, (c) => ({
      ...c, className: name,
      subjects: c.subjects.map((s) => {
        const x = contexts.find((k) => k.className === name && k.subject === s.subject);
        return x ? { ...s, chapters: s.chapters.filter((ch) => x.chapters.includes(ch)) } : { ...s, subject: '', chapters: [] };
      }),
    }));
    setEdit(null);
  };
  const saveClass = (c, name) => {
    if (edit.mode === 'add') {
      setContexts([...contexts, { id: uid('AC'), className: name, subject: '', chapters: [] }]);
      pickClass(c.key, name);
    } else {
      setContexts(contexts.map((k) => (k.className === c.className ? { ...k, className: name } : k)));
      setClasses((cs) => cs.map((x) => (x.className === c.className ? { ...x, className: name } : x)));
      setEdit(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {classes.map((cls, ci) => {
        const classOptions = allClassNames.filter((n) => n === cls.className || !classes.some((x) => x.className === n));
        return (
          <div key={cls.key} className="rounded-xl border border-[#E8E2D9] bg-[#faf8f5] p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500 pt-1">Class {ci + 1}</span>
              <button type="button" disabled={classes.length === 1} onClick={() => setClasses((cs) => cs.filter((c) => c.key !== cls.key))}
                className="text-xs font-semibold text-red-500 disabled:opacity-30 px-2 py-1 rounded-lg hover:bg-red-50" title={classes.length === 1 ? 'At least one class is required' : 'Remove class'}>Remove class</button>
            </div>
            <div className="mt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600">Class / Programme *</span>
                <span className="flex gap-3">
                  <LinkBtn disabled={!cls.className} onClick={() => setEdit({ key: cls.key, mode: 'rename' })}>Edit name</LinkBtn>
                  <LinkBtn onClick={() => setEdit({ key: cls.key, mode: 'add' })}>+ Add new</LinkBtn>
                </span>
              </div>
              <select className={`${inputCls} sm:max-w-sm`} value={cls.className} onChange={(e) => pickClass(cls.key, e.target.value)}>
                <option value="">Select class / programme…</option>
                {classOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {edit?.key === cls.key && (
                <div className="sm:max-w-sm">
                  <NameEditor key={edit.mode} label={edit.mode === 'add' ? 'New class / programme' : 'Rename class / programme'} initial={edit.mode === 'rename' ? cls.className : ''}
                    existing={allClassNames} onSave={(n) => saveClass(cls, n)} onCancel={() => setEdit(null)} />
                </div>
              )}
              {errors?.[cls.key] && <p className="text-xs text-red-600 mt-1">{errors[cls.key]}</p>}
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {cls.subjects.map((s, si) => (
                <SubjectCard key={s.key} index={si} s={s} cls={cls} contexts={contexts} setContexts={setContexts}
                  templates={templates} typesMap={typesMap} examMarks={examMarks} errors={errors?.[s.key]} canRemove={cls.subjects.length > 1}
                  upd={(patch) => updSubj(cls.key, s.key, patch)}
                  remove={() => updClass(cls.key, (c) => ({ ...c, subjects: c.subjects.filter((x) => x.key !== s.key) }))} />
              ))}
              <button type="button" disabled={!cls.className} onClick={() => updClass(cls.key, (c) => ({ ...c, subjects: [...c.subjects, newSubject(defaultMode)] }))}
                className="self-start text-xs font-bold rounded-lg px-3 py-2 border border-dashed border-[#72102a] disabled:opacity-40 flex items-center gap-1" style={maroon}>
                <Icon name="plus" className="w-3.5 h-3.5" /> Add Another Subject
              </button>
            </div>
          </div>
        );
      })}
      <button type="button" onClick={() => setClasses((cs) => [...cs, newClass(defaultMode)])}
        className="self-start text-xs font-bold rounded-lg px-4 py-2.5 text-white flex items-center gap-1" style={{ backgroundColor: '#72102a' }}>
        <Icon name="plus" className="w-4 h-4" /> Add Another Class
      </button>
    </div>
  );
}
