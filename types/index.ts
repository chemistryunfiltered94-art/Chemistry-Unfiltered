// types/index.ts — Chapter interface যোগ করা হয়েছে

export type UserRole = "student" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
  // ── গ্যামিফিকেশন ফিল্ড — নতুন ইউজার তৈরির সময় 0/[]  দিয়ে সেট হয়
  // (AuthModal.tsx, register/page.tsx); পুরনো একাউন্টে না থাকতে পারে
  // বলে useGamification.ts-এ সবসময় `user?.xp || 0` প্যাটার্নে পড়া হয় ──
  xp?: number;
  streak?: number;
  unlockedAchievements?: AchievementId[];
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

// ─── Gamification: Achievements ────────────────────────────────────

/** lib/gamification.ts-এর ACHIEVEMENTS লিস্টে ব্যবহৃত সবগুলো achievement id */
export type AchievementId =
  | "first-topic"
  | "five-topics"
  | "streak-3"
  | "xp-100"
  | "streak-14";

export interface Achievement {
  id: AchievementId;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  xpReward: number;
  /** lucide-react আইকনের নাম (components/dashboard/GamificationAchievements.tsx-এর ICON_MAP-এর key) */
  icon: string;
}

export interface Bookmark {
  userId: string;
  refType: "article" | "formula" | "reaction" | "question" | "historyEra" | "nobelLaureate" | "scientist";
  refId: string;
  createdAt: Date;
}

// ─── History Hub: Timeline / Nobel Laureates / Scientists ────────

/** রসায়নের ইতিহাস টাইমলাইন — একটি যুগ/ঘটনা */
export interface HistoryEra {
  id: string;
  title: string;        // e.g. "Atomic Theory"
  titleBn: string;       // e.g. "পরমাণু তত্ত্ব"
  period: string;        // e.g. "1803" বা "৪০০ খ্রিস্টপূর্ব" — display label
  yearStart: number;     // sort/filter-এর জন্য numeric year (BCE হলে negative)
  yearEnd?: number;
  summary: string;       // card-এ ছোট বিবরণ
  description: string;   // full body (markdown/plain)
  keyFigures: string[];  // এই যুগের সাথে জড়িত বিজ্ঞানীদের নাম
  image?: string;
  tags: string[];
  published: boolean;
  order: number;         // টাইমলাইনে ক্রম
  createdAt: Date;
  updatedAt: Date;
}

/** রসায়নে নোবেল বিজয়ী */
export interface NobelLaureate {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  year: number;                 // নোবেল পাওয়ার সাল
  country: string;
  countryBn?: string;
  photo?: string;
  motivation: string;           // নোবেল কমিটির ভাষ্যে অবদান (সংক্ষেপ)
  motivationBn?: string;
  biography: string;            // full bio
  keyContributions: string[];
  sharedWith: string[];         // একই বছরের সহ-বিজয়ী (নাম)
  birthYear?: number;
  deathYear?: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** বিখ্যাত রসায়নবিদ/বিজ্ঞানী (নোবেল না পেলেও) */
export interface Scientist {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  photo?: string;
  birthYear?: number;
  deathYear?: number;
  country: string;
  countryBn?: string;
  field: string;                 // e.g. "Organic Chemistry", "Periodic Table"
  fieldBn?: string;
  shortBio: string;              // card summary
  biography: string;             // full body
  keyContributions: string[];
  famousFor: string;             // one-line hook, e.g. "পর্যায় সারণির জনক"
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Revision (উচ্চ মাধ্যমিক / অনার্স — Subject → Year → Q&A) ──────

export type RevisionLevel = "hsc" | "honours";

export const REVISION_LEVEL_LABELS: Record<RevisionLevel, string> = {
  hsc: "উচ্চ মাধ্যমিক",
  honours: "অনার্স",
};

export interface RevisionQuestion {
  id: string;
  level: RevisionLevel;
  subject: string;      // যেমন: "জৈব রসায়ন", "পদার্থবিজ্ঞান ১ম পত্র"
  year: string;         // যেমন: "2023", "2024" — free text (string) রাখা হয়েছে যাতে "2023 (ঢাকা বোর্ড)"-এর মতো লেখা যায়
  question: string;
  answer: string;
  order?: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
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
