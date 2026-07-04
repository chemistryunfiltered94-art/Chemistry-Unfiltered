import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight, FolderOpen } from "lucide-react";
import { getRevisionSubjects } from "@/lib/firestore";
import { RevisionLevel, REVISION_LEVEL_LABELS } from "@/types";

interface Props { params: Promise<{ level: string }> }

function isValidLevel(level: string): level is RevisionLevel {
  return level === "hsc" || level === "honours";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;
  if (!isValidLevel(level)) return { title: "Not Found" };
  return { title: `${REVISION_LEVEL_LABELS[level]} — রিভিশন`, description: "বিষয় বেছে নিয়ে রিভিশন শুরু করো।" };
}

export default async function RevisionLevelPage({ params }: Props) {
  const { level } = await params;
  if (!isValidLevel(level)) notFound();

  const subjects = await getRevisionSubjects(level);

  return (
    <div className="section-padding">
      <div className="container-max max-w-3xl">
        <Link href="/revision" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব স্তর
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{REVISION_LEVEL_LABELS[level]}</h1>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-sm">
            <BookOpen className="w-4 h-4" /> {subjects.length}টি বিষয়
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FolderOpen className="w-14 h-14 mx-auto mb-3 opacity-30" />
            <p>এই স্তরে এখনো কোনো বিষয় যোগ করা হয়নি।</p>
            <p className="text-xs text-slate-500 mt-1">অ্যাডমিন প্যানেল থেকে প্রশ্ন যোগ করলেই বিষয় এখানে দেখা যাবে।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {subjects.map((subject) => (
              <Link
                key={subject}
                href={`/revision/${level}/${encodeURIComponent(subject)}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-500 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    {subject}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
