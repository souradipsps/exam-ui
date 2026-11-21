// Blueprint data service.
// The project has no backend yet, so this module is the single data-access layer for the
// blueprint feature: async functions (with latency) persisted to localStorage. Swap the
// bodies for real fetch() calls when the API exists; the UI only talks to these functions.
// Academic context and "existing" question types are derived from the Question Bank data.
import { INITIAL_QUESTIONS } from './mockQuestions.js';

const KEY = 'examui.blueprints.v1';
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const uid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`.toUpperCase();

export const SESSIONS = ['2024-25', '2025-26', '2026-27'];
export const blueprintLabel = (examName, session) => `${examName} · ${session}`;
export const COGNITIVE_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

const EXAMS = [
  { id: 'EX-001', name: 'Unit Test 1', totalMarks: 25, duration: 60, session: '2025-26' },
  { id: 'EX-002', name: 'Mid Term Examination', totalMarks: 50, duration: 120, session: '2025-26' },
  { id: 'EX-003', name: 'Half Yearly Examination', totalMarks: 80, duration: 180, session: '2025-26' },
  { id: 'EX-004', name: 'Final Examination', totalMarks: 100, duration: 180, session: '2025-26' },
];

// Master question types (system catalogue)
const MASTER_TYPES = [
  'Multiple Choice (MCQ)', 'True / False', 'Short Answer', 'Long Essay / Problem',
  'Assertion & Reasoning', 'Fill in the Blanks', 'Match the Following', 'Case Study Based',
].map((name, i) => ({ id: `MT-${i + 1}`, name }));

function academicContexts() {
  const map = new Map();
  INITIAL_QUESTIONS.forEach((q) => {
    const k = `${q.class}|${q.subject}`;
    if (!map.has(k)) map.set(k, { id: `AC-${map.size + 1}`, className: q.class, subject: q.subject, srcClass: q.class, srcSubject: q.subject, chapters: new Set() });
    map.get(k).chapters.add(q.chapter);
  });
  return [...map.values()].map((c) => ({ ...c, chapters: [...c.chapters] }));
}

// Academic contexts are seeded from the Question Bank once, then are user-editable
// (add / rename class, subject, chapter) and persisted. srcClass/srcSubject keep the link
// to Question Bank questions after a rename.
function loadAcademic() {
  const db = read();
  if (!db.academic) { db.academic = academicContexts(); write(db); }
  return db.academic;
}

// Existing question types for a context, with availability + usual marks from the bank
function existingTypes(contextId) {
  const ctx = loadAcademic().find((c) => c.id === contextId);
  const pool = INITIAL_QUESTIONS.filter((q) => ctx && q.class === ctx.srcClass && q.subject === ctx.srcSubject);
  const stats = new Map();
  pool.forEach((q) => {
    const s = stats.get(q.type) || { available: 0, marks: {} };
    s.available += 1;
    s.marks[q.marks] = (s.marks[q.marks] || 0) + 1;
    stats.set(q.type, s);
  });
  return [...stats.entries()].map(([name, s]) => ({
    name,
    available: s.available,
    marks: Number(Object.entries(s.marks).sort((a, b) => b[1] - a[1])[0][0]),
  }));
}

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { blueprints: [], templates: [] }; }
  catch { return { blueprints: [], templates: [] }; }
};
const write = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage unavailable */ } };

export const blueprintService = {
  async getExams() { await delay(); return EXAMS; },
  async getAcademicContexts() { await delay(); return loadAcademic(); },
  async saveAcademicContexts(list) { const db = read(); db.academic = list; write(db); return list; },
  async getQuestionTypes(contextId) {
    await delay();
    return { existing: existingTypes(contextId), master: MASTER_TYPES };
  },
  async listBlueprints() { await delay(250); return read().blueprints; },
  async listTemplates() { await delay(250); return read().templates; },

  // Creates the template (if new) and the blueprint together so the relationship stays consistent.
  async createBlueprint({ session, exam, context, template, templateId }) {
    await delay(500);
    const db = read();
    let tid = templateId;
    if (!tid) {
      tid = uid('TPL');
      db.templates.unshift({ ...template, id: tid, createdAt: new Date().toISOString() });
    }
    const tpl = db.templates.find((t) => t.id === tid);
    const bp = {
      id: uid('BP'), session, name: blueprintLabel(exam.name, session), templateId: tid, templateName: tpl.name,
      exam: { id: exam.id, name: exam.name, totalMarks: exam.totalMarks, duration: exam.duration, session: exam.session },
      context: { id: context.id, className: context.className, subject: context.subject, chapters: context.chapters },
      createdAt: new Date().toISOString(),
    };
    db.blueprints.unshift(bp);
    write(db);
    return bp;
  },
  // Edit blueprint metadata and its template's variations
  async updateBlueprint(id, { session, variations }) {
    await delay(400);
    const db = read();
    const bp = db.blueprints.find((b) => b.id === id);
    if (!bp) throw new Error('Blueprint not found');
    bp.session = session;
    bp.name = blueprintLabel(bp.exam.name, session);
    const tpl = db.templates.find((t) => t.id === bp.templateId);
    if (tpl && variations) tpl.variations = variations;
    write(db);
    return bp;
  },
  async deleteBlueprint(id) {
    await delay(300);
    const db = read();
    db.blueprints = db.blueprints.filter((b) => b.id !== id);
    // drop templates no longer referenced by any blueprint
    db.templates = db.templates.filter((t) => db.blueprints.some((b) => b.templateId === t.id));
    write(db);
  },
};

// ---- validation (shared by wizard + edit) ----
export function emptyVariation(label = 'Variation 1') {
  return {
    label,
    mode: 'custom', // 'existing' | 'custom'
    sections: [{ name: 'Section A' }],
    rows: [], // { name, source:'existing'|'master', section, count, marks }
    cognitive: Object.fromEntries(COGNITIVE_LEVELS.map((l) => [l, 0])),
    difficulty: Object.fromEntries(DIFFICULTY_LEVELS.map((l) => [l, 0])),
  };
}

export const variationTotals = (v) => ({
  questions: v.rows.reduce((s, r) => s + (Number(r.count) || 0), 0),
  marks: v.rows.reduce((s, r) => s + (Number(r.count) || 0) * (Number(r.marks) || 0), 0),
});

export function validateVariation(v, examMarks) {
  const errs = [];
  const sum = (o) => Object.values(o).reduce((a, b) => a + (Number(b) || 0), 0);
  if (!v.sections.length || v.sections.some((s) => !s.name.trim())) errs.push('Every section needs a name.');
  if (!v.rows.length) errs.push('Select at least one question type.');
  v.rows.forEach((r) => {
    if (!(Number(r.count) > 0)) errs.push(`"${r.name}": number of questions must be greater than 0.`);
    if (!(Number(r.marks) > 0)) errs.push(`"${r.name}": marks per question must be greater than 0.`);
    if (!v.sections.some((s) => s.name === r.section)) errs.push(`"${r.name}": choose a section.`);
  });
  const t = variationTotals(v);
  if (v.rows.length && examMarks && t.marks !== examMarks) errs.push(`Total marks (${t.marks}) must equal the exam's total marks (${examMarks}).`);
  if (sum(v.cognitive) !== 100) errs.push(`Cognitive level distribution must total 100% (now ${sum(v.cognitive)}%).`);
  if (sum(v.difficulty) !== 100) errs.push(`Difficulty distribution must total 100% (now ${sum(v.difficulty)}%).`);
  return errs;
}
