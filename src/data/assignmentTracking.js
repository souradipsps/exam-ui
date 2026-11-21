// Assignment tracking data. Built from the Teacher Management assignments/teachers (teacherData.js).
// Those assignments carry no exam, due date or progress yet, so those fields are derived here
// as demo values until the API provides them.
import { INITIAL_ASSIGNMENTS, INITIAL_TEACHERS, QUESTION_BANK_ITEMS } from './teacherData.js';
import { blueprintService } from './blueprintService.js';

const DAY = 86400000;
const STATUS_CYCLE = ['Completed', 'In Progress', 'Pending'];

export const effectiveStatus = (row, now = Date.now()) =>
  row.status !== 'Completed' && row.dueDate < now ? 'Overdue' : row.status;

export const assignmentService = {
  async getTracking() {
    const exams = await blueprintService.getExams();
    const now = Date.now();
    const rows = [];
    INITIAL_ASSIGNMENTS.forEach((a) => {
      const teacherIds = a.teacherIds || (a.teacherId ? [a.teacherId] : []);
      const types = a.type === 'question'
        ? [...new Set((a.selectedQuestionIds || []).map((id) => QUESTION_BANK_ITEMS.find((q) => q.id === id)?.type).filter(Boolean))]
        : a.questionTypes || [];
      const required = a.type === 'question' ? (a.selectedQuestionIds || []).length : Number(a.questionCount) || 0;
      teacherIds.forEach((tid) => {
        const t = INITIAL_TEACHERS.find((x) => x.id === tid);
        types.forEach((qt) => {
          const i = rows.length;
          const status = STATUS_CYCLE[i % 3];
          const per = Math.max(1, Math.round(required / Math.max(types.length, 1)));
          rows.push({
            id: `${a.id}-${tid}-${qt}`,
            assignmentId: a.id,
            educator: t?.name || tid,
            department: t?.department || '—',
            exam: exams[i % exams.length].name,
            questionType: qt,
            subject: a.subject,
            program: a.program,
            instructions: a.instructions,
            assignedDate: now - (3 + (i % 5)) * DAY,
            dueDate: now + ((i % 4) - 1.5) * 3 * DAY, // some already past due
            status,
            required: per,
            submitted: status === 'Completed' ? per : status === 'In Progress' ? Math.max(1, Math.floor(per / 2)) : 0,
          });
        });
      });
    });
    return rows;
  },
  // Submitted questions available in the question bank for this row's type
  submittedQuestions(row) {
    return QUESTION_BANK_ITEMS
      .filter((q) => q.type === row.questionType || row.questionType.includes(q.type))
      .slice(0, row.submitted);
  },
};
