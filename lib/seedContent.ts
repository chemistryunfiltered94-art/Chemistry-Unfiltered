// lib/seedContent.ts
//
// লার্ন-সেকশনের (/learn/...) জন্য কেন্দ্রীয় ডেটা সোর্স। আগে এই পেজগুলো
// Firestore থেকে chapters/topics পড়ত, কিন্তু Phase 1/2-এ নেওয়া সিদ্ধান্ত
// অনুযায়ী টপিক কনটেন্ট এখন শুধু lib/seedData/-এ hardcoded থাকে, Firestore-এ
// কখনো সিড করা হয়নি। এই মডিউল সেই সিদ্ধান্তের সাথে সামঞ্জস্য রেখে
// SYLLABUS (lib/syllabus.ts) + SEED_PACKAGES (lib/seedData/index.ts) থেকে
// সরাসরি chapter/topic/subtopic ডেটা বের করে দেয় — কোনো Firestore কল ছাড়াই।
//
// কাঠামো তিন স্তরের: Chapter → Topic → Subtopic (আসল কনটেন্ট পেজ)।
//
// chapterId হিসেবে SeedChapter.code (যেমন "1.1") ব্যবহার করা হয় — এটাই
// একমাত্র stable, predictable আইডেন্টিফায়ার যা Firestore auto-id-এর ওপর
// নির্ভর না করেই URL/routing-এ ব্যবহারযোগ্য।

import { SYLLABUS, SyllabusChapter, findSyllabusChapter } from "./syllabus";
import { SEED_PACKAGES } from "./seedData";
import { SeedTopic, SeedSubtopic } from "./seedData/types";
import { ChemistryCategory } from "@/types";

export interface ContentChapter {
  id: string;              // = SeedChapter.code, যেমন "1.1"
  title: string;
  categoryId: ChemistryCategory;
  order: number;
  description?: string;
  topicCount: number;      // এই অধ্যায়ে টপিক সংখ্যা
  subtopicCount: number;   // এই অধ্যায়ে (সব টপিক মিলিয়ে) কনটেন্ট লেখা সাব-টপিক সংখ্যা
}

/** কোনো ক্যাটেগরির সবগুলো অধ্যায় (syllabus অনুযায়ী), প্রতিটির সাথে বাস্তব
 *  টপিক/সাব-টপিক সংখ্যা (কনটেন্ট লেখা হয়ে গেলে SEED_PACKAGES থেকে, নাহলে ০)। */
export function getContentChapters(category: ChemistryCategory): ContentChapter[] {
  const syllabusChapters = SYLLABUS[category] || [];

  return syllabusChapters
    .map((sc: SyllabusChapter) => {
      const pkg = SEED_PACKAGES.find((p) => p.code === sc.code && p.category === category);
      const subtopicCount = (pkg?.topics ?? []).reduce((sum, t) => sum + t.subtopics.length, 0);
      return {
        id: sc.code,
        title: sc.title,
        categoryId: category,
        order: sc.order,
        description: sc.description,
        topicCount: pkg?.topics.length ?? 0,
        subtopicCount,
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
      const subtopicCount = (pkg?.topics ?? []).reduce((sum, t) => sum + t.subtopics.length, 0);
      return {
        id: sc.code,
        title: sc.title,
        categoryId: category,
        order: sc.order,
        description: sc.description,
        topicCount: pkg?.topics.length ?? 0,
        subtopicCount,
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
  chapterCode: string,
  topicSlug: string
): { topic: SeedTopic; chapterCode: string; category: ChemistryCategory; chapterTitle: string } | null {
  const pkg = SEED_PACKAGES.find((p) => p.code === chapterCode);
  if (!pkg) return null;
  const topic = pkg.topics.find((t) => t.slug === topicSlug);
  if (!topic) return null;
  return { topic, chapterCode: pkg.code, category: pkg.category, chapterTitle: pkg.chapterTitle };
}

/** একটি টপিকের সবগুলো সাব-টপিক (chapterCode + topicSlug দিয়ে)। */
export function getTopicSubtopics(chapterCode: string, topicSlug: string): SeedSubtopic[] {
  const found = findTopicBySlug(chapterCode, topicSlug);
  return found?.topic.subtopics ?? [];
}

/** slug দিয়ে একটি সাব-টপিক (আসল কনটেন্ট পেজ) খুঁজে বের করে, সাথে তার
 *  topic/chapter/category context — গোটা সাইট জুড়ে slug দিয়ে সরাসরি খোঁজে। */
export function findSubtopicBySlug(
  slug: string
): {
  subtopic: SeedSubtopic;
  topicSlug: string;
  topicTitle: string;
  chapterCode: string;
  chapterTitle: string;
  category: ChemistryCategory;
} | null {
  for (const pkg of SEED_PACKAGES) {
    for (const topic of pkg.topics) {
      const subtopic = topic.subtopics.find((s) => s.slug === slug);
      if (subtopic) {
        return {
          subtopic,
          topicSlug: topic.slug,
          topicTitle: topic.title,
          chapterCode: pkg.code,
          chapterTitle: pkg.chapterTitle,
          category: pkg.category,
        };
      }
    }
  }
  return null;
}
