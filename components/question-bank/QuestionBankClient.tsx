"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Filter, CheckCircle, XCircle } from "lucide-react";
import { MCQ } from "@/types";
import { getCategoryName } from "@/lib/constants";

const exams = ["সব", "SSC", "HSC", "Admission", "BCS", "Job"];
const diffs = ["সব", "easy", "medium", "hard"];
const diffLabel: Record<string, string> = { easy: "সহজ", medium: "মাঝারি", hard: "কঠিন" };
const diffColor: Record<string, string> = {
  easy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  hard: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

function QuestionCard({ q, index }: { q: MCQ; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diffColor[q.difficulty]}`}>{diffLabel[q.difficulty]}</span>
        {q.exam?.map((ex) => (
          <span key={ex} className="text-xs px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium">{ex}</span>
        ))}
        <span className="text-xs text-slate-500">{getCategoryName(q.categoryId)}</span>
      </div>
      <p className="font-semibold text-slate-900 dark:text-white mb-4">প্রশ্ন {index + 1}: {q.question}</p>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => {
          let cls = "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300";
          if (selected !== null && showAnswer) {
            if (i === q.correctAnswer) cls = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold";
            else if (i === selected) cls = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
          } else if (selected === i) cls = "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400";
          return (
            <button key={i} onClick={() => { if (!showAnswer) setSelected(i); }}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${cls} ${!showAnswer ? "hover:border-primary-400 cursor-pointer" : "cursor-default"}`}>
              <span className="font-bold mr-2">{["ক", "খ", "গ", "ঘ"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium gradient-bg text-white rounded-xl hover:opacity-90">
          {showAnswer ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {showAnswer ? "লুকাও" : "উত্তর দেখো"}
        </button>
        {selected !== null && showAnswer && (
          <span className={`text-sm font-medium ${selected === q.correctAnswer ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {selected === q.correctAnswer ? "✓ সঠিক!" : "✗ ভুল"}
          </span>
        )}
      </div>
      <AnimatePresence>
        {showAnswer && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-400">
            💡 {q.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  questions: MCQ[];
}

export default function QuestionBankClient({ questions }: Props) {
  const [exam, setExam] = useState("সব");
  const [diff, setDiff] = useState("সব");

  const filtered = questions.filter(
    (q) =>
      (exam === "সব" || q.exam?.includes(exam)) &&
      (diff === "সব" || q.difficulty === diff)
  );

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
        <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-slate-400" /><span className="text-sm font-medium text-slate-600 dark:text-slate-300">ফিল্টার:</span></div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-slate-500 self-center">পরীক্ষা:</span>
          {exams.map((e) => (
            <button key={e} onClick={() => setExam(e)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${exam === e ? "gradient-bg text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"}`}>
              {e}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-slate-500 self-center">কঠিনতা:</span>
          {diffs.map((d) => (
            <button key={d} onClick={() => setDiff(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${diff === d ? "gradient-bg text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"}`}>
              {d === "সব" ? "সব" : diffLabel[d]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-slate-500 text-sm mb-6">{filtered.length}টি প্রশ্ন</p>

      <div className="space-y-4">
        {filtered.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>
            {questions.length === 0
              ? "এখনো কোনো প্রশ্ন যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে যোগ করো।"
              : "কোনো প্রশ্ন পাওয়া যায়নি।"}
          </p>
        </div>
      )}
    </>
  );
}
