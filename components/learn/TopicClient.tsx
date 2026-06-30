"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Clock, CheckCircle, BookOpen, BookmarkPlus,
  BookmarkCheck, ChevronRight, Share2, AlertCircle,
  ChevronDown, ChevronUp, ArrowRight, ExternalLink, PlayCircle,
} from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useTopicProgress } from "@/hooks/useProgress";
import { LevelBadge } from "@/components/ui/Badge";
import MoleculeViewer from "@/components/shared/MoleculeViewer";
import { Molecule } from "@/lib/molecules";

interface TopicData {
  title: string; level: "beginner"|"intermediate"|"advanced";
  estimatedTime: number; category: string; categorySlug: string;
  introduction: string;
  historicalBackground: string;
  theory: string[];
  formulas: { name: string; formula: string; explanation: string }[];
  derivation: string[];
  examples: { question: string; steps: string[]; answer: string }[];
  diagrams: { url: string; caption: string }[];
  structure3D: { title?: string; description?: string; modelUrl?: string; molecule: Molecule | null } | null;
  applications: string[];
  industrialUses: string[];
  safety: string[];
  labExperiment: { title: string; materials: string[]; procedure: string[]; precautions: string[]; observation?: string } | null;
  animation: { title: string; description: string; url?: string } | null;
  pdfNotes: { title: string; url: string }[];
  practiceProblems: { question: string; answer: string; difficulty?: "easy"|"medium"|"hard" }[];
  notes: string[];
  mcqs: { q: string; options: string[]; answer: number; explanation: string }[];
  relatedTopics: { slug: string; title: string; categorySlug: string }[];
}

