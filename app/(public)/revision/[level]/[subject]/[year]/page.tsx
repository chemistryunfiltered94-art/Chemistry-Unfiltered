import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, HelpCircle, ChevronRight } from "lucide-react";
import { getRevisionQuestions } from "@/lib/firestore";
import { RevisionLevel } from "@/types";

interface Props { params: Promise<{ level: string; subject: string; year: string }> }

function isValidLevel(level: string): level is RevisionLevel {
  return level === "hsc" || level === "honours";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year } = await params;
  return { title: `${decodeURIComponent(subject)} ${decodeURIComponent(year)} — রিভিশন প্রশ্ন` };
}

export default async function RevisionYearPage({ params }: Props) {
  const { level, subject: rawSubject, year: rawYear } = await params;
  if (!isValidLevel(level)) notFound();
  const subject = decodeURIComponent(rawSubject);
  const year = decodeURIComponent(rawYear);

  const questions = await getRevisionQuestions(level, subject, year);

  return (
    <div className="section-padding">
      <div className="container-max max-w-3xl">
        <Link href={`/revision/${level}/${rawSubject}`} className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {subject} — সব সাল
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{subject}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{year} সাল • {questions.length}টি প্রশ্ন</p>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <HelpCircle className="w-14 h-14 mx-auto mb-3 opacity-30" />
            <p>এই সালের জন্য এখনো কোনো প্রশ্ন যোগ করা হয়নি।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <Link
                key={q.id}
                href={`/revision/${level}/${rawSubject}/${rawYear}/${q.id}`}
                className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-500 hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  {i + 1}
                </div>
                <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 pt-1 line-clamp-2">
                  {q.question}
                </p>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors flex-shrink-0 mt-2" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
