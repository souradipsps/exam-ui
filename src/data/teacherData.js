
// ==========================================
// PROGRAM & SUBJECT MAPPING
// ==========================================
export const PROGRAM_SUBJECT_MAP = {
  "Class 1": [
    "English",
    "Mathematics",
    "Environmental Studies",
    "Hindi",
    "Art & Craft"
  ],
  "Class 2": [
    "English",
    "Mathematics",
    "Environmental Studies",
    "Hindi",
    "Art & Craft"
  ],
  "Class 3": [
    "English",
    "Mathematics",
    "Environmental Studies",
    "Hindi",
    "Art & Craft"
  ],
  "Class 4": [
    "English",
    "Mathematics",
    "Environmental Studies",
    "Hindi",
    "Art & Craft"
  ],
  "Class 5": [
    "English",
    "Mathematics",
    "Environmental Studies",
    "Hindi",
    "Art & Craft"
  ],
  "Class 6": [
    "English",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer Science"
  ],
  "Class 7": [
    "English",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer Science"
  ],
  "Class 8": [
    "English",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer Science"
  ],
  "Class 9": [
    "English",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer Science"
  ],
  "Class 10": [
    "English",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer Science"
  ],
  "Class 11": [
    "English",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Computer Science"
  ],
  "Class 12": [
    "English",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Computer Science"
  ],
  "B.Tech - Computer Science Engineering": [
    "Artificial Intelligence (CS-401)",
    "Data Structures & Algorithms (CS-201)",
    "Machine Learning Systems (CS-402)",
    "Database Management (CS-301)",
    "Operating Systems (CS-302)"
  ],
  "B.Tech - Information Technology": [
    "Web Architecture & Cloud (IT-301)",
    "Database Management Systems (IT-202)",
    "Cybersecurity Fundamentals (IT-405)",
    "Software Engineering (IT-302)",
    "Computer Networks (IT-303)"
  ],
  "B.Sc - Mathematics & Computing": [
    "Linear Algebra (MA-102)",
    "Calculus III (MA-201)",
    "Discrete Mathematics (MA-303)",
    "Probability & Statistics (MA-304)",
    "Real Analysis (MA-305)"
  ],
  "B.Sc - Physics & Applied Sciences": [
    "Quantum Mechanics (PH-301)",
    "Electromagnetism (PH-202)",
    "Optics & Photonic Lab (PH-104)",
    "Classical Mechanics (PH-101)",
    "Statistical Physics (PH-303)"
  ],
  "B.A. - English Literature": [
    "Modern Poetry & Prose (ENG-201)",
    "Shakespearean Studies (ENG-302)",
    "Creative Writing & Rhetoric (ENG-101)",
    "Victorian Literature (ENG-303)",
    "Linguistics & Phonetics (ENG-202)"
  ],
  "M.Sc - Organic Chemistry": [
    "Advanced Organic Synthesis (CH-501)",
    "Thermodynamics & Kinetics (CH-402)",
    "Biochemistry (CH-304)",
    "Physical Chemistry (CH-401)",
    "Spectroscopy (CH-503)"
  ],
  "BCA - Computer Applications": [
    "Programming in C (BCA-101)",
    "Data Structures (BCA-201)",
    "Database Management Systems (BCA-202)",
    "Web Technologies (BCA-301)",
    "Computer Networks (BCA-302)"
  ],
  "B.Sc - Information Technology": [
    "Python Programming (BSIT-101)",
    "Operating Systems (BSIT-201)",
    "Cybersecurity Fundamentals (BSIT-301)",
    "Cloud Computing (BSIT-302)",
    "Software Engineering (BSIT-303)"
  ]
};

// ==========================================
// CHAPTERS PER SUBJECT (lesson plan)
// ==========================================
const SUBJECT_CHAPTERS = {
  "Mathematics": ["Number Systems", "Algebra"],
  "Science": ["Physics", "Chemistry", "Biology"],
  "English": ["Prose", "Poetry", "Grammar"],
  "Social Science": ["History", "Geography"],
  "Computer Science": ["Programming Basics", "Data Structures"],
  "Physics": ["Mechanics", "Optics", "Electricity"],
  "Chemistry": ["Atomic Structure", "Chemical Bonding", "Organic Basics"],
  "Hindi": ["Gadya", "Padya", "Vyakaran"],
  "Environmental Studies": ["Plants", "Animals", "Water"],
  "Art & Craft": ["Drawing", "Colours"],
};

// Subject name without its course code, e.g. "Web Architecture & Cloud (IT-301)" -> "Web Architecture & Cloud"
export const getSubjectBaseName = (subject) => subject.replace(/\s*\(.*\)\s*$/, '');

