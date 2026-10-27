export const NAV_ITEMS = [
  { id: 'questionBank',         label: 'Question Bank',             icon: 'book' },
  { id: 'teacherManagement',    label: 'Teacher Management',        icon: 'users' },
  { id: 'examBlueprint',        label: 'Exam Question Blueprint',   icon: 'clipboard' },
  { id: 'questionCreation',     label: 'Question Creation',         icon: 'plus' },
  { id: 'generatePaper',        label: 'Generate Question Paper',   icon: 'refresh' },
  { id: 'paperManagement',      label: 'Question Paper Management', icon: 'grid' },
];

export const COMING_SOON_PAGES = {
  teacherManagement: {
    icon: 'users',
    label: 'Teacher Management',
    desc: 'Manage teacher profiles, subject assignments, and workload tracking.',
  },
  examBlueprint: {
    icon: 'clipboard',
    label: 'Exam Question Blueprint',
    desc: 'Design and manage structured blueprints for exam papers by subject and class.',
  },
  questionCreation: {
    icon: 'plus',
    label: 'Question Creation',
    desc: 'Author new exam questions with rich formatting, options, and rubrics.',
  },
  generatePaper: {
    icon: 'refresh',
    label: 'Generate Question Paper',
    desc: 'Auto-generate balanced question papers based on syllabus and blueprint criteria.',
  },
  paperManagement: {
    icon: 'grid',
    label: 'Question Paper Management',
    desc: 'Review, approve, version-control, and archive finalised exam papers.',
  },
};
