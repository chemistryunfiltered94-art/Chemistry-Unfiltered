"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Info, RotateCcw, CheckCircle2, XCircle, Shuffle } from "lucide-react";

type Salt = { id: string; name: string; shortName: string; ion: string; color: string; wavelength: string };

const salts: Salt[] = [
  { id: "li", name: "লিথিয়াম ক্লোরাইড (LiCl)", shortName: "লিথিয়াম", ion: "Li⁺", color: "#dc2626", wavelength: "≈ 671 nm — গাঢ় লাল" },
  { id: "na", name: "সোডিয়াম ক্লোরাইড (NaCl)", shortName: "সোডিয়াম", ion: "Na⁺", color: "#facc15", wavelength: "≈ 589 nm — উজ্জ্বল হলুদ" },
  { id: "k", name: "পটাশিয়াম ক্লোরাইড (KCl)", shortName: "পটাশিয়াম", ion: "K⁺", color: "#c084fc", wavelength: "≈ 400 nm — লাইলাক/বেগুনি" },
  { id: "ca", name: "ক্যালসিয়াম ক্লোরাইড (CaCl₂)", shortName: "ক্যালসিয়াম", ion: "Ca²⁺", color: "#f97316", wavelength: "≈ 620 nm — ইটরঙা লাল-কমলা" },
  { id: "sr", name: "স্ট্রনশিয়াম ক্লোরাইড (SrCl₂)", shortName: "স্ট্রনশিয়াম", ion: "Sr²⁺", color: "#ef4444", wavelength: "≈ 640–690 nm — উজ্জ্বল লাল" },
  { id: "ba", name: "বেরিয়াম ক্লোরাইড (BaCl₂)", shortName: "বেরিয়াম", ion: "Ba²⁺", color: "#84cc16", wavelength: "≈ 524 nm — আপেল-সবুজ" },
  { id: "cu", name: "কপার সালফেট (CuSO₄)", shortName: "কপার", ion: "Cu²⁺", color: "#22d3ee", wavelength: "≈ 500–540 nm — নীল-সবুজ" },
];

const DEFAULT_FLAME = "#3b82f6";

