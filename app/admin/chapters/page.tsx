"use client";

// app/admin/chapters/page.tsx
// "Subject Expansion" — প্রতিটি বিষয়ের (category) জন্য lib/syllabus.ts-এ রাখা প্রস্তাবিত
// অধ্যায়সমূহ এক ক্লিকে Firestore-এ যোগ করা যায়, পাশাপাশি কাস্টম অধ্যায়ও ম্যানুয়ালি যোগ/মুছা যায়।

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/shared/AuthProvider";
import { getChapters, getAllTopicsByCategory, createChapter, deleteDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { CATEGORY_LIST } from "@/lib/constants";
import { SYLLABUS } from "@/lib/syllabus";
import { Chapter, ChemistryCategory } from "@/types";
import {
  ArrowLeft, Layers, Plus, Check, Trash2, Sparkles, FolderOpen,
} from "lucide-react";

export default function AdminChaptersPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [category, setCategory] = useState<ChemistryCategory>(CATEGORY_LIST[0].id);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topicCount, setTopicCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [bulkAdding, setBulkAdding] = useState(false);
  const [addingTitle, setAddingTitle] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // কাস্টম অধ্যায় ফর্ম
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [savingCustom, setSavingCustom] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [chs, topics] = await Promise.all([
      getChapters(category),
      getAllTopicsByCategory(category),
    ]);
    setChapters(chs);
    const counts: Record<string, number> = {};
    for (const t of topics) counts[t.chapterId] = (counts[t.chapterId] || 0) + 1;
    setTopicCount(counts);
    setLoading(false);
  }, [category]);

  useEffect(() => { refresh(); }, [refresh]);

  const existingTitles = new Set(chapters.map((c) => c.title));
  const syllabus = SYLLABUS[category] || [];
  const missing = syllabus.filter((s) => !existingTitles.has(s.title));

  const addOne = async (title: string, description?: string) => {
    setAddingTitle(title);
    const id = await createChapter({
      title,
      categoryId: category,
      order: chapters.length + 1,
      description,
    });
    if (id) {
      setChapters((prev) => [
        ...prev,
        { id, title, categoryId: category, order: prev.length + 1, description, createdAt: new Date(), updatedAt: new Date() },
      ]);
    } else {
      showToast("error", `"${title}" যোগ করা যায়নি।`);
    }
    setAddingTitle(null);
  };

  const handleBulkAdd = async () => {
    if (missing.length === 0) return;
    setBulkAdding(true);
    let added = 0;
    for (const m of missing) {
      const id = await createChapter({
        title: m.title,
        categoryId: category,
        order: chapters.length + added + 1,
        description: m.description,
      });
      if (id) added++;
    }
    setBulkAdding(false);
    showToast(added === missing.length ? "success" : "error",
      `${added}টি অধ্যায় যোগ হয়েছে${added !== missing.length ? ` (${missing.length - added}টি ব্যর্থ হয়েছে)` : "।"}`);
    refresh();
  };

  const handleAddCustom = async () => {
    if (!customTitle.trim()) return;
    setSavingCustom(true);
    const id = await createChapter({
      title: customTitle.trim(),
      categoryId: category,
      order: chapters.length + 1,
      description: customDesc.trim() || undefined,
    });
    setSavingCustom(false);
    if (id) {
      showToast("success", `"${customTitle.trim()}" অধ্যায় যোগ হয়েছে।`);
      setCustomTitle("");
      setCustomDesc("");
      refresh();
    } else {
      showToast("error", "অধ্যায় যোগ করা যায়নি।");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const ok = await deleteDocument("chapters", id);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (ok) {
      showToast("success", "অধ্যায় মুছে ফেলা হয়েছে।");
      refresh();
    } else {
      showToast("error", "মুছে ফেলা যায়নি।");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">অধ্যায় ম্যানেজ</h1>
            <p className="text-slate-400 text-sm">বিষয় অনুযায়ী অধ্যায় (Subject Expansion) যোগ করো</p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
          {CATEGORY_LIST.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                category === c.id ? "gradient-bg text-white" : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">

            {/* Existing chapters */}
            <div>
              <h2 className="text-base font-semibold text-slate-300 mb-3">
                বিদ্যমান অধ্যায়সমূহ ({chapters.length}টি)
              </h2>
              {chapters.length === 0 ? (
                <div className="text-center py-10 bg-slate-800 border border-slate-700 rounded-2xl text-slate-500">
                  <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">এই বিষয়ে এখনো কোনো অধ্যায় নেই।</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chapters.map((ch, i) => (
                    <div key={ch.id} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-3.5">
                      <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{ch.title}</p>
                        {ch.description && <p className="text-xs text-slate-500 truncate">{ch.description}</p>}
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-lg flex-shrink-0">
                        {topicCount[ch.id] || 0}টি টপিক
                      </span>
                      {confirmDeleteId === ch.id ? (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button onClick={() => handleDelete(ch.id)} disabled={deletingId === ch.id}
                            className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 disabled:opacity-50">
                            নিশ্চিত
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-600">
                            বাতিল
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(ch.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Syllabus expansion */}
            <div>
              <div className="flex items-center justify-between mb-3 gap-3">
                <h2 className="text-base font-semibold text-slate-300">প্রস্তাবিত অধ্যায় তালিকা</h2>
                {missing.length > 0 && (
                  <button
                    onClick={handleBulkAdd}
                    disabled={bulkAdding}
                    className="flex items-center gap-1.5 px-3.5 py-2 gradient-bg text-white rounded-xl text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex-shrink-0"
                  >
                    {bulkAdding ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    বাকি {missing.length}টি একসাথে যোগ করো
                  </button>
                )}
              </div>

              {syllabus.length === 0 ? (
                <div className="text-center py-8 bg-slate-800 border border-slate-700 rounded-2xl text-slate-500 text-sm px-4">
                  এই বিষয়ের জন্য এখনো কোনো প্রস্তাবিত অধ্যায়-তালিকা নির্ধারণ করা হয়নি। নিচে কাস্টম অধ্যায় যোগ করো।
                </div>
              ) : (
                <div className="space-y-2">
                  {syllabus.map((s) => {
                    const added = existingTitles.has(s.title);
                    return (
                      <div key={s.title} className={`flex items-center gap-3 border rounded-xl p-3.5 ${added ? "bg-emerald-900/10 border-emerald-800/50" : "bg-slate-800 border-slate-700"}`}>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${added ? "text-emerald-300" : "text-white"}`}>{s.title}</p>
                          {s.description && <p className="text-xs text-slate-500 truncate">{s.description}</p>}
                        </div>
                        {added ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium flex-shrink-0">
                            <Check className="w-3.5 h-3.5" /> যোগ হয়েছে
                          </span>
                        ) : (
                          <button
                            onClick={() => addOne(s.title, s.description)}
                            disabled={addingTitle === s.title}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-500 disabled:opacity-50 flex-shrink-0"
                          >
                            {addingTitle === s.title ? (
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <><Plus className="w-3.5 h-3.5" /> যোগ করো</>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom chapter */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-3">কাস্টম অধ্যায় যোগ করো</h2>
              <div className="space-y-3">
                <input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="অধ্যায়ের নাম"
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                />
                <input
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)"
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleAddCustom}
                  disabled={savingCustom || !customTitle.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {savingCustom ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Plus className="w-4 h-4" /> অধ্যায় যোগ করো</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
