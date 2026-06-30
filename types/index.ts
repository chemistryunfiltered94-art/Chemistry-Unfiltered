// types/index.ts — Chapter interface যোগ করা হয়েছে

export type UserRole = "student" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
}

export type Level = "beginner" | "intermediate" | "advanced";

export type ChemistryCategory =
  | "physical-chemistry"
  | "organic-chemistry"
  | "inorganic-chemistry"
  | "analytical-chemistry"
  | "biochemistry"
  | "environmental-chemistry"
  | "industrial-chemistry";

// ✅ নতুন Chapter interface
export interface Chapter {
  id: string;
  title: string;           // যেমন: "পরমাণুর গঠন", "রাসায়নিক বন্ধন"
  categoryId: ChemistryCategory;
  order: number;           // অধ্যায়ের ক্রম
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  categoryId: ChemistryCategory;
  level?: Level;           // ✅ difficulty level (optional for backward compatibility)
  chapterId: string;       // ✅ কোন অধ্যায়ে আছে
  estimatedTime: number;
  summary: string;
  content: {
    introduction: string;
    theory: string[];
    examples: Example[];
    applications: string[];
    notes: string[];
  };
  diagrams: string[];
  mcqs: MCQ[];
  relatedTopics: string[];
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Formula {
  id: string;
  name: string;
  nameBn: string;
  formula: string;
  latexFormula: string;
  category: ChemistryCategory;
  variables: FormulaVariable[];
  explanation: string;
  example: { question: string; solution: string };
  relatedFormulas: string[];
  relatedTopics: string[];
}

export interface FormulaVariable {
  symbol: string;
  meaning: string;
  unit: string;
}

// ─── Reaction Category types ────────────────────────────────────────
export type ReactionCategory =
  | "organic"
  | "inorganic"
  | "industrial"
  | "biochemical"
  | "nuclear"
  | "physical"
  | "analytical";

// Organic sub-types
export type OrganicSubType =
  | "substitution-sn1"
  | "substitution-sn2"
  | "elimination-e1"
  | "elimination-e2"
  | "addition-hydrogenation"
  | "addition-halogenation"
  | "addition-hydrohalogenation"
  | "oxidation-kmno4"
  | "oxidation-ozonolysis"
  | "named-aldol"
  | "named-cannizzaro"
  | "named-friedel-crafts"
  | "named-grignard"
  | "named-wurtz"
  | "named-sandmeyer"
  | "named-reimer-tiemann"
  | "named-claisen";

// Inorganic sub-types
export type InorganicSubType =
  | "neutralization"
  | "redox"
  | "precipitation"
  | "displacement"
  | "complex-formation";

// Industrial sub-types
export type IndustrialSubType =
  | "haber-process"
  | "contact-process"
  | "ostwald-process"
  | "hall-heroult"
  | "solvay-process";

// Biochemical sub-types
export type BiochemicalSubType =
  | "glycolysis"
  | "krebs-cycle"
  | "photosynthesis"
  | "respiration";

// Nuclear sub-types
export type NuclearSubType =
  | "alpha-decay"
  | "beta-decay"
  | "gamma-decay"
  | "fission"
  | "fusion";

export interface Reaction {
  id: string;
  name: string;
  nameBn: string;
  equation: string;
  category: ReactionCategory | string;
  subType?: string;                        // e.g. "substitution-sn1", "named-grignard"
  type: string;                            // display label e.g. "SN1", "Grignard"
  conditions: {
    temperature?: string;
    pressure?: string;
    other?: string;
  };
  catalyst?: string;
  mechanism: string[];
  intermediates?: string[];               // ✅ নতুন: intermediate compounds
  products: string[];
  applications: string[];
  industrialUses?: string[];              // ✅ নতুন: শিল্প প্রয়োগ
  safetyNotes?: string[];                 // ✅ নতুন: নিরাপত্তা তথ্য
  thermodynamics?: {
    deltaH: number;
    unit: string;
    type: "exothermic" | "endothermic";
  };
  // Nuclear specific
  nuclearData?: {
    halfLife?: string;
    radiation?: string;
    parentNuclide?: string;
    daughterNuclide?: string;
    energyMeV?: number;
  };
  // Biochemical specific
  biochemData?: {
    atp?: string;                         // ATP produced/consumed
    location?: string;                    // cell location e.g. cytoplasm, mitochondria
    enzymes?: string[];
  };
}

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  nameBn: string;
  atomicMass: number;
  category: string;
  period: number;
  group: number;
  electronConfig: string;
  oxidationStates: number[];
  electronegativity?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  density?: number;
  state: "solid" | "liquid" | "gas" | "unknown";
  discoveredBy?: string;
  discoveryYear?: number;
  uses: string[];
  isotopes: string[];
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  exam: string[];
  categoryId: string;
  topicId: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image?: string;
  author: string;
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Example {
  question: string;
  solution: string;
  steps: string[];
}

export interface Progress {
  userId: string;
  topicId: string;
  completed: boolean;
  lastVisited: Date;
}

export interface Bookmark {
  userId: string;
  refType: "article" | "formula" | "reaction" | "question";
  refId: string;
  createdAt: Date;
}

// ─── Study Notes ──────────────────────────────────────────────────

export type NoteType = "class" | "revision" | "practical" | "formula";

export interface StudyNote {
  id: string;
  title: string;
  slug: string;
  type: NoteType;
  category: ChemistryCategory;
  summary?: string;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
