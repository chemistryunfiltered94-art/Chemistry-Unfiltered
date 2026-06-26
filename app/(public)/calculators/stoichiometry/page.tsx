"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FlaskConical, RotateCcw } from "lucide-react";

export default function StoichiometryPage() {
  const [givenMass, setGivenMass]     = useState("");
  const [givenMW,   setGivenMW]       = useState("");
  const [givenCoef, setGivenCoef]     = useState("1");
  const [targetCoef,setTargetCoef]    = useState("1");
  const [targetMW,  setTargetMW]      = useState("");
  const [result, setResult]           = useState<{ moles: number; targetMoles: number; targetMass: number } | null>(null);
  const [steps, setSteps]             = useState<string[]>([]);
  const [error, setError]             = useState("");

  const calculate = () => {
    setError(""); setResult(null); setSteps([]);
    const m  = parseFloat(givenMass);
    const mw = parseFloat(givenMW);
    const gc = parseFloat(givenCoef);
    const tc = parseFloat(targetCoef);
    const tw = parseFloat(targetMW);
    if ([m, mw, gc, tc, tw].some(v => isNaN(v) || v <= 0)) {
      setError("সব মান সঠিকভাবে পূরণ করো (শূন্যের বেশি)"); return;
    }
    const moles       = m / mw;
    const targetMoles = moles * (tc / gc);
    const targetMass  = targetMoles * tw;
    setResult({ moles, targetMoles, targetMass });
    setSteps([
      `প্রদত্ত ভর = ${m} g`,
      `প্রদত্ত পদার্থের আণবিক ভর = ${mw} g/mol`,
      `মোল সংখ্যা = ${m} / ${mw} = ${moles.toFixed(5)} mol`,
      `মোলার অনুপাত = ${tc} / ${gc}`,
      `লক্ষ্য পদার্থের মোল = ${moles.toFixed(5)} × (${tc}/${gc}) = ${targetMoles.toFixed(5)} mol`,
      `লক্ষ্য পদার্থের ভর = ${targetMoles.toFixed(5)} × ${tw} = ${targetMass.toFixed(4)} g`,
    ]);
  };

  const reset = () => {
    setGivenMass(""); setGivenMW(""); setGivenCoef("1");
    setTargetCoef("1"); setTargetMW(""); setResult(null); setSteps([]); setError("");
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stoichiometry Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">ভর থেকে ভর হিসাব করো</p>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 mb-6 text-center">
            <p className="text-indigo-800 dark:text-indigo-300 font-mono text-lg font-bold">aA + bB → cC + dD</p>
            <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-1">মোলার অনুপাত ব্যবহার করে লক্ষ্য পদার্থের ভর বের করো</p>
          </div>

          <div className="space-y-4 mb-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">প্রদত্ত পদার্থ (A)</p>
            {[
              { label: "ভর (g)", val: givenMass, set: setGivenMass, placeholder: "যেমন: 10" },
              { label: "আণবিক ভর (g/mol)", val: givenMW, set: setGivenMW, placeholder: "যেমন: 32" },
              { label: "সমীকরণে সহগ", val: givenCoef, set: setGivenCoef, placeholder: "যেমন: 2" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder} step="any" min="0"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" />
              </div>
            ))}

            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide pt-2">লক্ষ্য পদার্থ (B)</p>
            {[
              { label: "সমীকরণে সহগ", val: targetCoef, set: setTargetCoef, placeholder: "যেমন: 3" },
              { label: "আণবিক ভর (g/mol)", val: targetMW, set: setTargetMW, placeholder: "যেমন: 44" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder} step="any" min="0"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" />
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5" /></button>
          </div>

          {result && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "প্রদত্ত মোল", val: result.moles.toFixed(5), unit: "mol", color: "from-indigo-500 to-blue-600" },
                  { label: "লক্ষ্য মোল", val: result.targetMoles.toFixed(5), unit: "mol", color: "from-purple-500 to-violet-600" },
                  { label: "লক্ষ্য ভর", val: result.targetMass.toFixed(4), unit: "g", color: "from-emerald-500 to-teal-600" },
                ].map(r => (
                  <div key={r.label} className={`bg-gradient-to-br ${r.color} rounded-2xl p-4 text-white text-center`}>
                    <div className="text-xs opacity-90 mb-1">{r.label}</div>
                    <div className="text-xl font-bold">{r.val}</div>
                    <div className="text-xs opacity-80">{r.unit}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">ধাপে ধাপে সমাধান</h3>
                <ol className="space-y-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
