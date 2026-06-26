"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, FileText, ArrowRight, X } from "lucide-react";
import { StudyNote, NoteType } from "@/types";
import { NOTE_TYPE_LIST, getNoteTypeLabel, getCategoryName } from "@/lib/constants";
import { formatFirestoreDate } from "@/lib/utils";

interface Props {
  notes: StudyNote[];
}

export default function NotesPageClient({ notes }: Props) {
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") as NoteType | null;
  const [search, setSearch] = useState("");

  const countsByType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of notes) counts[n.type] = (counts[n.type] || 0) + 1;
    return counts;
  }, [notes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter((n) => {
      if (activeType && n.type !== activeType) return false;
      if (!q) return true;
      return (
        n.title?.toLowerCase().includes(q) ||
        n.summary?.toLowerCase().includes(q) ||
        getCategoryName(n.category)?.toLowerCase().includes(q)
      );
    });
  }, [notes, activeType, search]);

  const heading = activeType
    ? `${getNoteTypeLabel(activeType)} (${filtered.length}টি)`
    : "সাম্প্রতিক নোটস";

  return (
    <>
      {/* Search */}
      <div className="relative mb-8 max-w-lg mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="নোট খোঁজো... (টপিক, ফর্মুলা, প্রশ্ন)"
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {NOTE_TYPE_LIST.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeType === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/notes?type=${cat.id}`}
              className={`block p-6 bg-white dark:bg-slate-800 border rounded-2xl card-hover group ${
                isActive
                  ? "border-primary-500 ring-2 ring-primary-500/30"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{cat.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{cat.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{countsByType[cat.id] || 0}টি নোট</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Notes list */}
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{heading}</h2>
          {activeType && (
            <Link
              href="/notes"
              className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              <X className="w-3.5 h-3.5" /> ফিল্টার মুছো
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>
              {notes.length === 0
                ? "এখনো কোনো নোট প্রকাশিত হয়নি। অ্যাডমিন প্যানেল থেকে যোগ করো।"
                : "কোনো নোট পাওয়া যায়নি।"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.slug}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{getNoteTypeLabel(note.type)}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{getCategoryName(note.category)}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{formatFirestoreDate(note.createdAt)}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
