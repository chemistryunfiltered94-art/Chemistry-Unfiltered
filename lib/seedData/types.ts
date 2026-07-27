// lib/seedData/types.ts
//
// "Deep Topic Structure" বাল্ক-কনটেন্ট সিডিং-এর জন্য টাইপ। দুই ধরনের কাঠামো সাপোর্ট করে:
//
//   ২-লেভেল (ভৌত ও জৈব রসায়ন):
//     SeedChapter2Level → SeedSubtopic[]   (সরাসরি কনটেন্ট পেজ, কোনো মাঝের লেভেল নেই)
//
//   ৩-লেভেল (অজৈব ও বিশ্লেষণাত্মক রসায়ন):
//     SeedChapter3Level → SeedTopic[] → SeedSubtopic[]
//       SeedTopic শুধু গ্রুপিং করে, নিজে কনটেন্ট রাখে না।
//       SeedSubtopic-ই সব ক্ষেত্রে আসল কনটেন্ট পেজ, ২৫টি সেকশন সহ।
//
// admin/seed-content পেজ chapter.structure দেখে বুঝে নেয় কীভাবে Firestore-এ
// চ্যাপ্টার + টপিক(/সাব-টপিক) সিড করতে হবে — ম্যানুয়ালি একে একে ফর্ম পূরণ করার বদলে।

import { ChemistryCategory } from "@/types";

export interface SeedFormula {
  name: string;
  formula: string;
  explanation: string;
}

export interface SeedExample {
  question: string;
  steps: string[];
  answer: string;
}

export interface SeedDiagram {
  url: string;
  caption: string;
}

export interface SeedAnimation {
  title: string;
  description: string;
  url?: string;
}

export interface SeedPdfNote {
  title: string;
  url: string;
}

export interface SeedPracticeProblem {
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface SeedShortQuestion {
  question: string;
  answer: string;
}

export interface SeedBoardQuestion {
  question: string;
  board?: string;   // যেমন "ঢাকা বোর্ড ২০২৩"
  year?: string;
  answer?: string;
}

export interface SeedLabExperiment {
  title: string;
  materials: string[];
  procedure: string[];
  precautions: string[];
  observation?: string;
}

export interface SeedMCQ {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0-3
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface SeedReference {
  title: string;
  url?: string;
}

/** একটি সাব-টপিক — আসল কনটেন্ট পেজ (Chapter → Topic → Subtopic এর তৃতীয় স্তর)। */
export interface SeedSubtopic {
  title: string;
  slug: string;            // গোটা সাইটজুড়ে unique হতে হবে
  estimatedTime: number;   // মিনিট
  level?: "beginner" | "intermediate" | "advanced";
  summary: string;
  content: {
    introduction: string;
    historicalBackground?: string;
    definition?: string;
    theory: string[];
    concepts?: string[];
    formulas?: SeedFormula[];
    derivation?: string[];
    examples?: SeedExample[];
    diagrams?: SeedDiagram[];
    animation?: SeedAnimation;
    applications: string[];
    industrialUses?: string[];
    advantages?: string[];
    disadvantages?: string[];
    safety?: string[];
    importantNotes?: string[];
    commonMistakes?: string[];
    summaryPoints?: string[];
    notes: string[];
  };
  practiceProblems?: SeedPracticeProblem[];
  shortQuestions?: SeedShortQuestion[];
  boardQuestions?: SeedBoardQuestion[];
  labExperiment?: SeedLabExperiment;
  mcqs?: SeedMCQ[];
  references?: SeedReference[];
  pdfNotes?: SeedPdfNote[];
  // পূর্বনির্ধারিত molecule (lib/molecules.ts)-এর id দিয়ে 3D গঠন যুক্ত করা যায়,
  // শুধু সেইসব সাব-টপিকের জন্য যেখানে একটি নির্দিষ্ট অণু প্রাসঙ্গিক।
  moleculeId?: string;
}

/** একটি টপিক — chapter ও subtopic-এর মাঝের স্তর (৩-লেভেল ক্যাটেগরিতে), নিজে সরাসরি কনটেন্ট রাখে না। */
export interface SeedTopic {
  title: string;
  slug: string;            // গোটা সাইটজুড়ে unique হতে হবে
  summary?: string;
  subtopics: SeedSubtopic[];
}

interface SeedChapterBase {
  code: string;             // lib/syllabus.ts-এর code-এর সাথে মেলে, যেমন "1.1"
  category: ChemistryCategory;
  chapterTitle: string;
  chapterDescription?: string;
  chapterOrder: number;
}

/**
 * ২-লেভেল chapter (Chapter → Topic) — ভৌত রসায়ন ও জৈব রসায়নে ব্যবহৃত।
 * এখানে "topics" সরাসরি কনটেন্ট পেজ (SeedSubtopic শেপ), মাঝে কোনো wrapper নেই।
 */
export interface SeedChapter2Level extends SeedChapterBase {
  structure: "2-level";
  topics: SeedSubtopic[];
}

/**
 * ৩-লেভেল chapter (Chapter → Topic → Subtopic) — অজৈব রসায়ন ও
 * বিশ্লেষণাত্মক রসায়নে ব্যবহৃত। এখানে "topics" মাঝের wrapper লেভেল,
 * প্রতিটার ভেতরে subtopics (আসল কনটেন্ট পেজ) থাকে।
 */
export interface SeedChapter3Level extends SeedChapterBase {
  structure: "3-level";
  topics: SeedTopic[];
}

export type SeedChapter = SeedChapter2Level | SeedChapter3Level;
