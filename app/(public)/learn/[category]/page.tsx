// app/(public)/learn/[category]/page.tsx
// বিষয়ে ক্লিক করলে সেই বিষয়ের অধ্যায়গুলো দেখাবে

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight, FolderOpen } from "lucide-react";
import { getChapters, getTopics } from "@/lib/firestore";
import { ChemistryCategory } from "@/types";

const categoryMeta: Record<ChemistryCategory, { name: string; desc: string; color: string; emoji: string }> = {
  "physical-chemistry":     { name: "ভৌত রসায়ন",       desc: "পদার্থের ভৌত ধর্ম, গ্যাস সূত্র, তাপগতিবিদ্যা, তড়িৎ রসায়ন এবং রাসায়নিক গতিবিদ্যা।",          color: "from-blue-500 to-indigo-600",   emoji: "⚛️" },
  "organic-chemistry":      { name: "জৈব রসায়ন",       desc: "কার্বন যৌগের রসায়ন — হাইড্রোকার্বন, কার্যকরী গ্রুপ, জৈব বিক্রিয়া এবং জৈব সংশ্লেষণ।",           color: "from-green-500 to-emerald-600", emoji: "🌿" },
  "inorganic-chemistry":    { name: "অজৈব রসায়ন",      desc: "ধাতু, অধাতু, পর্যায় সারণি, রাসায়নিক বন্ধন এবং সমন্বয় যৌগের রসায়ন।",                            color: "from-purple-500 to-violet-600", emoji: "🔬" },
  "analytical-chemistry":   { name: "বিশ্লেষণী রসায়ন", desc: "টাইট্রেশন, ক্রোমাটোগ্রাফি, বর্ণালী বিশ্লেষণ এবং গুণগত-পরিমাণগত বিশ্লেষণ।",                       color: "from-orange-500 to-amber-600",  emoji: "📊" },
  biochemistry:             { name: "জীব রসায়ন",       desc: "প্রোটিন, কার্বোহাইড্রেট, লিপিড, নিউক্লিক অ্যাসিড এবং বিপাক ক্রিয়ার রসায়ন।",                    color: "from-pink-500 to-rose-600",     emoji: "🧬" },
  "environmental-chemistry":{ name: "পরিবেশ রসায়ন",    desc: "বায়ু দূষণ, জল রসায়ন, গ্রিন হাউস গ্যাস এবং পরিবেশ বিজ্ঞান।",                                     color: "from-teal-500 to-green-600",    emoji: "🌍" },
  "industrial-chemistry":   { name: "শিল্প রসায়ন",     desc: "হেবার পদ্ধতি, সংস্পর্শ পদ্ধতি, সার উৎপাদন, তেল পরিশোধন এবং শিল্প প্রক্রিয়া।",                   color: "from-slate-400 to-slate-600",   emoji: "🏭" },
};

interface Props { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category as ChemistryCategory];
  if (!meta) return { title: "Not Found" };
  return { title: `${meta.name} — অধ্যায়সমূহ`, description: meta.desc };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = categoryMeta[category as ChemistryCategory];
  if (!meta) notFound();

  // অধ্যায় ও টপিক একসাথে load
  const [chapters, allTopics] = await Promise.all([
    getChapters(category),
    getTopics({ categoryId: category }),
  ]);

  // প্রতিটি অধ্যায়ে কতটি টপিক আছে
  const topicCountByChapter: Record<string, number> = {};
  for (const t of allTopics) {
    topicCountByChapter[t.chapterId] = (topicCountByChapter[t.chapterId] || 0) + 1;
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-5 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> সব বিষয়
        </Link>

        {/* Category banner */}
        <div className={`bg-gradient-to-r ${meta.color} rounded-2xl p-6 text-white mb-6`}>
          <div className="text-4xl mb-3">{meta.emoji}</div>
          <h1 className="text-3xl font-bold mb-1">{meta.name}</h1>
          <p className="text-white/75 text-sm leading-relaxed">{meta.desc}</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-white/60">
            <BookOpen className="w-3.5 h-3.5" />
            {chapters.length}টি অধ্যায় • {allTopics.length}টি টপিক
          </div>
        </div>

        {/* Chapter list */}
        <h2 className="text-base font-semibold text-slate-300 mb-3">অধ্যায়সমূহ</h2>

        {chapters.length === 0 ? (
          <div className="text-center py-14 text-slate-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">এই বিষয়ে এখনো কোনো অধ্যায় যোগ করা হয়নি।</p>
            <p className="text-xs text-slate-600 mt-1">Admin প্যানেল থেকে অধ্যায় ও টপিক যোগ করো।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter, i) => {
              const count = topicCountByChapter[chapter.id] || 0;
              return (
                <Link
                  key={chapter.id}
                  href={`/learn/${category}/${chapter.id}`}
                  className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-slate-500 hover:-translate-y-0.5 transition-all group"
                >
                  {/* Chapter number */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                    <span className="text-white text-sm font-bold">{i + 1}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                      {chapter.title}
                    </p>
                    {chapter.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{chapter.description}</p>
                    )}
                  </div>

                  {/* Count + arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-lg">
                      {count}টি টপিক
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
