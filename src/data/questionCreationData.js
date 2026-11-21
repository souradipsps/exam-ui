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
  { id: 'Hard', name: 'Hard', color: 'rose', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  { id: 'Very Hard', name: 'Very Hard', color: 'purple', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
];

export const RESPONSE_FORMATS = [
  { id: 'MCQ_SINGLE', name: 'Multiple Choice (MCQ)', group: 'Selected Response', defaultMarks: 1 },
  { id: 'MCQ_MULTIPLE', name: 'Multiple-select MCQ (MSQ)', group: 'Selected Response', defaultMarks: 2 },
  { id: 'TRUE_FALSE', name: 'True / False', group: 'Selected Response', defaultMarks: 1 },
  { id: 'YES_NO', name: 'Yes / No', group: 'Selected Response', defaultMarks: 1 },
  { id: 'ASSERTION_REASON', name: 'Assertion–Reason', group: 'Selected Response', defaultMarks: 2 },
  { id: 'MATCHING', name: 'Match the Following', group: 'Selected Response', defaultMarks: 4 },
  { id: 'SEQUENCE_ORDER', name: 'Sequence / Ordering', group: 'Selected Response', defaultMarks: 3 },
  { id: 'FILL_BLANK', name: 'Fill in the Blank', group: 'Short Response', defaultMarks: 1 },
  { id: 'VERY_SHORT_ANSWER', name: 'Very Short Answer (VSA)', group: 'Short Response', defaultMarks: 1 },
  { id: 'SHORT_ANSWER', name: 'Short Answer (SA)', group: 'Short Response', defaultMarks: 3 },
  { id: 'NUMERICAL', name: 'Numerical Answer', group: 'Short Response', defaultMarks: 3 },
  { id: 'LONG_ANSWER', name: 'Long Essay / Problem', group: 'Extended Response', defaultMarks: 5 },
  { id: 'ESSAY', name: 'Essay Type', group: 'Extended Response', defaultMarks: 8 },
  { id: 'DERIVATION', name: 'Derivation / Proof', group: 'Extended Response', defaultMarks: 6 },
  { id: 'CASE_STUDY', name: 'Case Study / Passage Based', group: 'Stimulus-Based', defaultMarks: 4 },
  { id: 'CODE', name: 'Code Writing / Programming', group: 'Computational', defaultMarks: 10 },
  { id: 'SQL', name: 'SQL Database Query', group: 'Computational', defaultMarks: 5 }
];

export const STIMULUS_TYPES = [
  'None',
  'Passage / Text',
  'Case Study',
  'Image / Diagram',
  'Data / Table',
  'Graph / Chart',
  'Map'
];

export const ASSESSMENT_MODES = [
  'Written',
  'Digital / Online',
  'Practical / Lab',
  'Project / Portfolio',
  'Oral / Viva'
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
  "Class 10": ["Mathematics", "Physics", "Chemistry", "Biology", "English Literature", "Environmental Studies"],
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

// Fallback chapter lists when creating a new chapter-wise question type set
export const DEFAULT_CHAPTERS_BY_SUBJECT = {
  "Environmental Studies": [
    "Our Environment & Ecosystem",
    "Management of Natural Resources",
    "Sustainable Development & Conservation"
  ],
  "Mathematics": [
    "Sets & Relations",
    "Functions & Graphs",
    "Trigonometric Functions",
    "Complex Numbers & Quadratic Equations",
    "Linear Inequalities",
    "Permutations & Combinations",
    "Binomial Theorem",
    "Sequences & Series",
    "Straight Lines",
    "Conic Sections",
    "Introduction to 3D Geometry",
    "Limits & Derivatives",
    "Statistics & Measures of Dispersion",
    "Probability Theory"
  ],
  "Physics": [
    "Units & Measurements",
    "Motion in a Straight Line",
    "Motion in a Plane (Vectors)",
    "Laws of Motion",
    "Work, Energy & Power",
    "System of Particles & Rotational Motion",
    "Gravitation",
    "Mechanical Properties of Solids",
    "Mechanical Properties of Fluids",
    "Thermal Properties of Matter",
    "Thermodynamics",
    "Kinetic Theory of Gases",
    "Oscillations & Simple Harmonic Motion",
    "Waves & Sound"
  ],
  "Chemistry": [
    "Some Basic Concepts of Chemistry",
    "Structure of Atom",
    "Classification of Elements & Periodicity",
    "Chemical Bonding & Molecular Structure",
    "Chemical Thermodynamics",
    "Equilibrium (Physical & Chemical)",
    "Redox Reactions",
    "Organic Chemistry: Basic Principles & Techniques",
    "Hydrocarbons (Alkanes, Alkenes, Alkynes)",
    "Haloalkanes & Haloarenes",
    "Alcohols, Phenols & Ethers",
    "Aldehydes, Ketones & Carboxylic Acids",
    "Amines & Nitrogen Compounds",
    "Biomolecules"
  ],
  "Biology": [
    "The Living World",
    "Biological Classification",
    "Plant Kingdom",
    "Animal Kingdom",
    "Morphology of Flowering Plants",
    "Anatomy of Flowering Plants",
    "Structural Organisation in Animals",
    "Cell: The Unit of Life",
    "Biomolecules",
    "Cell Cycle & Cell Division",
    "Photosynthesis in Higher Plants",
    "Respiration in Plants",
    "Plant Growth & Development",
    "Breathing & Exchange of Gases",
    "Body Fluids & Circulation",
    "Locomotion & Movement"
  ],
  "English Literature": [
    "Prose Selections: The Portrait of a Lady",
    "Poetry: A Photograph",
    "Drama: The Browning Version",
    "Prose: We're Not Afraid to Die...",
    "Prose: Discovering Tut",
    "Poetry: The Laburnum Top",
    "Poetry: The Voice of the Rain",
    "Poetry: Childhood",
    "Prose: The Adventure",
    "Prose: Silk Road",
    "Drama: Mother's Day",
    "Supplementary: The Address",
    "Supplementary: Birth",
    "Grammar: Advanced Tenses & Modals",
    "Writing: Speech & Debate Writing"
  ],
  "English Core": [
    "The Portrait of a Lady",
    "A Photograph (Poem)",
    "We're Not Afraid to Die...",
    "Discovering Tut: Saga Continues",
    "The Laburnum Top (Poem)",
    "The Voice of the Rain (Poem)",
    "Childhood (Poem)",
    "The Adventure",
    "Silk Road",
    "Father to Son (Poem)",
    "The Summer of the Beautiful White Horse",
    "The Address",
    "Mother's Day",
    "Birth",
    "The Tale of Melon City",
    "Note Making & Summarizing"
  ],
  "Computer Science": [
    "Computer System Architecture",
    "Data Representation & Boolean Logic",
    "Computational Thinking & Problem Solving",
    "Python Programming Fundamentals",
    "Functions & Modular Code",
    "Strings & Text Manipulation",
    "Lists, Tuples & Dictionaries",
    "File Handling (Text, Binary & CSV)",
    "Data Structures (Stacks & Queues)",
    "Database Concepts & ER Modeling",
    "Structured Query Language (SQL)",
    "Computer Networks & Protocols",
    "Cyber Security & Digital Ethics"
  ],
  "Humanities Studies": [
    "Modern World History & Industrial Revolution",
    "Nationalism & Decolonization",
    "Indian Constitution: Philosophy & Design",
    "Democratic Rights & Governance",
    "Contemporary Social Structures & Diversity",
    "Economic Development & Resource Planning",
    "Human Geography & Demographics",
    "Political Theory & Freedom",
    "Judiciary & Rule of Law",
    "Federalism & Local Government",
    "Social Justice & Equality",
    "Environmental Ethics & Sustainability"
  ],
  "Organic Chemistry (CH-204)": [
    "IUPAC Nomenclature & Isomerism",
    "Reaction Mechanisms & Intermediates",
    "Haloalkanes & Nucleophilic Substitution",
    "Haloarenes & Electrophilic Substitution",
    "Alcohols, Phenols & Industrial Synthesis",
    "Ethers & Epoxides",
    "Aldehydes & Ketones (Carbonyl Additions)",
    "Carboxylic Acids & Acyl Derivatives",
    "Amines & Diazonium Salts",
    "Biomolecules (Carbohydrates & Proteins)",
    "Polymers & Synthetic Resins",
    "Chemistry in Everyday Life"
  ],
  "Artificial Intelligence (CS-401)": [
    "Introduction to AI & Intelligent Agents",
    "Uninformed State-Space Search",
    "Heuristic Search (A* & Greedy)",
    "Adversarial Search & Minimax",
    "Alpha-Beta Pruning & Game Trees",
    "Constraint Satisfaction Problems",
    "Knowledge Representation & Predicate Logic",
    "Probabilistic Reasoning & Bayesian Networks",
    "Markov Decision Processes (MDP)",
    "Reinforcement Learning & Q-Learning",
    "Supervised Machine Learning Foundations",
    "Neural Networks & Deep Learning",
    "Natural Language Processing (NLP)",
    "Computer Vision & Pattern Recognition"
  ],
  "Operating Systems (CS-305)": [
    "Operating System Structures & Kernel Services",
    "Process Management & Process Control Blocks",
    "Threads & Multithreading Models",
    "CPU Scheduling Algorithms",
    "Process Synchronization & Semaphores",
    "Classical Synchronization Problems",
    "Deadlock Characterization & Prevention",
    "Deadlock Avoidance (Banker's Algorithm)",
    "Main Memory Management & Paging",
    "Virtual Memory & Page Replacement",
    "File System Interface & Directory Structure",
    "I/O Systems, Disk Scheduling & RAID"
  ],
  "Database Management (CS-301)": [
    "Database System Architecture & 3-Tier Model",
    "Entity-Relationship (ER) Modeling",
    "Enhanced ER & Specialization/Generalization",
    "Relational Model & Integrity Constraints",
    "Relational Algebra & Tuple Calculus",
    "SQL: DDL, DML & Aggregate Queries",
    "Complex Subqueries, Joins & Views",
    "Functional Dependencies & Normal Forms (1NF-3NF)",
    "Boyce-Codd Normal Form (BCNF) & 4NF",
    "Transaction Processing & ACID Properties",
    "Concurrency Control & Locking Protocols",
    "Database Recovery Techniques & Log Management"
  ],
  "Data Structures & Algorithms (CS-201)": [
    "Asymptotic Analysis & Big-O Notation",
    "Arrays, Strings & Amortized Complexity",
    "Singly, Doubly & Circular Linked Lists",
    "Stacks: Applications & Expression Evaluation",
    "Queues, Deques & Priority Queues",
    "Binary Trees, Traversals & Properties",
    "Binary Search Trees (BST) & Balanced Trees",
    "Heaps & Heap Sort",
    "Hashing: Hash Tables, Collisions & Probing",
    "Graph Representations (Matrix & Adjacency)",
    "Graph Traversals (BFS & DFS)",
    "Shortest Path Algorithms (Dijkstra, Bellman-Ford)",
    "Minimum Spanning Trees (Prim, Kruskal)",
    "Dynamic Programming Fundamentals"
  ],
  "Machine Learning Systems (CS-402)": [
    "Foundations of Machine Learning & Workflow",
    "Linear Regression & Gradient Descent",
    "Logistic Regression & Classification Metrics",
    "Decision Trees, Entropy & Information Gain",
    "Ensemble Methods (Random Forests, XGBoost)",
    "Support Vector Machines (SVM & Kernels)",
    "K-Nearest Neighbors & Naive Bayes",
    "Clustering (K-Means & Hierarchical)",
    "Dimensionality Reduction (PCA & t-SNE)",
    "Deep Feedforward Neural Networks",
    "Convolutional Neural Networks (CNNs)",
    "Recurrent Neural Networks (RNN & LSTM)",
    "Model Evaluation, Overfitting & Cross-Validation"
  ],
  "Linear Algebra (MA-102)": [
    "Systems of Linear Equations & Gaussian Elimination",
    "Matrices & Determinants",
    "Vector Spaces & Subspaces",
    "Linear Independence, Basis & Dimension",
    "Linear Transformations & Rank-Nullity Theorem",
    "Matrix Representation of Transformations",
    "Inner Product Spaces & Orthogonality",
    "Gram-Schmidt Orthogonalization",
    "Eigenvalues & Eigenvectors",
    "Diagonalization & Symmetric Matrices",
    "Singular Value Decomposition (SVD)",
    "Applications to Graphics & Data Science"
  ],
  "Calculus III (MA-201)": [
    "Vectors & Vector-Valued Functions",
    "Functions of Several Variables & Level Surfaces",
    "Limits, Continuity & Partial Derivatives",
    "Chain Rule, Directional Derivatives & Gradients",
    "Tangent Planes, Extrema & Lagrange Multipliers",
    "Double Integrals in Cartesian & Polar Coordinates",
    "Triple Integrals in Cylindrical & Spherical",
    "Vector Fields, Divergence & Curl",
    "Line Integrals & Fundamental Theorem of Line Integrals",
    "Green's Theorem in the Plane",
    "Surface Integrals & Flux",
    "Stokes' Theorem & Divergence Theorem"
  ],
  "Discrete Mathematics (MA-303)": [
    "Propositional Logic & Truth Tables",
    "Predicate Logic & Quantifiers",
    "Methods of Proof & Mathematical Induction",
    "Set Theory, Relations & Equivalence Classes",
    "Functions, Injections, Surjections & Bijections",
    "Recurrence Relations & Generating Functions",
    "Counting Principles, Permutations & Combinations",
    "Pigeonhole Principle & Inclusion-Exclusion",
    "Graph Theory Basics: Paths, Cycles & Isomorphisms",
    "Eulerian & Hamiltonian Graphs",
    "Trees, Spanning Trees & Tree Traversals",
    "Boolean Algebras & Logic Gates"
  ],
  "Quantum Mechanics (PH-301)": [
    "Inadequacy of Classical Physics & Blackbody Radiation",
    "Photoelectric Effect & Compton Scattering",
    "Wave-Particle Duality & De Broglie Waves",
    "Heisenberg Uncertainty Principle",
    "Wave Function Postulates & Born Interpretation",
    "Time-Independent Schrödinger Equation",
    "Particle in a 1D Infinite Potential Well",
    "Finite Square Well & Quantum Tunneling",
    "Quantum Harmonic Oscillator",
    "Angular Momentum & Hydrogen Atom",
    "Identical Particles & Spin",
    "Perturbation Theory Basics"
  ],
  "Electromagnetism (PH-202)": [
    "Vector Calculus: Gradient, Divergence & Curl",
    "Coulomb's Law & Electric Field Intensity",
    "Gauss's Law & Applications",
    "Electric Potential & Work",
    "Electrostatic Boundary Conditions & Capacitance",
    "Biot-Savart Law & Magnetic Flux Density",
    "Ampere's Circuital Law & Solenoids",
    "Magnetic Vector Potential & Boundary Value Problems",
    "Faraday's Law of Induction & Lenz's Law",
    "Displacement Current & Maxwell's Equations",
    "Electromagnetic Wave Propagation in Free Space",
    "Poynting Theorem & Energy Conservation"
  ],
  "Optics & Photonic Lab (PH-104)": [
    "Fermat's Principle & Geometrical Optics",
    "Interference by Wavefront Division (Young's Double Slit)",
    "Interference by Amplitude Division (Thin Films & Newton's Rings)",
    "Michelson & Fabry-Perot Interferometers",
    "Fraunhofer Diffraction at Single & Double Slit",
    "Diffraction Gratings & Resolving Power",
    "Fresnel Diffraction & Half-Period Zones",
    "Polarization of Light & Brewster's Angle",
    "Double Refraction & Nicol Prism",
    "Quarter-Wave & Half-Wave Plates",
    "Laser Fundamentals & Population Inversion",
    "Optical Fibers: Numerical Aperture & Fiber Sensors"
  ]
};

// Master Question Types Catalogue (Full Assessment Taxonomy Demo Data)
export const MASTER_QUESTION_TYPES = [
  // ── 1. Objective / Selected-Response Questions ──
  {
    id: "MQT-MCQ",
    name: "MCQ",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Multiple-choice question with one correct option."
  },
  {
    id: "MQT-SINGLE-MCQ",
    name: "Single-choice MCQ",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Student selects exactly one correct answer from given choices."
  },
  {
    id: "MQT-MSQ",
    name: "Multiple-select MCQ (MSQ)",
    category: "Objective",
    defaultMarks: 2,
    requiresOptions: true,
    description: "Student selects all applicable correct answers from multiple choices."
  },
  {
    id: "MQT-TRUEFALSE",
    name: "True / False",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Student determines whether a given statement is true or false."
  },
  {
    id: "MQT-YESNO",
    name: "Yes / No",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Binary yes or no response to a direct factual or conceptual question."
  },
  {
    id: "MQT-ASSERTION",
    name: "Assertion–Reason",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Student evaluates an assertion statement and its related reason."
  },
  {
    id: "MQT-MATCH",
    name: "Match the Following",
    category: "Objective",
    defaultMarks: 2,
    requiresOptions: true,
    description: "Items in one column are matched with related items in another column."
  },
  {
    id: "MQT-FILLBLANKS",
    name: "Fill in the Blank",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Student supplies a missing word, phrase, symbol, number, or value."
  },
  {
    id: "MQT-MULTI-FILL",
    name: "Multiple Fill in the Blank",
    category: "Objective",
    defaultMarks: 2,
    requiresOptions: false,
    description: "One question contains multiple blanks to be filled accurately."
  },
  {
    id: "MQT-CORRECT-STMT",
    name: "Choose the Correct Statement",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Student evaluates options and selects the valid or correct statement."
  },
  {
    id: "MQT-ODD-ONE",
    name: "Odd One Out",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Student identifies the item that does not belong to the given group."
  },
  {
    id: "MQT-SEQUENCE",
    name: "Sequence / Ordering",
    category: "Objective",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Student arranges events, steps, numbers, or concepts in correct order."
  },
  {
    id: "MQT-CLASSIFICATION",
    name: "Classification",
    category: "Objective",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Student categorizes given items into appropriate logical groups."
  },
  {
    id: "MQT-PAIR-CHECK",
    name: "Correct / Incorrect Pair",
    category: "Objective",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Student identifies correctly or incorrectly related pairs."
  },

  // ── 2. Very-Short, Short and Long-Answer Questions ──
  {
    id: "MQT-VSA",
    name: "Very Short Answer (VSA)",
    category: "Short & Long",
    defaultMarks: 1,
    requiresOptions: false,
    description: "One word, phrase, value, or very brief direct response."
  },
  {
    id: "MQT-SHORT",
    name: "Short Answer (SA)",
    category: "Short & Long",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Short explanation, usually a few clear and concise sentences."
  },
  {
    id: "MQT-SA2",
    name: "Short Answer II",
    category: "Short & Long",
    defaultMarks: 3,
    requiresOptions: false,
    description: "More developed short response requiring explanation or reasoning."
  },
  {
    id: "MQT-LA",
    name: "Long Answer (LA)",
    category: "Short & Long",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Detailed structured answer, explanation, or multi-point analysis."
  },
  {
    id: "MQT-VLA",
    name: "Very Long Answer (VLA)",
    category: "Short & Long",
    defaultMarks: 6,
    requiresOptions: false,
    description: "Extended response covering multiple points, derivations, or arguments."
  },
  {
    id: "MQT-ESSAY",
    name: "Essay Type",
    category: "Short & Long",
    defaultMarks: 8,
    requiresOptions: false,
    description: "Extended written discussion of a topic with introduction, body, and conclusion."
  },
  {
    id: "MQT-RESTRICTED",
    name: "Restricted Response",
    category: "Short & Long",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Answer constrained by scope, word length, method, or specified points."
  },
  {
    id: "MQT-EXTENDED",
    name: "Extended Response",
    category: "Short & Long",
    defaultMarks: 6,
    requiresOptions: false,
    description: "Learner has greater freedom in constructing and organizing a detailed answer."
  },

  // ── 3. Comprehension / Stimulus-Based Questions ──
  {
    id: "MQT-PASSAGE",
    name: "Passage-based",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Questions anchored to a text passage requiring extraction and inference."
  },
  {
    id: "MQT-READING-COMP",
    name: "Reading comprehension",
    category: "Comprehension",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Learner reads a prose or literary text and answers comprehension prompts."
  },
  {
    id: "MQT-CASE-BASED",
    name: "Case-based",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Questions derived from a structured real-world or academic case brief."
  },
  {
    id: "MQT-CASESTUDY",
    name: "Case-study",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Detailed contextual scenario followed by integrated analytical sub-questions."
  },
  {
    id: "MQT-SOURCE-BASED",
    name: "Source-based",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Learner interprets primary or secondary source excerpts to answer prompts."
  },
  {
    id: "MQT-DOC-BASED",
    name: "Document-based",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Questions built around authentic documents, reports, or archival records."
  },
  {
    id: "MQT-DATA-BASED",
    name: "Data-based",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Learner analyzes structured numerical datasets to compute or infer conclusions."
  },
  {
    id: "MQT-SCENARIO-BASED",
    name: "Scenario-based",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Practical scenario requiring concept application and reasoned decisions."
  },
  {
    id: "MQT-SITUATION-BASED",
    name: "Situation-based",
    category: "Comprehension",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Everyday or laboratory situation testing learner judgment and application."
  },
  {
    id: "MQT-CONTEXT-BASED",
    name: "Context-based",
    category: "Comprehension",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Questions framed inside a specific thematic or disciplinary context."
  },
  {
    id: "MQT-STIMULUS-BASED",
    name: "Stimulus-based",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Prompt supported by text, visual, or quantitative stimulus material."
  },
  {
    id: "MQT-EXTRACT-BASED",
    name: "Extract-based",
    category: "Comprehension",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Short quoted extract from a text or poem followed by targeted sub-questions."
  },
  {
    id: "MQT-PICTURE-BASED",
    name: "Picture-based",
    category: "Comprehension",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Visual image stimulus requiring identification, observation, or explanation."
  },
  {
    id: "MQT-MAP-BASED",
    name: "Map-based",
    category: "Comprehension",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Geographical or historical map stimulus for locating and interpreting places."
  },
  {
    id: "MQT-GRAPH-BASED",
    name: "Graph-based",
    category: "Comprehension",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Questions based on plotted curves, trendlines, or coordinate graphs."
  },
  {
    id: "MQT-CHART-BASED",
    name: "Chart-based",
    category: "Comprehension",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Bar, pie, or flow chart stimulus requiring quantitative comparison."
  },
  {
    id: "MQT-TABLE-BASED",
    name: "Table-based",
    category: "Comprehension",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Tabular dataset requiring reading, comparison, and trend inference."
  },
  {
    id: "MQT-INFOGRAPHIC",
    name: "Infographic-based",
    category: "Comprehension",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Visual infographic combining icons, facts, and data for synthesis."
  },

  // ── 4. Competency-Based Questions ──
  {
    id: "MQT-COMP-CONCEPT",
    name: "Conceptual understanding",
    category: "Competency",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Tests depth of grasp over core principles, laws, and relationships."
  },
  {
    id: "MQT-COMP-APPLY",
    name: "Application",
    category: "Competency",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Requires applying learned concepts and procedures to novel situations."
  },
  {
    id: "MQT-COMP-ANALYSIS",
    name: "Analysis",
    category: "Competency",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Breaks complex information into components to examine relationships and patterns."
  },
  {
    id: "MQT-COMP-INTERPRET",
    name: "Interpretation",
    category: "Competency",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Requires deriving accurate meaning from text, visuals, or data."
  },
  {
    id: "MQT-COMP-EVAL",
    name: "Evaluation",
    category: "Competency",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Assesses ability to judge claims, solutions, or evidence against criteria."
  },
  {
    id: "MQT-COMP-CRITICAL",
    name: "Critical thinking",
    category: "Competency",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Evaluates logical validity, assumptions, and multi-perspective reasoning."
  },
  {
    id: "MQT-COMP-PROBLEM",
    name: "Problem solving",
    category: "Competency",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Formulates strategies to solve unfamiliar multi-step problems."
  },
  {
    id: "MQT-COMP-REASONING",
    name: "Reasoning",
    category: "Competency",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Requires justifying conclusions using deductive or inductive logic."
  },
  {
    id: "MQT-COMP-DECISION",
    name: "Decision making",
    category: "Competency",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Selects and defends the optimal course of action under constraints."
  },
  {
    id: "MQT-COMP-INFERENCE",
    name: "Inference",
    category: "Competency",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Draws logical conclusions not explicitly stated in the given evidence."
  },
  {
    id: "MQT-COMP-PREDICTION",
    name: "Prediction",
    category: "Competency",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Anticipates outcomes or trends based on scientific or analytical models."
  },
  {
    id: "MQT-COMP-COMPARE",
    name: "Comparison",
    category: "Competency",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Identifies meaningful similarities and differences across concepts or cases."
  },
  {
    id: "MQT-COMP-CLASSIFY",
    name: "Classification (Competency)",
    category: "Competency",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Groups entities or phenomena based on defined conceptual attributes."
  },
  {
    id: "MQT-COMP-REALWORLD",
    name: "Real-world application",
    category: "Competency",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Connects classroom theory directly to authentic everyday challenges."
  },
  {
    id: "MQT-COMP-HOTS",
    name: "Higher-Order Thinking Skills (HOTS)",
    category: "Competency",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Integrates analysis, synthesis, and evaluation beyond routine recall."
  },
  {
    id: "MQT-COMP-CREATIVE",
    name: "Creative thinking",
    category: "Competency",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Generates original ideas, designs, hypotheses, or alternative solutions."
  },

  // ── 5. Mathematics-Specific Question Types ──
  {
    id: "MQT-MATH-NUMERICAL",
    name: "Numerical answer",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Learner computes and enters a single verified numerical result."
  },
  {
    id: "MQT-MATH-EXACT",
    name: "Exact-value answer",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Requires an exact symbolic value such as surds, fractions, or multiples of π."
  },
  {
    id: "MQT-MATH-INTEGER",
    name: "Integer answer",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Calculation problem whose final answer is a whole integer."
  },
  {
    id: "MQT-MATH-FRACTION",
    name: "Fraction answer",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Requires expressing the computed answer in simplified fractional form."
  },
  {
    id: "MQT-MATH-DECIMAL",
    name: "Decimal answer",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Numerical result rounded or computed to specified decimal places."
  },
  {
    id: "MQT-MATH-ALGEBRA",
    name: "Algebraic expression",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Formulates, simplifies, or factors symbolic algebraic expressions."
  },
  {
    id: "MQT-MATH-EQUATION",
    name: "Equation solving",
    category: "Mathematics",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Solves linear, quadratic, polynomial, or simultaneous equations step by step."
  },
  {
    id: "MQT-MATH-WORD",
    name: "Word problem",
    category: "Mathematics",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Translates a verbal real-life scenario into mathematical equations and solves it."
  },
  {
    id: "MQT-MATH-PROOF",
    name: "Proof",
    category: "Mathematics",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Constructs a rigorous step-by-step logical proof of a theorem or identity."
  },
  {
    id: "MQT-MATH-DERIVATION",
    name: "Derivation",
    category: "Mathematics",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Derives a mathematical formula or relationship from first principles."
  },
  {
    id: "MQT-MATH-CONSTRUCT",
    name: "Construction",
    category: "Mathematics",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Performs geometric constructions accurately using compass and straightedge."
  },
  {
    id: "MQT-MATH-GEOMETRY",
    name: "Geometry problem",
    category: "Mathematics",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Applies spatial theorems, angles, congruence, or similarity to find unknowns."
  },
  {
    id: "MQT-MATH-PLOT",
    name: "Graph plotting",
    category: "Mathematics",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Plots points, functions, or inequalities accurately on coordinate axes."
  },
  {
    id: "MQT-MATH-GRAPH-INT",
    name: "Graph interpretation (Math)",
    category: "Mathematics",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Reads intercepts, slopes, roots, or domain/range from a plotted graph."
  },
  {
    id: "MQT-MATH-TABLE-COMP",
    name: "Table completion",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Computes and fills missing entries in a mathematical or statistical table."
  },
  {
    id: "MQT-MATH-PATTERN",
    name: "Pattern recognition",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Identifies underlying rules governing numerical or geometric patterns."
  },
  {
    id: "MQT-MATH-SEQ",
    name: "Sequence completion",
    category: "Mathematics",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Determines missing or next terms in arithmetic, geometric, or logical series."
  },
  {
    id: "MQT-MATH-MENTAL",
    name: "Mental mathematics",
    category: "Mathematics",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Quick arithmetic or estimation problem solved without extended written steps."
  },
  {
    id: "MQT-MATH-CALC",
    name: "Calculation-based",
    category: "Mathematics",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Procedural calculation testing accuracy in mathematical operations."
  },
  {
    id: "MQT-MATH-APP-NUM",
    name: "Application-based numerical",
    category: "Mathematics",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Applied quantitative problem connecting formulas to real contexts."
  },
  {
    id: "MQT-MATH-MULTISTEP",
    name: "Multi-step problem",
    category: "Mathematics",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Complex task combining multiple mathematical concepts across sequential steps."
  },
  {
    id: "MQT-MATH-CASE",
    name: "Case-based mathematics",
    category: "Mathematics",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Real-world mathematical case study with interconnected sub-questions."
  },
  {
    id: "MQT-MATH-AR",
    name: "Assertion–reason mathematics",
    category: "Mathematics",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Evaluates mathematical assertion validity and explanatory reasoning."
  },

  // ── 6. Science-Specific Question Types ──
  {
    id: "MQT-SCI-DIAG-LABEL",
    name: "Diagram labelling",
    category: "Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Learner identifies and labels anatomical, physical, or circuit components."
  },
  {
    id: "MQT-SCI-DIAG-INT",
    name: "Diagram interpretation",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Analyzes a scientific diagram, ray diagram, or schematic to explain processes."
  },
  {
    id: "MQT-SCI-EXP",
    name: "Experiment-based",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Questions grounded in laboratory experiments, controls, and expected results."
  },
  {
    id: "MQT-SCI-OBS",
    name: "Observation-based",
    category: "Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Requires noting physical, chemical, or biological observations and explaining why."
  },
  {
    id: "MQT-SCI-PRAC",
    name: "Practical-based",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Tests hands-on experimental skills, precautions, and measurement accuracy."
  },
  {
    id: "MQT-SCI-LAB-SCEN",
    name: "Laboratory scenario",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Presents a lab setup or anomaly for troubleshooting and scientific inference."
  },
  {
    id: "MQT-SCI-NUM",
    name: "Numerical/problem-solving",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Applies physics or chemistry equations with proper SI units to compute results."
  },
  {
    id: "MQT-SCI-CHEM-COMP",
    name: "Chemical equation completion",
    category: "Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Completes missing reactants, products, or conditions in a chemical reaction."
  },
  {
    id: "MQT-SCI-CHEM-BAL",
    name: "Chemical equation balancing",
    category: "Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Balances stoichiometric coefficients to satisfy conservation of mass."
  },
  {
    id: "MQT-SCI-REACTION",
    name: "Reaction prediction",
    category: "Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Predicts products, color changes, precipitates, or gas evolution in reactions."
  },
  {
    id: "MQT-SCI-SUB",
    name: "Identify substance",
    category: "Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Deduces unknown elements, compounds, or indicators from experimental clues."
  },
  {
    id: "MQT-SCI-APPARATUS",
    name: "Identify apparatus",
    category: "Science",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Recognizes laboratory instruments and explains their proper use."
  },
  {
    id: "MQT-SCI-PROC",
    name: "Experimental procedure",
    category: "Science",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Outlines step-by-step methodology and safety precautions to test a principle."
  },
  {
    id: "MQT-SCI-REASON",
    name: "Scientific reasoning",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Explains natural phenomena using established scientific laws and models."
  },
  {
    id: "MQT-SCI-HYPO",
    name: "Hypothesis-based",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Formulates or evaluates testable hypotheses and identifies variables."
  },
  {
    id: "MQT-SCI-DATA",
    name: "Data interpretation (Science)",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Extracts scientific relationships from experimental tables and measurements."
  },
  {
    id: "MQT-SCI-GRAPH",
    name: "Graph interpretation (Science)",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Analyzes motion, titration, or biological rate graphs to draw conclusions."
  },
  {
    id: "MQT-SCI-APP",
    name: "Application-based (Science)",
    category: "Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Applies scientific concepts to technology, health, or environmental scenarios."
  },

  // ── 7. Social Science / Geography / History Question Types ──
  {
    id: "MQT-SOC-TIMELINE",
    name: "Timeline-based",
    category: "Social Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Places historical events on a timeline or interprets chronological milestones."
  },
  {
    id: "MQT-SOC-CHRONO",
    name: "Chronology/order",
    category: "Social Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Arranges historical developments or movements in accurate chronological order."
  },
  {
    id: "MQT-SOC-CAUSE",
    name: "Cause-and-effect",
    category: "Social Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Explains historical, economic, or geographical causes and resulting impacts."
  },
  {
    id: "MQT-SOC-COMPARE",
    name: "Compare and contrast",
    category: "Social Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Contrasts policies, regions, eras, or civic institutions systematically."
  },
  {
    id: "MQT-SOC-EVENT",
    name: "Identify historical event",
    category: "Social Science",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Recognizes a historical event from dates, clues, or primary quotes."
  },
  {
    id: "MQT-SOC-PERSON",
    name: "Identify person/place",
    category: "Social Science",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Identifies key historical figures, landmarks, or geographical features."
  },
  {
    id: "MQT-SOC-CARTOON",
    name: "Political cartoon interpretation",
    category: "Social Science",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Interprets symbolism, satire, and civic commentary in political cartoons."
  },
  {
    id: "MQT-SOC-IMAGE",
    name: "Image-based (Social Science)",
    category: "Social Science",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Analyzes historical photographs, monuments, or artifacts for context."
  },
  {
    id: "MQT-SOC-ESSAY",
    name: "Analytical essay",
    category: "Social Science",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Constructs an evidence-backed historical, civic, or economic argument."
  },

  // ── 8. Language Question Types ──
  {
    id: "MQT-LANG-UNSEEN",
    name: "Unseen passage",
    category: "Language",
    defaultMarks: 5,
    requiresOptions: false,
    description: "New unfamiliar passage assessing reading comprehension and vocabulary in context."
  },
  {
    id: "MQT-LANG-SEEN",
    name: "Seen passage",
    category: "Language",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Passage from prescribed textbook testing textual understanding and detail."
  },
  {
    id: "MQT-LANG-VOCAB",
    name: "Vocabulary",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Assesses word meaning, contextual usage, and lexical precision."
  },
  {
    id: "MQT-LANG-SYN",
    name: "Synonyms",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Identifies words closest in meaning to the target word."
  },
  {
    id: "MQT-LANG-ANT",
    name: "Antonyms",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Identifies words opposite in meaning to the target word."
  },
  {
    id: "MQT-LANG-ONEWORD",
    name: "One-word substitution",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Replaces a descriptive phrase with a single precise word."
  },
  {
    id: "MQT-LANG-GRAM-MCQ",
    name: "Grammar MCQ",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Multiple-choice grammar item checking syntax, agreement, and usage."
  },
  {
    id: "MQT-LANG-ERR",
    name: "Error detection",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Locates grammatical, punctuation, or usage errors in a given sentence."
  },
  {
    id: "MQT-LANG-CORR",
    name: "Sentence correction",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Rewrites or edits an erroneous sentence into grammatically accurate form."
  },
  {
    id: "MQT-LANG-TRANS",
    name: "Sentence transformation",
    category: "Language",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Transforms sentence structure (degree, clause, simple/complex) preserving meaning."
  },
  {
    id: "MQT-LANG-REARR",
    name: "Sentence rearrangement",
    category: "Language",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Orders jumbled words or clauses into a coherent grammatical sentence."
  },
  {
    id: "MQT-LANG-JUMBLED",
    name: "Jumbled sentences",
    category: "Language",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Sequences shuffled sentences to form a logical, cohesive paragraph."
  },
  {
    id: "MQT-LANG-CLOZE",
    name: "Cloze test",
    category: "Language",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Passage with systematically omitted words testing grammar and contextual flow."
  },
  {
    id: "MQT-LANG-TENSES",
    name: "Tenses",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Applies correct verb tense forms according to time and aspect clues."
  },
  {
    id: "MQT-LANG-VOICE",
    name: "Voice",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Converts sentences accurately between active and passive voice."
  },
  {
    id: "MQT-LANG-NARR",
    name: "Narration",
    category: "Language",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Converts dialogue between direct and indirect (reported) speech."
  },
  {
    id: "MQT-LANG-POS",
    name: "Parts of speech",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Identifies or applies nouns, verbs, adjectives, adverbs, and prepositions."
  },
  {
    id: "MQT-LANG-WORDFORM",
    name: "Word formation",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Builds derived words using prefixes, suffixes, and root transformations."
  },
  {
    id: "MQT-LANG-IDIOMS",
    name: "Idioms",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Interprets or uses figurative idiomatic expressions accurately in sentences."
  },
  {
    id: "MQT-LANG-PHRASAL",
    name: "Phrasal verbs",
    category: "Language",
    defaultMarks: 1,
    requiresOptions: false,
    description: "Applies verb-preposition combinations accurately in context."
  },
  {
    id: "MQT-LANG-LIT-EXT",
    name: "Literature extract",
    category: "Language",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Literary prose or poetry excerpt testing tone, imagery, and comprehension."
  },
  {
    id: "MQT-LANG-CHAR",
    name: "Character-based question",
    category: "Language",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Analyzes character traits, motivations, and development in a text."
  },
  {
    id: "MQT-LANG-THEME",
    name: "Theme-based question",
    category: "Language",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Explores central themes, messages, and literary devices in a work."
  },
  {
    id: "MQT-LANG-RTC",
    name: "Reference-to-context",
    category: "Language",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Identifies speaker, context, and significance of quoted lines from literature."
  },
  {
    id: "MQT-LANG-LETTER",
    name: "Letter writing",
    category: "Language",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Formal or informal letter following proper salutation, format, and tone."
  },
  {
    id: "MQT-LANG-NOTICE",
    name: "Notice writing",
    category: "Language",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Concise formal institutional notice containing date, event, and key details."
  },
  {
    id: "MQT-LANG-REPORT",
    name: "Report writing",
    category: "Language",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Factual, objective report summarizing an event, survey, or investigation."
  },
  {
    id: "MQT-LANG-ARTICLE",
    name: "Article writing",
    category: "Language",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Structured informative or persuasive article for publication."
  },
  {
    id: "MQT-LANG-STORY",
    name: "Story writing",
    category: "Language",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Original narrative crafted from prompts with plot, setting, and resolution."
  },
  {
    id: "MQT-LANG-DIALOGUE",
    name: "Dialogue writing",
    category: "Language",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Natural conversational exchange between characters around a given situation."
  },
  {
    id: "MQT-LANG-CREATIVE",
    name: "Creative writing",
    category: "Language",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Imaginative composition assessing voice, originality, and expressive fluency."
  },

  // ── 9. Practical / Performance-Based Questions ──
  {
    id: "MQT-PRAC-TASK",
    name: "Practical task",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Applied hands-on task evaluated against observable performance criteria."
  },
  {
    id: "MQT-PRAC-LAB",
    name: "Laboratory task",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Supervised lab exercise measuring apparatus handling, readings, and accuracy."
  },
  {
    id: "MQT-PRAC-EXP",
    name: "Experiment",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Full experimental investigation from setup and recording to conclusion."
  },
  {
    id: "MQT-PRAC-PROJ",
    name: "Project",
    category: "Practical",
    defaultMarks: 10,
    requiresOptions: false,
    description: "Extended inquiry or build task culminating in a report, model, or artifact."
  },
  {
    id: "MQT-PRAC-ASSIGN",
    name: "Assignment",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Structured take-home or classroom task submitted for rubric assessment."
  },
  {
    id: "MQT-PRAC-ACT",
    name: "Activity-based",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Experiential learning activity demonstrating applied understanding."
  },
  {
    id: "MQT-PRAC-OBS",
    name: "Observation task",
    category: "Practical",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Systematic recording and interpretation of real-time observable phenomena."
  },
  {
    id: "MQT-PRAC-DEMO",
    name: "Demonstration",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Learner demonstrates a concept, process, or technique live."
  },
  {
    id: "MQT-PRAC-VIVA",
    name: "Viva voce",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Oral questioning session probing conceptual clarity behind practical work."
  },
  {
    id: "MQT-PRAC-ORAL",
    name: "Oral examination",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Spoken assessment evaluating pronunciation, recall, and verbal reasoning."
  },
  {
    id: "MQT-PRAC-PRES",
    name: "Presentation",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Structured visual and spoken presentation of research or findings."
  },
  {
    id: "MQT-PRAC-ROLEPLAY",
    name: "Role play",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Simulated scenario where learners enact roles to apply concepts or skills."
  },
  {
    id: "MQT-PRAC-DEBATE",
    name: "Debate",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Structured argumentation assessing evidence, rebuttal, and persuasion."
  },
  {
    id: "MQT-PRAC-GROUP",
    name: "Group activity",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Collaborative problem-solving or inquiry task assessed for teamwork and output."
  },
  {
    id: "MQT-PRAC-FIELD",
    name: "Field-work task",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Off-classroom survey, ecological study, or community data collection task."
  },
  {
    id: "MQT-PRAC-PORTFOLIO",
    name: "Portfolio",
    category: "Practical",
    defaultMarks: 10,
    requiresOptions: false,
    description: "Curated collection of learner work showcasing growth and mastery over time."
  },
  {
    id: "MQT-PRAC-ART",
    name: "Art/performance task",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Creative visual, musical, or dramatic performance evaluated via rubric."
  },
  {
    id: "MQT-PRAC-SKILL",
    name: "Skill demonstration",
    category: "Practical",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Direct performance check of a specific technical, physical, or vocational skill."
  },

  // ── 10. Interactive / Digital Question Types ──
  {
    id: "MQT-DIG-DRAGDROP",
    name: "Drag and drop",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Learner drags interactive tokens onto designated target drop zones."
  },
  {
    id: "MQT-DIG-MATCHDRAG",
    name: "Match by dragging",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Pairs related concepts by dragging cards onto matching slots."
  },
  {
    id: "MQT-DIG-CLICKSEL",
    name: "Click-to-select",
    category: "Digital",
    defaultMarks: 1,
    requiresOptions: true,
    description: "Selects target words, tiles, or regions directly by clicking."
  },
  {
    id: "MQT-DIG-HOTSPOT",
    name: "Image hotspot",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Clicks precise target coordinates or regions on an interactive image."
  },
  {
    id: "MQT-DIG-IMGLABEL",
    name: "Image labelling",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Places or types labels directly onto callout pins over an image."
  },
  {
    id: "MQT-DIG-DIAG",
    name: "Interactive diagram",
    category: "Digital",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Manipulates or annotates an interactive schematic or scientific diagram."
  },
  {
    id: "MQT-DIG-GRAPH",
    name: "Interactive graph",
    category: "Digital",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Plots points, lines, or curves directly on a digital coordinate canvas."
  },
  {
    id: "MQT-DIG-ORDER",
    name: "Arrange/order items",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Reorders interactive tiles into the correct logical or chronological sequence."
  },
  {
    id: "MQT-DIG-SORT",
    name: "Sort into categories",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Sorts digital items into two or more labeled category buckets."
  },
  {
    id: "MQT-DIG-DRAGSEQ",
    name: "Drag-and-drop sequencing",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Drags steps or stages into sequential order using touch or mouse."
  },
  {
    id: "MQT-DIG-AUDIO",
    name: "Audio-based question",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Presents an audio clip prompt for listening accuracy or response."
  },
  {
    id: "MQT-DIG-VIDEO",
    name: "Video-based question",
    category: "Digital",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Embeds a short video clip followed by analytical or comprehension prompts."
  },
  {
    id: "MQT-DIG-AUDIOCOMP",
    name: "Audio comprehension",
    category: "Digital",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Listening comprehension set evaluating recall and inference from spoken audio."
  },
  {
    id: "MQT-DIG-VIDEOCOMP",
    name: "Video comprehension",
    category: "Digital",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Multi-question comprehension exercise anchored to an educational video."
  },
  {
    id: "MQT-DIG-SPOKEN",
    name: "Spoken response",
    category: "Digital",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Captures a recorded voice answer for pronunciation or oral fluency review."
  },
  {
    id: "MQT-DIG-TYPED",
    name: "Typed response",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Free-text digital response entered via rich-text or plain input editor."
  },
  {
    id: "MQT-DIG-MATHEXP",
    name: "Mathematical expression input",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Formula/LaTeX math keypad input evaluated for algebraic equivalence."
  },
  {
    id: "MQT-DIG-CODEWRITE",
    name: "Code-writing question",
    category: "Digital",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Interactive code editor where learners write and run executable programs."
  },
  {
    id: "MQT-DIG-PROGOUT",
    name: "Programming output question",
    category: "Digital",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Displays a code snippet and asks the learner to enter its exact output."
  },

  // ── 11. Computer Science / Coding Question Types ──
  {
    id: "MQT-CS-OUTPUT",
    name: "Output prediction",
    category: "Coding",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Traces a given program snippet to predict its exact console output."
  },
  {
    id: "MQT-CS-COMPLETE",
    name: "Code completion",
    category: "Coding",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Fills in missing statements, loop conditions, or expressions in partial code."
  },
  {
    id: "MQT-CS-DEBUG",
    name: "Debugging",
    category: "Coding",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Identifies and fixes syntax, runtime, or logical bugs in broken code."
  },
  {
    id: "MQT-CS-FINDERR",
    name: "Find the error",
    category: "Coding",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Pinpoints faulty lines and explains why the snippet fails or misbehaves."
  },
  {
    id: "MQT-CODING",
    name: "Write code",
    category: "Coding",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Authors working source code in Python, Java, C++, or JavaScript to spec."
  },
  {
    id: "MQT-CS-ALGO",
    name: "Write an algorithm",
    category: "Coding",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Designs a clear step-by-step computational procedure to solve a problem."
  },
  {
    id: "MQT-CS-FLOWCHART",
    name: "Flowchart",
    category: "Coding",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Represents control flow, branching, and loops using standard flowchart symbols."
  },
  {
    id: "MQT-CS-TRACE",
    name: "Trace the algorithm",
    category: "Coding",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Tracks variable states across iterations to verify algorithmic behavior."
  },
  {
    id: "MQT-CS-SQL",
    name: "SQL query",
    category: "Coding",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Writes SQL SELECT, JOIN, GROUP BY, or DDL/DML queries against a schema."
  },
  {
    id: "MQT-CS-DBOUT",
    name: "Database query output",
    category: "Coding",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Determines the resulting rows and columns produced by a given SQL query."
  },
  {
    id: "MQT-CS-MATCHOUT",
    name: "Program-output matching",
    category: "Coding",
    defaultMarks: 2,
    requiresOptions: true,
    description: "Matches code blocks with their corresponding execution outputs."
  },
  {
    id: "MQT-CS-ORDER",
    name: "Code ordering",
    category: "Coding",
    defaultMarks: 2,
    requiresOptions: false,
    description: "Arranges shuffled code lines (Parsons problem) into a valid working program."
  },
  {
    id: "MQT-CS-PROBLEM",
    name: "Programming problem",
    category: "Coding",
    defaultMarks: 5,
    requiresOptions: false,
    description: "Full programming challenge evaluated against sample and edge test cases."
  },
  {
    id: "MQT-CS-CASE",
    name: "Case-based programming",
    category: "Coding",
    defaultMarks: 4,
    requiresOptions: false,
    description: "Software or database scenario followed by applied coding sub-questions."
  },
  {
    id: "MQT-CS-PSEUDO",
    name: "Pseudocode",
    category: "Coding",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Expresses algorithmic logic in language-independent structured pseudocode."
  },
  {
    id: "MQT-CS-DRYRUN",
    name: "Dry run / tracing",
    category: "Coding",
    defaultMarks: 3,
    requiresOptions: false,
    description: "Creates a dry-run trace table showing step-by-step variable updates."
  }
];

// Initial Question Type Sets (Course Sets with New Request Notifications)
export const INITIAL_QUESTION_TYPE_SETS = [
  // New Requests Arrived (Pending Teacher Setup)
  {
    id: "QTS-REQ-10",
    session: "2026-27",
    dueDate: "25 Nov 2026",
    program: "Class 10",
    subject: "Environmental Studies",
    chapters: [
      "Our Environment & Ecosystem",
      "Management of Natural Resources",
      "Sustainable Development & Conservation"
    ],
    assessmentTag: "Unit Test I",
    requestedBy: "Exam Controller",
    requestedAt: "Just now",
    department: "Science",
    assignedTeacher: "Current Educator (You)",
    status: "Pending Assignment",
    isNewRequest: true,
    updatedAt: "Just now",
    questionTypes: []
  },
  {
    id: "QTS-REQ-01",
    session: "2026-27",
    dueDate: "25 Nov 2026",
    program: "Class 11",
    subject: "English Core",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["English Core"],
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
    session: "2026-27",
    dueDate: "28 Nov 2026",
    program: "Class 11",
    subject: "English Core",
    chapters: [
      "The Portrait of a Lady",
      "We're Not Afraid to Die",
      "Discovering Tut: The Saga Continues"
    ],
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
    dueDate: "30 Nov 2026",
    program: "Class 12 (Science)",
    subject: "Organic Chemistry (CH-204)",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Organic Chemistry (CH-204)"],
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
    dueDate: "30 Nov 2026",
    program: "Class 12 (Science)",
    subject: "Organic Chemistry (CH-204)",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Organic Chemistry (CH-204)"],
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
    dueDate: "02 Dec 2026",
    program: "B.Tech - Computer Science Engineering",
    subject: "Operating Systems (CS-305)",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Operating Systems (CS-305)"],
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
    dueDate: "24 Nov 2026",
    program: "Class 10",
    subject: "Chemistry",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Chemistry"],
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
    dueDate: "05 Dec 2026",
    program: "B.Tech - Computer Science Engineering",
    subject: "Database Management (CS-301)",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Database Management (CS-301)"],
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
    dueDate: "26 Nov 2026",
    program: "Class 9",
    subject: "Mathematics",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Mathematics"],
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
    dueDate: "28 Nov 2026",
    program: "Class 11",
    subject: "Physics",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Physics"],
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
    dueDate: "15 Nov 2026",
    program: "B.Tech - Computer Science Engineering",
    subject: "Artificial Intelligence (CS-401)",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Artificial Intelligence (CS-401)"],
    assessmentTag: "End Semester Exam",
    department: "Computer Science",
    assignedTeacher: "Dr. Evelyn Vance",
    status: "Approved",
    isNewRequest: false,
    updatedAt: "2 hours ago",
    chapterQuestionTypes: {
      "Heuristic Search (A*)": [
        { id: "MQT-MCQ", name: "MCQ", category: "Objective", description: "Multiple-choice question with one correct option." },
        { id: "MQT-CS-DRYRUN", name: "Dry run / tracing", category: "Coding", description: "Creates a dry-run trace table showing step-by-step variable updates." }
      ],
      "Knowledge Representation": [
        { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long", description: "Short explanation, usually a few clear and concise sentences." },
        { id: "MQT-CASE-BASED", name: "Case-based", category: "Comprehension", description: "Questions derived from a structured real-world or academic case brief." }
      ],
      "Bayesian Networks": [
        { id: "MQT-MCQ", name: "MCQ", category: "Objective", description: "Multiple-choice question with one correct option." },
        { id: "MQT-ESSAY", name: "Essay Type", category: "Short & Long", description: "Extended written discussion of a topic with introduction, body, and conclusion." }
      ]
    },
    questionTypes: [
      { id: "MQT-MCQ", name: "MCQ", category: "Objective" },
      { id: "MQT-CS-DRYRUN", name: "Dry run / tracing", category: "Coding" },
      { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long" },
      { id: "MQT-CASE-BASED", name: "Case-based", category: "Comprehension" },
      { id: "MQT-ESSAY", name: "Essay Type", category: "Short & Long" }
    ]
  },
  {
    id: "QTS-SET-02",
    dueDate: "18 Nov 2026",
    program: "B.Sc - Physics & Applied Sciences",
    subject: "Quantum Mechanics (PH-301)",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Quantum Mechanics (PH-301)"],
    assessmentTag: "Mid-Sem Examination",
    department: "Physics",
    assignedTeacher: "Dr. Sarah Lin",
    status: "Approved",
    isNewRequest: false,
    updatedAt: "Yesterday",
    chapterQuestionTypes: {
      "Wave-Particle Duality": [
        { id: "MQT-MCQ", name: "MCQ", category: "Objective", description: "Multiple-choice question with one correct option." },
        { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long", description: "Short explanation, usually a few clear and concise sentences." }
      ],
      "Schrödinger Equation": [
        { id: "MQT-MATH-DERIVATION", name: "Derivation", category: "Mathematics", description: "Logical derivation of a formula, identity, or mathematical relation." },
        { id: "MQT-LA", name: "Long Answer (LA)", category: "Short & Long", description: "Detailed structured answer, explanation, or multi-point analysis." }
      ],
      "Quantum Tunneling": [
        { id: "MQT-SCI-NUMERICAL", name: "Numerical (Physics / Chemistry)", category: "Science", description: "Quantitative scientific calculation with proper units and formulas." },
        { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long", description: "Short explanation, usually a few clear and concise sentences." }
      ]
    },
    questionTypes: [
      { id: "MQT-MCQ", name: "MCQ", category: "Objective" },
      { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long" },
      { id: "MQT-MATH-DERIVATION", name: "Derivation", category: "Mathematics" },
      { id: "MQT-LA", name: "Long Answer (LA)", category: "Short & Long" },
      { id: "MQT-SCI-NUMERICAL", name: "Numerical (Physics / Chemistry)", category: "Science" }
    ]
  },
  {
    id: "QTS-SET-03",
    dueDate: "20 Nov 2026",
    program: "B.Sc - Mathematics & Computing",
    subject: "Linear Algebra (MA-102)",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Linear Algebra (MA-102)"],
    assessmentTag: "Term I Assessment",
    department: "Mathematics",
    assignedTeacher: "Prof. Marcus Thorne",
    status: "Approved",
    isNewRequest: false,
    updatedAt: "1 day ago",
    chapterQuestionTypes: {
      "Vector Spaces": [
        { id: "MQT-TRUEFALSE", name: "True / False", category: "Objective", description: "Student determines whether a given statement is true or false." },
        { id: "MQT-MATH-PROOF", name: "Proof-based", category: "Mathematics", description: "Requires formal deductive proof of a theorem, property, or geometric claim." }
      ],
      "Eigenvalues & Eigenvectors": [
        { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long", description: "Short explanation, usually a few clear and concise sentences." },
        { id: "MQT-MATH-STEPS", name: "Step-by-step calculation", category: "Mathematics", description: "Requires explicit intermediate computational steps toward the final answer." }
      ],
      "Linear Transformations": [
        { id: "MQT-MATH-PROOF", name: "Proof-based", category: "Mathematics", description: "Requires formal deductive proof of a theorem, property, or geometric claim." },
        { id: "MQT-LA", name: "Long Answer (LA)", category: "Short & Long", description: "Detailed structured answer, explanation, or multi-point analysis." }
      ]
    },
    questionTypes: [
      { id: "MQT-TRUEFALSE", name: "True / False", category: "Objective" },
      { id: "MQT-MATH-PROOF", name: "Proof-based", category: "Mathematics" },
      { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long" },
      { id: "MQT-MATH-STEPS", name: "Step-by-step calculation", category: "Mathematics" },
      { id: "MQT-LA", name: "Long Answer (LA)", category: "Short & Long" }
    ]
  },
  {
    id: "QTS-SET-04",
    dueDate: "01 Dec 2026",
    program: "Class 10",
    subject: "Physics",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Physics"],
    assessmentTag: "Pre-Board Exam",
    department: "Science",
    assignedTeacher: "Dr. Sarah Lin",
    status: "Draft",
    isNewRequest: false,
    updatedAt: "30 minutes ago",
    chapterQuestionTypes: {
      "Optics & Light Reflection": [
        { id: "MQT-MCQ", name: "MCQ", category: "Objective", description: "Multiple-choice question with one correct option." },
        { id: "MQT-ASSERTION", name: "Assertion–Reason", category: "Objective", description: "Student evaluates an assertion statement and its related reason." }
      ],
      "Human Eye & Colourful World": [
        { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long", description: "Short explanation, usually a few clear and concise sentences." },
        { id: "MQT-CASESTUDY", name: "Case-study", category: "Comprehension", description: "Detailed contextual scenario followed by integrated analytical sub-questions." }
      ],
      "Electricity": [
        { id: "MQT-MCQ", name: "MCQ", category: "Objective", description: "Multiple-choice question with one correct option." },
        { id: "MQT-SCI-NUMERICAL", name: "Numerical (Physics / Chemistry)", category: "Science", description: "Quantitative scientific calculation with proper units and formulas." }
      ]
    },
    questionTypes: [
      { id: "MQT-MCQ", name: "MCQ", category: "Objective" },
      { id: "MQT-ASSERTION", name: "Assertion–Reason", category: "Objective" },
      { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long" },
      { id: "MQT-CASESTUDY", name: "Case-study", category: "Comprehension" },
      { id: "MQT-SCI-NUMERICAL", name: "Numerical (Physics / Chemistry)", category: "Science" }
    ]
  },
  {
    id: "QTS-SET-05",
    dueDate: "10 Nov 2026",
    program: "Class 10",
    subject: "Mathematics",
    chapters: DEFAULT_CHAPTERS_BY_SUBJECT["Mathematics"],
    assessmentTag: "Annual Board Exam",
    department: "Mathematics",
    assignedTeacher: "Dr. Clara Oswald",
    status: "Submitted",
    isNewRequest: false,
    updatedAt: "2 hours ago",
    chapterQuestionTypes: {
      "Quadratic Equations": [
        { id: "MQT-MCQ", name: "MCQ", category: "Objective", description: "Multiple-choice question with one correct option." },
        { id: "MQT-MATH-WORD", name: "Word problem", category: "Mathematics", description: "Contextual narrative problem translated into mathematical equations and solved." }
      ],
      "Triangles & Similarity": [
        { id: "MQT-MATH-PROOF", name: "Proof-based", category: "Mathematics", description: "Requires formal deductive proof of a theorem, property, or geometric claim." },
        { id: "MQT-CASESTUDY", name: "Case-study", category: "Comprehension", description: "Detailed contextual scenario followed by integrated analytical sub-questions." }
      ],
      "Trigonometry": [
        { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long", description: "Short explanation, usually a few clear and concise sentences." },
        { id: "MQT-MATH-STEPS", name: "Step-by-step calculation", category: "Mathematics", description: "Requires explicit intermediate computational steps toward the final answer." }
      ]
    },
    questionTypes: [
      { id: "MQT-MCQ", name: "MCQ", category: "Objective" },
      { id: "MQT-MATH-WORD", name: "Word problem", category: "Mathematics" },
      { id: "MQT-MATH-PROOF", name: "Proof-based", category: "Mathematics" },
      { id: "MQT-CASESTUDY", name: "Case-study", category: "Comprehension" },
      { id: "MQT-SHORT", name: "Short Answer (SA)", category: "Short & Long" },
      { id: "MQT-MATH-STEPS", name: "Step-by-step calculation", category: "Mathematics" }
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
  },
  {
    id: "QCR-4007",
    code: "BIO-MSQ-01",
    program: "Class 10",
    subject: "Biology",
    exam: "Annual / Final Board Examination",
    session: "2026-27",
    chapter: "Life Processes",
    type: "Multiple-select MCQ (MSQ)",
    responseType: "MCQ_MULTIPLE",
    stimulusType: "None",
    difficulty: "Medium",
    cognitiveLevel: "Analyze",
    assessmentMode: "Written",
    marks: 2,
    negativeMarks: 0.5,
    questionText: "Which of the following events occur during the light-dependent reaction of photosynthesis? (Select all that apply)",
    options: [
      { id: "A", text: "Absorption of light energy by chlorophyll", isCorrect: true },
      { id: "B", text: "Reduction of carbon dioxide to carbohydrates", isCorrect: false },
      { id: "C", text: "Splitting of water molecules into hydrogen and oxygen (Photolysis)", isCorrect: true },
      { id: "D", text: "Conversion of chemical energy into light energy", isCorrect: false }
    ],
    correctAnswer: "Options A and C",
    solution: "During light reactions, chlorophyll absorbs photon energy and water molecules split into hydrogen and oxygen (photolysis). Reduction of CO2 happens in the dark/light-independent Calvin cycle.",
    blueprintSection: "Section A (Objective & MSQ)",
    author: "Dr. Evelyn Vance",
    status: "Approved",
    createdAt: "3 hours ago",
    assignedTeacher: "Dr. Evelyn Vance"
  },
  {
    id: "QCR-4008",
    code: "CHEM-AR-01",
    program: "Class 10",
    subject: "Chemistry",
    exam: "Annual / Final Board Examination",
    session: "2026-27",
    chapter: "Chemical Reactions and Equations",
    type: "Assertion–Reason",
    responseType: "ASSERTION_REASON",
    stimulusType: "None",
    difficulty: "Medium",
    cognitiveLevel: "Evaluate",
    assessmentMode: "Written",
    marks: 2,
    negativeMarks: 0.25,
    questionText: "Evaluate the given assertion and reasoning regarding redox reactions:",
    assertionText: "Corrosion of iron is an electrochemical phenomenon and considered a redox reaction.",
    reasonText: "During rusting, iron is oxidized to Fe²⁺ at the anodic region and oxygen is reduced to water at the cathodic region.",
    arKey: "A",
    options: [
      { id: "A", text: "Both Assertion (A) and Reason (R) are true, and (R) is the correct explanation of (A).", isCorrect: true },
      { id: "B", text: "Both Assertion (A) and Reason (R) are true, but (R) is NOT the correct explanation of (A).", isCorrect: false },
      { id: "C", text: "Assertion (A) is true, but Reason (R) is false.", isCorrect: false },
      { id: "D", text: "Assertion (A) is false, but Reason (R) is true.", isCorrect: false }
    ],
    correctAnswer: "Option A: Both (A) and (R) are true, and (R) is the correct explanation of (A).",
    solution: "Rusting of iron involves simultaneous oxidation of iron atoms to Fe²⁺ (loss of electrons) and reduction of atmospheric oxygen in moisture (gain of electrons). Thus it is a classic redox process.",
    blueprintSection: "Section A (Objective & MSQ)",
    author: "Prof. Marcus Thorne",
    status: "Approved",
    createdAt: "5 hours ago",
    assignedTeacher: "Prof. Marcus Thorne"
  },
  {
    id: "QCR-4009",
    code: "PHY-NUM-01",
    program: "Class 10",
    subject: "Physics",
    exam: "Annual / Final Board Examination",
    session: "2026-27",
    chapter: "Light - Reflection and Refraction",
    type: "Numerical Answer",
    responseType: "NUMERICAL",
    stimulusType: "None",
    difficulty: "Hard",
    cognitiveLevel: "Apply",
    assessmentMode: "Written",
    marks: 3,
    negativeMarks: 0,
    numericValue: 15,
    numericTolerance: 0.5,
    numericUnit: "cm",
    questionText: "An object is placed at a distance of 30 cm in front of a concave mirror of focal length 20 cm. At what distance (in cm) from the mirror should a screen be placed to obtain a sharp focused image? (Enter the absolute numeric value in cm).",
    options: [],
    correctAnswer: "15 cm (Image distance v = -60 cm; screen distance from mirror is 60 cm)",
    solution: "Mirror Formula: 1/f = 1/v + 1/u. With Cartesian sign convention: u = -30 cm, f = -20 cm. 1/v = 1/(-20) - 1/(-30) = -1/20 + 1/30 = -1/60 => v = -60 cm. The screen must be placed 60 cm in front of the mirror.",
    blueprintSection: "Section C (Numerical Problems)",
    author: "Dr. Sarah Lin",
    status: "Submitted",
    createdAt: "1 day ago",
    assignedTeacher: "Dr. Sarah Lin"
  },
  {
    id: "QCR-4010",
    code: "MATH-MATCH-01",
    program: "Class 10",
    subject: "Mathematics",
    exam: "Annual / Final Board Examination",
    session: "2026-27",
    chapter: "Trigonometric Functions",
    type: "Match the Following",
    responseType: "MATCHING",
    stimulusType: "None",
    difficulty: "Medium",
    cognitiveLevel: "Understand",
    assessmentMode: "Written",
    marks: 4,
    negativeMarks: 1,
    questionText: "Match the standard trigonometric values in Column I with their corresponding expressions in Column II:",
    matchingPairs: [
      { id: 1, left: "sin(30°)", right: "1/2" },
      { id: 2, left: "cos(45°)", right: "1/√2" },
      { id: 3, left: "tan(60°)", right: "√3" },
      { id: 4, left: "sec(60°)", right: "2" }
    ],
    options: [],
    correctAnswer: "1 -> 1/2, 2 -> 1/√2, 3 -> √3, 4 -> 2",
    solution: "Direct evaluation from trigonometric unit ratios: sin(30°) = 0.5, cos(45°) = 1/√2, tan(60°) = √3, sec(60°) = 1/cos(60°) = 2.",
    blueprintSection: "Section B (Matching & Comprehension)",
    author: "Prof. Alan Turing",
    status: "Approved",
    createdAt: "1 day ago",
    assignedTeacher: "Prof. Alan Turing"
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

