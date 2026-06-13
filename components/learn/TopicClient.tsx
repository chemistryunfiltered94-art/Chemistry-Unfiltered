"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Clock, CheckCircle, BookOpen, BookmarkPlus,
  BookmarkCheck, ChevronRight, Share2, AlertCircle,
  ChevronDown, ChevronUp, ArrowRight
} from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useTopicProgress } from "@/hooks/useProgress";
import { LevelBadge } from "@/components/ui/Badge";

interface TopicData {
  title: string; level: "beginner"|"intermediate"|"advanced";
  estimatedTime: number; category: string; categorySlug: string;
  introduction: string; theory: string[];
  formulas: { name: string; formula: string; explanation: string }[];
  examples: { question: string; steps: string[]; answer: string }[];
  applications: string[]; notes: string[];
  mcqs: { q: string; options: string[]; answer: number; explanation: string }[];
  relatedTopics: { slug: string; title: string; categorySlug: string }[];
}

// Simple markdown-like bold renderer
function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part}</strong> : part
      )}
    </span>
  );
}

function MCQSection({ mcqs }: { mcqs: TopicData["mcqs"] }) {
  const [selected, setSelected]   = useState<Record<number, number>>({});
  const [revealed, setRevealed]   = useState<Record<number, boolean>>({});
  const [score,    setScore]      = useState<number|null>(null);

  const submit = () => {
    const correct = mcqs.filter((q, i) => selected[i] === q.answer).length;
    setScore(correct);
    const all: Record<number, boolean> = {};
    mcqs.forEach((_, i) => { all[i] = true; });
    setRevealed(all);
  };

  const reset = () => { setSelected({}); setRevealed({}); setScore(null); };

  return (
    <div className="space-y-5">
      {mcqs.map((mcq, i) => (
        <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-5">
          <p className="font-semibold text-slate-900 dark:text-white mb-4">
            {i+1}. {mcq.q}
          </p>
          <div className="space-y-2 mb-3">
            {mcq.options.map((opt, j) => {
              let cls = "border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300";
              if (revealed[i]) {
                if (j === mcq.answer) cls = "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold";
                else if (j === selected[i]) cls = "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
              } else if (selected[i] === j) {
                cls = "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300";
              }
              return (
                <button
                  key={j}
                  disabled={!!revealed[i]}
                  onClick={() => setSelected(prev => ({ ...prev, [i]: j }))}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all ${cls} ${!revealed[i] ? "hover:border-primary-400 cursor-pointer" : "cursor-default"}`}
                >
                  <span className="font-bold mr-2">{["ক","খ","গ","ঘ"][j]}.</span>{opt}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {revealed[i] && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-sm text-blue-700 dark:text-blue-300"
              >
                💡 {mcq.explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <div className="flex gap-3">
        {score === null ? (
          <button
            onClick={submit}
            disabled={Object.keys(selected).length < mcqs.length}
            className="flex-1 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-40"
          >
            জমা দাও ({Object.keys(selected).length}/{mcqs.length})
          </button>
        ) : (
          <div className="flex-1 flex items-center gap-4">
            <div className={`flex-1 py-3 rounded-xl text-center font-bold text-lg ${
              score === mcqs.length ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
              score >= mcqs.length/2  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
              "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}>
              স্কোর: {score}/{mcqs.length} ({Math.round(score/mcqs.length*100)}%)
            </div>
            <button onClick={reset} className="px-5 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">
              আবার দাও
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TopicClient({ data, categorySlug, topicSlug }: {
  data: TopicData; categorySlug: string; topicSlug: string;
}) {
  const { user }                                        = useAuth();
  const { completed, bookmarked, completing, bookmarking,
          handleMarkComplete, handleToggleBookmark }    = useTopicProgress(topicSlug);
  const [copied, setCopied]                             = useState(false);
  const [activeSection, setActiveSection]               = useState("introduction");
  const [showAllTheory, setShowAllTheory]               = useState(false);

  const sections = [
    { id:"introduction", label:"ভূমিকা" },
    { id:"theory",       label:"তত্ত্ব" },
    { id:"formulas",     label:"সূত্র" },
    { id:"examples",     label:"উদাহরণ" },
    { id:"applications", label:"প্রয়োগ" },
    { id:"notes",        label:"গুরুত্বপূর্ণ নোট" },
    { id:"quiz",         label:"অনুশীলন MCQ" },
    { id:"related",      label:"সম্পর্কিত টপিক" },
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/learn" className="hover:text-primary-600 dark:hover:text-primary-400">শেখো</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/learn/${categorySlug}`} className="hover:text-primary-600 dark:hover:text-primary-400">{data.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 dark:text-white font-medium">{data.title}</span>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
          {/* Main Content */}
          <div className="space-y-8">

            {/* Header Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <LevelBadge level={data.level} />
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" /> {data.estimatedTime} মিনিট
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Share2 className="w-3 h-3" />
                    {copied ? "কপি হয়েছে!" : "শেয়ার"}
                  </button>
                  {user && (
                    <button onClick={handleToggleBookmark} disabled={bookmarking}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      {bookmarked ? <BookmarkCheck className="w-3 h-3 text-primary-600" /> : <BookmarkPlus className="w-3 h-3" />}
                      {bookmarked ? "সংরক্ষিত" : "সংরক্ষণ"}
                    </button>
                  )}
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">{data.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{data.category}</p>

              {user && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={handleMarkComplete}
                    disabled={completing || completed}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      completed
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
                        : "gradient-bg text-white hover:opacity-90"
                    }`}
                  >
                    {completed ? <><CheckCircle className="w-4 h-4" /> সম্পন্ন হয়েছে</> :
                     completing ? "চিহ্নিত হচ্ছে..." :
                     <><BookOpen className="w-4 h-4" /> সম্পন্ন হিসেবে চিহ্নিত করো</>}
                  </button>
                </div>
              )}
            </div>

            {/* Introduction */}
            <section id="introduction" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📖</span> ভূমিকা
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{data.introduction}</p>
            </section>

            {/* Theory */}
            <section id="theory" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🧪</span> তত্ত্ব
              </h2>
              <div className="space-y-4">
                {(showAllTheory ? data.theory : data.theory.slice(0,3)).map((para, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                    <div className="w-8 h-8 rounded-full gradient-bg text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {i+1}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      <RichText text={para} />
                    </p>
                  </div>
                ))}
              </div>
              {data.theory.length > 3 && (
                <button onClick={() => setShowAllTheory(!showAllTheory)}
                  className="mt-4 flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                  {showAllTheory ? <><ChevronUp className="w-4 h-4" /> কম দেখো</> : <><ChevronDown className="w-4 h-4" /> আরো {data.theory.length - 3}টি পয়েন্ট দেখো</>}
                </button>
              )}
            </section>

            {/* Formulas */}
            {data.formulas.length > 0 && (
              <section id="formulas" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">⚗️</span> মূল সূত্রসমূহ
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.formulas.map((f, i) => (
                    <div key={i} className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{f.name}</p>
                      <div className="font-mono text-xl font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl px-4 py-3 mb-3 text-center">
                        {f.formula}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Examples */}
            {data.examples.length > 0 && (
              <section id="examples" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">✏️</span> সমাধান করা উদাহরণ
                </h2>
                <div className="space-y-5">
                  {data.examples.map((ex, i) => (
                    <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                      <div className="bg-amber-50 dark:bg-amber-900/20 px-5 py-3 border-b border-amber-200 dark:border-amber-800">
                        <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                          প্রশ্ন {i+1}: {ex.question}
                        </p>
                      </div>
                      <div className="p-5">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">সমাধান:</p>
                        <ol className="space-y-2 mb-4">
                          {ex.steps.map((step, j) => (
                            <li key={j} className="flex gap-3 text-sm">
                              <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{j+1}</span>
                              <span className="text-slate-700 dark:text-slate-300 font-mono pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-2.5">
                          <p className="text-green-800 dark:text-green-300 text-sm font-semibold">✅ উত্তর: {ex.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Applications */}
            <section id="applications" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="text-2xl">🌍</span> বাস্তব জীবনে প্রয়োগ
              </h2>
              <ul className="space-y-3">
                {data.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                    {app}
                  </li>
                ))}
              </ul>
            </section>

            {/* Notes */}
            <section id="notes" className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-300 mb-5 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" /> গুরুত্বপূর্ণ নোট
              </h2>
              <ul className="space-y-2">
                {data.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                    <span className="text-amber-500 mt-1">•</span> {note}
                  </li>
                ))}
              </ul>
            </section>

            {/* MCQ Quiz */}
            <section id="quiz" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">❓</span> অনুশীলন MCQ
              </h2>
              <MCQSection mcqs={data.mcqs} />
            </section>

            {/* Related Topics */}
            {data.relatedTopics.length > 0 && (
              <section id="related" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">সম্পর্কিত টপিক</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.relatedTopics.map((rt, i) => (
                    <Link key={i} href={`/learn/${rt.categorySlug}/${rt.slug}`}
                      className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all group">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">{rt.title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar TOC — sticky on desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">বিষয়বস্তু</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button key={s.id} onClick={() => scrollTo(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                      activeSection === s.id
                        ? "gradient-bg text-white font-medium"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}>
                    {s.label}
                  </button>
                ))}
              </nav>

              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
                <Link href={`/learn/${categorySlug}`}
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> সব টপিক দেখো
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
