"use client";

import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { createDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { NOTE_TYPE_LIST, CATEGORY_LIST } from "@/lib/constants";
import { NoteType, ChemistryCategory } from "@/types";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AddNotePage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<NoteType>("class");
  const [category, setCategory] = useState<ChemistryCategory>("physical-chemistry");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const autoSlug = (t: string) => t.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) return;
    setSaving(true);
    const id = await createDocument("studyNotes", {
      title: title.trim(),
      slug: slug.trim(),
      type,
      category,
      summary: summary.trim(),
      content: content.trim(),
      published,
    });
    setSaving(false);

    if (id) {
      setSuccess(true);
      showToast("success", "নোট সফলভাবে সংরক্ষিত হয়েছে।");
      setTimeout(() => setSuccess(false), 3000);
      setTitle(""); setSlug(""); setSummary(""); setContent("");
    } else {
      showToast("error", "সংরক্ষণ করা যায়নি। admin role বা Firestore rules যাচাই করো।");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin/notes" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> নোট ম্যানেজ
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">নতুন নোট যোগ করো</h1>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">শিরোনাম *</label>
            <input value={title}
              onChange={(e) => { setTitle(e.target.value); setSlug(autoSlug(e.target.value)); }}
              placeholder="নোটের শিরোনাম"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Slug (URL) *</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)}
              placeholder="note-slug"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">নোটের ধরন *</label>
              <select value={type} onChange={(e) => setType(e.target.value as NoteType)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
              >
                {NOTE_TYPE_LIST.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">বিষয় *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ChemistryCategory)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
              >
                {CATEGORY_LIST.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">সংক্ষিপ্ত বিবরণ</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2}
              placeholder="কার্ডে যা দেখাবে..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">মূল লেখা *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12}
              placeholder="প্রতিটা প্যারাগ্রাফ নতুন লাইনে লেখো..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1.5">প্রতিটা নতুন লাইন একটা আলাদা প্যারাগ্রাফ হিসেবে দেখাবে।</p>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                <div className={`w-10 h-5 rounded-full transition-colors ${published ? "gradient-bg" : "bg-slate-600"}`} />
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${published ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-slate-300">প্রকাশিত (Published)</span>
            </label>
          </div>

          <button onClick={handleSave} disabled={saving || !title.trim() || !slug.trim() || !content.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
             success ? "✅ সফলভাবে সংরক্ষিত হয়েছে!" :
             <><Save className="w-5 h-5" /> নোট সংরক্ষণ করো</>}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
