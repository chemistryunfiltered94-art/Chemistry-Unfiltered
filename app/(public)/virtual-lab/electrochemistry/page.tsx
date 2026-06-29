"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Info } from "lucide-react";

type Metal = { symbol: string; bn: string; E: number; n: number; color: string };

const metals: Metal[] = [
  { symbol: "Li", bn: "লিথিয়াম",       E: -3.04, n: 1, color: "#e2e8f0" },
  { symbol: "Mg", bn: "ম্যাগনেসিয়াম",   E: -2.37, n: 2, color: "#cbd5e1" },
  { symbol: "Al", bn: "অ্যালুমিনিয়াম",  E: -1.66, n: 3, color: "#d1d5db" },
  { symbol: "Zn", bn: "জিংক",           E: -0.76, n: 2, color: "#94a3b8" },
  { symbol: "Fe", bn: "আয়রন",           E: -0.44, n: 2, color: "#78716c" },
  { symbol: "Pb", bn: "লেড",            E: -0.13, n: 2, color: "#57534e" },
  { symbol: "Cu", bn: "কপার",           E:  0.34, n: 2, color: "#ea580c" },
  { symbol: "Ag", bn: "সিলভার",         E:  0.80, n: 1, color: "#d4d4d8" },
];

type Ion = { symbol: string; bn: string; n: number; M: number; color: string };

const ions: Ion[] = [
  { symbol: "Cu²⁺", bn: "কপার",           n: 2, M: 63.5,  color: "#ea580c" },
  { symbol: "Ag⁺",  bn: "সিলভার",         n: 1, M: 108.0, color: "#d4d4d8" },
  { symbol: "Zn²⁺", bn: "জিংক",           n: 2, M: 65.4,  color: "#94a3b8" },
  { symbol: "Al³⁺", bn: "অ্যালুমিনিয়াম",  n: 3, M: 27.0,  color: "#d1d5db" },
  { symbol: "Ni²⁺", bn: "নিকেল",          n: 2, M: 58.7,  color: "#a3a3a3" },
];

const FARADAY = 96500;

const supMap: Record<string, string> = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹" };
const toSup = (n: number) => n.toString().split("").map(d => supMap[d]).join("");
const chargeSup = (n: number) => (n === 1 ? "⁺" : `${toSup(n)}⁺`);
const eTerm = (n: number) => (n === 1 ? "e⁻" : `${n}e⁻`);

