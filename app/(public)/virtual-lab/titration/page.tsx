"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Plus } from "lucide-react";

const indicators = [
  { name:"ফেনলফথালিন",   range:[8.2,10.0], acidColor:"#f1f5f9", baseColor:"#f9a8d4" },
  { name:"মিথাইল অরেঞ্জ", range:[3.1,4.4],  acidColor:"#fca5a5", baseColor:"#fde68a" },
  { name:"লিটমাস",        range:[5.0,8.0],  acidColor:"#fca5a5", baseColor:"#93c5fd" },
  { name:"ব্রোমোথাইমল ব্লু",range:[6.0,7.6], acidColor:"#fde68a", baseColor:"#6ee7b7" },
];

const acids = [
  { name:"HCl (0.1 M)", conc:0.1, strong:true  },
  { name:"CH₃COOH (0.1 M)", conc:0.1, strong:false },
];

const bases = [
  { name:"NaOH (0.1 M)", conc:0.1, strong:true },
  { name:"NH₃ (0.1 M)",  conc:0.1, strong:false },
];

function calcPH(acidMoles: number, baseMoles: number, totalVol: number, acidStrong: boolean): number {
  const diff = acidMoles - baseMoles;
  const pKa = acidStrong ? -2 : 4.74;
  if (Math.abs(diff) < 1e-9) return 7.0;
  if (diff > 0) {
    const h = diff / totalVol;
    return Math.max(0, -Math.log10(h));
  } else {
    const oh = -diff / totalVol;
    const poh = Math.max(0, -Math.log10(oh));
    return Math.min(14, 14 - poh);
  }
}

function getIndicatorColor(ph: number, ind: typeof indicators[0]): string {
  if (ph < ind.range[0]) return ind.acidColor;
  if (ph > ind.range[1]) return ind.baseColor;
  const t = (ph - ind.range[0]) / (ind.range[1] - ind.range[0]);
  return `rgba(150,120,200,${0.3 + t * 0.5})`;
}

