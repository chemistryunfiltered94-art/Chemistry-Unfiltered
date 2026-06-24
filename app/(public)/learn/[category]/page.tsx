// app/(public)/learn/[category]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { getTopics } from "@/lib/firestore";
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

const chapters = [
  {
    level:    "beginner" as const,
    name:     "শুরু",
    nameFull: "শুরু (Beginner)",
    desc:     "কোনো পূর্ব জ্ঞান ছাড়াই শুরু করো",
    color:    "from-green-500 to-emerald-600",
    bg:       "bg-green-500/10",
    border:   "border-green-500/30",
    badge:    "text-green-400",
    dot:      "bg-green-400",
  },
  {
    level:    "intermediate" as const,
    name:     "মধ্যবর্তী",
    nameFull: "মধ্যবর্তী (Intermediate)",
    desc:     "SSC ও HSC মানের রসায়ন",
    color:    "from-blue-500 to-indigo-600",
    bg:       "bg-blue-500/10",
    border:   "border-blue-500/30",
    badge:    "text-blue-400",
    dot:      "bg-blue-400",
  },
  {
    level:    "advanced" as const,
    name:     "উন্নত",
    nameFull: "উন্নত (Advanced)",
    desc:     "University ও উচ্চতর পড়াশোনার জন্য",
    color:    "from-purple-500 to-violet-600",
    bg:       "bg-purple-500/10",
    border:   "border-purple-500/30",
    badge:    "text-purple-400",
    dot:      "bg-purple-400",
  },
];

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

  const topics = await getTopics({ categoryId: category });

  // Count topics per level
  const counts = {
    beginner:     topics.filter((t) => t.level === "beginner").length,
    intermediate: topics.filter((t) => t.level === "intermediate").length,
    advanced:     topics.filter((t) => t.level === "advanced").length,
  };

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
            {topics.length}টি টপিক
          </div>
        </div>

        {/* Chapter list */}
        <h2 className="text-base font-semibold text-slate-300 mb-3">অধ্যায়সমূহ</h2>

        {topics.length === 0 ? (
          <div className="text-center py-14 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">এই বিষয়ে এখনো কোনো টপিক যোগ করা হয়নি।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((ch) => {
              const count = counts[ch.level];
              if (count === 0) return null;
              return (
                <Link
                  key={ch.level}
                  href={`/learn/${category}/chapter/${ch.level}`}
                  className={`flex items-center gap-4 p-4 ${ch.bg} border ${ch.border} rounded-2xl hover:border-opacity-60 hover:-translate-y-0.5 transition-all group`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                    <span className="text-white text-lg font-bold">
                      {ch.level === "beginner" ? "১" : ch.level === "intermediate" ? "২" : "৩"}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`w-2 h-2 rounded-full ${ch.dot} flex-shrink-0`} />
                      <p className={`text-sm font-semibold ${ch.badge}`}>{ch.nameFull}</p>
                    </div>
                    <p className="text-xs text-slate-400">{ch.desc}</p>
                  </div>

                  {/* Count + arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
                      {count}টি
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