// Chapter names mapped to a subject (generic chapters when the lesson plan has none)
export const getSubjectChapters = (subject) =>
  SUBJECT_CHAPTERS[getSubjectBaseName(subject)] || ["Introduction", "Core Concepts", "Applications"];

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
    subjects: ["Computer Science", "Programming in C"],
    classes: ["Class 11", "BCA - Computer Applications"],
    sections: ["A", "B"]
  },
  {
    id: "TCH-1007",
    name: "Prof. Alan Turing",
    designation: "Associate Professor",
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    subjects: ["Computer Science", "Data Structures"],
    classes: ["Class 9", "Class 10"],
    sections: ["A", "C"]
  },
  {
    id: "TCH-1002",
    name: "Prof. Marcus Thorne",
    designation: "Associate Professor",
    department: "Mathematics",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    subjects: ["Mathematics", "Linear Algebra"],
    classes: ["Class 9", "Class 10"],
    sections: ["B", "C"]
  },
  {
    id: "TCH-1008",
    name: "Dr. Clara Oswald",
    designation: "Assistant Professor",
    department: "Mathematics",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    subjects: ["Mathematics", "Calculus III"],
    classes: ["Class 6", "Class 7"],
    sections: ["A", "B"]
  },
  {
    id: "TCH-1003",
    name: "Dr. Sarah Lin",
    designation: "Assistant Professor",
    department: "Physics",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    subjects: ["Physics", "Quantum Mechanics"],
    classes: ["Class 11", "B.Sc - Physics & Applied Sciences"],
    sections: ["B", "D"]
  },
  {
    id: "TCH-1004",
    name: "Robert Sterling",
    designation: "Senior Lecturer",
    department: "English Literature",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    subjects: ["English", "Modern Poetry & Prose"],
    classes: ["Class 9", "B.A. - English Literature"],
    sections: ["A", "C"]
  },
  {
    id: "TCH-1005",
    name: "Dr. Aris Thorne",
    designation: "Professor",
    department: "Chemistry",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    subjects: ["Chemistry", "Advanced Organic Synthesis"],
    classes: ["Class 12", "M.Sc - Organic Chemistry"],
    sections: ["A", "D"]
  },
  {
    id: "TCH-1006",
    name: "Elena Rostova",
    designation: "Assistant Lecturer",
    department: "Art & Design",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    subjects: ["Art & Craft", "Environmental Studies"],
    classes: ["Class 4", "Class 5"],
    sections: ["B", "C"]
  },
  {
    id: "TCH-1009",
    name: "Dr. Priya Nair",
    designation: "Associate Professor",
    department: "Computer Science",
    avatar: "https://i.pravatar.cc/150?img=47",
    subjects: ["Database Management Systems", "Cybersecurity Fundamentals"],
    classes: ["B.Tech - Computer Science Engineering", "B.Tech - Information Technology"],
    sections: ["A", "B"]
  },
  {
    id: "TCH-1010",
    name: "Prof. Rahul Mehta",
    designation: "Assistant Professor",
    department: "Computer Science",
    avatar: "https://i.pravatar.cc/150?img=12",
    subjects: ["Web Technologies", "Cloud Computing"],
    classes: ["B.Tech - Information Technology", "BCA - Computer Applications"],
    sections: ["C", "D"]
  },
  {
    id: "TCH-1011",
    name: "Dr. Anita Deshmukh",
    designation: "Professor",
    department: "Mathematics",
    avatar: "https://i.pravatar.cc/150?img=45",
    subjects: ["Mathematics", "Discrete Mathematics"],
    classes: ["Class 8", "B.Sc - Mathematics & Computing"],
    sections: ["A", "C"]
  },
  {
    id: "TCH-1012",
    name: "Prof. Vikram Rao",
    designation: "Associate Professor",
    department: "Physics",
    avatar: "https://i.pravatar.cc/150?img=15",
    subjects: ["Science", "Electromagnetism"],
    classes: ["Class 6", "Class 7"],
    sections: ["A", "D"]
  },
  {
    id: "TCH-1013",
    name: "Ms. Kavya Iyer",
    designation: "Assistant Lecturer",
    department: "English Literature",
    avatar: "https://i.pravatar.cc/150?img=44",
    subjects: ["English", "Creative Writing & Rhetoric"],
    classes: ["Class 1", "Class 2"],
    sections: ["B", "C"]
  },
  {
    id: "TCH-1014",
    name: "Dr. Imran Qureshi",
    designation: "Senior Lecturer",
    department: "Chemistry",
    avatar: "https://i.pravatar.cc/150?img=33",
    subjects: ["Science", "Biochemistry"],
    classes: ["Class 7", "Class 8"],
    sections: ["A", "B"]
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
