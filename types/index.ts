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

// ─── Deep Topic Structure — সহায়ক ইন্টারফেসসমূহ ─────────────────────

export interface TopicFormula {
  name: string;
  formula: string;
  explanation: string;
}

export interface PracticeProblem {
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface LabExperiment {
  title: string;
  materials: string[];
  procedure: string[];
  precautions: string[];
  observation?: string;
}

/** ভিডিও/অ্যানিমেশন-জাতীয় মিডিয়া রেফারেন্স (title + description + optional url) */
export interface TopicMedia {
  title: string;
  description: string;
  url?: string;
}

/** PDF নোট ইত্যাদির জন্য সাধারণ রিসোর্স লিংক */
export interface TopicResource {
  title: string;
  url: string;
}

export interface Diagram {
  url: string;
  caption?: string;
}

/** 3D গঠন — lib/molecules.ts-এর পূর্বনির্ধারিত অণু (moleculeId দিয়ে) অথবা বাহিরের মডেল লিংক (modelUrl) */
export interface Structure3D {
  moleculeId?: string;
  title?: string;
  description?: string;
  modelUrl?: string;
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
    historicalBackground?: string;   // ঐতিহাসিক পটভূমি
    theory: string[];
    formulas?: TopicFormula[];       // মূল সূত্রসমূহ
    derivation?: string[];           // ধাপে ধাপে ডেরিভেশন
    examples: Example[];
    practiceProblems?: PracticeProblem[]; // অনুশীলন সমস্যা (উত্তরসহ, সমাধান-ধাপ ছাড়া)
    applications: string[];
    industrialUses?: string[];       // শিল্পে ব্যবহার
    safety?: string[];               // নিরাপত্তা সতর্কতা
    labExperiment?: LabExperiment;   // ল্যাব এক্সপেরিমেন্ট
    animation?: TopicMedia;          // অ্যানিমেশন/ভিডিও
    pdfNotes?: TopicResource[];      // PDF নোট
    notes: string[];
  };
  diagrams: Diagram[];
  structure3D?: Structure3D;         // 3D গঠন
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

export interface Reaction {
  id: string;
  name: string;
  nameBn: string;
  equation: string;
  category: string;
  type: string;
  subType?: string;
  conditions: { temperature?: string; pressure?: string; other?: string };
  catalyst?: string;
  mechanism: string[];
  intermediates?: string[];
  products: string[];
  applications: string[];
  industrialUses?: string[];
  safetyNotes?: string[];
  thermodynamics?: { deltaH: number; unit: string; type: string };
  nuclearData?: {
    halfLife?: string;
    radiation?: string;
    parentNuclide?: string;
    daughterNuclide?: string;
    energyMeV?: number;
  };
  biochemData?: {
    atp?: string;
    location?: string;
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
