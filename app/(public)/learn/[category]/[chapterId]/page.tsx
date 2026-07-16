// app/(public)/learn/[category]/[chapterId]/page.tsx
// অধ্যায়ে ক্লিক করলে সেই অধ্যায়ের টপিকগুলো দেখাবে

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowRight, BookOpen } from "lucide-react";
import { getContentChapter, getChapterTopics } from "@/lib/seedContent";

const categoryMeta: Record<string, { name: string; color: string }> = {
  "physical-chemistry":     { name: "ভৌত রসায়ন",       color: "from-blue-500 to-indigo-600"   },
  "organic-chemistry":      { name: "জৈব রসায়ন",       color: "from-green-500 to-emerald-600" },
  "inorganic-chemistry":    { name: "অজৈব রসায়ন",      color: "from-purple-500 to-violet-600" },
  "analytical-chemistry":   { name: "বিশ্লেষণী রসায়ন", color: "from-orange-500 to-amber-600"  },
  biochemistry:             { name: "জীব রসায়ন",       color: "from-pink-500 to-rose-600"     },
  "environmental-chemistry":{ name: "পরিবেশ রসায়ন",    color: "from-teal-500 to-green-600"    },
  "industrial-chemistry":   { name: "শিল্প রসায়ন",     color: "from-slate-400 to-slate-600"   },
};

interface Props { params: Promise<{ category: string; chapterId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params;
  const chapter = getContentChapter(chapterId);
  if (!chapter) return { title: "Not Found" };
  return { title: `${chapter.title} — টপিকসমূহ` };
}

export default async function ChapterTopicsPage({ params }: Props) {
  const { category, chapterId } = await params;

  const catMeta = categoryMeta[category];
  if (!catMeta) notFound();

  const chapter = getContentChapter(chapterId);
  if (!chapter || chapter.categoryId !== category) notFound();

  const topics = getChapterTopics(chapterId);

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          href={`/learn/${category}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-5 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {catMeta.name}
        </Link>

        {/* Chapter header */}
        <div className={`bg-gradient-to-r ${catMeta.color} rounded-2xl p-5 text-white mb-6`}>
          <p className="text-white/70 text-sm mb-1">{catMeta.name}</p>
          <h1 className="text-2xl font-bold">{chapter.title}</h1>
          {chapter.description && (
            <p className="text-white/70 text-sm mt-1">{chapter.description}</p>
          )}
          <p className="text-white/60 text-xs mt-2">{topics.length}টি টপিক</p>
        </div>

        {/* Topics */}
        {topics.length === 0 ? (
          <div className="text-center py-14 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">এই অধ্যায়ে এখনো কোনো টপিক যোগ করা হয়নি।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topics.map((topic, i) => (
              <Link
                key={topic.slug}
                href={`/learn/${category}/topic/${topic.slug}`}
                className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-slate-500 hover:-translate-y-0.5 transition-all group"
              >
                {/* Number */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${catMeta.color} flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-lg`}>
                  {i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                    {topic.title}
                  </p>
                  {topic.summary && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{topic.summary}</p>
                  )}
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
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
