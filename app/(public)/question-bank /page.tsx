"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HelpCircle, Filter, CheckCircle, XCircle, Trophy } from "lucide-react";

const questions = [
  { id:1,  question:"পানির pH কত?", options:["6","7","8","14"], answer:1, explanation:"পানি নিরপেক্ষ, তাই pH = 7।", difficulty:"easy", exam:"SSC", category:"ভৌত রসায়ন" },
  { id:2,  question:"কোনটি অ্যাসিডের ধর্ম নয়?", options:["লিটমাস কাগজ লাল করে","ক্ষারের সাথে বিক্রিয়া করে","স্বাদে টক","তিক্ত স্বাদ"], answer:3, explanation:"তিক্ত স্বাদ ক্ষারের ধর্ম।", difficulty:"easy", exam:"SSC", category:"ভৌত রসায়ন" },
  { id:3,  question:"CH₄ অণুতে বন্ধন কোন ধরনের?", options:["আয়নিক","সমযোজী","হাইড্রোজেন","ধাতব"], answer:1, explanation:"মিথেনে সমযোজী বন্ধন।", difficulty:"easy", exam:"HSC", category:"অজৈব রসায়ন" },
  { id:4,  question:"হেবার পদ্ধতিতে কোন গ্যাস উৎপাদিত হয়?", options:["অক্সিজেন","নাইট্রিক অ্যাসিড","অ্যামোনিয়া","HCl"], answer:2, explanation:"N₂+3H₂⇌2NH₃।", difficulty:"medium", exam:"HSC", category:"শিল্প রসায়ন" },
  { id:5,  question:"Avogadro সংখ্যার মান কত?", options:["6.022×10²²","6.022×10²³","3.011×10²³","6.022×10²⁴"], answer:1, explanation:"Nₐ = 6.022×10²³ mol⁻¹।", difficulty:"easy", exam:"SSC", category:"ভৌত রসায়ন" },
  { id:6,  question:"কোন বিজ্ঞানী পর্যায় সারণি আবিষ্কার করেন?", options:["Marie Curie","Dmitri Mendeleev","John Dalton","Robert Boyle"], answer:1, explanation:"Mendeleev ১৮৬৯ সালে।", difficulty:"easy", exam:"SSC", category:"অজৈব রসায়ন" },
  { id:7,  question:"বেঞ্জিনে কতটি π বন্ধন আছে?", options:["২","৩","৬","৯"], answer:1, explanation:"৩টি দ্বিবন্ধন → ৩টি π।", difficulty:"medium", exam:"HSC", category:"জৈব রসায়ন" },
  { id:8,  question:"pH 3 দ্রবণে [H⁺] কত?", options:["3 mol/L","0.003 mol/L","10⁻³ mol/L","3×10⁻³ mol/L"], answer:2, explanation:"[H⁺]=10^(-3)=10⁻³ mol/L।", difficulty:"medium", exam:"HSC", category:"ভৌত রসায়ন" },
  { id:9,  question:"STP তে 1 mol গ্যাসের আয়তন কত?", options:["11.2 L","22.4 L","44.8 L","24.0 L"], answer:1, explanation:"STP তে 22.4 L।", difficulty:"easy", exam:"SSC", category:"ভৌত রসায়ন" },
  { id:10, question:"নিরপেক্ষকরণে কী তৈরি হয়?", options:["শুধু লবণ","লবণ + পানি","শুধু পানি","অ্যাসিড+ক্ষার"], answer:1, explanation:"অ্যাসিড + ক্ষার → লবণ + পানি।", difficulty:"easy", exam:"SSC", category:"ভৌত রসায়ন" },
  { id:11, question:"ΔG < 0 হলে বিক্রিয়া কী?", options:["অস্বতঃস্ফূর্ত","স্বতঃস্ফূর্ত","সাম্যাবস্থায়","থামে"], answer:1, explanation:"ΔG<0 → স্বতঃস্ফূর্ত।", difficulty:"hard", exam:"BCS", category:"তাপগতিবিদ্যা" },
  { id:12, question:"কোনটি তেজস্ক্রিয় মৌল?", options:["সোনা","রূপা","ইউরেনিয়াম","তামা"], answer:2, explanation:"ইউরেনিয়াম তেজস্ক্রিয়।", difficulty:"medium", exam:"BCS", category:"অজৈব রসায়ন" },
];

