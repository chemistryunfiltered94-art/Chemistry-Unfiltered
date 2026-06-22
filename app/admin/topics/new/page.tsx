"use client";

import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { createDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";

export default function AddTopicPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [title,        setTitle]        = useState("");
  const [slug,         setSlug]         = useState("");
  const [category,     setCategory]     = useState("physical-chemistry");
  const [level,        setLevel]        = useState("beginner");
  const [estTime,      setEstTime]      = useState("20");
  const [summary,      setSummary]      = useState("");
  const [introduction, setIntroduction] = useState("");
  const [theory,       setTheory]       = useState([""]);
  const [notes,        setNotes]        = useState([""]);
  const [applications, setApplications] = useState([""]);
  const [featured,     setFeatured]     = useState(false);
  const [published,    setPublished]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [success,      setSuccess]      = useState(false);

  const autoSlug = (t: string) => t.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const addItem = (arr: string[], set: (v: string[]) => void) => set([...arr, ""]);
  const removeItem = (arr: string[], set: (v: string[]) => void, i: number) => set(arr.filter((_, idx) => idx !== i));
  const updateItem = (arr: string[], set: (v: string[]) => void, i: number, val: string) =>
    set(arr.map((item, idx) => idx === i ? val : item));

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !summary.trim()) return;
    setSaving(true);
    const id = await createDocument("topics", {
      title: title.trim(),
      slug: slug.trim(),
      categoryId: category,
      level,
      estimatedTime: parseInt(estTime) || 20,
      summary: summary.trim(),
      content: {
        introduction: introduction.trim(),
        theory: theory.filter(t => t.trim()),
        applications: applications.filter(a => a.trim()),
        notes: notes.filter(n => n.trim()),
        examples: [],
      },
      diagrams: [],
      mcqs: [],
      relatedTopics: [],
      featured,
      published,
      views: 0,
    });
    setSaving(false);

    if (id) {
      setSuccess(true);
      showToast("success", "টপিক সফলভাবে সংরক্ষিত হয়েছে।");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      showToast(
        "error",
        "টপিক সংরক্ষণ করা যায়নি। তোমার অ্যাকাউন্টে admin role আছে কিনা এবং Firestore rules ঠিক আছে কিনা যাচাই করো। (Console-এ বিস্তারিত error দেখা যাবে।)"
      );
    }
  };

  if (!isAdmin) return null;

  const categories = [
    { id: "physical-chemistry",    name: "ভৌত রসায়ন" },
    { id: "organic-chemistry",     name: "জৈব রসায়ন" },
    { id: "inorganic-chemistry",   name: "অজৈব রসায়ন" },
    { id: "analytical-chemistry",  name: "বিশ্লেষণী রসায়ন" },
    { id: "biochemistry",          name: "জীব রসায়ন" },
    { id: "environmental-chemistry",name:"পরিবেশ রসায়ন" },
    { id: "industrial-chemistry",  name: "শিল্প রসায়ন" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">নতুন টপিক যোগ করো</h1>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">টপিকের নাম *</label>
              <input value={title}
                onChange={e => { setTitle(e.target.value); setSlug(autoSlug(e.target.value)); }}
                placeholder="যেমন: অ্যাসিড ও ক্ষার"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Slug (URL) *</label>
              <input value={slug} onChange={e => setSlug(e.target.value)}
                placeholder="acid-base"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">পড়ার সময় (মিনিট)</label>
              <input type="number" value={estTime} onChange={e => setEstTime(e.target.value)} min="5" max="120"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">বিষয়</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">স্তর</label>
              <select value={level} onChange={e => setLevel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500">
                <option value="beginner">শুরু (Beginner)</option>
                <option value="intermediate">মধ্যবর্তী (Intermediate)</option>
                <option value="advanced">উন্নত (Advanced)</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">সংক্ষিপ্ত বিবরণ *</label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={2}
              placeholder="টপিকের সংক্ষিপ্ত বিবরণ (Card-এ দেখাবে)"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          {/* Introduction */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">ভূমিকা</label>
            <textarea value={introduction} onChange={e => setIntroduction(e.target.value)} rows={4}
              placeholder="টপিকের বিস্তারিত ভূমিকা..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          {/* Theory Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">তত্ত্বের পয়েন্ট</label>
              <button onClick={() => addItem(theory, setTheory)} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus className="w-3.5 h-3.5" /> যোগ করো
              </button>
            </div>
            <div className="space-y-2">
              {theory.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <span className="w-6 h-9 flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">{i+1}.</span>
                  <input value={t} onChange={e => updateItem(theory, setTheory, i, e.target.value)}
                    placeholder="তত্ত্বের পয়েন্ট (Bold করতে **text** ব্যবহার করো)"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  {theory.length > 1 && (
                    <button onClick={() => removeItem(theory, setTheory, i)} className="text-slate-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">বাস্তব প্রয়োগ</label>
              <button onClick={() => addItem(applications, setApplications)} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus className="w-3.5 h-3.5" /> যোগ করো
              </button>
            </div>
            <div className="space-y-2">
              {applications.map((app, i) => (
                <div key={i} className="flex gap-2">
                  <input value={app} onChange={e => updateItem(applications, setApplications, i, e.target.value)}
                    placeholder="প্রয়োগের বিবরণ"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  {applications.length > 1 && (
                    <button onClick={() => removeItem(applications, setApplications, i)} className="text-slate-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">গুরুত্বপূর্ণ নোট</label>
              <button onClick={() => addItem(notes, setNotes)} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus className="w-3.5 h-3.5" /> যোগ করো
              </button>
            </div>
            <div className="space-y-2">
              {notes.map((note, i) => (
                <div key={i} className="flex gap-2">
                  <input value={note} onChange={e => updateItem(notes, setNotes, i, e.target.value)}
                    placeholder="গুরুত্বপূর্ণ তথ্য বা মনে রাখার পয়েন্ট"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  {notes.length > 1 && (
                    <button onClick={() => removeItem(notes, setNotes, i)} className="text-slate-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-700">
            {[
              { label: "Featured হিসেবে চিহ্নিত করো", val: featured, set: setFeatured },
              { label: "প্রকাশিত (Published)",         val: published, set: setPublished },
            ].map(toggle => (
              <label key={toggle.label} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={toggle.val} onChange={e => toggle.set(e.target.checked)} />
                  <div className={`w-10 h-5 rounded-full transition-colors ${toggle.val ? "gradient-bg" : "bg-slate-600"}`} />
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggle.val ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-slate-300">{toggle.label}</span>
              </label>
            ))}
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving || !title.trim() || !slug.trim() || !summary.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
             success ? "✅ সফলভাবে সংরক্ষিত হয়েছে!" :
             <><Save className="w-5 h-5" /> টপিক সংরক্ষণ করো</>}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
