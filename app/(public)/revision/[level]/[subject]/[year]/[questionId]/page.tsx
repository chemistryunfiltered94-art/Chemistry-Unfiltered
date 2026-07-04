import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, HelpCircle, Lightbulb } from "lucide-react";
import { getRevisionQuestion } from "@/lib/firestore";
import { RevisionLevel } from "@/types";

interface Props { params: Promise<{ level: string; subject: string; year: string; questionId: string }> }

function isValidLevel(level: string): level is RevisionLevel {
  return level === "hsc" || level === "honours";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { questionId } = await params;
  const q = await getRevisionQuestion(questionId);
  return { title: q ? `প্রশ্ন — ${q.subject} ${q.year}` : "প্রশ্ন পাওয়া যায়নি" };
}

export default async function RevisionAnswerPage({ params }: Props) {
  const { level, subject: rawSubject, year: rawYear, questionId } = await params;
  if (!isValidLevel(level)) notFound();

  const q = await getRevisionQuestion(questionId);
  if (!q || !q.published) notFound();

  return (
    <div className="section-padding">
      <div className="container-max max-w-2xl">
        <Link
          href={`/revision/${level}/${rawSubject}/${rawYear}`}
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {q.subject} {q.year} — সব প্রশ্ন
        </Link>

        {/* Question */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium text-slate-400">{q.subject} • {q.year}</span>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
            {q.question}
          </p>
        </div>

        {/* Answer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">উত্তর</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {q.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
