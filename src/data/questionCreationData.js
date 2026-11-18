// Question Creation Data Layer
// Implements the two-track workflow:
// Track A: Question Type Management (Master Types, Submitted Types Set)
// Track B: Question Authoring (Blueprint Alignment, Cognitive/Difficulty Levels, Question Sets)

export const COGNITIVE_LEVELS = [
  { id: 'Remember', name: 'Remember / Knowledge', desc: 'Recall facts, terms, basic concepts, and answers.' },
  { id: 'Understand', name: 'Understand / Comprehension', desc: 'Demonstrate understanding of facts and ideas by organizing, comparing.' },
  { id: 'Apply', name: 'Apply / Application', desc: 'Solve problems to new situations by applying acquired knowledge.' },
  { id: 'Analyze', name: 'Analyze / Analysis', desc: 'Examine and break information into parts by identifying motives or causes.' },
  { id: 'Evaluate', name: 'Evaluate / Evaluation', desc: 'Present and defend opinions by making judgments about information.' },
  { id: 'Create', name: 'Create / Synthesis', desc: 'Compile information together in a different way or propose alternative solutions.' }
];

export const DIFFICULTY_LEVELS = [
  { id: 'Easy', name: 'Easy', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { id: 'Medium', name: 'Medium', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { id: 'Hard', name: 'Hard', color: 'rose', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
];

export const ACADEMIC_PROGRAMS = [
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 11 - Science",
  "Class 12 (Science)",
  "Class 12 - Science",
  "B.Tech - Computer Science Engineering",
  "B.Sc - Mathematics & Computing",
  "B.Sc - Physics & Applied Sciences"
];

export const PROGRAM_SUBJECTS = {
  "Class 9": ["Mathematics", "Physics", "Chemistry", "Biology", "English Literature"],
  "Class 10": ["Mathematics", "Physics", "Chemistry", "Biology", "English Literature"],
  "Class 11": ["English Core", "Physics", "Chemistry", "Mathematics", "Humanities Studies"],
  "Class 11 - Science": ["Physics", "Chemistry", "Mathematics", "Computer Science"],
  "Class 12 (Science)": ["Organic Chemistry (CH-204)", "Physics", "Chemistry", "Mathematics", "Computer Science"],
  "Class 12 - Science": ["Physics", "Chemistry", "Mathematics", "Computer Science"],
  "B.Tech - Computer Science Engineering": [
    "Artificial Intelligence (CS-401)",
    "Operating Systems (CS-305)",
    "Database Management (CS-301)",
    "Data Structures & Algorithms (CS-201)",
    "Machine Learning Systems (CS-402)"
  ],
  "B.Sc - Mathematics & Computing": [
    "Linear Algebra (MA-102)",
    "Calculus III (MA-201)",
    "Discrete Mathematics (MA-303)"
  ],
  "B.Sc - Physics & Applied Sciences": [
    "Quantum Mechanics (PH-301)",
    "Electromagnetism (PH-202)",
    "Optics & Photonic Lab (PH-104)"
  ]
};

export const EXAMS_LIST = [
  { id: "EX-1", name: "Term I Examination", session: "2026-27", defaultMarks: 100 },
  { id: "EX-2", name: "Half-Yearly Examination", session: "2026-27", defaultMarks: 80 },
  { id: "EX-3", name: "Mid-Term Assessment", session: "2026-27", defaultMarks: 50 },
  { id: "EX-4", name: "Annual / Final Board Examination", session: "2026-27", defaultMarks: 100 }
];

export const SESSIONS_LIST = ["2026-27", "2025-26", "2027-28"];

// Master Question Types Catalogue (Step 2 in Track A)
export const MASTER_QUESTION_TYPES = [
  {
    id: "MQT-MCQ",
    name: "Multiple Choice (MCQ)",
    category: "Objective",
    defaultMarks: 1,
    marksRange: "1 - 2 Marks",
    description: "Standard single-select or multi-select objective item with 4 distinct options and one verified correct key.",
    rubricTemplate: "1 Mark for exact correct option selection. No partial credit. Optional negative marking (-0.25).",
    requiresOptions: true,
    structure: "Stem prompt + Options A, B, C, D + Explanation key"
  },
  {
    id: "MQT-TRUEFALSE",
    name: "True / False",
    category: "Objective",
    defaultMarks: 1,
    marksRange: "1 Mark",
    description: "Binary verification question testing basic factual retention or immediate logical consistency.",
    rubricTemplate: "1 Mark for correct truth determination. 0 for incorrect or omitted.",
    requiresOptions: true,
    structure: "Factual proposition statement with True / False selection"
  },
  {
    id: "MQT-SHORT",
    name: "Short Answer",
    category: "Subjective",
    defaultMarks: 3,
    marksRange: "2 - 4 Marks",
    description: "Concise response question requiring definitions, brief explanations, direct calculations, or 2-4 bullet points (30-50 words).",
    rubricTemplate: "Step-wise grading: 1 mark for core definition/principle, 1 mark for formula/diagram, 1 mark for concluding inference.",
    requiresOptions: false,
    structure: "Targeted prompt with 50-word answer boundary and key phrases rubric"
  },
  {
    id: "MQT-ESSAY",
    name: "Long Essay / Problem",
    category: "Comprehensive",
    defaultMarks: 5,
    marksRange: "5 - 10 Marks",
    description: "Extended analytical question requiring comprehensive derivations, multi-step proofs, structural designs, or essay arguments (150-300 words).",
    rubricTemplate: "5-point rubric: 1 mark setup/givens, 2 marks working steps/proof mechanics, 1 mark final answer with units, 1 mark reasoning/justification.",
    requiresOptions: false,
    structure: "Comprehensive problem statement with multi-stage evaluation criteria"
  },
  {
    id: "MQT-ASSERTION",
    name: "Assertion & Reasoning",
    category: "Analytical",
    defaultMarks: 2,
    marksRange: "1 - 2 Marks",
    description: "Two related statements (Assertion [A] and Reason [R]). Evaluates student ability to discern whether Reason accurately explains the Assertion.",
    rubricTemplate: "2 Marks for correct identification of truth values and causal explanatory validity between A and R.",
    requiresOptions: true,
    structure: "Statement [A] + Statement [R] with 4 standard relationship options"
  },
  {
    id: "MQT-CASESTUDY",
    name: "Case Study / Passage Based",
    category: "Applied Context",
    defaultMarks: 4,
    marksRange: "4 - 8 Marks",
    description: "Contextual real-world case, experimental lab scenario, or literary excerpt followed by 3-5 integrated sub-questions.",
    rubricTemplate: "Independent sub-part allocation: 1 mark per objective query, 2 marks for analytical synthesis.",
    requiresOptions: false,
    structure: "Background passage/data table/exhibit + 3 to 4 sequential sub-prompts"
  },
  {
    id: "MQT-CODING",
    name: "Coding Task / Algorithm",
    category: "Practical",
    defaultMarks: 5,
    marksRange: "4 - 10 Marks",
    description: "Hands-on computational problem requiring pseudocode, algorithm complexity analysis, or working source code in Python/C++/Java.",
    rubricTemplate: "2 marks logic/approach, 2 marks syntactic correctness & edge-case handling, 1 mark time/space complexity commentary.",
    requiresOptions: false,
    structure: "Problem brief + Input/Output specification + Sample constraints + Starter stub"
  },
  {
    id: "MQT-FILLBLANKS",
    name: "Fill in the Blanks",
    category: "Objective",
    defaultMarks: 1,
    marksRange: "1 - 2 Marks",
    description: "Sentence with missing key terminologies or values to test recall precision without multiple choice distractors.",
    rubricTemplate: "1 mark per correct blank term (allowing accepted synonyms).",
    requiresOptions: false,
    structure: "Sentence with ____ delimiters + allowed equivalent answer list"
  },
  {
    id: "MQT-MATCH",
    name: "Match the Following",
    category: "Relational",
    defaultMarks: 3,
    marksRange: "2 - 4 Marks",
    description: "Two columns of interconnected concepts, dates, formulas, or biological terms requiring correct one-to-one or one-to-many pairings.",
    rubricTemplate: "0.5 to 1 mark per correct pairing. Full marks for all correct.",
    requiresOptions: true,
    structure: "Column I (Items 1-4) vs Column II (Items A-D) with combination options"
  }
];

// Initial Question Type Sets (Course Sets with New Request Notifications)
export const INITIAL_QUESTION_TYPE_SETS = [
  // New Requests Arrived (Pending Teacher Setup)
  {
    id: "QTS-REQ-01",
    program: "Class 11",
    subject: "English Core",
    chapters: ["The Portrait of a Lady", "A Photograph", "Note Making & Summarizing"],
    assessmentTag: "Term I Assessment",
    requestedBy: "Exam Controller",
    requestedAt: "Just now",
    department: "Humanities",
    assignedTeacher: "Current Educator (You)",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "Just now",
    questionTypes: []
  },
  {
    id: "QTS-REQ-02",
    program: "Class 11",
    subject: "English Core",
    chapters: ["We're Not Afraid to Die", "Discovering Tut", "Grammar & Tenses"],
    assessmentTag: "Term I Assessment",
    requestedBy: "Exam Controller",
    requestedAt: "Just now",
    department: "Humanities",
    assignedTeacher: "Current Educator (You)",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "Just now",
    questionTypes: []
  },
  {
    id: "QTS-REQ-03",
    program: "Class 12 (Science)",
    subject: "Organic Chemistry (CH-204)",
    chapters: ["Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers", "Aldehydes & Ketones"],
    assessmentTag: "Pre-Board Exam",
    requestedBy: "Exam Controller",
    requestedAt: "Just now",
    department: "Science",
    assignedTeacher: "Dr. Aris Thorne",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "Just now",
    questionTypes: []
  },
  {
    id: "QTS-REQ-04",
    program: "Class 12 (Science)",
    subject: "Organic Chemistry (CH-204)",
    chapters: ["Amines", "Biomolecules", "Reaction Mechanisms"],
    assessmentTag: "Pre-Board Exam",
    requestedBy: "Exam Controller",
    requestedAt: "Just now",
    department: "Science",
    assignedTeacher: "Dr. Aris Thorne",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "Just now",
    questionTypes: []
  },
  {
    id: "QTS-REQ-05",
    program: "B.Tech - Computer Science Engineering",
    subject: "Operating Systems (CS-305)",
    chapters: ["Process Scheduling", "Deadlocks & Synchronization", "Virtual Memory"],
    assessmentTag: "Mid-Sem Blueprint",
    requestedBy: "Exam Controller",
    requestedAt: "Just now",
    department: "Computer Science",
    assignedTeacher: "Prof. Alan Turing",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "Just now",
    questionTypes: []
  },
  {
    id: "QTS-REQ-06",
    program: "Class 10",
    subject: "Chemistry",
    chapters: ["Chemical Reactions & Equations", "Acids, Bases & Salts", "Metals & Non-Metals"],
    assessmentTag: "Urgent - Unit Test II",
    requestedBy: "HOD Science",
    requestedAt: "12 mins ago",
    department: "Science",
    assignedTeacher: "Dr. Aris Thorne",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "12 mins ago",
    questionTypes: []
  },
  {
    id: "QTS-REQ-07",
    program: "B.Tech - Computer Science Engineering",
    subject: "Database Management (CS-301)",
    chapters: ["ER Modeling & Relational Algebra", "SQL & Normalization", "Transactions & Concurrency"],
    assessmentTag: "Term I Assessment",
    requestedBy: "Exam Controller",
    requestedAt: "1 hour ago",
    department: "Computer Science",
    assignedTeacher: "Prof. Alan Turing",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "1 hour ago",
    questionTypes: []
  },
  {
    id: "QTS-REQ-08",
    program: "Class 9",
    subject: "Mathematics",
    chapters: ["Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables"],
    assessmentTag: "Unit Test II",
    requestedBy: "HOD Mathematics",
    requestedAt: "2 hours ago",
    department: "Mathematics",
    assignedTeacher: "Prof. Marcus Thorne",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "2 hours ago",
    questionTypes: []
  },
  {
    id: "QTS-REQ-09",
    program: "Class 11",
    subject: "Physics",
    chapters: ["Laws of Motion", "Work, Energy & Power", "Rotational Motion"],
    assessmentTag: "Term I Assessment",
    requestedBy: "Exam Controller",
    requestedAt: "3 hours ago",
    department: "Science",
    assignedTeacher: "Dr. Sarah Lin",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "3 hours ago",
    questionTypes: []
  },

  // Configured Courses
  {
    id: "QTS-SET-01",
    program: "B.Tech - Computer Science Engineering",
    subject: "Artificial Intelligence (CS-401)",
    chapters: ["Heuristic Search (A*)", "Knowledge Representation", "Bayesian Networks"],
    assessmentTag: "End Semester Exam",
    department: "Computer Science",
    assignedTeacher: "Dr. Evelyn Vance",
    status: "Approved",
    isNewRequest: false,
    updatedAt: "2 hours ago",
    questionTypes: [
      { id: "MQT-MCQ", name: "Multiple Choice (MCQ)", category: "Objective" },
      { id: "MQT-SHORT", name: "Short Answer", category: "Conceptual" },
      { id: "MQT-ESSAY", name: "Long Essay / Problem", category: "Analytical" }
    ]
  },
  {
    id: "QTS-SET-02",
    program: "B.Sc - Physics & Applied Sciences",
    subject: "Quantum Mechanics (PH-301)",
    chapters: ["Wave-Particle Duality", "Schrödinger Equation", "Quantum Tunneling"],
    assessmentTag: "Mid-Sem Examination",
    department: "Physics",
    assignedTeacher: "Dr. Sarah Lin",
    status: "Approved",
    isNewRequest: false,
    updatedAt: "Yesterday",
    questionTypes: [
      { id: "MQT-MCQ", name: "Multiple Choice (MCQ)", category: "Objective" },
      { id: "MQT-ESSAY", name: "Long Derivations", category: "Comprehensive" },
      { id: "MQT-SHORT", name: "Short Numericals", category: "Subjective" }
    ]
  },
  {
    id: "QTS-SET-03",
    program: "B.Sc - Mathematics & Computing",
    subject: "Linear Algebra (MA-102)",
    chapters: ["Vector Spaces", "Eigenvalues & Eigenvectors", "Linear Transformations"],
    assessmentTag: "Term I Assessment",
    department: "Mathematics",
    assignedTeacher: "Prof. Marcus Thorne",
    status: "Approved",
    isNewRequest: false,
    updatedAt: "1 day ago",
    questionTypes: [
      { id: "MQT-TRUEFALSE", name: "True / False", category: "Objective" },
      { id: "MQT-SHORT", name: "Short Matrix Proofs", category: "Subjective" },
      { id: "MQT-ESSAY", name: "Long Analytical Proofs", category: "Comprehensive" }
    ]
  },
  {
    id: "QTS-SET-04",
    program: "Class 10",
    subject: "Physics",
    chapters: ["Optics & Light Reflection", "Human Eye & Colourful World", "Electricity"],
    assessmentTag: "Pre-Board Exam",
    department: "Science",
    assignedTeacher: "Dr. Sarah Lin",
    status: "Draft",
    isNewRequest: false,
    updatedAt: "30 minutes ago",
    questionTypes: [
      { id: "MQT-MCQ", name: "Multiple Choice (MCQ)", category: "Objective" },
      { id: "MQT-ASSERTION", name: "Assertion & Reasoning", category: "Analytical" },
      { id: "MQT-SHORT", name: "Short Answer", category: "Subjective" },
      { id: "MQT-CASESTUDY", name: "Case Study Based", category: "Applied Context" }
    ]
  },
  {
    id: "QTS-SET-05",
    program: "Class 10",
    subject: "Mathematics",
    chapters: ["Quadratic Equations", "Triangles & Similarity", "Trigonometry"],
    assessmentTag: "Annual Board Exam",
    department: "Mathematics",
    assignedTeacher: "Dr. Clara Oswald",
    status: "Submitted",
    isNewRequest: false,
    updatedAt: "2 hours ago",
    questionTypes: [
      { id: "MQT-MCQ", name: "Multiple Choice (MCQ)", category: "Objective" },
      { id: "MQT-SHORT", name: "Short Math", category: "Subjective" },
      { id: "MQT-ESSAY", name: "Long Proofs & Geometry", category: "Comprehensive" },
      { id: "MQT-CASESTUDY", name: "Case Study Problems", category: "Applied Context" }
    ]
  }
];

// Initial Submitted Question Types (Track A list)
export const INITIAL_SUBMITTED_QUESTION_TYPES = [
  {
    id: "QTS-101",
    name: "AI Midterm Multiple Choice (MCQ)",
    typeId: "MQT-MCQ",
    category: "Objective",
    program: "B.Tech - Computer Science Engineering",
    subject: "Artificial Intelligence (CS-401)",
    exam: "Term I Examination",
    session: "2026-27",
    defaultMarks: 1,
    marksRange: "1 Mark",
    targetCount: 15,
    assignedSection: "Section A (Objective)",
    status: "Approved", // Draft | Submitted | Approved
    author: "Dr. Evelyn Vance",
    updatedAt: "2 hours ago",
    instructions: "Strict single-choice questions covering State Space Search, Heuristics, and Minimax. 4 options per question."
  },
  {
    id: "QTS-102",
    name: "Quantum Physics Derivation & Proofs",
    typeId: "MQT-ESSAY",
    category: "Comprehensive",
    program: "B.Sc - Physics & Applied Sciences",
    subject: "Quantum Mechanics (PH-301)",
    exam: "Half-Yearly Examination",
    session: "2026-27",
    defaultMarks: 5,
    marksRange: "5 Marks",
    targetCount: 4,
    assignedSection: "Section B (Derivations)",
    status: "Approved",
    author: "Dr. Sarah Lin",
    updatedAt: "Yesterday",
    instructions: "Long-form derivation questions for 1D Infinite Potential Well, Wave Packet dynamics, and Hermitian Operators."
  },
  {
    id: "QTS-103",
    name: "Data Structures Practical Coding Task",
    typeId: "MQT-CODING",
    category: "Practical",
    program: "B.Tech - Computer Science Engineering",
    subject: "Data Structures & Algorithms (CS-201)",
    exam: "Term I Examination",
    session: "2026-27",
    defaultMarks: 5,
    marksRange: "5 Marks",
    targetCount: 2,
    assignedSection: "Section C (Implementation)",
    status: "Submitted",
    author: "Prof. Alan Turing",
    updatedAt: "3 hours ago",
    instructions: "Algorithm problem statements in Python/C++ with time constraint O(N log N) and space O(1)."
  },
  {
    id: "QTS-104",
    name: "Linear Algebra Short Conceptual Proofs",
    typeId: "MQT-SHORT",
    category: "Subjective",
    program: "B.Sc - Mathematics & Computing",
    subject: "Linear Algebra (MA-102)",
    exam: "Term I Examination",
    session: "2026-27",
    defaultMarks: 3,
    marksRange: "3 Marks",
    targetCount: 5,
    assignedSection: "Section B (Matrices)",
    status: "Approved",
    author: "Prof. Marcus Thorne",
    updatedAt: "1 day ago",
    instructions: "Requires 4-6 lines of rigorous mathematical matrix transformations."
  },
  {
    id: "QTS-105",
    name: "Class 10 Optics Assertion & Reasoning",
    typeId: "MQT-ASSERTION",
    category: "Analytical",
    program: "Class 10",
    subject: "Physics",
    exam: "Annual / Final Board Examination",
    session: "2026-27",
    defaultMarks: 2,
    marksRange: "2 Marks",
    targetCount: 5,
    assignedSection: "Section A (Objective & Analytical)",
    status: "Draft",
    author: "Dr. Sarah Lin",
    updatedAt: "30 minutes ago",
    instructions: "CBSE board pattern questions assessing Snell's law, total internal reflection, and lens power."
  }
];

// Existing Blueprint Specifications loaded per Academic Context
export const BLUEPRINT_SPECIFICATIONS = {
  "B.Tech - Computer Science Engineering|Artificial Intelligence (CS-401)": {
    examName: "Term I Examination",
    totalMarks: 100,
    duration: "3 Hours",
    sections: [
      { id: "SEC-A", name: "Section A (Objective)", type: "Multiple Choice (MCQ)", targetCount: 15, marksPerQ: 2, sectionMarks: 30 },
      { id: "SEC-B", name: "Section B (Conceptual)", type: "Short Answer", targetCount: 6, marksPerQ: 5, sectionMarks: 30 },
      { id: "SEC-C", name: "Section C (Analytical)", type: "Long Essay / Problem", targetCount: 4, marksPerQ: 10, sectionMarks: 40 }
    ]
  },
  "B.Sc - Physics & Applied Sciences|Quantum Mechanics (PH-301)": {
    examName: "Half-Yearly Examination",
    totalMarks: 80,
    duration: "3 Hours",
    sections: [
      { id: "SEC-A", name: "Section A (Concepts)", type: "Multiple Choice (MCQ)", targetCount: 10, marksPerQ: 2, sectionMarks: 20 },
      { id: "SEC-B", name: "Section B (Derivations)", type: "Long Essay / Problem", targetCount: 3, marksPerQ: 10, sectionMarks: 30 },
      { id: "SEC-C", name: "Section C (Lab Numericals)", type: "Short Answer", targetCount: 6, marksPerQ: 5, sectionMarks: 30 }
    ]
  },
  "B.Sc - Mathematics & Computing|Linear Algebra (MA-102)": {
    examName: "Term I Examination",
    totalMarks: 75,
    duration: "2.5 Hours",
    sections: [
      { id: "SEC-A", name: "Section A (True/False)", type: "True / False", targetCount: 10, marksPerQ: 1.5, sectionMarks: 15 },
      { id: "SEC-B", name: "Section B (Matrices)", type: "Short Answer", targetCount: 5, marksPerQ: 5, sectionMarks: 25 },
      { id: "SEC-C", name: "Section C (Proofs)", type: "Long Essay / Problem", targetCount: 5, marksPerQ: 7, sectionMarks: 35 }
    ]
  },
  "Class 10|Physics": {
    examName: "Annual / Final Board Examination",
    totalMarks: 80,
    duration: "3 Hours",
    sections: [
      { id: "SEC-A", name: "Section A (MCQs & Assertion)", type: "Multiple Choice (MCQ)", targetCount: 16, marksPerQ: 1, sectionMarks: 16 },
      { id: "SEC-B", name: "Section B (Very Short)", type: "Short Answer", targetCount: 6, marksPerQ: 2, sectionMarks: 12 },
      { id: "SEC-C", name: "Section C (Short Answers)", type: "Short Answer", targetCount: 7, marksPerQ: 3, sectionMarks: 21 },
      { id: "SEC-D", name: "Section D (Long Derivations)", type: "Long Essay / Problem", targetCount: 3, marksPerQ: 5, sectionMarks: 15 },
      { id: "SEC-E", name: "Section E (Case Study)", type: "Case Study / Passage Based", targetCount: 4, marksPerQ: 4, sectionMarks: 16 }
    ]
  },
  "Class 10|Mathematics": {
    examName: "Annual / Final Board Examination",
    totalMarks: 80,
    duration: "3 Hours",
    sections: [
      { id: "SEC-A", name: "Section A (Objective MCQs)", type: "Multiple Choice (MCQ)", targetCount: 20, marksPerQ: 1, sectionMarks: 20 },
      { id: "SEC-B", name: "Section B (Short Math)", type: "Short Answer", targetCount: 5, marksPerQ: 2, sectionMarks: 10 },
      { id: "SEC-C", name: "Section C (Long Proofs)", type: "Short Answer", targetCount: 6, marksPerQ: 3, sectionMarks: 18 },
      { id: "SEC-D", name: "Section D (Complex Problems)", type: "Long Essay / Problem", targetCount: 4, marksPerQ: 5, sectionMarks: 20 },
      { id: "SEC-E", name: "Section E (Case Studies)", type: "Case Study / Passage Based", targetCount: 3, marksPerQ: 4, sectionMarks: 12 }
    ]
  }
};

// Initial Submitted Questions (Track B list)
export const INITIAL_SUBMITTED_QUESTIONS = [
  {
    id: "QCR-4001",
    code: "AI-MCQ-01",
    program: "B.Tech - Computer Science Engineering",
    subject: "Artificial Intelligence (CS-401)",
    exam: "Term I Examination",
    session: "2026-27",
    chapter: "Heuristic Search Strategies",
    type: "Multiple Choice (MCQ)",
    difficulty: "Medium",
    cognitiveLevel: "Analyze",
    marks: 2,
    questionText: "In A* search algorithm, what condition must the heuristic function h(n) satisfy to guarantee that the search will always find an optimal solution in tree search?",
    options: [
      { id: "A", text: "h(n) must be consistent (monotonic)", isCorrect: false },
      { id: "B", text: "h(n) must be admissible (never overestimate the true cost)", isCorrect: true },
      { id: "C", text: "h(n) must be strictly greater than the true cost to reach the goal", isCorrect: false },
      { id: "D", text: "h(n) must equal zero for all non-terminal nodes", isCorrect: false }
    ],
    correctAnswer: "Option B: h(n) must be admissible (never overestimate the true cost)",
    solution: "For Tree Search, A* is optimal if h(n) is admissible (i.e. h(n) <= h*(n)). For Graph Search, A* requires consistency (monotonicity) to avoid re-opening closed nodes.",
    blueprintSection: "Section A (Objective)",
    author: "Dr. Evelyn Vance",
    status: "Submitted", // Draft | Submitted | Approved | Sent Back
    createdAt: "40 minutes ago",
    assignedTeacher: "Dr. Evelyn Vance"
  },
  {
    id: "QCR-4002",
    code: "AI-CODE-02",
    program: "B.Tech - Computer Science Engineering",
    subject: "Artificial Intelligence (CS-401)",
    exam: "Term I Examination",
    session: "2026-27",
    chapter: "Adversarial Search & Games",
    type: "Long Essay / Problem",
    difficulty: "Hard",
    cognitiveLevel: "Apply",
    marks: 10,
    questionText: "Implement the Minimax algorithm with Alpha-Beta pruning in Python for a 2-player zero-sum game tree of depth 3. Explain the pruning condition when Beta <= Alpha.",
    options: [],
    correctAnswer: "Working Python recursive function with alpha-beta parameter passing and pruning condition.",
    solution: "def alphabeta(node, depth, alpha, beta, is_max):\n  if depth == 0 or node.is_terminal(): return node.value\n  if is_max:\n    v = -inf\n    for child in node.children():\n      v = max(v, alphabeta(child, depth-1, alpha, beta, False))\n      alpha = max(alpha, v)\n      if beta <= alpha: break\n    return v",
    blueprintSection: "Section C (Analytical)",
    author: "Prof. Alan Turing",
    status: "Approved",
    createdAt: "2 hours ago",
    assignedTeacher: "Prof. Alan Turing"
  },
  {
    id: "QCR-4003",
    code: "PH-DER-01",
    program: "B.Sc - Physics & Applied Sciences",
    subject: "Quantum Mechanics (PH-301)",
    exam: "Half-Yearly Examination",
    session: "2026-27",
    chapter: "Schrodinger Wave Equation",
    type: "Long Essay / Problem",
    difficulty: "Hard",
    cognitiveLevel: "Evaluate",
    marks: 10,
    questionText: "Derive the time-independent Schrödinger equation for a non-relativistic particle of mass m confined in an infinite one-dimensional square well of width L (0 <= x <= L). Find the normalized energy eigenfunctions and discrete eigenvalues.",
    options: [],
    correctAnswer: "E_n = (n² π² ħ²) / (2 m L²), with eigenfunctions ψ_n(x) = sqrt(2/L) sin(n π x / L).",
    solution: "1. State boundary conditions: ψ(0) = ψ(L) = 0.\n2. General solution in well: ψ(x) = A sin(kx) + B cos(kx).\n3. Applying x=0 gives B=0. Applying x=L gives k = nπ/L.\n4. Normalization integral ∫|ψ|² dx = 1 gives A = sqrt(2/L).\n5. Energy E = (ħ² k²) / (2m) = (n² π² ħ²) / (2mL²).",
    blueprintSection: "Section B (Derivations)",
    author: "Dr. Sarah Lin",
    status: "Submitted",
    createdAt: "3 hours ago",
    assignedTeacher: "Dr. Sarah Lin"
  },
  {
    id: "QCR-4004",
    code: "MA-MAT-01",
    program: "B.Sc - Mathematics & Computing",
    subject: "Linear Algebra (MA-102)",
    exam: "Term I Examination",
    session: "2026-27",
    chapter: "Eigenvalues & Diagonalization",
    type: "Short Answer",
    difficulty: "Medium",
    cognitiveLevel: "Understand",
    marks: 5,
    questionText: "Let A be a 3x3 real symmetric matrix with trace(A) = 9 and det(A) = 24. If one eigenvalue is λ = 2, find the other two eigenvalues and state whether A is invertible.",
    options: [],
    correctAnswer: "Eigenvalues are 2, 3, 4. Since det(A) = 24 ≠ 0, A is invertible.",
    solution: "1. Trace is sum of eigenvalues: 2 + λ2 + λ3 = 9 => λ2 + λ3 = 7.\n2. Determinant is product of eigenvalues: 2 * λ2 * λ3 = 24 => λ2 * λ3 = 12.\n3. Solving gives roots of t² - 7t + 12 = 0, which are 3 and 4.\n4. All eigenvalues are non-zero, hence det(A) ≠ 0 => invertible.",
    blueprintSection: "Section B (Matrices)",
    author: "Prof. Marcus Thorne",
    status: "Draft",
    createdAt: "1 day ago",
    assignedTeacher: "Prof. Marcus Thorne"
  },
  {
    id: "QCR-4005",
    code: "OPT-MCQ-01",
    program: "Class 10",
    subject: "Physics",
    exam: "Annual / Final Board Examination",
    session: "2026-27",
    chapter: "Light - Reflection and Refraction",
    type: "Multiple Choice (MCQ)",
    difficulty: "Easy",
    cognitiveLevel: "Remember",
    marks: 1,
    questionText: "The refractive index of medium A with respect to medium B is 2/3 and that of medium B with respect to medium C is 4/3. What is the refractive index of medium C with respect to medium A?",
    options: [
      { id: "A", text: "8/9", isCorrect: false },
      { id: "B", text: "9/8", isCorrect: true },
      { id: "C", text: "1/2", isCorrect: false },
      { id: "D", text: "2", isCorrect: false }
    ],
    correctAnswer: "Option B: 9/8",
    solution: "n_A/n_B = 2/3 and n_B/n_C = 4/3. Therefore n_A/n_C = (2/3) * (4/3) = 8/9. Hence, the refractive index of C with respect to A is 1 / (8/9) = 9/8.",
    blueprintSection: "Section A (MCQs & Assertion)",
    author: "Dr. Sarah Lin",
    status: "Approved",
    createdAt: "2 days ago",
    assignedTeacher: "Dr. Sarah Lin"
  },
  {
    id: "QCR-4006",
    code: "OPT-CASE-01",
    program: "Class 10",
    subject: "Physics",
    exam: "Annual / Final Board Examination",
    session: "2026-27",
    chapter: "Human Eye and the Colourful World",
    type: "Case Study / Passage Based",
    difficulty: "Medium",
    cognitiveLevel: "Analyze",
    marks: 4,
    questionText: "A classroom projector uses a convex lens of focal length 20 cm. A clear image of a slide is projected onto a white wall situated 2 meters away from the lens. Based on this optical setup, answer the following sub-questions:\n(i) Calculate the distance of the slide from the projector lens.\n(ii) Determine the magnification produced by the lens.\n(iii) What kind of lens should be added to produce a larger image at the same wall position?",
    options: [],
    correctAnswer: "(i) u ≈ -22.2 cm, (ii) m = -9, (iii) A lens of shorter positive focal length (higher converging power).",
    solution: "1. Given v = +200 cm, f = +20 cm. 1/f = 1/v - 1/u => 1/20 = 1/200 - 1/u => 1/u = 1/200 - 10/200 = -9/200 => u = -22.22 cm.\n2. m = v/u = 200 / (-22.22) = -9.\n3. Higher optical power converging lens gives greater angular magnification.",
    blueprintSection: "Section E (Case Study)",
    author: "Dr. Evelyn Vance",
    status: "Draft",
    createdAt: "35 minutes ago",
    assignedTeacher: "Dr. Evelyn Vance"
  }
];

// Helper to calculate blueprint alignment status for a given program and subject
export function getBlueprintStatus(program, subject, questions) {
  const key = `${program}|${subject}`;
  const bp = BLUEPRINT_SPECIFICATIONS[key];
  if (!bp) return null;

  const relevantQs = questions.filter(
    q => q.program === program && q.subject === subject
  );

  const sectionsStatus = bp.sections.map(sec => {
    const matching = relevantQs.filter(q => q.type === sec.type || q.blueprintSection === sec.name);
    const completedCount = matching.length;
    const completedMarks = matching.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
    const targetMarks = sec.sectionMarks;
    const isCompleted = completedCount >= sec.targetCount;
    const pct = Math.min(100, Math.round((completedCount / sec.targetCount) * 100));

    return {
      ...sec,
      completedCount,
      completedMarks,
      targetMarks,
      isCompleted,
      pct,
      remainingCount: Math.max(0, sec.targetCount - completedCount)
    };
  });

  const totalTargetMarks = bp.totalMarks;
  const totalCompletedMarks = sectionsStatus.reduce((sum, s) => sum + s.completedMarks, 0);
  const totalTargetQuestions = bp.sections.reduce((sum, s) => sum + s.targetCount, 0);
  const totalCompletedQuestions = sectionsStatus.reduce((sum, s) => sum + s.completedCount, 0);
  const overallPct = Math.min(100, Math.round((totalCompletedMarks / totalTargetMarks) * 100));
  const isFullyAligned = sectionsStatus.every(s => s.isCompleted);

  return {
    examName: bp.examName,
    duration: bp.duration,
    totalTargetMarks,
    totalCompletedMarks,
    totalTargetQuestions,
    totalCompletedQuestions,
    overallPct,
    isFullyAligned,
    sections: sectionsStatus
  };
}

