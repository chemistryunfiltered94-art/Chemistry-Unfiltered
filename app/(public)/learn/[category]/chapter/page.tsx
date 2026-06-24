// app/(public)/learn/[category]/chapter/[level]/page.tsx
// NEW FILE — এই route আগে ছিল না

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { getTopics } from "@/lib/firestore";
import { ChemistryCategory } from "@/types";

const categoryNames: Record<string, string> = {
  "physical-chemistry":     "ভৌত রসায়ন",
  "organic-chemistry":      "জৈব রসায়ন",
  "inorganic-chemistry":    "অজৈব রসায়ন",
  "analytical-chemistry":   "বিশ্লেষণী রসায়ন",
  biochemistry:             "জীব রসায়ন",
  "environmental-chemistry":"পরিবেশ রসায়ন",
  "industrial-chemistry":   "শিল্প রসায়ন",
};

const levelMeta: Record<string, { name: string; color: string; bg: string; border: string; badge: string }> = {
  beginner: {
    name:   "শুরু (Beginner)",
    color:  "from-green-500 to-emerald-600",
    bg:     "bg-green-500/10",
    border: "border-green-500/30",
    badge:  "text-green-400",
  },
  intermediate: {
    name:   "মধ্যবর্তী (Intermediate)",
    color:  "from-blue-500 to-indigo-600",
    bg:     "bg-blue-500/10",
    border: "border-blue-500/30",
    badge:  "text-blue-400",
  },
  advanced: {
    name:   "উন্নত (Advanced)",
    color:  "from-purple-500 to-violet-600",
    bg:     "bg-purple-500/10",
    border: "border-purple-500/30",
    badge:  "text-purple-400",
  },
};

interface Props { params: Promise<{ category: string; level: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, level } = await params;
  const catName   = categoryNames[category] || category;
  const levelName = levelMeta[level]?.name  || level;
  return { title: `${catName} — ${levelName}` };
}

export default async function ChapterPage({ params }: Props) {
  const { category, level } = await params;

  const catName = categoryNames[category];
  if (!catName) notFound();

  const lMeta = levelMeta[level];
  if (!lMeta) notFound();

  const allTopics = await getTopics({ categoryId: category });
  const topics    = allTopics.filter((t) => t.level === level);

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          href={`/learn/${category}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-5 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {catName}
        </Link>

        {/* Header */}
        <div className={`bg-gradient-to-r ${lMeta.color} rounded-2xl p-5 text-white mb-6`}>
          <p className="text-white/70 text-sm mb-1">{catName}</p>
          <h1 className="text-2xl font-bold">{lMeta.name}</h1>
          <p className="text-white/60 text-xs mt-2">{topics.length}টি টপিক</p>
        </div>

        {/* Topics */}
        {topics.length === 0 ? (
          <div className="text-center py-14 text-slate-500">
            <p className="text-sm">এই অধ্যায়ে এখনো কোনো টপিক যোগ করা হয়নি।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topics.map((topic, i) => (
              <Link
                key={topic.id}
                href={`/learn/${category}/${topic.slug}`}
                className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-slate-500 hover:-translate-y-0.5 transition-all group"
              >
                {/* Number */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${lMeta.color} flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-lg`}>
                  {i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                    {topic.title}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {topic.estimatedTime} মিনিট
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
