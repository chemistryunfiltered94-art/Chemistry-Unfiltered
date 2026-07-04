"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useCollection } from "@/hooks/useFirestore";
import { createDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { RevisionQuestion, RevisionLevel, REVISION_LEVEL_LABELS } from "@/types";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AddRevisionQuestionPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const { data: existing } = useCollection<RevisionQuestion>("revisionQuestions");

  const [level, setLevel] = useState<RevisionLevel>("hsc");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // এই level-এর জন্য আগে থেকে ব্যবহৃত subject/year — datalist suggestion হিসেবে,
  // যাতে admin টাইপো করে ভিন্ন বানান দিয়ে ফেললে নতুন ডুপ্লিকেট সেকশন তৈরি না হয়।
  const subjectSuggestions = useMemo(
    () => Array.from(new Set(existing.filter((q) => q.level === level).map((q) => q.subject))).sort(),
    [existing, level]
  );
  const yearSuggestions = useMemo(
    () =>
      Array.from(
        new Set(existing.filter((q) => q.level === level && q.subject === subject).map((q) => q.year))
      ).sort().reverse(),
    [existing, level, subject]
  );

  const isValid = subject.trim() && year.trim() && question.trim() && answer.trim();

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    const id = await createDocument("revisionQuestions", {
      level,
      subject: subject.trim(),
      year: year.trim(),
      question: question.trim(),
      answer: answer.trim(),
      published,
    });
    setSaving(false);

    if (id) {
      setSuccess(true);
      showToast("success", "প্রশ্ন সফলভাবে যোগ হয়েছে।");
      setTimeout(() => {
        setQuestion("");
        setAnswer("");
        setSuccess(false);
      }, 1500);
    } else {
      showToast("error", "প্রশ্ন সংরক্ষণ করা যায়নি। admin role বা Firestore rules যাচাই করো।");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/admin/revision" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> রিভিশন ম্যানেজ
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-white mb-6">নতুন রিভিশন প্রশ্ন যোগ করো</h1>

          {/* Level */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">স্তর</label>
            <div className="flex gap-2">
              {(["hsc", "honours"] as RevisionLevel[]).map((lvl) => (
                <button key={lvl} type="button" onClick={() => { setLevel(lvl); setSubject(""); setYear(""); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    level === lvl ? "gradient-bg text-white" : "border border-slate-600 text-slate-400 hover:border-primary-500"
                  }`}>
                  {REVISION_LEVEL_LABELS[lvl]}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">বিষয়</label>
            <input
              list="subject-suggestions"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="যেমন: জৈব রসায়ন, পদার্থবিজ্ঞান ১ম পত্র"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
            <datalist id="subject-suggestions">
              {subjectSuggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>

          {/* Year */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">সাল</label>
            <input
              list="year-suggestions"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="যেমন: 2023, 2024"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
            <datalist id="year-suggestions">
              {yearSuggestions.map((y) => <option key={y} value={y} />)}
            </datalist>
          </div>

          {/* Question */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">প্রশ্ন</label>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} placeholder="প্রশ্ন লেখো..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none" />
          </div>

          {/* Answer */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">উত্তর</label>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={6} placeholder="সম্পূর্ণ উত্তর লেখো..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none" />
          </div>

          {/* Published toggle */}
          <label className="flex items-center gap-3 mb-6 cursor-pointer select-none">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 rounded accent-primary-500" />
            <span className="text-sm text-slate-300">প্রকাশ করো (unchecked রাখলে draft হিসেবে সংরক্ষিত হবে)</span>
          </label>

          <button onClick={handleSave} disabled={saving || !isValid}
            className="w-full flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50">
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              "✅ সফলভাবে যোগ হয়েছে!"
            ) : (
              <><Save className="w-5 h-5" /> প্রশ্ন সংরক্ষণ করো</>
            )}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
