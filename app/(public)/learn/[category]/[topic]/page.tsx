import { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicClient from "@/components/learn/TopicClient";
import { getTopic, getDocument, incrementTopicViews } from "@/lib/firestore";
import { getCategoryName } from "@/lib/constants";
import { Topic } from "@/types";

interface Props { params: Promise<{ category: string; topic: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const data = await getTopic(topic);
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.title} — ${getCategoryName(data.categoryId)}`,
    description: data.summary?.slice(0, 160) || data.content?.introduction?.slice(0, 160),
  };
}

export default async function TopicPage({ params }: Props) {
  const { category, topic } = await params;
  const data = await getTopic(topic);
  if (!data || data.categoryId !== category) notFound();

  // Resolve related topic IDs into the {slug, title, categorySlug} shape TopicClient expects.
  const relatedTopics = (
    await Promise.all((data.relatedTopics || []).map((id) => getDocument<Topic>("topics", id)))
  )
    .filter((t): t is Topic => Boolean(t))
    .map((t) => ({ slug: t.slug, title: t.title, categorySlug: t.categoryId }));

  // Adapt Firestore Topic shape -> the flat TopicData shape TopicClient renders.
  const topicData = {
    title: data.title,
    level: data.level,
    estimatedTime: data.estimatedTime,
    category: getCategoryName(data.categoryId),
    categorySlug: data.categoryId,
    introduction: data.content?.introduction || "",
    theory: data.content?.theory || [],
    // Topic documents don't currently store per-topic formulas; the Formula
    // Library (/formulas) covers that separately.
    formulas: [] as { name: string; formula: string; explanation: string }[],
    examples: (data.content?.examples || []).map((ex) => ({
      question: ex.question,
      steps: ex.steps,
      answer: ex.solution,
    })),
    applications: data.content?.applications || [],
    notes: data.content?.notes || [],
    mcqs: (data.mcqs || []).map((m) => ({
      q: m.question,
      options: m.options,
      answer: m.correctAnswer,
      explanation: m.explanation,
    })),
    relatedTopics,
  };

  // Fire-and-forget view counter (don't block render on this).
  incrementTopicViews(data.id);

  return <TopicClient data={topicData} categorySlug={category} topicSlug={topic} />;
}
