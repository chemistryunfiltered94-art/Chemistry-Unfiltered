import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getStudyNote } from "@/lib/firestore";
import { formatFirestoreDate } from "@/lib/utils";
import { getNoteTypeLabel, getCategoryName } from "@/lib/constants";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await getStudyNote(slug);
  if (!note) return { title: "Note Not Found" };
  return { title: note.title, description: note.summary };
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const note = await getStudyNote(slug);
  if (!note) notFound();

  const paragraphs = (note.content || "").split("\n").filter((p) => p.trim());

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/notes" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব নোটস
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
          <div className="h-2 gradient-bg" />
          <div className="p-6 lg:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                <Tag className="w-3 h-3" /> {getNoteTypeLabel(note.type)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{getCategoryName(note.category)}</span>
              {note.createdAt && (
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3 h-3" /> {formatFirestoreDate(note.createdAt)}
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{note.title}</h1>
            {note.summary && (
              <p className="text-lg text-slate-600 dark:text-slate-400 border-l-4 border-primary-500 pl-4 mb-8 italic">{note.summary}</p>
            )}

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