export default function TitrationLabPage() {
  const [acid,       setAcid]       = useState(acids[0]);
  const [base,       setBase]       = useState(bases[0]);
  const [indicator,  setIndicator]  = useState(indicators[0]);
  const [acidVol,    setAcidVol]    = useState(25); // mL in flask
  const [baseAdded,  setBaseAdded]  = useState(0);  // mL from burette
  const [history,    setHistory]    = useState<{vol:number; ph:number}[]>([]);

  const totalVol     = (acidVol + baseAdded) / 1000; // L
  const acidMoles    = acid.conc * acidVol / 1000;
  const baseMoles    = base.conc * baseAdded / 1000;
  const currentPH    = calcPH(acidMoles, baseMoles, totalVol, acid.strong);
  const flaskColor   = getIndicatorColor(currentPH, indicator);
  const equivalenceVol = (acid.conc * acidVol) / base.conc;

  const addBase = useCallback((ml: number) => {
    setBaseAdded(prev => {
      const newVol = Math.min(prev + ml, 60);
      const newPH  = calcPH(acidMoles, base.conc * newVol / 1000, (acidVol + newVol)/1000, acid.strong);
      setHistory(h => [...h.slice(-19), { vol: newVol, ph: newPH }]);
      return newVol;
    });
  }, [acidMoles, base.conc, acidVol, acid.strong]);

  const reset = () => { setBaseAdded(0); setHistory([]); };

  const phColor = currentPH < 4 ? "#ef4444" : currentPH < 7 ? "#f97316" : currentPH < 8 ? "#22c55e" : currentPH < 10 ? "#3b82f6" : "#8b5cf6";

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">টাইট্রেশন ল্যাব</h1>
            <p className="text-white/80 text-sm">Burette থেকে Base যোগ করে Equivalence Point খুঁজে বের করো</p>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Setup */}
            <div className="space-y-4">
              {/* Selections */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">অ্যাসিড (Flask)</label>
                  <select value={acid.name} onChange={e => { setAcid(acids.find(a=>a.name===e.target.value)!); reset(); }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                    {acids.map(a => <option key={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">ক্ষার (Burette)</label>
                  <select value={base.name} onChange={e => { setBase(bases.find(b=>b.name===e.target.value)!); reset(); }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                    {bases.map(b => <option key={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">ইন্ডিকেটর</label>
                <select value={indicator.name} onChange={e => setIndicator(indicators.find(i=>i.name===e.target.value)!)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                  {indicators.map(i => <option key={i.name}>{i.name}</option>)}
                </select>
              </div>

              {/* Visualization */}
              <div className="bg-slate-900 rounded-2xl p-6 flex items-end justify-center gap-10 min-h-[220px]">
                {/* Burette */}
                <div className="flex flex-col items-center">
                  <div className="relative w-8 h-32 bg-blue-900/40 border border-blue-600/50 rounded-t-sm overflow-hidden">
                    <motion.div className="absolute bottom-0 left-0 right-0 bg-blue-500/60"
                      animate={{ height: `${((60-baseAdded)/60)*100}%` }} transition={{ duration:0.3 }} />
                    <div className="absolute inset-0 flex items-start justify-center pt-1">
                      <span className="text-[8px] text-blue-300 font-mono">{(60-baseAdded).toFixed(1)} mL</span>
                    </div>
                  </div>
                  <div className="w-1 h-4 bg-blue-600" />
                  <span className="text-xs text-slate-400 mt-1">Burette</span>
                </div>

                {/* Flask */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <svg viewBox="0 0 80 90" className="w-20 h-24">
                      <path d="M25 5 L20 50 Q5 80 40 85 Q75 80 60 50 L55 5 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    </svg>
                    <motion.div className="absolute bottom-2 left-3 right-3 rounded-b-3xl"
                      style={{ backgroundColor: flaskColor, height:"55%" }}
                      animate={{ backgroundColor: flaskColor }} transition={{ duration:0.8 }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 mt-1">Flask ({acidVol} mL)</span>
                </div>
              </div>

              {/* Controls */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Base যোগ করো</p>
                <div className="flex gap-2">
                  {[0.5,1,5].map(ml => (
                    <button key={ml} onClick={() => addBase(ml)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">
                      <Plus className="w-4 h-4" />+{ml} mL
                    </button>
                  ))}
                  <button onClick={reset} className="px-4 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Data */}
            <div className="space-y-4">
              {/* Current pH */}
              <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: phColor + "33", border: `1px solid ${phColor}66` }}>
                <p className="text-slate-300 text-sm mb-1">বর্তমান pH</p>
                <p className="text-5xl font-bold" style={{ color: phColor }}>{currentPH.toFixed(2)}</p>
                <p className="text-slate-400 text-xs mt-1">{currentPH<7?"অম্লীয়":currentPH===7?"নিরপেক্ষ":"ক্ষারীয়"}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:"যোগ করা Base", value:`${baseAdded.toFixed(1)} mL` },
                  { label:"Equivalence Point", value:`${equivalenceVol.toFixed(1)} mL` },
                  { label:"অ্যাসিডের মোল", value:`${(acidMoles*1000).toFixed(2)} mmol` },
                  { label:"ক্ষারের মোল", value:`${(baseMoles*1000).toFixed(2)} mmol` },
                ].map(s => (
                  <div key={s.label} className="bg-slate-700 rounded-xl p-3">
                    <p className="text-xs text-slate-400">{s.label}</p>
                    <p className="font-bold text-white text-sm">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Equivalence check */}
              {Math.abs(baseAdded - equivalenceVol) < 0.6 && baseAdded > 0 && (
                <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  className="bg-green-900/40 border border-green-500 rounded-2xl p-4 text-center">
                  <p className="text-2xl mb-1">🎉</p>
                  <p className="text-green-400 font-bold">Equivalence Point পৌঁছে গেছো!</p>
                  <p className="text-green-300 text-sm">pH ≈ {currentPH.toFixed(2)} at {baseAdded.toFixed(1)} mL</p>
                </motion.div>
              )}

              {/* Titration curve */}
              {history.length > 1 && (
                <div className="bg-slate-700 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Titration Curve</p>
                  <svg viewBox={`0 0 200 80`} className="w-full">
                    <line x1="0" y1="70" x2="200" y2="70" stroke="#475569" strokeWidth="1"/>
                    <line x1="10" y1="0"  x2="10"  y2="75" stroke="#475569" strokeWidth="1"/>
                    <polyline
                      points={history.map((p,i) => `${10+i*(180/Math.max(history.length-1,1))},${70-p.ph*(60/14)}`).join(" ")}
                      fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <text x="15" y="10" fill="#94a3b8" fontSize="6">pH 14</text>
                    <text x="15" y="40" fill="#94a3b8" fontSize="6">pH 7</text>
                    <text x="15" y="68" fill="#94a3b8" fontSize="6">pH 0</text>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
