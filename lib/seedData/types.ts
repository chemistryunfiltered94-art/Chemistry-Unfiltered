// lib/seedData/types.ts
//
// "Deep Topic Structure" বাল্ক-কনটেন্ট সিডিং-এর জন্য টাইপ। প্রতিটি subsection
// (যেমন: ১.১ মৌলিক ধারণা) একটি SeedChapter — যার ভেতরে তার সবগুলো Topic থাকে,
// প্রতিটি Topic-এর সম্পূর্ণ Deep Topic Structure কনটেন্ট সহ।
//
// admin/seed-content পেজ এই অবজেক্টগুলো পড়ে Firestore-এ চ্যাপ্টার + টপিক তৈরি করে —
// টপিক অ্যাডমিন ফর্ম ম্যানুয়ালি একে একে পূরণ করার বদলে।

import { ChemistryCategory } from "@/types";

export interface SeedFormula {
  name: string;
  formula: string;
  explanation: string;
}

export interface SeedPracticeProblem {
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
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

export interface SeedTopic {
  title: string;
  slug: string;            // গোটা সাইটজুড়ে unique হতে হবে
  estimatedTime: number;   // মিনিট
  level?: "beginner" | "intermediate" | "advanced";
  summary: string;
  content: {
    introduction: string;
    historicalBackground?: string;
    theory: string[];
    formulas?: SeedFormula[];
    derivation?: string[];
    applications: string[];
    industrialUses?: string[];
    safety?: string[];
    practiceProblems?: SeedPracticeProblem[];
    labExperiment?: SeedLabExperiment;
    notes: string[];
  };
  mcqs?: SeedMCQ[];
  // পূর্বনির্ধারিত molecule (lib/molecules.ts)-এর id দিয়ে 3D গঠন যুক্ত করা যায়,
  // শুধু সেইসব টপিকের জন্য যেখানে একটি নির্দিষ্ট অণু প্রাসঙ্গিক।
  moleculeId?: string;
}

export interface SeedChapter {
  code: string;             // lib/syllabus.ts-এর code-এর সাথে মেলে, যেমন "1.1"
  category: ChemistryCategory;
  chapterTitle: string;
  chapterDescription?: string;
  chapterOrder: number;
  topics: SeedTopic[];
}
