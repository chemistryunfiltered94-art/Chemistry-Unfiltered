"use client";

import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { createDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";

export default function AddArticlePage() {
  const { isAdmin, user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([""]);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const autoSlug = (t: string) => t.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const addTag = () => setTags((prev) => [...prev, ""]);
  const removeTag = (i: number) => setTags((prev) => prev.filter((_, idx) => idx !== i));
  const updateTag = (i: number, val: string) => setTags((prev) => prev.map((t, idx) => (idx === i ? val : t)));

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) return;
    setSaving(true);
    const id = await createDocument("articles", {
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      content: content.trim(),
      author: user?.name || "Chemistry Unfiltered Team",
      tags: tags.filter((t) => t.trim()),
      published,
    });
    setSaving(false);

    if (id) {
      setSuccess(true);
      showToast("success", "আর্টিকেল সফলভাবে সংরক্ষিত হয়েছে।");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      showToast("error", "সংরক্ষণ করা যায়নি। admin role বা Firestore rules যাচাই করো।");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">নতুন আর্টিকেল লেখো</h1>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">শিরোনাম *</label>
            <input value={title}
              onChange={(e) => { setTitle(e.target.value); setSlug(autoSlug(e.target.value)); }}
              placeholder="আর্টিকেলের শিরোনাম"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Slug (URL) *</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)}
              placeholder="article-slug"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">ট্যাগ</label>
              <button onClick={addTag} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus className="w-3.5 h-3.5" /> যোগ করো
              </button>
            </div>
            <div className="space-y-2">
              {tags.map((tag, i) => (
                <div key={i} className="flex gap-2">
                  <input value={tag} onChange={(e) => updateTag(i, e.target.value)}
                    placeholder="যেমন: Organic, Biochemistry"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  {tags.length > 1 && (
                    <button onClick={() => removeTag(i)} className="text-slate-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
             <><Save className="w-5 h-5" /> আর্টিকেল সংরক্ষণ করো</>}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
