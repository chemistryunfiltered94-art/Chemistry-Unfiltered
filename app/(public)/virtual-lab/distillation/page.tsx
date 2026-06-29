"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Info } from "lucide-react";

type Pair = { id: string; name: string; lowName: string; lowBp: number; lowColor: string; highName: string; highBp: number; highColor: string };

const pairs: Pair[] = [
  { id: "ethanol",  name: "ইথানল + পানি",     lowName: "ইথানল",     lowBp: 78, lowColor: "#38bdf8", highName: "পানি", highBp: 100, highColor: "#1d4ed8" },
  { id: "methanol", name: "মিথানল + পানি",    lowName: "মিথানল",    lowBp: 65, lowColor: "#34d399", highName: "পানি", highBp: 100, highColor: "#1d4ed8" },
  { id: "acetone",  name: "অ্যাসিটোন + পানি", lowName: "অ্যাসিটোন", lowBp: 56, lowColor: "#fbbf24", highName: "পানি", highBp: 100, highColor: "#1d4ed8" },
];

type Mode = "simple" | "fractional";

function blendColor(hex1: string, hex2: string, t: number): string {
  const c1 = parseInt(hex1.slice(1), 16);
  const c2 = parseInt(hex2.slice(1), 16);
  const r = Math.round(((c1 >> 16) & 255) * t + ((c2 >> 16) & 255) * (1 - t));
  const g = Math.round(((c1 >> 8) & 255) * t + ((c2 >> 8) & 255) * (1 - t));
  const b = Math.round((c1 & 255) * t + (c2 & 255) * (1 - t));
  return `rgb(${r},${g},${b})`;
}

