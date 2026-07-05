"use client";

// app/admin/seed-content/page.tsx
//
// "Topic admin দিবে না" — টপিক ফর্ম ম্যানুয়ালি একে একে পূরণ করার বদলে, এখানে
// lib/seedData/-এ লেখা সম্পূর্ণ কনটেন্ট প্যাকেজ (চ্যাপ্টার + তার সব টপিক, প্রতিটির
// সম্পূর্ণ Deep Topic Structure সহ) এক ক্লিকে Firestore-এ ইমপোর্ট করা যায়।
//
// প্রতিটি প্যাকেজ ১টি subsection (যেমন "১.১ মৌলিক ধারণা") প্রতিনিধিত্ব করে।
// ইমপোর্ট করলে: চ্যাপ্টার না থাকলে তৈরি হয় (থাকলে reuse হয়), এবং প্রতিটি টপিক
// slug অনুযায়ী না থাকলে তৈরি হয় (থাকলে skip হয়, যাতে দ্বিতীয়বার চালালে ডুপ্লিকেট না হয়)।

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/shared/AuthProvider";
import { getChapters, createChapter, getTopic, createDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { getCategoryName } from "@/lib/constants";
import { SEED_PACKAGES } from "@/lib/seedData";
import { SeedChapter } from "@/lib/seedData/types";
import { MCQ } from "@/types";
import { ArrowLeft, DatabaseZap, Check, Loader2, BookOpen } from "lucide-react";

interface PkgStatus {
  existingSlugs: Set<string>;
  checked: boolean;
}

export default function SeedContentPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [statuses, setStatuses]         = useState<Record<string, PkgStatus>>({});
  const [importingCode, setImportingCode] = useState<string | null>(null);
  const [progress, setProgress]         = useState<{ done: number; total: number } | null>(null);

  const checkStatus = useCallback(async (pkg: SeedChapter) => {
    const results = await Promise.all(pkg.topics.map((t) => getTopic(t.slug)));
    const existingSlugs = new Set(
      pkg.topics.filter((_, i) => results[i] !== null).map((t) => t.slug)
    );
    setStatuses((prev) => ({ ...prev, [pkg.code]: { existingSlugs, checked: true } }));
  }, []);

  useEffect(() => {
    SEED_PACKAGES.forEach((pkg) => checkStatus(pkg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const importPackage = async (pkg: SeedChapter) => {
    setImportingCode(pkg.code);
    setProgress({ done: 0, total: pkg.topics.length });

    // ১) চ্যাপ্টার খুঁজে বের করো (থাকলে reuse করো), না থাকলে তৈরি করো
    const existingChapters = await getChapters(pkg.category);
    let chapterId = existingChapters.find((c) => c.title === pkg.chapterTitle)?.id;
    if (!chapterId) {
      chapterId =
        (await createChapter({
          title: pkg.chapterTitle,
          categoryId: pkg.category,
          order: pkg.chapterOrder,
          description: pkg.chapterDescription,
        })) || undefined;
    }
    if (!chapterId) {
      showToast("error", "অধ্যায় তৈরি করা যায়নি — আবার চেষ্টা করো।");
      setImportingCode(null);
      setProgress(null);
      return;
    }

    // ২) প্রতিটি টপিক — slug অনুযায়ী না থাকলে তৈরি করো
    let created = 0, skipped = 0, failed = 0;
    const currentExisting = statuses[pkg.code]?.existingSlugs || new Set<string>();

    for (let i = 0; i < pkg.topics.length; i++) {
      const t = pkg.topics[i];
      setProgress({ done: i, total: pkg.topics.length });

      if (currentExisting.has(t.slug)) { skipped++; continue; }

      const mcqs: MCQ[] = (t.mcqs || []).map((m, j) => ({
        id: `mcq-${j + 1}`,
        question: m.question,
        options: m.options,
        correctAnswer: m.correctAnswer,
        explanation: m.explanation,
        difficulty: m.difficulty || "medium",
        exam: [],
        categoryId: pkg.category,
        topicId: t.slug,
      }));

      const id = await createDocument("topics", {
        title: t.title,
        slug: t.slug,
        categoryId: pkg.category,
        chapterId,
        estimatedTime: t.estimatedTime,
        level: t.level,
        summary: t.summary,
        content: {
          introduction: t.content.introduction,
          historicalBackground: t.content.historicalBackground,
          theory: t.content.theory,
          formulas: t.content.formulas,
          derivation: t.content.derivation,
          applications: t.content.applications,
          industrialUses: t.content.industrialUses,
          safety: t.content.safety,
          practiceProblems: t.content.practiceProblems,
          labExperiment: t.content.labExperiment,
          notes: t.content.notes,
          examples: [],
        },
        diagrams: [],
        structure3D: t.moleculeId ? { moleculeId: t.moleculeId } : undefined,
        mcqs,
        relatedTopics: [],
        featured: false,
        published: true,
        views: 0,
      });

      if (id) created++; else failed++;
    }

    setProgress({ done: pkg.topics.length, total: pkg.topics.length });
    showToast(
      failed === 0 ? "success" : "error",
      `"${pkg.chapterTitle}" — ${created}টি নতুন টপিক তৈরি হয়েছে, ${skipped}টি আগে থেকেই ছিল${failed ? `, ${failed}টি ব্যর্থ হয়েছে` : "।"}`
    );

    await checkStatus(pkg);
    setImportingCode(null);
    setProgress(null);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <DatabaseZap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">কনটেন্ট ইমপোর্ট</h1>
            <p className="text-slate-400 text-sm">পূর্ণাঙ্গ টপিক কনটেন্ট প্যাকেজ এক ক্লিকে যোগ করো</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          প্রতিটি প্যাকেজে একটি সম্পূর্ণ অধ্যায় ও তার সব টপিক (ভূমিকা, তত্ত্ব, সূত্র, উদাহরণ, MCQ ইত্যাদি সহ) থাকে।
          ইমপোর্ট করলে আগে থেকে থাকা টপিক বাদ দিয়ে শুধু নতুনগুলো তৈরি হবে — তাই বারবার চালানো নিরাপদ।
        </p>

        <div className="space-y-3">
          {SEED_PACKAGES.map((pkg) => {
            const status = statuses[pkg.code];
            const existingCount = status?.existingSlugs.size ?? 0;
            const total = pkg.topics.length;
            const fullyImported = status?.checked && existingCount === total;
            const isImporting = importingCode === pkg.code;

            return (
              <div key={pkg.code} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-primary-400 mb-0.5">{pkg.code}</p>
                    <p className="font-bold text-white truncate">{pkg.chapterTitle}</p>
                    <p className="text-xs text-slate-500">{getCategoryName(pkg.category)} • {total}টি টপিক</p>
                  </div>
                  {fullyImported && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium flex-shrink-0 mt-1">
                      <Check className="w-3.5 h-3.5" /> সম্পন্ন
                    </span>
                  )}
                </div>

                {pkg.chapterDescription && (
                  <p className="text-sm text-slate-400 mb-3 leading-relaxed">{pkg.chapterDescription}</p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pkg.topics.map((t) => {
                    const done = status?.existingSlugs.has(t.slug);
                    return (
                      <span key={t.slug}
                        className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          done ? "bg-emerald-900/30 text-emerald-400" : "bg-slate-700 text-slate-300"
                        }`}>
                        {done && <Check className="w-3 h-3" />}
                        {t.title}
                      </span>
                    );
                  })}
                </div>

                {isImporting && progress && (
                  <div className="mb-3">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full gradient-bg transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">{progress.done}/{progress.total} টপিক প্রক্রিয়াধীন...</p>
                  </div>
                )}

                <button
                  onClick={() => importPackage(pkg)}
                  disabled={isImporting || !status?.checked}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50 ${
                    fullyImported ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "gradient-bg text-white hover:opacity-90"
                  }`}
                >
                  {isImporting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> ইমপোর্ট হচ্ছে...</>
                  ) : fullyImported ? (
                    <><BookOpen className="w-4 h-4" /> আবার যাচাই করো</>
                  ) : (
                    <><DatabaseZap className="w-4 h-4" /> ইমপোর্ট করো ({total - existingCount}টি বাকি)</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
