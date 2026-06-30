// app/(public)/learn/[category]/topic/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicClient from "@/components/learn/TopicClient";
import { getTopic, getDocument, incrementTopicViews } from "@/lib/firestore";
import { getCategoryName } from "@/lib/constants";
import { getMolecule } from "@/lib/molecules";
import { Topic } from "@/types";

interface Props { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTopic(slug);
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.title} — ${getCategoryName(data.categoryId)}`,
    description: data.summary?.slice(0, 160) || data.content?.introduction?.slice(0, 160),
  };
}

export default async function TopicPage({ params }: Props) {
  const { category, slug } = await params;
  const data = await getTopic(slug);
  if (!data || data.categoryId !== category) notFound();

  const relatedTopics = (
    await Promise.all((data.relatedTopics || []).map((id) => getDocument<Topic>("topics", id)))
  )
    .filter((t): t is Topic => Boolean(t))
    .map((t) => ({ slug: t.slug, title: t.title, categorySlug: t.categoryId }));

  // 3D গঠন — পূর্বনির্ধারিত molecule (lib/molecules.ts) বেছে নেওয়া থাকলে সেই পুরো অণুর
  // ডেটা (পরমাণু/বন্ধন) সাথেই পাঠানো হয়, যাতে ক্লায়েন্টে MoleculeViewer সরাসরি render করতে পারে।
  const structure3D = data.structure3D
    ? {
        title: data.structure3D.title,
        description: data.structure3D.description,
        modelUrl: data.structure3D.modelUrl,
        molecule: data.structure3D.moleculeId ? getMolecule(data.structure3D.moleculeId) || null : null,
      }
    : null;

  const topicData = {
    title: data.title,
    level: data.level ?? "beginner",
    estimatedTime: data.estimatedTime,
    category: getCategoryName(data.categoryId),
    categorySlug: data.categoryId,
    introduction: data.content?.introduction || "",
    historicalBackground: data.content?.historicalBackground || "",
    theory: data.content?.theory || [],
    formulas: data.content?.formulas || [],
    derivation: data.content?.derivation || [],
    examples: (data.content?.examples || []).map((ex) => ({
      question: ex.question,
      steps: ex.steps,
      answer: ex.solution,
    })),
    diagrams: (data.diagrams || []).map((d) =>
      typeof d === "string" ? { url: d, caption: "" } : { url: d.url, caption: d.caption || "" }
    ),
    structure3D,
    applications: data.content?.applications || [],
    industrialUses: data.content?.industrialUses || [],
    safety: data.content?.safety || [],
    labExperiment: data.content?.labExperiment || null,
    animation: data.content?.animation || null,
    pdfNotes: data.content?.pdfNotes || [],
    practiceProblems: data.content?.practiceProblems || [],
    notes: data.content?.notes || [],
    mcqs: (data.mcqs || []).map((m) => ({
      q: m.question,
      options: m.options,
      answer: m.correctAnswer,
      explanation: m.explanation,
    })),
    relatedTopics,
  };

  incrementTopicViews(data.id);

  return <TopicClient data={topicData} categorySlug={category} topicSlug={slug} />;
}