export default function DistillationLabPage() {
  const [pair, setPair] = useState(pairs[0]);
  const [mode, setMode] = useState<Mode>("simple");
  const [temp, setTemp] = useState(pairs[0].lowBp);

  const lowBp = pair.lowBp;
  const highBp = pair.highBp;
  const range = highBp - lowBp;
  const mid = (lowBp + highBp) / 2;

  const fractionLow = (t: number, m: Mode): number => {
    if (m === "simple") {
      const v = 1 - (t - lowBp) / range;
      return Math.min(Math.max(v, 0), 1) * 100;
    }
    const steepness = 12 / range;
    return 100 / (1 + Math.exp(steepness * (t - mid)));
  };

  const currentFractionLow = fractionLow(temp, mode);
  const isBoiling = Math.abs(temp - lowBp) < 2 || Math.abs(temp - highBp) < 2;

  const curvePoints = (m: Mode) =>
    Array.from({ length: 25 }, (_, i) => {
      const t = lowBp - 3 + (i / 24) * (range + 6);
      return { t, f: fractionLow(t, m) };
    });
  const simplePts = curvePoints("simple");
  const fracPts = curvePoints("fractional");

  const toSvg = (pts: { t: number; f: number }[]) =>
    pts
      .map((p) => {
        const x = 10 + ((p.t - (lowBp - 3)) / (range + 6)) * 185;
        const y = 70 - (p.f / 100) * 60;
        return `${x},${y}`;
      })
      .join(" ");

  const markerX = 10 + ((temp - (lowBp - 3)) / (range + 6)) * 185;
  const markerY = 70 - (currentFractionLow / 100) * 60;

  const selectPair = (id: string) => {
    const p = pairs.find((x) => x.id === id)!;
    setPair(p);
    setTemp(p.lowBp);
  };
  const reset = () => setTemp(pair.lowBp);

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">পাতন ল্যাব</h1>
            <p className="text-white/80 text-sm">স্ফুটনাঙ্কের পার্থক্য ব্যবহার করে মিশ্রণ পৃথক করো</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Selections */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">মিশ্রণ বাছাই করো</label>
                <select
                  value={pair.id}
                  onChange={(e) => selectPair(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                >
                  {pairs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">{pair.lowName}: {pair.lowBp}°C, {pair.highName}: {pair.highBp}°C</p>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">পাতনের ধরন</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-600">
                  <button
                    onClick={() => setMode("simple")}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${mode === "simple" ? "bg-teal-600 text-white" : "text-slate-400 hover:bg-slate-700"}`}
                  >
                    সরল
                  </button>
                  <button
                    onClick={() => setMode("fractional")}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${mode === "fractional" ? "bg-teal-600 text-white" : "text-slate-400 hover:bg-slate-700"}`}
                  >
                    ভগ্নাংশ
                  </button>
                </div>
              </div>
            </div>

            {/* Visualization */}
            <div className="bg-slate-900 rounded-2xl p-6 flex items-end justify-center gap-6 min-h-[220px]">
              {/* Distillation flask */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-20">
                  <svg viewBox="0 0 64 80" className="absolute inset-0 w-full h-full">
                    <path d="M22 4 L20 35 Q5 60 32 75 Q59 60 44 35 L42 4 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  </svg>
                  <div
                    className="absolute bottom-2 left-3 right-3 rounded-b-2xl"
                    style={{ backgroundColor: blendColor(pair.lowColor, pair.highColor, 0.5), height: "45%", opacity: 0.7 }}
                  />
                  {isBoiling && [1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white/50"
                      style={{ width: 3 + i, height: 3 + i, left: `${28 + i * 8}%`, bottom: "30%" }}
                      animate={{ y: [-5, -30], opacity: [0.8, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400 mt-2">ফ্লাস্ক</span>
              </div>

              {/* Thermometer + condenser */}
              <div className="flex flex-col items-center gap-1">
                <div className="bg-slate-700 rounded-lg px-3 py-2 text-center">
                  <p className="text-[10px] text-slate-400">তাপমাত্রা</p>
                  <p className="text-orange-400 font-bold">{temp}°C</p>
                </div>
                <svg width="40" height="60" className="my-1">
                  <line x1="20" y1="5" x2="20" y2="50" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                  <line x1="20" y1="50" x2="35" y2="55" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 2" />
                </svg>
                <span className="text-xs text-slate-400">কনডেন্সার</span>
              </div>

              {/* Receiving flask */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-16">
                  <svg viewBox="0 0 56 64" className="absolute inset-0 w-full h-full">
                    <path d="M18 4 L16 30 Q4 50 28 60 Q52 50 40 30 L38 4 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  </svg>
                  <motion.div
                    className="absolute bottom-2 left-2 right-2 rounded-b-xl"
                    style={{ height: "40%" }}
                    animate={{ backgroundColor: blendColor(pair.lowColor, pair.highColor, currentFractionLow / 100) }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="text-xs text-slate-400 mt-2">গ্রহণ ফ্লাস্ক</span>
              </div>
            </div>

            {/* Composition readout */}
            <div className="bg-slate-700 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">পাতনের গঠন (এই তাপমাত্রায়)</p>
                <p className="text-sm text-white font-semibold">
                  {currentFractionLow.toFixed(0)}% {pair.lowName} + {(100 - currentFractionLow).toFixed(0)}% {pair.highName}
                </p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${currentFractionLow > 90 || currentFractionLow < 10 ? "bg-green-900/40 text-green-400" : "bg-amber-900/40 text-amber-400"}`}>
                {currentFractionLow > 90 ? `বিশুদ্ধ ${pair.lowName}` : currentFractionLow < 10 ? `বিশুদ্ধ ${pair.highName}` : "মিশ্র ভগ্নাংশ"}
              </span>
            </div>

            {/* Temperature slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-slate-300">উত্তাপ নিয়ন্ত্রণ করো</label>
                <span className="text-teal-400 font-bold text-sm">{temp}°C</span>
              </div>
              <input
                type="range"
                min={lowBp - 5}
                max={highBp + 5}
                step="1"
                value={temp}
                onChange={(e) => setTemp(+e.target.value)}
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{lowBp - 5}°C</span>
                <span>{highBp + 5}°C</span>
              </div>
            </div>

            {/* Comparison curve */}
            <div className="bg-slate-700 rounded-2xl p-4">
              <p className="text-xs text-slate-400 mb-2">পাতনের গঠন বনাম তাপমাত্রা — সরল (ড্যাশ) বনাম ভগ্নাংশ (কঠিন)</p>
              <svg viewBox="0 0 200 80" className="w-full">
                <line x1="0" y1="70" x2="200" y2="70" stroke="#475569" strokeWidth="1" />
                <line x1="10" y1="0" x2="10" y2="75" stroke="#475569" strokeWidth="1" />
                <polyline points={toSvg(simplePts)} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
                <polyline points={toSvg(fracPts)} fill="none" stroke="#2dd4bf" strokeWidth="2" />
                <circle cx={markerX} cy={markerY} r="3.5" fill="#fbbf24" />
                <text x="14" y="8" fill="#94a3b8" fontSize="6">100% {pair.lowName}</text>
                <text x="130" y="68" fill="#94a3b8" fontSize="6">100% {pair.highName}</text>
              </svg>
            </div>

            <button onClick={reset} className="w-full flex items-center justify-center gap-2 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors text-sm">
              <RotateCcw className="w-4 h-4" /> রিসেট করো
            </button>

            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">সরল বনাম ভগ্নাংশ পাতন</p>
                <p>সরল পাতনে একবারই বাষ্পীভবন-ঘনীভবন হয়, ফলে মাঝামাঝি তাপমাত্রায় দুই উপাদান বেশি মিশে যায়। ভগ্নাংশ পাতন কলামে বহুবার এই চক্র ঘটে, তাই বিভাজন অনেক বেশি তীক্ষ্ণ ও বিশুদ্ধ হয়।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
