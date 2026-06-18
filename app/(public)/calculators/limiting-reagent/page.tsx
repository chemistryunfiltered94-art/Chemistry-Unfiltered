"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FlaskConical, RotateCcw } from "lucide-react";

const reactions = [
  { name:"হেবার পদ্ধতি: N₂ + 3H₂ → 2NH₃", reagents:[{name:"N₂",coeff:1},{name:"H₂",coeff:3}], product:{name:"NH₃",coeff:2} },
  { name:"HCl + NaOH → NaCl + H₂O",         reagents:[{name:"HCl",coeff:1},{name:"NaOH",coeff:1}], product:{name:"NaCl",coeff:1} },
  { name:"H₂ + Cl₂ → 2HCl",                  reagents:[{name:"H₂",coeff:1},{name:"Cl₂",coeff:1}], product:{name:"HCl",coeff:2} },
  { name:"2H₂ + O₂ → 2H₂O",                  reagents:[{name:"H₂",coeff:2},{name:"O₂",coeff:1}], product:{name:"H₂O",coeff:2} },
];

export default function LimitingReagentPage() {
  const [rxnIdx, setRxnIdx]   = useState(0);
  const [moles,  setMoles]    = useState<Record<string,string>>({});
  const [result, setResult]   = useState<{limiting:string; excess:string; excessAmt:number; productMoles:number} | null>(null);
  const [steps,  setSteps]    = useState<string[]>([]);
  const [error,  setError]    = useState("");

  const rxn = reactions[rxnIdx];

  const reset = () => { setMoles({}); setResult(null); setSteps([]); setError(""); };
  const changeRxn = (i: number) => { setRxnIdx(i); reset(); };

  const calculate = () => {
    setError(""); setResult(null); setSteps([]);
    const vals = rxn.reagents.map(r => ({ ...r, moles: parseFloat(moles[r.name] || "") }));
    if (vals.some(v => isNaN(v.moles) || v.moles <= 0)) { setError("সব বিকারকের মোল সংখ্যা দাও।"); return; }

    // moles needed per mole of first reagent consumed
    const ratios = vals.map(v => v.moles / v.coeff);
    const limitingRatio = Math.min(...ratios);
    const limiting = vals[ratios.indexOf(limitingRatio)];
    const excess   = vals[ratios.indexOf(Math.max(...ratios))];
    const excessConsumed = limitingRatio * excess.coeff;
    const excessAmt      = excess.moles - excessConsumed;
    const productMoles   = limitingRatio * rxn.product.coeff;

    const newSteps: string[] = [
      `বিক্রিয়া: ${rxn.name}`,
      ...vals.map(v => `${v.name}: ${v.moles} mol ÷ সহগ ${v.coeff} = ${(v.moles/v.coeff).toFixed(4)} (অনুপাত)`),
      `সর্বনিম্ন অনুপাত = ${limitingRatio.toFixed(4)} → সীমাবদ্ধ বিকারক = ${limiting.name}`,
      `অতিরিক্ত ${excess.name} ব্যবহৃত = ${limitingRatio.toFixed(4)} × ${excess.coeff} = ${excessConsumed.toFixed(4)} mol`,
      `অতিরিক্ত ${excess.name} অবশিষ্ট = ${excess.moles} - ${excessConsumed.toFixed(4)} = ${excessAmt.toFixed(4)} mol`,
      `উৎপন্ন ${rxn.product.name} = ${limitingRatio.toFixed(4)} × ${rxn.product.coeff} = ${productMoles.toFixed(4)} mol`,
    ];
    setSteps(newSteps);
    setResult({ limiting: limiting.name, excess: excess.name, excessAmt, productMoles });
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Limiting Reagent Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">সীমাবদ্ধ বিকারক নির্ণয়</p>
            </div>
          </div>

          {/* Reaction selector */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">বিক্রিয়া বেছে নাও</label>
            <div className="space-y-2">
              {reactions.map((r, i) => (
                <button key={i} onClick={() => changeRxn(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${rxnIdx===i ? "gradient-bg text-white" : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-400"}`}>
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mole inputs */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {rxn.reagents.map(r => (
              <div key={r.name}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {r.name} এর মোল সংখ্যা (সহগ: {r.coeff})
                </label>
                <div className="flex gap-2">
                  <input type="number" step="any" min="0" value={moles[r.name]||""}
                    onChange={e => setMoles(p => ({...p, [r.name]:e.target.value}))}
                    placeholder="যেমন: 3"
                    className="flex-1 px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                  <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-500">mol</span>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5" /></button>
          </div>

          {result && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-2xl p-4 text-center">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">সীমাবদ্ধ বিকারক</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{result.limiting}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-2xl p-4 text-center">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">অতিরিক্ত বিকারক</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{result.excess}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">অবশিষ্ট: {result.excessAmt.toFixed(4)} mol</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-5 text-white text-center">
                <p className="text-sm opacity-90 mb-1">উৎপন্ন {rxn.product.name}</p>
                <p className="text-4xl font-bold">{result.productMoles.toFixed(4)}</p>
                <p className="text-sm opacity-80 mt-1">mol</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-3">ধাপে ধাপে সমাধান</p>
                <ol className="space-y-2">
                  {steps.map((s,i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                      <span className="text-slate-600 dark:text-slate-300">{s}</span>
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
