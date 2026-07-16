// lib/seedContent.ts
//
// লার্ন-সেকশনের (/learn/...) জন্য কেন্দ্রীয় ডেটা সোর্স। আগে এই পেজগুলো
// Firestore থেকে chapters/topics পড়ত, কিন্তু Phase 1/2-এ নেওয়া সিদ্ধান্ত
// অনুযায়ী টপিক কনটেন্ট এখন শুধু lib/seedData/-এ hardcoded থাকে, Firestore-এ
// কখনো সিড করা হয়নি। এই মডিউল সেই সিদ্ধান্তের সাথে সামঞ্জস্য রেখে
// SYLLABUS (lib/syllabus.ts) + SEED_PACKAGES (lib/seedData/index.ts) থেকে
// সরাসরি chapter/topic ডেটা বের করে দেয় — কোনো Firestore কল ছাড়াই।
//
// chapterId হিসেবে SeedChapter.code (যেমন "1.1") ব্যবহার করা হয় — এটাই
// একমাত্র stable, predictable আইডেন্টিফায়ার যা Firestore auto-id-এর ওপর
// নির্ভর না করেই URL/routing-এ ব্যবহারযোগ্য।

import { SYLLABUS, SyllabusChapter, findSyllabusChapter } from "./syllabus";
import { SEED_PACKAGES } from "./seedData";
import { SeedTopic } from "./seedData/types";
import { ChemistryCategory } from "@/types";

export interface ContentChapter {
  id: string;              // = SeedChapter.code, যেমন "1.1"
  title: string;
  categoryId: ChemistryCategory;
  order: number;
  description?: string;
  topicCount: number;      // এই অধ্যায়ে কনটেন্ট লেখা হয়ে যাওয়া টপিক সংখ্যা
}

/** কোনো ক্যাটেগরির সবগুলো অধ্যায় (syllabus অনুযায়ী), প্রতিটির সাথে বাস্তব
 *  টপিক সংখ্যা (কনটেন্ট লেখা হয়ে গেলে SEED_PACKAGES থেকে, নাহলে ০)। */
export function getContentChapters(category: ChemistryCategory): ContentChapter[] {
  const syllabusChapters = SYLLABUS[category] || [];

  return syllabusChapters
    .map((sc: SyllabusChapter) => {
      const pkg = SEED_PACKAGES.find((p) => p.code === sc.code && p.category === category);
      return {
        id: sc.code,
        title: sc.title,
        categoryId: category,
        order: sc.order,
        description: sc.description,
        topicCount: pkg?.topics.length ?? 0,
      };
    })
    .sort((a, b) => a.order - b.order);
}

/** একটি অধ্যায়ের মেটাডেটা (chapterId = code দিয়ে, ক্যাটেগরি নির্বিশেষে খোঁজে)। */
export function getContentChapter(chapterCode: string): ContentChapter | null {
  for (const category of Object.keys(SYLLABUS) as ChemistryCategory[]) {
    const sc = findSyllabusChapter(category, chapterCode);
    if (sc) {
      const pkg = SEED_PACKAGES.find((p) => p.code === sc.code && p.category === category);
      return {
        id: sc.code,
        title: sc.title,
        categoryId: category,
        order: sc.order,
        description: sc.description,
        topicCount: pkg?.topics.length ?? 0,
      };
    }
  }
  return null;
}

/** একটি অধ্যায়ের সবগুলো টপিক (কনটেন্ট লেখা হয়ে থাকলে); নাহলে খালি array। */
export function getChapterTopics(chapterCode: string): SeedTopic[] {
  const pkg = SEED_PACKAGES.find((p) => p.code === chapterCode);
  return pkg?.topics ?? [];
}

/** slug দিয়ে একটি টপিক খুঁজে বের করে, সাথে তার chapter/category context। */
export function findTopicBySlug(
  slug: string
): { topic: SeedTopic; chapterCode: string; category: ChemistryCategory; chapterTitle: string } | null {
  for (const pkg of SEED_PACKAGES) {
    const topic = pkg.topics.find((t) => t.slug === slug);
    if (topic) {
      return { topic, chapterCode: pkg.code, category: pkg.category, chapterTitle: pkg.chapterTitle };
    }
  }
  return null;
}
