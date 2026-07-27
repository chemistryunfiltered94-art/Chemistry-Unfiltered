// app/(public)/learn/[category]/subtopic/[slug]/page.tsx
// আসল কনটেন্ট পেজ — সাইট-ওয়াইড unique slug দিয়ে সরাসরি সাব-টপিক খুঁজে দেখায়

import { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicClient from "@/components/learn/TopicClient";
import { findSubtopicBySlug } from "@/lib/seedContent";
import { getCategoryName } from "@/lib/constants";
import { getMolecule } from "@/lib/molecules";

interface Props { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = findSubtopicBySlug(slug);
  if (!found) return { title: "Not Found" };
  return {
    title: `${found.subtopic.title} — ${getCategoryName(found.category)}`,
    description: found.subtopic.summary?.slice(0, 160) || found.subtopic.content?.introduction?.slice(0, 160),
  };
}

export default async function SubtopicPage({ params }: Props) {
  const { category, slug } = await params;
  const found = findSubtopicBySlug(slug);
  if (!found || found.category !== category) notFound();

  const data = found.subtopic;

  // 3D গঠন — পূর্বনির্ধারিত molecule (lib/molecules.ts) বেছে নেওয়া থাকলে সেই পুরো অণুর
  // ডেটা (পরমাণু/বন্ধন) সাথেই পাঠানো হয়, যাতে ক্লায়েন্টে MoleculeViewer সরাসরি render করতে পারে।
  const structure3D = data.moleculeId
    ? { molecule: getMolecule(data.moleculeId) || null }
    : null;

  const topicData = {
    title: data.title,
    level: data.level ?? "beginner",
    estimatedTime: data.estimatedTime,
    category: getCategoryName(found.category),
    categorySlug: found.category,
    introduction: data.content?.introduction || "",
    historicalBackground: data.content?.historicalBackground || "",
    definition: data.content?.definition || "",
    theory: data.content?.theory || [],
    concepts: data.content?.concepts || [],
    formulas: data.content?.formulas || [],
    derivation: data.content?.derivation || [],
    examples: data.content?.examples || [],
    diagrams: data.content?.diagrams || [],
    structure3D,
    applications: data.content?.applications || [],
    industrialUses: data.content?.industrialUses || [],
    advantages: data.content?.advantages || [],
    disadvantages: data.content?.disadvantages || [],
    safety: data.content?.safety || [],
    labExperiment: data.labExperiment || null,
    animation: data.content?.animation || null,
    importantNotes: data.content?.importantNotes || [],
    commonMistakes: data.content?.commonMistakes || [],
    summaryPoints: data.content?.summaryPoints || [],
    pdfNotes: data.pdfNotes || [],
    practiceProblems: data.practiceProblems || [],
    shortQuestions: data.shortQuestions || [],
    boardQuestions: data.boardQuestions || [],
    notes: data.content?.notes || [],
    mcqs: (data.mcqs || []).map((m) => ({
      q: m.question,
      options: m.options,
      answer: m.correctAnswer,
      explanation: m.explanation,
    })),
    references: data.references || [],
    relatedTopics: [],
  };

  // ২-লেভেল ক্যাটেগরিতে কোনো মাঝের টপিক-লিস্ট নেই, তাই সরাসরি chapter পেজে ফিরে যায়।
  // ৩-লেভেলে টপিকের সাব-টপিক লিস্টে ফিরে যায়।
  const backHref = found.structure === "2-level"
    ? `/learn/${category}/${found.chapterCode}`
    : `/learn/${category}/${found.chapterCode}/${found.topicSlug}`;

  return <TopicClient data={topicData} categorySlug={category} topicSlug={slug} backHref={backHref} />;
}
