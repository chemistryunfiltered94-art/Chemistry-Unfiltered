"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useCollection } from "@/hooks/useFirestore";
import { deleteDocument, updateDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { StudyNote } from "@/types";
import { NOTE_TYPE_LIST, getNoteTypeLabel, getCategoryName } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowLeft, StickyNote, Search, Plus, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminNotesPage() {
  const { isAdmin } = useAuth();
  const { data: notes, loading } = useCollection<StudyNote>("studyNotes");
  const { toast, showToast, hideToast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("সব");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (!isAdmin) return null;

  const filtered = notes.filter(
    (n) =>
      (typeFilter === "সব" || n.type === typeFilter) &&
      (n.title?.toLowerCase().includes(search.toLowerCase()) ||
        n.slug?.toLowerCase().includes(search.toLowerCase()))
  );

  const togglePublished = async (note: StudyNote) => {
    setBusyId(note.id);
    const ok = await updateDocument("studyNotes", note.id, { published: !note.published });
    setBusyId(null);
    if (!ok) showToast("error", "আপডেট করা যায়নি, আবার চেষ্টা করো।");
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    const ok = await deleteDocument("studyNotes", id);
    setBusyId(null);
    setConfirmDeleteId(null);
    if (ok) showToast("success", "নোট মুছে ফেলা হয়েছে।");
    else showToast("error", "মুছে ফেলা যায়নি, আবার চেষ্টা করো।");
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">নোট ম্যানেজ</h1>
              <p className="text-slate-400 text-sm">মোট {notes.length}টি নোট</p>
            </div>
          </div>
          <Link href="/admin/notes/new"
            className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> নতুন নোট
          </Link>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="শিরোনাম বা স্লাগ দিয়ে খোঁজো..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => setTypeFilter("সব")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${typeFilter === "সব" ? "gradient-bg text-white" : "border border-slate-700 text-slate-300 hover:border-primary-500"}`}>
            সব
          </button>
          {NOTE_TYPE_LIST.map((t) => (
            <button key={t.id} onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${typeFilter === t.id ? "gradient-bg text-white" : "border border-slate-700 text-slate-300 hover:border-primary-500"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl text-center py-16 text-slate-400">
            <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>কোনো নোট পাওয়া যায়নি।</p>
            <Link href="/admin/notes/new" className="inline-block mt-3 text-primary-400 hover:text-primary-300 text-sm font-medium">
              প্রথম নোট যোগ করো →
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((note, i) => (
              <motion.div key={note.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-2xl p-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{note.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 truncate">/{note.slug}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-primary-400">{getNoteTypeLabel(note.type)}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{getCategoryName(note.category)}</span>
                  </div>
                </div>

                <button onClick={() => togglePublished(note)} disabled={busyId === note.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
                    note.published
                      ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700"
                      : "bg-slate-700 text-slate-400 border border-slate-600"
                  } ${busyId === note.id ? "opacity-50" : "hover:opacity-80"}`}
                >
                  {note.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {note.published ? "প্রকাশিত" : "অপ্রকাশিত"}
                </button>

                {confirmDeleteId === note.id ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleDelete(note.id)} disabled={busyId === note.id}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 disabled:opacity-50">
                      নিশ্চিত
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-600">
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(note.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
