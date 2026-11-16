
// ==========================================
// PROGRAM & SUBJECT MAPPING
// ==========================================
export const PROGRAM_SUBJECT_MAP = {
  "B.Tech - Computer Science Engineering": [
    "Artificial Intelligence (CS-401)",
    "Data Structures & Algorithms (CS-201)",
    "Machine Learning Systems (CS-402)",
    "Database Management (CS-301)"
  ],
  "B.Tech - Information Technology": [
    "Web Architecture & Cloud (IT-301)",
    "Database Management Systems (IT-202)",
    "Cybersecurity Fundamentals (IT-405)"
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
  ],
  "B.A. - English Literature": [
    "Modern Poetry & Prose (ENG-201)",
    "Shakespearean Studies (ENG-302)",
    "Creative Writing & Rhetoric (ENG-101)"
  ],
  "M.Sc - Organic Chemistry": [
    "Advanced Organic Synthesis (CH-501)",
    "Thermodynamics & Kinetics (CH-402)",
    "Biochemistry (CH-304)"
  ]
};

// ==========================================
// EXAM QUESTION BLUEPRINTS (Auto-loaded per course)
// ==========================================
export const DEFAULT_BLUEPRINT = {
  totalMarks: 100,
  duration: "3 Hours",
  sections: [
    { name: "Section A (Objective)", type: "Multiple Choice (MCQ)", count: 10, marks: 20 },
    { name: "Section B (Short Answer)", type: "Short Answer", count: 4, marks: 30 },
    { name: "Section C (Comprehensive)", type: "Essay", count: 2, marks: 50 }
  ]
};

export const SUBJECT_BLUEPRINTS = {
  "Artificial Intelligence (CS-401)": {
    totalMarks: 100,
    duration: "3 Hours",
    sections: [
      { name: "Section A (Objective)", type: "Multiple Choice (MCQ)", count: 10, marks: 20 },
      { name: "Section B (Conceptual)", type: "Short Answer", count: 5, marks: 30 },
      { name: "Section C (Analytical)", type: "Essay", count: 2, marks: 30 },
      { name: "Section D (Practical)", type: "Coding Task", count: 1, marks: 20 }
    ]
  },
  "Data Structures & Algorithms (CS-201)": {
    totalMarks: 100,
    duration: "3 Hours",
    sections: [
      { name: "Section A (Theory)", type: "Multiple Choice (MCQ)", count: 15, marks: 30 },
      { name: "Section B (Algorithms)", type: "Short Answer", count: 4, marks: 20 },
      { name: "Section C (Implementation)", type: "Coding Task", count: 2, marks: 50 }
    ]
  },
  "Machine Learning Systems (CS-402)": {
    totalMarks: 100,
    duration: "3 Hours",
    sections: [
      { name: "Section A (MCQs)", type: "Multiple Choice (MCQ)", count: 10, marks: 20 },
      { name: "Section B (Short Math)", type: "Short Answer", count: 4, marks: 40 },
      { name: "Section C (ML Model Code)", type: "Coding Task", count: 2, marks: 40 }
    ]
  },
  "Linear Algebra (MA-102)": {
    totalMarks: 75,
    duration: "2.5 Hours",
    sections: [
      { name: "Section A (True/False)", type: "True / False", count: 10, marks: 15 },
      { name: "Section B (Matrices)", type: "Short Answer", count: 5, marks: 25 },
      { name: "Section C (Proofs)", type: "Essay", count: 2, marks: 35 }
    ]
  },
  "Quantum Mechanics (PH-301)": {
    totalMarks: 80,
    duration: "3 Hours",
    sections: [
      { name: "Section A (Concepts)", type: "Multiple Choice (MCQ)", count: 10, marks: 20 },
      { name: "Section B (Derivations)", type: "Essay", count: 3, marks: 30 },
      { name: "Section C (Lab Numericals)", type: "Short Answer", count: 3, marks: 30 }
    ]
  }
};

