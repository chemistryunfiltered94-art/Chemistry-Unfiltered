"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, TrendingUp, RotateCcw } from "lucide-react";

export default function PercentYieldPage() {
  const [actual,      setActual]      = useState("");
  const [theoretical, setTheoretical] = useState("");
  const [mode,        setMode]        = useState<"yield"|"actual"|"theoretical">("yield");
  const [result,      setResult]      = useState<number|null>(null);
  const [steps,       setSteps]       = useState<string[]>([]);
  const [error,       setError]       = useState("");

  const reset = () => { setActual(""); setTheoretical(""); setResult(null); setSteps([]); setError(""); };

  const calculate = () => {
    setError(""); setResult(null); setSteps([]);
    const a = parseFloat(actual), t = parseFloat(theoretical);

    if (mode === "yield") {
      if (isNaN(a)||isNaN(t)||a<=0||t<=0) { setError("উভয় মান দাও।"); return; }
      if (a > t) { setError("প্রকৃত ফলন তাত্ত্বিক ফলনের চেয়ে বেশি হতে পারে না।"); return; }
      const yield_ = (a/t)*100;
      setResult(yield_);
      setSteps([`% Yield = (প্রকৃত / তাত্ত্বিক) × 100`, `% Yield = (${a} / ${t}) × 100`, `% Yield = ${yield_.toFixed(2)}%`]);
    } else if (mode === "actual") {
      const y = parseFloat(actual); // repurpose as yield%
      if (isNaN(y)||isNaN(t)||y<=0||t<=0||y>100) { setError("শতকরা ফলন (০-১০০) ও তাত্ত্বিক ফলন দাও।"); return; }
      const act = (y/100)*t;
      setResult(act);
      setSteps([`প্রকৃত = (% Yield / 100) × তাত্ত্বিক`, `প্রকৃত = (${y}/100) × ${t}`, `প্রকৃত = ${act.toFixed(4)} g`]);
    } else {
      const y = parseFloat(actual);
      if (isNaN(y)||isNaN(a)||y<=0||a<=0||y>100) { setError("শতকরা ফলন ও প্রকৃত ফলন দাও।"); return; }
      const th = (a/y)*100;
      setResult(th);
      setSteps([`তাত্ত্বিক = প্রকৃত / (% Yield / 100)`, `তাত্ত্বিক = ${a} / (${y}/100)`, `তাত্ত্বিক = ${th.toFixed(4)} g`]);
    }
  };

  const getModeFields = () => {
    if (mode === "yield")        return [{ label:"প্রকৃত ফলন (g)",      val:actual,      set:setActual,      ph:"যেমন: 8.5" }, { label:"তাত্ত্বিক ফলন (g)", val:theoretical, set:setTheoretical, ph:"যেমন: 10" }];
    if (mode === "actual")       return [{ label:"শতকরা ফলন (%)",       val:actual,      set:setActual,      ph:"যেমন: 85" }, { label:"তাত্ত্বিক ফলন (g)", val:theoretical, set:setTheoretical, ph:"যেমন: 10" }];
    return                              [{ label:"শতকরা ফলন (%)",       val:actual,      set:setActual,      ph:"যেমন: 85" }, { label:"প্রকৃত ফলন (g)",    val:theoretical, set:setTheoretical, ph:"যেমন: 8.5" }];
  };

  const getResultLabel = () => mode === "yield" ? "শতকরা ফলন" : mode === "actual" ? "প্রকৃত ফলন" : "তাত্ত্বিক ফলন";
  const getResultUnit  = () => mode === "yield" ? "%" : "g";

  const getYieldColor = (y: number) =>
    y >= 90 ? "from-green-500 to-emerald-600" : y >= 70 ? "from-yellow-500 to-amber-600" : y >= 50 ? "from-orange-500 to-red-500" : "from-red-500 to-rose-600";

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Percent Yield Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">শতকরা ফলন হিসাব</p>
            </div>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-3 mb-5 text-center font-mono text-lg font-bold text-teal-700 dark:text-teal-300">
            % Yield = (প্রকৃত ফলন / তাত্ত্বিক ফলন) × 100
          </div>

          {/* Mode */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-5">
            {[["yield","% Yield বের করো"],["actual","প্রকৃত ফলন বের করো"],["theoretical","তাত্ত্বিক ফলন বের করো"]].map(([k,lbl]) => (
              <button key={k} onClick={() => { setMode(k as "yield"|"actual"|"theoretical"); reset(); }}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${mode===k ? "gradient-bg text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>
                {lbl}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-4">
            {getModeFields().map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                <input type="number" step="any" min="0" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5" /></button>
          </div>

          {result !== null && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <div className={`bg-gradient-to-br ${getYieldColor(mode==="yield"?result:0)} rounded-2xl p-5 text-white text-center mb-4`}>
                <p className="text-sm opacity-90 mb-1">{getResultLabel()}</p>
                <p className="text-5xl font-bold">{result.toFixed(2)}</p>
                <p className="text-sm opacity-80 mt-1">{getResultUnit()}</p>
                {mode === "yield" && (
                  <div className="mt-3 bg-white/20 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all" style={{ width:`${Math.min(result,100)}%` }} />
                  </div>
                )}
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-3">ধাপে ধাপে সমাধান</p>
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
