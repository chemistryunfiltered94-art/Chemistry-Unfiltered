"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Beaker, RotateCcw } from "lucide-react";

const acidTypes = [
  { name:"HCl (মনোপ্রোটিক)",  nFactor:1 },
  { name:"H₂SO₄ (ডাইপ্রোটিক)", nFactor:2 },
  { name:"H₃PO₄ (ট্রাইপ্রোটিক)",nFactor:3 },
  { name:"NaOH (মনোহাইড্রক্সিলিক)", nFactor:1 },
  { name:"Ca(OH)₂ (ডাইহাইড্রক্সিলিক)", nFactor:2 },
  { name:"কাস্টম n-factor",     nFactor:0 },
];

export default function NormalityPage() {
  const [mass,    setMass]    = useState("");
  const [mw,      setMw]      = useState("");
  const [vol,     setVol]     = useState("");
  const [unit,    setUnit]    = useState("mL");
  const [acidIdx, setAcidIdx] = useState(0);
  const [customN, setCustomN] = useState("1");
  const [result,  setResult]  = useState<{eq:number; normality:number}|null>(null);
  const [steps,   setSteps]   = useState<string[]>([]);
  const [error,   setError]   = useState("");

  const nFactor = acidTypes[acidIdx].nFactor || parseInt(customN)||1;

  const calculate = () => {
    setError(""); setResult(null); setSteps([]);
    const m = parseFloat(mass), w = parseFloat(mw), v = parseFloat(vol);
    if ([m,w,v].some(isNaN)||[m,w,v].some(x=>x<=0)) { setError("সব মান সঠিকভাবে দাও।"); return; }
    const vL = unit==="mL"?v/1000:unit==="μL"?v/1e6:v;
    const moles = m/w;
    const eq    = moles * nFactor;
    const norm  = eq / vL;
    setResult({ eq, normality: norm });
    setSteps([
      `ভর (m) = ${m} g, আণবিক ভর = ${w} g/mol`,
      `মোল (n) = ${m}/${w} = ${moles.toFixed(6)} mol`,
      `n-factor = ${nFactor} (${acidTypes[acidIdx].name})`,
      `Equivalents = n × n-factor = ${moles.toFixed(6)} × ${nFactor} = ${eq.toFixed(6)} eq`,
      `আয়তন = ${v} ${unit} = ${vL} L`,
      `Normality (N) = eq/V = ${eq.toFixed(6)}/${vL} = ${norm.toFixed(4)} N`,
    ]);
  };

  const reset = () => { setMass(""); setMw(""); setVol(""); setResult(null); setSteps([]); setError(""); };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4"/> সব ক্যালকুলেটর
        </Link>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Beaker className="w-6 h-6 text-white"/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Normality Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">নর্মালিটি হিসাব</p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-3 mb-5 text-center font-mono text-base font-bold text-purple-700 dark:text-purple-300">
            N = n × n-factor / V &nbsp;|&nbsp; n-factor = যোজনী/ইলেকট্রন
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">পদার্থের ধরন</label>
              <select value={acidIdx} onChange={e=>setAcidIdx(+e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500">
                {acidTypes.map((a,i) => <option key={i} value={i}>{a.name}</option>)}
              </select>
            </div>

            {acidTypes[acidIdx].nFactor === 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">কাস্টম n-factor</label>
                <input type="number" min="1" max="10" value={customN} onChange={e=>setCustomN(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {[
              { label:"ভর (g)", val:mass, set:setMass, ph:"যেমন: 4.9" },
              { label:"আণবিক ভর (g/mol)", val:mw, set:setMw, ph:"যেমন: 98 (H₂SO₄)" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                <input type="number" step="any" min="0" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">আয়তন</label>
              <div className="flex gap-2">
                <input type="number" step="any" min="0" value={vol} onChange={e=>setVol(e.target.value)} placeholder="যেমন: 500"
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
                <select value={unit} onChange={e=>setUnit(e.target.value)}
                  className="px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none">
                  <option>mL</option><option>L</option><option>μL</option>
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5"/></button>
          </div>

          {result && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-5 text-white text-center">
                  <div className="text-sm opacity-90 mb-1">Equivalents</div>
                  <div className="text-2xl font-bold">{result.eq.toFixed(6)}</div>
                  <div className="text-xs opacity-80">eq</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 text-white text-center">
                  <div className="text-sm opacity-90 mb-1">Normality (N)</div>
                  <div className="text-2xl font-bold">{result.normality.toFixed(4)}</div>
                  <div className="text-xs opacity-80">N (eq/L)</div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3">ধাপে ধাপে সমাধান</p>
                <ol className="space-y-2">
                  {steps.map((s,i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                      <span className="text-slate-600 dark:text-slate-300 font-mono">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