// ==========================================
// MOCK DATA: TEACHERS & SAMPLE QUESTIONS
// ==========================================
export const INITIAL_TEACHERS = [
  {
    id: "TCH-1001",
    name: "Dr. Evelyn Vance",
    designation: "Professor & HOD",
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    subjects: ["Artificial Intelligence", "Machine Learning", "Data Structures"]
  },
  {
    id: "TCH-1007",
    name: "Prof. Alan Turing",
    designation: "Associate Professor",
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    subjects: ["Artificial Intelligence", "Data Structures", "Web Architecture"]
  },
  {
    id: "TCH-1002",
    name: "Prof. Marcus Thorne",
    designation: "Associate Professor",
    department: "Mathematics",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    subjects: ["Linear Algebra", "Calculus III", "Discrete Math"]
  },
  {
    id: "TCH-1008",
    name: "Dr. Clara Oswald",
    designation: "Assistant Professor",
    department: "Mathematics",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    subjects: ["Linear Algebra", "Discrete Math", "Calculus III"]
  },
  {
    id: "TCH-1003",
    name: "Dr. Sarah Lin",
    designation: "Assistant Professor",
    department: "Physics",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    subjects: ["Quantum Mechanics", "Electromagnetism", "Optics Lab"]
  },
  {
    id: "TCH-1004",
    name: "Robert Sterling",
    designation: "Senior Lecturer",
    department: "English Literature",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    subjects: ["Modern Poetry", "Shakespearean Studies", "Creative Writing"]
  },
  {
    id: "TCH-1005",
    name: "Dr. Aris Thorne",
    designation: "Professor",
    department: "Chemistry",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    subjects: ["Organic Chemistry", "Biochemistry", "Thermodynamics"]
  },
  {
    id: "TCH-1006",
    name: "Elena Rostova",
    designation: "Assistant Lecturer",
    department: "Art & Design",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    subjects: ["UI/UX Design", "Digital Illustration", "Art History"]
  }
];

export const QUESTION_BANK_ITEMS = [
  { id: "Q-101", title: "Explain Time & Space Complexity of MergeSort algorithm", type: "Essay", subject: "Computer Science" },
  { id: "Q-102", title: "Write a Python script to check for Palindromes using 2 pointers", type: "Coding", subject: "Computer Science" },
  { id: "Q-103", title: "Calculate Eigenvalues and Eigenvectors for 3x3 Matrix", type: "Short Answer", subject: "Mathematics" },
  { id: "Q-104", title: "Derive Schrodinger Wave Equation for 1D Quantum Box", type: "Essay", subject: "Physics" },
  { id: "Q-105", title: "Which of the following is true about Reaction Kinetics?", type: "Multiple Choice", subject: "Chemistry" },
  { id: "Q-106", title: "Analyze Shakespeare's usage of iambic pentameter in Hamlet", type: "Essay", subject: "English Literature" }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: "ASN-2001",
    type: "questionType",
    program: "B.Tech - Computer Science Engineering",
    subject: "Artificial Intelligence (CS-401)",
    teacherIds: ["TCH-1001", "TCH-1007"],
    questionTypes: ["Multiple Choice (MCQ)", "Essay"],
    questionCount: "15",
    instructions: "Prepare 10 MCQs and 5 Essay questions for AI midterm exam.",
    createdAt: "10 minutes ago"
  },
  {
    id: "ASN-2002",
    type: "questionType",
    program: "B.Sc - Physics & Applied Sciences",
    subject: "Quantum Mechanics (PH-301)",
    teacherIds: ["TCH-1003"],
    questionTypes: ["Short Answer", "Coding Task"],
    questionCount: "10",
    instructions: "Prepare lab simulation questions & quantum state derivations.",
    createdAt: "1.5 hours ago"
  },
  {
    id: "ASN-2003",
    type: "question",
    program: "B.Tech - Computer Science Engineering",
    subject: "Data Structures & Algorithms (CS-201)",
    teacherId: "TCH-1001",
    teacherIds: ["TCH-1001"],
    selectedQuestionIds: ["Q-101", "Q-102"],
    totalMarks: "50",
    instructions: "Evaluate student submissions for MergeSort and Palindrome algorithms.",
    createdAt: "25 minutes ago"
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: "LOG-5001",
    teacherName: "Dr. Evelyn Vance & Prof. Alan Turing",
    teacherAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    department: "Computer Science",
    action: "Assigned Question Type Assignment (Artificial Intelligence)",
    details: "Program: B.Tech CSE | Course: Artificial Intelligence (CS-401) | Assigned to 2 mapped teachers (Dr. Evelyn Vance, Prof. Alan Turing).",
    timestamp: "10 minutes ago"
  },
  {
    id: "LOG-5002",
    teacherName: "Prof. Marcus Thorne",
    teacherAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    department: "Mathematics",
    action: "Assigned 2 Questions from Question Bank",
    details: "Assigned specific questions Q-103 (Eigenvalues) to review for Linear Algebra.",
    timestamp: "35 minutes ago"
  },
  {
    id: "LOG-5003",
    teacherName: "Dr. Sarah Lin",
    teacherAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    department: "Physics",
    action: "Assigned Question Type Assignment (Quantum Mechanics)",
    details: "Program: B.Sc Physics | Course: Quantum Mechanics (PH-301) | Quantum Physics Lab evaluation assignment.",
    timestamp: "1.5 hours ago"
  }
];