function ElectrodeRod({ color, label, scale, growing }: { color: string; label: string; scale: number; growing: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-6 h-24 bg-slate-700 rounded-t-sm overflow-hidden border border-slate-600">
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: color }}
          animate={{ height: `${scale * 100}%` }}
          transition={{ duration: 1.2 }}
        />
        {growing && [1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/50"
            style={{ width: 3, height: 3, left: `${30 + i * 20}%`, top: "85%" }}
            animate={{ y: [0, -75], opacity: [0.7, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
      <span className="text-xs text-slate-300 text-center whitespace-pre-line leading-tight">{label}</span>
    </div>
  );
}

export default function ElectrochemistryLabPage() {
  const [tab, setTab] = useState<"galvanic" | "electrolysis">("galvanic");

  // Galvanic cell state
  const [m1, setM1] = useState(metals[3]); // Zn
  const [m2, setM2] = useState(metals[6]); // Cu
  const [running, setRunning] = useState(false);

  const cathode = m1.E >= m2.E ? m1 : m2;
  const anode = m1.E >= m2.E ? m2 : m1;
  const emf = cathode.E - anode.E;
  const sameMetals = m1.symbol === m2.symbol;

  // Electrolysis state
  const [ion, setIon] = useState(ions[0]);
  const [current, setCurrent] = useState(2);
  const [minutes, setMinutes] = useState(10);
  const [depositing, setDepositing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const charge = current * minutes * 60; // Coulombs
  const molesE = charge / FARADAY;
  const molesMetal = molesE / ion.n;
  const massDeposited = molesMetal * ion.M;
  const visualScale = Math.min(massDeposited / 5, 1);

  const resetGalvanic = () => setRunning(false);

  const runElectrolysis = () => {
    setShowResult(false);
    setDepositing(true);
    setTimeout(() => {
      setDepositing(false);
      setShowResult(true);
    }, 1500);
  };
  const resetElectrolysis = () => { setShowResult(false); setDepositing(false); };

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">তড়িৎ রসায়ন ল্যাব</h1>
            <p className="text-white/80 text-sm">গ্যালভানিক কোষ ও ইলেকট্রোলাইসিস পরীক্ষা করো</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setTab("galvanic")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "galvanic" ? "bg-slate-700 text-orange-400 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"}`}
            >
              গ্যালভানিক কোষ
            </button>
            <button
              onClick={() => setTab("electrolysis")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "electrolysis" ? "bg-slate-700 text-orange-400 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"}`}
            >
              ইলেকট্রোলাইসিস
            </button>
          </div>

          {tab === "galvanic" ? (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">ইলেকট্রোড ১</label>
                  <select
                    value={m1.symbol}
                    onChange={(e) => { setM1(metals.find((m) => m.symbol === e.target.value)!); setRunning(false); }}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    {metals.map((m) => <option key={m.symbol} value={m.symbol}>{m.symbol} ({m.bn})</option>)}
                  </select>
                  <p className="text-xs text-slate-400 mt-1">E° = {m1.E.toFixed(2)} V</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">ইলেকট্রোড ২</label>
                  <select
                    value={m2.symbol}
                    onChange={(e) => { setM2(metals.find((m) => m.symbol === e.target.value)!); setRunning(false); }}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    {metals.map((m) => <option key={m.symbol} value={m.symbol}>{m.symbol} ({m.bn})</option>)}
                  </select>
                  <p className="text-xs text-slate-400 mt-1">E° = {m2.E.toFixed(2)} V</p>
                </div>
              </div>

              {sameMetals ? (
                <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-4 text-amber-300 text-sm">
                  একই ধাতু বাছাই করেছো — দুই ইলেকট্রোডের বিভব সমান, তাই কোষ কাজ করবে না (EMF = 0)।
                </div>
              ) : (
                <>
                  {/* Visualization */}
                  <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center gap-6 min-h-[200px]">
                    <ElectrodeRod color={anode.color} label={`${anode.symbol} (অ্যানোড)\nক্ষয় হচ্ছে`} scale={running ? 0.5 : 0.75} growing={false} />

                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs text-slate-400">e⁻</span>
                      <svg width="80" height="20">
                        <line x1="0" y1="10" x2="80" y2="10" stroke="#fbbf24" strokeWidth="2" strokeDasharray={running ? "4 4" : "0"} />
                        {running && (
                          <motion.circle r="3" fill="#fbbf24" cy="10" animate={{ cx: [0, 80] }} transition={{ duration: 1, repeat: Infinity }} />
                        )}
                      </svg>
                      <div className="bg-slate-700 rounded-lg px-3 py-1.5 text-center">
                        <p className="text-[10px] text-slate-400">ভোল্টমিটার</p>
                        <p className="text-orange-400 font-bold text-sm">{emf.toFixed(2)} V</p>
                      </div>
                    </div>

                    <ElectrodeRod color={cathode.color} label={`${cathode.symbol} (ক্যাথোড)\nজমা হচ্ছে`} scale={running ? 0.85 : 0.6} growing={running} />
                  </div>

                  {/* Half reactions */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-700 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1">অ্যানোড (জারণ — ইলেকট্রন ত্যাগ)</p>
                      <p className="font-mono text-orange-300 text-sm">{anode.symbol} → {anode.symbol}{chargeSup(anode.n)} + {eTerm(anode.n)}</p>
                    </div>
                    <div className="bg-slate-700 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1">ক্যাথোড (বিজারণ — ইলেকট্রন গ্রহণ)</p>
                      <p className="font-mono text-blue-300 text-sm">{cathode.symbol}{chargeSup(cathode.n)} + {eTerm(cathode.n)} → {cathode.symbol}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">E°cell = E°cathode − E°anode</p>
                      <p className="text-sm text-slate-300 font-mono">{cathode.E.toFixed(2)} − ({anode.E.toFixed(2)}) = {emf.toFixed(2)} V</p>
                    </div>
                    <p className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${emf > 0 ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}>
                      {emf > 0 ? "স্বতঃস্ফূর্ত" : "অ-স্বতঃস্ফূর্ত"}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setRunning(true)}
                      disabled={running}
                      className="flex-1 py-3.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {running ? "চলছে... ⚡" : "কোষ চালু করো ⚡"}
                    </button>
                    <button onClick={resetGalvanic} className="px-5 py-3.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}

              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">কীভাবে কাজ করে?</p>
                  <p>যে ধাতুর বিজারণ বিভব (E°) কম, সে ইলেকট্রন ত্যাগ করে অ্যানোডে জারিত হয় ও ক্ষয় হতে থাকে। ইলেকট্রন বাহ্যিক তার দিয়ে ক্যাথোডে গিয়ে উচ্চ E°-যুক্ত ধাতু আয়নকে বিজারিত করে, ফলে ক্যাথোডে ধাতু জমা হয়।</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">আয়ন বাছাই করো</label>
                  <select
                    value={ion.symbol}
                    onChange={(e) => { setIon(ions.find((i) => i.symbol === e.target.value)!); resetElectrolysis(); }}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    {ions.map((i) => <option key={i.symbol} value={i.symbol}>{i.symbol} ({i.bn})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">প্রবাহ (I): <span className="text-orange-400 font-bold">{current} A</span></label>
                  <input type="range" min="0.5" max="10" step="0.5" value={current}
                    onChange={(e) => { setCurrent(+e.target.value); resetElectrolysis(); }} className="w-full accent-orange-500 mt-2.5" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">সময় (t): <span className="text-orange-400 font-bold">{minutes} মিনিট</span></label>
                  <input type="range" min="1" max="60" step="1" value={minutes}
                    onChange={(e) => { setMinutes(+e.target.value); resetElectrolysis(); }} className="w-full accent-orange-500 mt-2.5" />
                </div>
              </div>

              {/* Visualization */}
              <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center gap-10 min-h-[200px]">
                <div className="relative flex flex-col items-center gap-2">
                  <div className="w-6 h-24 bg-slate-700 rounded-t-sm border border-slate-600" />
                  <span className="text-xs text-slate-400">অ্যানোড</span>
                  {depositing && [1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
                      style={{ left: `${20 + i * 18}%`, top: "70%" }}
                      animate={{ y: [0, -65], opacity: [0.8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                    />
                  ))}
                </div>
                <ElectrodeRod color={ion.color} label={`ক্যাথোড\n${ion.bn} জমা হচ্ছে`} scale={depositing || showResult ? visualScale : 0.05} growing={depositing} />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={runElectrolysis}
                  disabled={depositing}
                  className="flex-1 py-3.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {depositing ? "ইলেকট্রোলাইসিস চলছে..." : "ইলেকট্রোলাইসিস চালু করো ⚡"}
                </button>
                <button onClick={resetElectrolysis} className="px-5 py-3.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {showResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-700 rounded-2xl p-5 space-y-3">
                  <p className="text-slate-400 text-sm">ফ্যারাডের প্রথম সূত্র অনুযায়ী হিসাব:</p>
                  <p className="font-mono text-sm text-slate-300">m = (I × t × M) / (n × F)</p>
                  <p className="font-mono text-sm text-slate-300">= ({current} × {minutes * 60} × {ion.M}) / ({ion.n} × {FARADAY})</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                    <span className="text-slate-400 text-sm">জমা হওয়া ভর</span>
                    <span className="text-2xl font-bold text-orange-400">{massDeposited.toFixed(3)} g</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-800 rounded-lg p-2.5">
                      <p className="text-slate-500">চার্জ (Q)</p>
                      <p className="text-slate-200 font-semibold">{charge.toFixed(0)} C</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2.5">
                      <p className="text-slate-500">ইলেকট্রনের মোল</p>
                      <p className="text-slate-200 font-semibold">{molesE.toFixed(4)} mol</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">ফ্যারাডের সূত্র</p>
                  <p>প্রবাহিত চার্জের পরিমাণ যত বেশি, ক্যাথোডে তত বেশি ধাতু জমা হয়। ১ ফ্যারাডে (৯৬৫০০ C) ১ মোল ইলেকট্রন প্রবাহিত হয়।</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