const exams = ["সব","SSC","HSC","Admission","BCS","Job"];
const diffs = ["সব","easy","medium","hard"];
const diffLabel: Record<string,string> = { easy:"সহজ", medium:"মাঝারি", hard:"কঠিন" };
const diffColor: Record<string,string> = {
  easy:"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  medium:"bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  hard:"bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

function QuestionCard({ q }: { q: typeof questions[0] }) {
  const [selected, setSelected] = useState<number|null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diffColor[q.difficulty]}`}>{diffLabel[q.difficulty]}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium">{q.exam}</span>
        <span className="text-xs text-slate-500">{q.category}</span>
      </div>
      <p className="font-semibold text-slate-900 dark:text-white mb-4">প্রশ্ন {q.id}: {q.question}</p>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => {
          let cls = "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300";
          if (selected !== null && showAnswer) {
            if (i === q.answer) cls = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold";
            else if (i === selected) cls = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
          } else if (selected === i) cls = "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400";
          return (
            <button key={i} onClick={() => { if (!showAnswer) setSelected(i); }}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${cls} ${!showAnswer?"hover:border-primary-400 cursor-pointer":"cursor-default"}`}>
              <span className="font-bold mr-2">{["ক","খ","গ","ঘ"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium gradient-bg text-white rounded-xl hover:opacity-90">
          {showAnswer ? <XCircle className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
          {showAnswer ? "লুকাও" : "উত্তর দেখো"}
        </button>
        {selected !== null && showAnswer && (
          <span className={`text-sm font-medium ${selected===q.answer?"text-green-600 dark:text-green-400":"text-red-600 dark:text-red-400"}`}>
            {selected===q.answer?"✓ সঠিক!":"✗ ভুল"}
          </span>
        )}
      </div>
      <AnimatePresence>
        {showAnswer && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-400">
            💡 {q.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuestionBankPage() {
  const [exam, setExam] = useState("সব");
  const [diff, setDiff] = useState("সব");
  const filtered = questions.filter(q => (exam==="সব"||q.exam===exam) && (diff==="সব"||q.difficulty===diff));
  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4"/> প্রশ্নব্যাংক
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Question Bank</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">SSC থেকে BCS — সব পরীক্ষার রসায়ন প্রশ্ন এবং ব্যাখ্যা</p>
          <Link href="/question-bank/mock-test"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-semibold hover:opacity-90 shadow-lg">
            <Trophy className="w-5 h-5"/> Mock Test দাও
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
          <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-slate-400"/><span className="text-sm font-medium text-slate-600 dark:text-slate-300">ফিল্টার:</span></div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-500 self-center">পরীক্ষা:</span>
            {exams.map(e => (
              <button key={e} onClick={() => setExam(e)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${exam===e?"gradient-bg text-white":"border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"}`}>
                {e}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-500 self-center">কঠিনতা:</span>
            {diffs.map(d => (
              <button key={d} onClick={() => setDiff(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${diff===d?"gradient-bg text-white":"border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"}`}>
                {d==="সব"?"সব":diffLabel[d]}
              </button>
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-sm mb-6">{filtered.length}টি প্রশ্ন</p>
        <div className="space-y-4">{filtered.map(q => <QuestionCard key={q.id} q={q}/>)}</div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-30"/>
            <p>কোনো প্রশ্ন নেই</p>
          </div>
        )}
      </div>
    </div>
  );
}
