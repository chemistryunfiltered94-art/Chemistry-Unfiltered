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

export interface Reaction {
  id: string;
  name: string;
  nameBn: string;
  equation: string;
  category: string;
  type: string;
  conditions: { temperature?: string; pressure?: string; other?: string };
  catalyst?: string;
  mechanism: string[];
  products: string[];
  applications: string[];
  thermodynamics?: { deltaH: number; unit: string; type: string };
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

// ✅ নোটস সেকশনের জন্য (Class / Revision / Practical Notes ও ফর্মুলা শিট)
export type NoteType = "class" | "revision" | "practical" | "formula";

export interface StudyNote {
  id: string;
  title: string;
  slug: string;
  type: NoteType;
  category: ChemistryCategory;
  summary: string;
  content: string;
  published: boolean;
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
