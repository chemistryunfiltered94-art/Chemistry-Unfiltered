// app/(public)/learn/[category]/topic/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicClient from "@/components/learn/TopicClient";
import { findTopicBySlug } from "@/lib/seedContent";
import { getCategoryName } from "@/lib/constants";
import { getMolecule } from "@/lib/molecules";

interface Props { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = findTopicBySlug(slug);
  if (!found) return { title: "Not Found" };
  return {
    title: `${found.topic.title} — ${getCategoryName(found.category)}`,
    description: found.topic.summary?.slice(0, 160) || found.topic.content?.introduction?.slice(0, 160),
  };
}

export default async function TopicPage({ params }: Props) {
  const { category, slug } = await params;
  const found = findTopicBySlug(slug);
  if (!found || found.category !== category) notFound();

  const data = found.topic;

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
    theory: data.content?.theory || [],
    formulas: data.content?.formulas || [],
    derivation: data.content?.derivation || [],
    examples: [],
    diagrams: [],
    structure3D,
    applications: data.content?.applications || [],
    industrialUses: data.content?.industrialUses || [],
    safety: data.content?.safety || [],
    labExperiment: data.content?.labExperiment || null,
    animation: null,
    pdfNotes: [],
    practiceProblems: data.content?.practiceProblems || [],
    notes: data.content?.notes || [],
    mcqs: (data.mcqs || []).map((m) => ({
      q: m.question,
      options: m.options,
      answer: m.correctAnswer,
      explanation: m.explanation,
    })),
    relatedTopics: [],
  };

  return <TopicClient data={topicData} categorySlug={category} topicSlug={slug} />;
}
