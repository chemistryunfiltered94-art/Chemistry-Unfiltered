"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

const R = 8.314; // J/mol·K
const EA_NO_CATALYST = 75000; // J/mol — H₂O₂ বিয়োজনের সক্রিয়ণ শক্তি (অনুঘটক ছাড়া)
const EA_CATALYST = 58000;    // J/mol — MnO₂ অনুঘটক উপস্থিতিতে
const BASE_T = 298;  // K (25°C)
const BASE_CONC = 1; // M
const BASE_EA = EA_NO_CATALYST;
const DEMO_K = 0.004; // আপেক্ষিক তুলনার জন্য বেসলাইন হার ধ্রুবক (/s)

function formatRate(r: number): string {
  if (r < 10) return r.toFixed(2);
  if (r < 1000) return r.toFixed(0);
  return r.toExponential(1);
}

function fmtTime(s: number): string {
  if (s < 1) return `${(s * 1000).toFixed(0)} মিলিসেকেন্ড`;
  if (s < 120) return `${s.toFixed(1)} সেকেন্ড`;
  return `${(s / 60).toFixed(1)} মিনিট`;
}

export default function ReactionRateLabPage() {
  const [tempC, setTempC] = useState(25);
  const [conc, setConc] = useState(1.0);
  const [catalyst, setCatalyst] = useState(false);

  const tempK = tempC + 273;
  const ea = catalyst ? EA_CATALYST : EA_NO_CATALYST;
  const relativeRate = (conc / BASE_CONC) * Math.exp(-(ea / (R * tempK)) + BASE_EA / (R * BASE_T));
  const kDisplay = DEMO_K * relativeRate;
  const halfLifeSec = Math.log(2) / kDisplay;

  const totalTime = Math.min(halfLifeSec * 5, 1200);
  const points = Array.from({ length: 30 }, (_, i) => {
    const t = (i / 29) * totalTime;
    const c = conc * Math.exp(-kDisplay * t);
    return { t, c };
  });

  const bubbleCount = Math.min(Math.max(Math.round(relativeRate * 2), 1), 14);
  const bubbleSpeed = Math.min(Math.max(1.6 / Math.max(relativeRate, 0.05), 0.3), 2.5);

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">বিক্রিয়ার হার ল্যাব</h1>
            <p className="text-white/80 text-sm">2H₂O₂ → 2H₂O + O₂ বিক্রিয়ায় তাপ, ঘনত্ব ও অনুঘটকের প্রভাব দেখো</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-slate-300">তাপমাত্রা</label>
                  <span className="text-rose-400 font-bold text-sm">{tempC}°C</span>
                </div>
                <input type="range" min="10" max="80" value={tempC} onChange={(e) => setTempC(+e.target.value)} className="w-full accent-rose-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-slate-300">H₂O₂ ঘনত্ব</label>
                  <span className="text-rose-400 font-bold text-sm">{conc.toFixed(1)} M</span>
                </div>
                <input type="range" min="0.2" max="2" step="0.1" value={conc} onChange={(e) => setConc(+e.target.value)} className="w-full accent-rose-500" />
              </div>
              <button
                onClick={() => setCatalyst((c) => !c)}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors border ${catalyst ? "bg-rose-600 border-rose-500 text-white" : "bg-slate-700 border-slate-600 text-slate-300"}`}
              >
                MnO₂ অনুঘটক {catalyst ? "যুক্ত আছে ✓" : "যুক্ত করো"}
              </button>
            </div>

            {/* Visualization */}
            <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[180px]">
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-24 border-2 border-slate-600 rounded-b-2xl rounded-t-sm overflow-hidden bg-blue-500/10">
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-400/30" style={{ height: "60%" }} />
                  {catalyst && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-500/80 rounded-full" />}
                  {Array.from({ length: bubbleCount }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                      style={{ left: `${15 + (i % 7) * 10}%`, bottom: "20%" }}
                      animate={{ y: [0, -70], opacity: [0.8, 0] }}
                      transition={{ duration: bubbleSpeed, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400 mt-2">O₂ গ্যাস নির্গমন হার দেখো</span>
              </div>
            </div>

            {/* Result Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">আপেক্ষিক হার</p>
                <p className="text-xl font-bold text-rose-400">{formatRate(relativeRate)}×</p>
              </div>
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">অর্ধজীবন (t½)</p>
                <p className="text-xl font-bold text-pink-400">{fmtTime(halfLifeSec)}</p>
              </div>
            </div>

            {/* Comparison bar */}
            <div className="bg-slate-700 rounded-2xl p-4">
              <p className="text-xs text-slate-400 mb-3">তুলনা: বেসলাইন (২৫°C, ১M, অনুঘটক ছাড়া) বনাম তোমার সেটিং</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-20">বেসলাইন</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full" style={{ width: "8%" }} />
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">1×</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-20">তোমার সেটিং</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                      animate={{ width: `${Math.min(relativeRate * 8, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs text-rose-300 w-12 text-right font-semibold">{formatRate(relativeRate)}×</span>
                </div>
              </div>
            </div>

            {/* Decay Curve */}
            <div className="bg-slate-700 rounded-2xl p-4">
              <p className="text-xs text-slate-400 mb-2">[H₂O₂] বনাম সময় (ক্ষয় রেখা)</p>
              <svg viewBox="0 0 200 80" className="w-full">
                <line x1="0" y1="70" x2="200" y2="70" stroke="#475569" strokeWidth="1" />
                <line x1="10" y1="0" x2="10" y2="75" stroke="#475569" strokeWidth="1" />
                <polyline
                  points={points.map((p) => `${10 + (p.t / totalTime) * 185},${70 - (p.c / Math.max(conc, 0.01)) * 60}`).join(" ")}
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text x="14" y="8" fill="#94a3b8" fontSize="6">[H₂O₂]₀</text>
                <text x="150" y="68" fill="#94a3b8" fontSize="6">t={fmtTime(totalTime)}</text>
              </svg>
            </div>

            {/* Arrhenius formula */}
            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-sm text-slate-300 font-medium mb-1">আরহেনিয়াস সমীকরণ: k = A·e^(−Eₐ/RT)</p>
              <p className="text-slate-400 text-xs font-mono">Eₐ = {(ea / 1000).toFixed(0)} kJ/mol, T = {tempK} K</p>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">কীভাবে কাজ করে?</p>
                <p>তাপমাত্রা বাড়লে কণার গতিশক্তি বাড়ে, ফলে কার্যকর সংঘর্ষ বেশি হয়। অনুঘটক (MnO₂) সক্রিয়ণ শক্তি (Eₐ) কমিয়ে বিক্রিয়া দ্রুত করে, নিজে অপরিবর্তিত থাকে। আরহেনিয়াস সমীকরণে Eₐ এক্সপোনেন্টে থাকায় সামান্য কমলেও হার বহুগুণ বেড়ে যেতে পারে।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
