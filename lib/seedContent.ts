// lib/seedContent.ts
//
// লার্ন-সেকশনের (/learn/...) জন্য কেন্দ্রীয় ডেটা সোর্স। টপিক কনটেন্ট শুধু
// lib/seedData/-এ hardcoded থাকে (Firestore-এ কখনো সিড করা হয়নি), তাই এই
// মডিউল SYLLABUS (lib/syllabus.ts) + SEED_PACKAGES (lib/seedData/index.ts)
// থেকে সরাসরি chapter/topic/subtopic ডেটা বের করে দেয়।
//
// দুই ধরনের কাঠামো সাপোর্ট করে (SeedChapter.structure discriminant দিয়ে):
//   - "2-level" (ভৌত ও জৈব রসায়ন): Chapter → Topic, Topic-ই সরাসরি কনটেন্ট পেজ
//   - "3-level" (অজৈব ও বিশ্লেষণাত্মক রসায়ন): Chapter → Topic → Subtopic,
//     Subtopic-ই আসল কনটেন্ট পেজ, Topic শুধু গ্রুপিং
//
// chapterId হিসেবে SeedChapter.code (যেমন "1.1") ব্যবহার করা হয় — এটাই
// একমাত্র stable, predictable আইডেন্টিফায়ার যা Firestore auto-id-এর ওপর
// নির্ভর না করেই URL/routing-এ ব্যবহারযোগ্য।

import { SYLLABUS, SyllabusChapter, findSyllabusChapter } from "./syllabus";
import { SEED_PACKAGES } from "./seedData";
import { SeedChapter, SeedTopic, SeedSubtopic } from "./seedData/types";
import { ChemistryCategory } from "@/types";

export interface ContentChapter {
  id: string;              // = SeedChapter.code, যেমন "1.1"
  title: string;
  categoryId: ChemistryCategory;
  order: number;
  description?: string;
  structure: "2-level" | "3-level";
  topicCount: number;      // এই অধ্যায়ে টপিক সংখ্যা (২-লেভেলে এটাই কনটেন্ট পেজ সংখ্যা)
  subtopicCount: number;   // ৩-লেভেলে সব টপিক মিলিয়ে সাব-টপিক সংখ্যা; ২-লেভেলে topicCount-এর সমান
}

function countsFor(pkg: SeedChapter | undefined): { topicCount: number; subtopicCount: number; structure: "2-level" | "3-level" } {
  if (!pkg) return { topicCount: 0, subtopicCount: 0, structure: "2-level" };
  if (pkg.structure === "2-level") {
    return { topicCount: pkg.topics.length, subtopicCount: pkg.topics.length, structure: "2-level" };
  }
  const subtopicCount = pkg.topics.reduce((sum, t) => sum + t.subtopics.length, 0);
  return { topicCount: pkg.topics.length, subtopicCount, structure: "3-level" };
}

/** কোনো ক্যাটেগরির সবগুলো অধ্যায় (syllabus অনুযায়ী), প্রতিটির সাথে বাস্তব
 *  টপিক/সাব-টপিক সংখ্যা (কনটেন্ট লেখা হয়ে গেলে SEED_PACKAGES থেকে, নাহলে ০)। */
export function getContentChapters(category: ChemistryCategory): ContentChapter[] {
  const syllabusChapters = SYLLABUS[category] || [];

  return syllabusChapters
    .map((sc: SyllabusChapter) => {
      const pkg = SEED_PACKAGES.find((p) => p.code === sc.code && p.category === category);
      const counts = countsFor(pkg);
      return {
        id: sc.code,
        title: sc.title,
        categoryId: category,
        order: sc.order,
        description: sc.description,
        ...counts,
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
      const counts = countsFor(pkg);
      return {
        id: sc.code,
        title: sc.title,
        categoryId: category,
        order: sc.order,
        description: sc.description,
        ...counts,
      };
    }
  }
  return null;
}

/**
 * একটি অধ্যায়ের সবগুলো টপিক।
 * - ৩-লেভেল chapter হলে: SeedTopic[] (মাঝের গ্রুপিং লেভেল, subtopics ধারী)
 * - ২-লেভেল chapter হলে: SeedSubtopic[] (সরাসরি কনটেন্ট পেজ)
 * কলার-কে chapter.structure (getContentChapter দিয়ে) আগে চেক করে নেওয়া উচিত।
 */
export function getChapterTopics(chapterCode: string): SeedTopic[] | SeedSubtopic[] {
  const pkg = SEED_PACKAGES.find((p) => p.code === chapterCode);
  if (!pkg) return [];
  return pkg.topics;
}

/** slug দিয়ে একটি টপিক (৩-লেভেল ক্যাটেগরিতে মাঝের গ্রুপিং লেভেল) খুঁজে বের করে। */
export function findTopicBySlug(
  chapterCode: string,
  topicSlug: string
): { topic: SeedTopic; chapterCode: string; category: ChemistryCategory; chapterTitle: string } | null {
  const pkg = SEED_PACKAGES.find((p) => p.code === chapterCode);
  if (!pkg || pkg.structure !== "3-level") return null;
  const topic = pkg.topics.find((t) => t.slug === topicSlug);
  if (!topic) return null;
  return { topic, chapterCode: pkg.code, category: pkg.category, chapterTitle: pkg.chapterTitle };
}

/** একটি টপিকের সবগুলো সাব-টপিক (chapterCode + topicSlug দিয়ে) — শুধু ৩-লেভেল ক্যাটেগরিতে প্রযোজ্য। */
export function getTopicSubtopics(chapterCode: string, topicSlug: string): SeedSubtopic[] {
  const found = findTopicBySlug(chapterCode, topicSlug);
  return found?.topic.subtopics ?? [];
}

/**
 * slug দিয়ে একটি কনটেন্ট পেজ (SeedSubtopic) খুঁজে বের করে, গোটা সাইট জুড়ে —
 * ২-লেভেল ক্যাটেগরিতে chapter.topics-এর ভেতরে সরাসরি, ৩-লেভেলে
 * chapter.topics[].subtopics-এর ভেতরে খোঁজে।
 */
export function findSubtopicBySlug(
  slug: string
): {
  subtopic: SeedSubtopic;
  topicSlug: string | null;  // ২-লেভেলে null (কোনো মাঝের টপিক নেই)
  topicTitle: string | null;
  chapterCode: string;
  chapterTitle: string;
  category: ChemistryCategory;
  structure: "2-level" | "3-level";
} | null {
  for (const pkg of SEED_PACKAGES) {
    if (pkg.structure === "2-level") {
      const subtopic = pkg.topics.find((s) => s.slug === slug);
      if (subtopic) {
        return {
          subtopic,
          topicSlug: null,
          topicTitle: null,
          chapterCode: pkg.code,
          chapterTitle: pkg.chapterTitle,
          category: pkg.category,
          structure: "2-level",
        };
      }
    } else {
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
            structure: "3-level",
          };
        }
      }
    }
  }
  return null;
}