// Simple markdown-like bold renderer
function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{part}</strong> : part
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
        <div key={i} className="bg-slate-700/50 rounded-2xl p-5">
          <p className="font-semibold text-white mb-4">
            {i+1}. {mcq.q}
          </p>
          <div className="space-y-2 mb-3">
            {mcq.options.map((opt, j) => {
              let cls = "border border-slate-600 bg-slate-700 text-slate-300";
              if (revealed[i]) {
                if (j === mcq.answer) cls = "border-green-500 bg-green-900/30 text-green-300 font-semibold";
                else if (j === selected[i]) cls = "border-red-400 bg-red-900/20 text-red-400";
              } else if (selected[i] === j) {
                cls = "border-primary-500 bg-primary-900/20 text-primary-300";
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
                className="mt-3 p-3 bg-blue-900/20 border border-blue-700 rounded-xl text-sm text-blue-300"
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
              score === mcqs.length ? "bg-green-900/30 text-green-400" :
              score >= mcqs.length/2  ? "bg-yellow-900/30 text-yellow-400" :
              "bg-red-900/30 text-red-400"
            }`}>
              স্কোর: {score}/{mcqs.length} ({Math.round(score/mcqs.length*100)}%)
            </div>
            <button onClick={reset} className="px-5 py-3 border border-slate-600 rounded-xl text-slate-300 hover:bg-slate-700 text-sm">
              আবার দাও
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeProblemsSection({ problems }: { problems: TopicData["practiceProblems"] }) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setRevealed((p) => ({ ...p, [i]: !p[i] }));
  const diffLabel: Record<string, string> = { easy: "সহজ", medium: "মধ্যম", hard: "কঠিন" };
  const diffColor: Record<string, string> = {
    easy: "text-green-400 bg-green-900/30",
    medium: "text-amber-400 bg-amber-900/30",
    hard: "text-red-400 bg-red-900/30",
  };

  return (
    <div className="space-y-4">
      {problems.map((p, i) => (
        <div key={i} className="border border-slate-700 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="font-semibold text-white flex-1">{i + 1}. {p.question}</p>
            {p.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium ${diffColor[p.difficulty]}`}>
                {diffLabel[p.difficulty]}
              </span>
            )}
          </div>
          {revealed[i] ? (
            <div className="bg-green-900/20 border border-green-700 rounded-xl px-4 py-2.5">
              <p className="text-green-300 text-sm font-semibold">✅ উত্তর: {p.answer}</p>
            </div>
          ) : (
            <button onClick={() => toggle(i)} className="text-sm text-primary-400 hover:underline font-medium">
              উত্তর দেখো
            </button>
          )}
        </div>
      ))}
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

  // ✅ যেসব সেকশনে আসলে ডেটা আছে, কেবল সেগুলোই TOC ও পেজে দেখানো হয়
  const sections = [
    { id: "introduction", label: "ভূমিকা",              show: true },
    { id: "history",      label: "ঐতিহাসিক পটভূমি",      show: !!data.historicalBackground },
    { id: "theory",       label: "তত্ত্ব",               show: true },
    { id: "formulas",     label: "সূত্র",                show: data.formulas.length > 0 },
    { id: "derivation",   label: "ডেরিভেশন",            show: data.derivation.length > 0 },
    { id: "examples",     label: "উদাহরণ",               show: data.examples.length > 0 },
    { id: "diagrams",     label: "ডায়াগ্রাম",            show: data.diagrams.length > 0 },
    { id: "structure3d",  label: "3D গঠন",               show: !!data.structure3D },
    { id: "applications", label: "প্রয়োগ",               show: true },
    { id: "industrial",   label: "শিল্পে ব্যবহার",        show: data.industrialUses.length > 0 },
    { id: "safety",       label: "নিরাপত্তা",            show: data.safety.length > 0 },
    { id: "lab",          label: "ল্যাব এক্সপেরিমেন্ট",    show: !!data.labExperiment },
    { id: "animation",    label: "অ্যানিমেশন",          show: !!data.animation },
    { id: "practice",     label: "অনুশীলন সমস্যা",       show: data.practiceProblems.length > 0 },
    { id: "pdf",          label: "PDF নোট",              show: data.pdfNotes.length > 0 },
    { id: "notes",        label: "গুরুত্বপূর্ণ নোট",      show: true },
    { id: "quiz",         label: "অনুশীলন MCQ",          show: data.mcqs.length > 0 },
    { id: "related",      label: "সম্পর্কিত টপিক",       show: data.relatedTopics.length > 0 },
  ].filter((s) => s.show);

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
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/learn" className="hover:text-primary-400">শেখো</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/learn/${categorySlug}`} className="hover:text-primary-400">{data.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-medium">{data.title}</span>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
          {/* Main Content */}
          <div className="space-y-8">

            {/* Header Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <LevelBadge level={data.level} />
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" /> {data.estimatedTime} মিনিট
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors">
                    <Share2 className="w-3 h-3" />
                    {copied ? "কপি হয়েছে!" : "শেয়ার"}
                  </button>
                  {user && (
                    <button onClick={handleToggleBookmark} disabled={bookmarking}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors">
                      {bookmarked ? <BookmarkCheck className="w-3 h-3 text-primary-400" /> : <BookmarkPlus className="w-3 h-3" />}
                      {bookmarked ? "সংরক্ষিত" : "সংরক্ষণ"}
                    </button>
                  )}
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{data.title}</h1>
              <p className="text-slate-400 text-sm">{data.category}</p>

              {user && (
                <div className="mt-5 pt-5 border-t border-slate-700">
                  <button
                    onClick={handleMarkComplete}
                    disabled={completing || completed}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      completed
                        ? "bg-green-900/30 text-green-400 cursor-default"
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
            <section id="introduction" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📖</span> ভূমিকা
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">{data.introduction}</p>
            </section>

            {/* Historical Background */}
            {data.historicalBackground && (
              <section id="history" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">📜</span> ঐতিহাসিক পটভূমি
                </h2>
                <p className="text-slate-300 leading-relaxed">{data.historicalBackground}</p>
              </section>
            )}

            {/* Theory */}
            <section id="theory" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🧪</span> তত্ত্ব
              </h2>
              <div className="space-y-4">
                {(showAllTheory ? data.theory : data.theory.slice(0,3)).map((para, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-700/50 rounded-2xl">
                    <div className="w-8 h-8 rounded-full gradient-bg text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {i+1}
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      <RichText text={para} />
                    </p>
                  </div>
                ))}
              </div>
              {data.theory.length > 3 && (
                <button onClick={() => setShowAllTheory(!showAllTheory)}
                  className="mt-4 flex items-center gap-2 text-primary-400 text-sm font-medium hover:underline">
                  {showAllTheory ? <><ChevronUp className="w-4 h-4" /> কম দেখো</> : <><ChevronDown className="w-4 h-4" /> আরো {data.theory.length - 3}টি পয়েন্ট দেখো</>}
                </button>
              )}
            </section>

            {/* Formulas */}
            {data.formulas.length > 0 && (
              <section id="formulas" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">⚗️</span> মূল সূত্রসমূহ
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.formulas.map((f, i) => (
                    <div key={i} className="p-4 border border-slate-700 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-2 font-medium">{f.name}</p>
                      <div className="font-mono text-xl font-bold text-primary-400 bg-primary-900/20 rounded-xl px-4 py-3 mb-3 text-center">
                        {f.formula}
                      </div>
                      <p className="text-sm text-slate-400">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Derivation */}
            {data.derivation.length > 0 && (
              <section id="derivation" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📐</span> ডেরিভেশন
                </h2>
                <ol className="space-y-3">
                  {data.derivation.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary-900/30 text-primary-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i+1}</span>
                      <span className="text-slate-300 font-mono text-sm pt-1 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Examples */}
            {data.examples.length > 0 && (
              <section id="examples" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">✏️</span> সমাধান করা উদাহরণ
                </h2>
                <div className="space-y-5">
                  {data.examples.map((ex, i) => (
                    <div key={i} className="border border-slate-700 rounded-2xl overflow-hidden">
                      <div className="bg-amber-900/20 px-5 py-3 border-b border-amber-800">
                        <p className="font-semibold text-amber-300 text-sm">
                          প্রশ্ন {i+1}: {ex.question}
                        </p>
                      </div>
                      <div className="p-5 bg-slate-800">
                        <p className="text-sm font-semibold text-slate-400 mb-3">সমাধান:</p>
                        <ol className="space-y-2 mb-4">
                          {ex.steps.map((step, j) => (
                            <li key={j} className="flex gap-3 text-sm">
                              <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{j+1}</span>
                              <span className="text-slate-300 font-mono pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="bg-green-900/20 border border-green-700 rounded-xl px-4 py-2.5">
                          <p className="text-green-300 text-sm font-semibold">✅ উত্তর: {ex.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Diagrams */}
            {data.diagrams.length > 0 && (
              <section id="diagrams" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🖼️</span> ডায়াগ্রাম
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.diagrams.map((d, i) => (
                    <figure key={i} className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.url} alt={d.caption || `ডায়াগ্রাম ${i+1}`} className="w-full h-auto" />
                      {d.caption && (
                        <figcaption className="px-4 py-2.5 text-xs text-slate-400 text-center">{d.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* 3D Structure */}
            {data.structure3D && (
              <section id="structure3d" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🧬</span> 3D গঠন
                </h2>
                {data.structure3D.molecule ? (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-white">{data.structure3D.title || data.structure3D.molecule.nameBn}</p>
                        <p className="text-sm text-slate-400">{data.structure3D.description || data.structure3D.molecule.desc}</p>
                      </div>
                      <span className="font-mono text-lg font-bold text-primary-400 flex-shrink-0">{data.structure3D.molecule.formula}</span>
                    </div>
                    <MoleculeViewer mol={data.structure3D.molecule} compact />
                  </div>
                ) : data.structure3D.modelUrl ? (
                  <div className="p-5 border border-slate-700 rounded-2xl">
                    {data.structure3D.title && <p className="font-bold text-white mb-1">{data.structure3D.title}</p>}
                    {data.structure3D.description && <p className="text-sm text-slate-400 mb-4">{data.structure3D.description}</p>}
                    <a href={data.structure3D.modelUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                      <ExternalLink className="w-4 h-4" /> 3D মডেল দেখো
                    </a>
                  </div>
                ) : null}
              </section>
            )}

            {/* Applications */}
            <section id="applications" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                <span className="text-2xl">🌍</span> বাস্তব জীবনে প্রয়োগ
              </h2>
              <ul className="space-y-3">
                {data.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                    {app}
                  </li>
                ))}
              </ul>
            </section>

            {/* Industrial Uses */}
            {data.industrialUses.length > 0 && (
              <section id="industrial" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                  <span className="text-2xl">🏭</span> শিল্পে ব্যবহার
                </h2>
                <ul className="space-y-3">
                  {data.industrialUses.map((use, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="w-6 h-6 rounded-full bg-indigo-900/30 text-indigo-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                      {use}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Safety */}
            {data.safety.length > 0 && (
              <section id="safety" className="bg-red-900/20 border border-red-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-red-300 mb-5 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span> নিরাপত্তা সতর্কতা
                </h2>
                <ul className="space-y-2">
                  {data.safety.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                      <span className="text-red-500 mt-1">•</span> {s}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Lab Experiment */}
            {data.labExperiment && (
              <section id="lab" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔬</span> ল্যাব এক্সপেরিমেন্ট
                </h2>
                <p className="font-semibold text-primary-400 mb-5">{data.labExperiment.title}</p>

                {data.labExperiment.materials.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-slate-400 mb-2">প্রয়োজনীয় উপকরণ</p>
                    <ul className="space-y-1.5">
                      {data.labExperiment.materials.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-slate-500 mt-1">•</span> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.labExperiment.procedure.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-slate-400 mb-2">পরীক্ষার পদ্ধতি</p>
                    <ol className="space-y-2">
                      {data.labExperiment.procedure.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                          <span className="text-slate-300 pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {data.labExperiment.precautions.length > 0 && (
                  <div className="mb-5 bg-amber-900/20 border border-amber-700 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-amber-300 mb-2">সতর্কতা</p>
                    <ul className="space-y-1.5">
                      {data.labExperiment.precautions.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-300">
                          <span className="text-amber-500 mt-1">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.labExperiment.observation && (
                  <div>
                    <p className="text-sm font-semibold text-slate-400 mb-2">পর্যবেক্ষণ</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{data.labExperiment.observation}</p>
                  </div>
                )}
              </section>
            )}

            {/* Animation */}
            {data.animation && (
              <section id="animation" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎬</span> অ্যানিমেশন / ভিডিও
                </h2>
                <p className="font-semibold text-white mb-1">{data.animation.title}</p>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">{data.animation.description}</p>
                {data.animation.url && (
                  <a href={data.animation.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                    <PlayCircle className="w-4 h-4" /> ভিডিও দেখো
                  </a>
                )}
              </section>
            )}

            {/* Practice Problems */}
            {data.practiceProblems.length > 0 && (
              <section id="practice" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📝</span> অনুশীলন সমস্যা
                </h2>
                <PracticeProblemsSection problems={data.practiceProblems} />
              </section>
            )}

            {/* PDF Notes */}
            {data.pdfNotes.length > 0 && (
              <section id="pdf" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
                  <span className="text-2xl">📄</span> PDF নোট
                </h2>
                <div className="space-y-2">
                  {data.pdfNotes.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-slate-700 rounded-2xl hover:border-primary-600 hover:bg-primary-900/10 transition-all group">
                      <span className="flex items-center gap-3 text-sm font-medium text-slate-300 group-hover:text-primary-400">
                        <span className="text-xl">📄</span> {p.title}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary-400" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Notes */}
            <section id="notes" className="bg-amber-900/20 border border-amber-700 rounded-3xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-amber-300 mb-5 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" /> গুরুত্বপূর্ণ নোট
              </h2>
              <ul className="space-y-2">
                {data.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-300">
                    <span className="text-amber-500 mt-1">•</span> {note}
                  </li>
                ))}
              </ul>
            </section>

            {/* MCQ Quiz */}
            {data.mcqs.length > 0 && (
              <section id="quiz" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">❓</span> অনুশীলন MCQ
                </h2>
                <MCQSection mcqs={data.mcqs} />
              </section>
            )}

            {/* Related Topics */}
            {data.relatedTopics.length > 0 && (
              <section id="related" className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
                <h2 className="text-xl font-bold text-white mb-4">সম্পর্কিত টপিক</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.relatedTopics.map((rt, i) => (
                    <Link key={i} href={`/learn/${rt.categorySlug}/${rt.slug}`}
                      className="flex items-center justify-between p-4 border border-slate-700 rounded-2xl hover:border-primary-600 hover:bg-primary-900/10 transition-all group">
                      <span className="text-sm font-medium text-slate-300 group-hover:text-primary-400">{rt.title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar TOC — sticky on desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-slate-800 border border-slate-700 rounded-3xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">বিষয়বস্তু</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button key={s.id} onClick={() => scrollTo(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                      activeSection === s.id
                        ? "gradient-bg text-white font-medium"
                        : "text-slate-300 hover:bg-slate-700"
                    }`}>
                    {s.label}
                  </button>
                ))}
              </nav>

              <div className="mt-5 pt-5 border-t border-slate-700">
                <Link href={`/learn/${categorySlug}`}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors">
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
