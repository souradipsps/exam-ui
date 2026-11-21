import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { ModalWrapper } from '../common/ModalWrapper.jsx';
import { assignmentService, effectiveStatus } from '../../data/assignmentTracking.js';

const STATUS_STYLE = {
  Completed: ['#059669', 'rgba(5,150,105,0.10)'],
  'In Progress': ['#2563eb', 'rgba(37,99,235,0.10)'],
  Pending: ['#b45309', 'rgba(180,83,9,0.10)'],
  Overdue: ['#dc2626', 'rgba(220,38,38,0.10)'],
};
const fmt = (t) => new Date(t).toLocaleDateString();
const selCls = 'w-full border border-[#E8E2D9] rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#72102a]';

export const StatusBadge = ({ status }) => {
  const [c, bg] = STATUS_STYLE[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ color: c, background: bg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />{status}
    </span>
  );
};

export default function AssignmentTracking({ onBack }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [fExam, setFExam] = useState('All');
  const [fEducator, setFEducator] = useState('All');
  const [fType, setFType] = useState('All');
  const [fStatus, setFStatus] = useState('All');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    assignmentService.getTracking().then(setRows).catch(() => { setError('Could not load assignments.'); setRows([]); });
  }, []);

  const all = useMemo(() => (rows || []).map((r) => ({ ...r, eff: effectiveStatus(r) })), [rows]);
  const opts = (k) => ['All', ...new Set(all.map((r) => r[k]))];
  const filtered = all.filter((r) => {
    const s = search.toLowerCase();
    return (!s || r.educator.toLowerCase().includes(s) || r.exam.toLowerCase().includes(s))
      && (fExam === 'All' || r.exam === fExam) && (fEducator === 'All' || r.educator === fEducator)
      && (fType === 'All' || r.questionType === fType) && (fStatus === 'All' || r.eff === fStatus);
  });
  const count = (st) => all.filter((r) => r.status === st).length;
  const overdue = all.filter((r) => r.eff === 'Overdue').length;
  const cards = [
    ['Total Assigned', all.length, '#72102a', overdue ? `${overdue} overdue` : null],
    ['Completed', count('Completed'), '#059669'],
    ['In Progress', count('In Progress'), '#2563eb'],
    ['Pending', count('Pending'), '#b45309'],
  ];
  const reset = () => { setSearch(''); setFExam('All'); setFEducator('All'); setFType('All'); setFStatus('All'); };
  const filtersOn = [fExam, fEducator, fType, fStatus].some((v) => v !== 'All') || search;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] md:text-[22px] font-extrabold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>Assignment Tracking</h1>
          <p className="text-[12.5px] text-gray-500 mt-1">Track educators' question-setting progress by exam and question type</p>
        </div>
        <button onClick={onBack} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2.5">← Back to Blueprints</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(([label, value, color, note]) => (
          <div key={label} className="bg-white rounded-xl border border-[#E8E2D9] px-5 py-3.5 shadow-sm">
            <div className="text-2xl md:text-3xl font-extrabold leading-none mb-1.5" style={{ color }}>{rows ? value : '–'}</div>
            <div className="text-xs font-semibold text-gray-700">{label}</div>
            {note && <div className="text-[11px] text-red-600 font-semibold mt-0.5">{note}</div>}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8E2D9] rounded-[14px] p-4 shadow-sm flex flex-col gap-3">
        <div className="relative">
          <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input className="w-full pl-10 pr-3 py-2.5 text-[13px] bg-[#FAFAF9] border-[1.5px] border-[#E8E2D9] rounded-[10px] focus:outline-none focus:border-[#72102a]"
            placeholder="Search by educator name or exam…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          {[['Exam', fExam, setFExam, opts('exam')], ['Educator', fEducator, setFEducator, opts('educator')],
            ['Question Type', fType, setFType, opts('questionType')],
            ['Status', fStatus, setFStatus, ['All', 'Completed', 'In Progress', 'Pending', 'Overdue']]].map(([l, v, set, o]) => (
              <select key={l} className={selCls} aria-label={l} value={v} onChange={(e) => set(e.target.value)}>
                {o.map((x) => <option key={x} value={x}>{x === 'All' ? `All ${l}${l === 'Status' ? 'es' : 's'}` : x}</option>)}
              </select>
          ))}
          {filtersOn && (
            <button onClick={reset} className="col-span-2 lg:col-span-1 text-xs font-semibold rounded-lg px-3 py-2 border border-[#72102a]/20" style={{ color: '#72102a', background: 'rgba(114,16,42,0.06)' }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

      <div className="bg-white rounded-xl border border-[#E8E2D9] shadow-sm overflow-x-auto">
        {!rows ? <p className="p-8 text-center text-xs text-gray-400 animate-pulse">Loading assignments…</p>
          : filtered.length === 0 ? <p className="p-10 text-center text-xs text-gray-400">No assignments match your search or filters.</p> : (
            <table className="w-full text-xs min-w-[820px]">
              <thead>
                <tr className="text-left text-gray-500 bg-[#faf8f5]">
                  {['Educator', 'Exam', 'Question Type', 'Assigned', 'Due', 'Status', ''].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-[#E8E2D9]">
                    <td className="px-4 py-3 font-semibold text-gray-800">{r.educator}<div className="text-[11px] font-normal text-gray-400">{r.department}</div></td>
                    <td className="px-4 py-3">{r.exam}</td>
                    <td className="px-4 py-3">{r.questionType}</td>
                    <td className="px-4 py-3">{fmt(r.assignedDate)}</td>
                    <td className="px-4 py-3">{fmt(r.dueDate)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.eff} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDetail(r)} className="inline-flex items-center gap-1 font-semibold" style={{ color: '#72102a' }}>
                        <Icon name="eye" className="w-4 h-4" />View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {detail && (
        <ModalWrapper title="Assignment Details" subtitle={`${detail.educator} · ${detail.exam}`} onClose={() => setDetail(null)} wide>
          <dl className="grid grid-cols-2 gap-3 text-xs">
            {[['Educator', detail.educator], ['Department', detail.department], ['Exam', detail.exam], ['Question type', detail.questionType],
              ['Course', detail.subject], ['Programme', detail.program], ['Assigned', fmt(detail.assignedDate)], ['Due', fmt(detail.dueDate)],
              ['Progress', `${detail.submitted} / ${detail.required} questions submitted`]].map(([k, v]) => (
                <div key={k}><dt className="text-[11px] text-gray-400">{k}</dt><dd className="font-semibold text-gray-700">{v}</dd></div>
            ))}
            <div><dt className="text-[11px] text-gray-400">Status</dt><dd className="mt-0.5"><StatusBadge status={effectiveStatus(detail)} /></dd></div>
          </dl>
          {detail.instructions && <p className="text-xs text-gray-600 bg-[#faf8f5] rounded-lg p-3 mt-3">{detail.instructions}</p>}
          <h4 className="text-xs font-bold text-gray-700 mt-4 mb-1.5">Submitted questions</h4>
          {(() => {
            const qs = assignmentService.submittedQuestions(detail);
            if (qs.length === 0) {
              return <p className="text-xs text-gray-400">{detail.submitted ? `${detail.submitted} submitted — question previews aren't available for this type yet.` : 'Nothing submitted yet.'}</p>;
            }
            return (
              <ul className="flex flex-col gap-1.5">
                {qs.map((q) => <li key={q.id} className="text-xs border border-[#E8E2D9] rounded-lg p-2.5"><span className="font-mono font-bold text-gray-500 mr-2">{q.id}</span>{q.title}</li>)}
              </ul>
            );
          })()}
        </ModalWrapper>
      )}
    </div>
  );
}