function FlameVisual({ color }: { color: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      animate={{ scaleY: [1, 1.06, 0.95, 1.02, 1], scaleX: [1, 0.96, 1.04, 0.98, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="64" height="96" viewBox="0 0 60 100">
        <motion.path
          d="M30 92 C12 78 8 55 20 33 C16 44 26 44 26 30 C26 14 35 4 35 4 C41 20 50 30 47 48 C56 58 53 80 30 92 Z"
          animate={{ fill: color }}
          transition={{ duration: 0.6 }}
        />
      </svg>
      <div className="w-20 h-3 bg-slate-600 rounded-sm" />
      <div className="w-10 h-10 bg-slate-700 rounded-b-md" />
    </motion.div>
  );
}

function buildOptions(correct: Salt): Salt[] {
  const others = salts.filter((s) => s.id !== correct.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...shuffled, correct].sort(() => Math.random() - 0.5);
}

export default function FlameTestLabPage() {
  const [mode, setMode] = useState<"explore" | "quiz">("explore");

  // Explore mode
  const [selected, setSelected] = useState(salts[1]); // সোডিয়াম
  const [tested, setTested] = useState(false);

  // Quiz mode
  const [question, setQuestion] = useState(salts[0]);
  const [options, setOptions] = useState<Salt[]>(() => buildOptions(salts[0]));
  const [picked, setPicked] = useState<Salt | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const nextQuestion = () => {
    const pool = salts.filter((s) => s.id !== question.id);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setQuestion(next);
    setOptions(buildOptions(next));
    setPicked(null);
  };

  const pickAnswer = (s: Salt) => {
    if (picked) return;
    setPicked(s);
    setScore((sc) => ({ correct: sc.correct + (s.id === question.id ? 1 : 0), total: sc.total + 1 }));
  };

  const switchMode = (m: "explore" | "quiz") => {
    setMode(m);
    if (m === "quiz") nextQuestion();
  };

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">শিখা পরীক্ষা ল্যাব</h1>
            <p className="text-white/80 text-sm">ধাতু আয়নের শিখার রঙ দিয়ে অজানা নমুনা চিহ্নিত করো</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => switchMode("explore")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === "explore" ? "bg-slate-700 text-orange-400 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"}`}
            >
              শিখো
            </button>
            <button
              onClick={() => switchMode("quiz")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === "quiz" ? "bg-slate-700 text-orange-400 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"}`}
            >
              কুইজ
            </button>
          </div>

          {mode === "explore" ? (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-slate-300 mb-2">ধাতব লবণ বাছাই করো</label>
                <select
                  value={selected.id}
                  onChange={(e) => { setSelected(salts.find((s) => s.id === e.target.value)!); setTested(false); }}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {salts.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[220px]">
                <FlameVisual color={tested ? selected.color : DEFAULT_FLAME} />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setTested(true)}
                  disabled={tested}
                  className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  শিখা পরীক্ষা করো 🔥
                </button>
                <button onClick={() => setTested(false)} className="px-5 py-3.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {tested && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-700 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">আয়ন</span>
                    <span className="font-mono text-white font-semibold">{selected.ion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">নিঃসরণ তরঙ্গদৈর্ঘ্য</span>
                    <span className="text-sm text-orange-300">{selected.wavelength}</span>
                  </div>
                </motion.div>
              )}

              {/* Reference chart */}
              <div className="bg-slate-700 rounded-2xl p-4">
                <p className="text-xs text-slate-400 mb-3">দ্রুত রেফারেন্স — সাধারণ ধাতু আয়নের শিখার রঙ</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {salts.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 bg-slate-800 rounded-lg px-2.5 py-2">
                      <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-xs text-slate-300">{s.shortName} ({s.ion})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">কীভাবে কাজ করে?</p>
                  <p>তাপে ইলেকট্রন নিচু শক্তিস্তর থেকে উচ্চ শক্তিস্তরে (উত্তেজিত অবস্থা) উঠে যায়। ইলেকট্রন আবার নিচে ফিরে আসার সময় নির্দিষ্ট পরিমাণ শক্তি নির্দিষ্ট তরঙ্গদৈর্ঘ্যের আলো হিসেবে নির্গত করে — প্রতিটি ধাতুর ইলেকট্রন বিন্যাস ভিন্ন হওয়ায় রঙও ভিন্ন হয়।</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">প্রশ্ন {score.total + (picked ? 0 : 1)}</span>
                <span className="text-sm text-orange-400 font-semibold">স্কোর: {score.correct}/{score.total}</span>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[220px]">
                <FlameVisual color={question.color} />
              </div>

              <p className="text-center text-slate-300 text-sm">এই শিখার রঙ কোন ধাতু আয়নের জন্য?</p>

              <div className="grid grid-cols-2 gap-3">
                {options.map((o) => {
                  const isCorrect = o.id === question.id;
                  const isPicked = picked?.id === o.id;
                  let style = "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600";
                  if (picked) {
                    if (isCorrect) style = "bg-green-900/40 border-green-600 text-green-300";
                    else if (isPicked) style = "bg-red-900/40 border-red-600 text-red-300";
                    else style = "bg-slate-700 border-slate-600 text-slate-500";
                  }
                  return (
                    <button
                      key={o.id}
                      onClick={() => pickAnswer(o)}
                      disabled={!!picked}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-medium transition-colors ${style}`}
                    >
                      {picked && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                      {picked && isPicked && !isCorrect && <XCircle className="w-4 h-4" />}
                      {o.shortName} ({o.ion})
                    </button>
                  );
                })}
              </div>

              {picked && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-700 rounded-2xl p-5 space-y-3">
                  <p className={`text-sm font-semibold ${picked.id === question.id ? "text-green-400" : "text-red-400"}`}>
                    {picked.id === question.id ? "✓ সঠিক!" : `✗ ভুল — সঠিক উত্তর ${question.shortName} (${question.ion})`}
                  </p>
                  <p className="text-xs text-slate-400">{question.wavelength}</p>
                  <button
                    onClick={nextQuestion}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Shuffle className="w-4 h-4" /> পরবর্তী প্রশ্ন
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
