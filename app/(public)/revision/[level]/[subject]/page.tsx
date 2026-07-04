import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ChevronRight, FolderOpen } from "lucide-react";
import { getRevisionYears } from "@/lib/firestore";
import { RevisionLevel, REVISION_LEVEL_LABELS } from "@/types";

interface Props { params: Promise<{ level: string; subject: string }> }

function isValidLevel(level: string): level is RevisionLevel {
  return level === "hsc" || level === "honours";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, subject } = await params;
  if (!isValidLevel(level)) return { title: "Not Found" };
  return { title: `${decodeURIComponent(subject)} — রিভিশন` };
}

export default async function RevisionSubjectPage({ params }: Props) {
  const { level, subject: rawSubject } = await params;
  if (!isValidLevel(level)) notFound();
  const subject = decodeURIComponent(rawSubject);

  const years = await getRevisionYears(level, subject);

  return (
    <div className="section-padding">
      <div className="container-max max-w-3xl">
        <Link href={`/revision/${level}`} className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {REVISION_LEVEL_LABELS[level]} — সব বিষয়
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{subject}</h1>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-sm">
            <CalendarDays className="w-4 h-4" /> {years.length}টি সাল
          </p>
        </div>

        {years.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FolderOpen className="w-14 h-14 mx-auto mb-3 opacity-30" />
            <p>এই বিষয়ে এখনো কোনো সাল যোগ করা হয়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {years.map((year) => (
              <Link
                key={year}
                href={`/revision/${level}/${encodeURIComponent(subject)}/${encodeURIComponent(year)}`}
                className="flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-500 hover:-translate-y-0.5 transition-all group text-center"
              >
                <span className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  {year}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
