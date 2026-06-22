"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, RotateCcw, Trophy, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { MCQ } from "@/types";
import { getCategoryName } from "@/lib/constants";

// Internal question shape used throughout this component (kept as-is to
// minimize changes to the existing test-flow logic below).
type LocalQuestion = {
  id: string;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
  cat: string;
  diff: string;
};

function toLocalQuestions(mcqs: MCQ[]): LocalQuestion[] {
  return mcqs.map((m) => ({
    id: m.id,
    q: m.question,
    opts: m.options,
    ans: m.correctAnswer,
    exp: m.explanation,
    cat: getCategoryName(m.categoryId),
    diff: m.difficulty,
  }));
}

type Phase = "setup" | "test" | "result";

function formatTime(s: number) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
}

interface Props {
  mcqs: MCQ[];
}

export default function MockTestClient({ mcqs }: Props) {
  const allQuestions = toLocalQuestions(mcqs);
  const [phase,    setPhase]    = useState<Phase>("setup");
  const [count,    setCount]    = useState(10);
  const [timeLimit,setTimeLimit]= useState(true);
  const [minutes,  setMinutes]  = useState(15);
  const [questions,setQuestions]= useState<typeof allQuestions>([]);
  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState<Record<number,number>>({});
  const [flagged,  setFlagged]  = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted,setSubmitted]= useState(false);

  // Timer
  useEffect(() => {
    if (phase !== "test" || !timeLimit || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft, submitted, timeLimit]);

  const startTest = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(count, allQuestions.length));
    setQuestions(shuffled);
    setCurrent(0);
    setSelected({});
    setFlagged(new Set());
    setTimeLeft(minutes * 60);
    setSubmitted(false);
    setPhase("test");
  };

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setPhase("result");
  }, []);

  const toggleFlag = (idx: number) =>
    setFlagged(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });

  // Result calc
  const correct = questions.filter((q, i) => selected[i] === q.ans).length;
  const score   = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  // ── Setup Phase ──────────────────────────────────────────────────
  if (phase === "setup") return (
    <div className="section-padding">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mock Test</h1>
          <p className="text-slate-600 dark:text-slate-400">পরীক্ষার প্রস্তুতি নাও</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">প্রশ্নের সংখ্যা</label>
            <div className="flex gap-2">
              {[5,10,15,20].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${count===n ? "gradient-bg text-white shadow-lg" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"}`}>
                  {n}টি
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">সময়সীমা</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={timeLimit} onChange={e=>setTimeLimit(e.target.checked)}/>
                  <div className={`w-10 h-5 rounded-full transition-colors ${timeLimit?"gradient-bg":"bg-slate-300 dark:bg-slate-600"}`}/>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${timeLimit?"translate-x-5":"translate-x-0.5"}`}/>
                </div>
                <span className="text-xs text-slate-500">{timeLimit?"চালু":"বন্ধ"}</span>
              </label>
            </div>
            {timeLimit && (
              <div className="flex gap-2">
                {[10,15,20,30].map(m => (
                  <button key={m} onClick={() => setMinutes(m)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${minutes===m ? "gradient-bg text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"}`}>
                    {m} মি
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <p>📋 {count}টি MCQ প্রশ্ন</p>
            <p>⏱ {timeLimit ? `${minutes} মিনিট সময়` : "সময়সীমা নেই"}</p>
            <p>✅ প্রতিটি সঠিক উত্তরে ১ নম্বর</p>
          </div>

          {allQuestions.length === 0 ? (
            <p className="text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl py-3 px-4">
              এখনো কোনো প্রশ্ন যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে প্রশ্ন যোগ করো।
            </p>
          ) : (
            <button onClick={startTest} className="w-full py-3.5 gradient-bg text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-xl">
              পরীক্ষা শুরু করো →
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── Test Phase ───────────────────────────────────────────────────
  if (phase === "test") {
    const q = questions[current];
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-6 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {current+1} / {questions.length}
            </span>
            {timeLimit && (
              <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft<60?"text-red-500 animate-pulse":"text-slate-800 dark:text-white"}`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
            <button onClick={() => { if(confirm("পরীক্ষা জমা দিবে?")) handleSubmit(); }}
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
              জমা দাও
            </button>
          </div>

          {/* Progress */}
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-6">
            <div className="h-full gradient-bg rounded-full transition-all" style={{ width:`${((current+1)/questions.length)*100}%` }} />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 mb-4">
                <div className="flex items-start justify-between mb-5">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{q.cat} • {q.diff}</span>
                  <button onClick={() => toggleFlag(current)}
                    className={`${flagged.has(current) ? "text-yellow-500" : "text-slate-400 hover:text-yellow-400"} transition-colors`}>
                    <Flag className="w-5 h-5" fill={flagged.has(current)?"currentColor":"none"} />
                  </button>
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{q.q}</p>
                <div className="space-y-3">
                  {q.opts.map((opt, j) => (
                    <button key={j} onClick={() => setSelected(p => ({...p, [current]:j}))}
                      className={`w-full text-left px-5 py-3.5 rounded-2xl border-2 text-sm font-medium transition-all ${
                        selected[current]===j
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}>
                      <span className="font-bold mr-2">{["ক","খ","গ","ঘ"][j]}.</span>{opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button onClick={() => setCurrent(p => Math.max(0, p-1))} disabled={current===0}
                  className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <ChevronLeft className="w-4 h-4" /> আগের
                </button>

                {/* Question nav dots */}
                <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
                  {questions.map((_,i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        i===current ? "gradient-bg text-white" :
                        selected[i]!==undefined ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-400" :
                        flagged.has(i) ? "bg-yellow-500/20 text-yellow-600 border border-yellow-400" :
                        "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                      {i+1}
                    </button>
                  ))}
                </div>

                {current < questions.length-1 ? (
                  <button onClick={() => setCurrent(p => p+1)}
                    className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl hover:opacity-90">
                    পরের <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => { if(confirm("পরীক্ষা জমা দিবে?")) handleSubmit(); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600">
                    <CheckCircle className="w-4 h-4" /> জমা দাও
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ── Result Phase ─────────────────────────────────────────────────
  const gradeInfo =
    score>=90 ? { label:"অসাধারণ! 🏆", color:"from-yellow-400 to-amber-500"} :
    score>=70 ? { label:"চমৎকার! 🎉",   color:"from-green-500 to-emerald-600"} :
    score>=50 ? { label:"ভালো! 👍",      color:"from-blue-500 to-indigo-600"} :
               { label:"আরো চেষ্টা করো 💪",color:"from-red-500 to-rose-600"};

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        {/* Score Card */}
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
          className={`bg-gradient-to-br ${gradeInfo.color} rounded-3xl p-8 text-white text-center mb-6 shadow-2xl`}
        >
          <p className="text-xl font-semibold opacity-90 mb-2">{gradeInfo.label}</p>
          <div className="text-7xl font-black mb-2">{score}%</div>
          <p className="text-lg opacity-90">{correct} / {questions.length} সঠিক</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="bg-white/20 rounded-xl p-2"><div className="font-bold">{correct}</div><div className="opacity-80">সঠিক</div></div>
            <div className="bg-white/20 rounded-xl p-2"><div className="font-bold">{questions.length-correct}</div><div className="opacity-80">ভুল</div></div>
            <div className="bg-white/20 rounded-xl p-2"><div className="font-bold">{questions.length-Object.keys(selected).length}</div><div className="opacity-80">বাদ</div></div>
          </div>
        </motion.div>

        {/* Detailed Results */}
        <div className="space-y-4 mb-6">
          {questions.map((q, i) => {
            const isCorrect = selected[i] === q.ans;
            const isSkipped = selected[i] === undefined;
            return (
              <div key={q.id} className={`bg-white dark:bg-slate-800 border rounded-2xl overflow-hidden ${
                isCorrect ? "border-green-300 dark:border-green-700" :
                isSkipped ? "border-slate-200 dark:border-slate-700" :
                "border-red-300 dark:border-red-700"
              }`}>
                <div className={`px-5 py-3 flex items-center justify-between ${
                  isCorrect ? "bg-green-50 dark:bg-green-900/20" :
                  isSkipped ? "bg-slate-50 dark:bg-slate-700/30" :
                  "bg-red-50 dark:bg-red-900/20"
                }`}>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{i+1}. {q.q}</span>
                  {isCorrect ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> :
                   isSkipped ? <span className="text-xs text-slate-400">বাদ দেওয়া</span> :
                   <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                </div>
                <div className="px-5 py-3 space-y-1">
                  {q.opts.map((opt, j) => (
                    <div key={j} className={`text-sm px-3 py-1.5 rounded-lg ${
                      j===q.ans ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold" :
                      j===selected[i] && !isCorrect ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 line-through" :
                      "text-slate-600 dark:text-slate-400"
                    }`}>
                      {["ক","খ","গ","ঘ"][j]}. {opt}
                    </div>
                  ))}
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                    💡 {q.exp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setPhase("setup")}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-2xl font-semibold hover:opacity-90">
            <RotateCcw className="w-5 h-5" /> আবার দাও
          </button>
        </div>
      </div>
    </div>
  );
}
