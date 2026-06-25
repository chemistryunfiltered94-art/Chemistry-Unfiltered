// app/(public)/learn/[category]/topic/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicClient from "@/components/learn/TopicClient";
import { getTopic, getDocument, incrementTopicViews } from "@/lib/firestore";
import { getCategoryName } from "@/lib/constants";
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

  const topicData = {
    title: data.title,
    estimatedTime: data.estimatedTime,
    category: getCategoryName(data.categoryId),
    categorySlug: data.categoryId,
    introduction: data.content?.introduction || "",
    theory: data.content?.theory || [],
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

  incrementTopicViews(data.id);

  return <TopicClient data={topicData} categorySlug={category} topicSlug={slug} />;
}
