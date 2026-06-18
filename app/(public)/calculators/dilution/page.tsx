"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Droplets, RotateCcw } from "lucide-react";

export default function DilutionCalculatorPage() {
  const [c1, setC1] = useState(""); const [v1, setV1] = useState("");
  const [c2, setC2] = useState(""); const [v2, setV2] = useState("");
  const [solve, setSolve] = useState<"c1"|"v1"|"c2"|"v2">("v2");
  const [result, setResult] = useState<number|null>(null);
  const [steps, setSteps]   = useState<string[]>([]);
  const [error,  setError]  = useState("");

  const num = (v: string) => parseFloat(v);
  const reset = () => { setC1(""); setV1(""); setC2(""); setV2(""); setResult(null); setSteps([]); setError(""); };

  const calculate = () => {
    setError(""); setResult(null); setSteps([]);
    const vals = { c1: num(c1), v1: num(v1), c2: num(c2), v2: num(v2) };
    const defined = Object.entries(vals).filter(([k]) => k !== solve).map(([,v]) => v);
    if (defined.some(isNaN) || defined.some(v => v <= 0)) {
      setError("সব পরিচিত মান সঠিকভাবে দাও।"); return;
    }
    let res = 0;
    if (solve === "v2") { res = (vals.c1 * vals.v1) / vals.c2; setSteps([`C₁V₁ = C₂V₂`, `V₂ = C₁V₁/C₂`, `V₂ = ${vals.c1}×${vals.v1}/${vals.c2}`, `V₂ = ${res.toFixed(4)} L`]); }
    else if (solve === "c2") { res = (vals.c1 * vals.v1) / vals.v2; setSteps([`C₁V₁ = C₂V₂`, `C₂ = C₁V₁/V₂`, `C₂ = ${vals.c1}×${vals.v1}/${vals.v2}`, `C₂ = ${res.toFixed(4)} mol/L`]); }
    else if (solve === "c1") { res = (vals.c2 * vals.v2) / vals.v1; setSteps([`C₁V₁ = C₂V₂`, `C₁ = C₂V₂/V₁`, `C₁ = ${res.toFixed(4)} mol/L`]); }
    else { res = (vals.c2 * vals.v2) / vals.c1; setSteps([`C₁V₁ = C₂V₂`, `V₁ = C₂V₂/C₁`, `V₁ = ${res.toFixed(4)} L`]); }
    setResult(res);
  };

  const fields = [
    { key:"c1", label:"প্রারম্ভিক ঘনত্ব C₁", unit:"mol/L", val:c1, set:setC1 },
    { key:"v1", label:"প্রারম্ভিক আয়তন V₁",  unit:"L",     val:v1, set:setV1 },
    { key:"c2", label:"চূড়ান্ত ঘনত্ব C₂",    unit:"mol/L", val:c2, set:setC2 },
    { key:"v2", label:"চূড়ান্ত আয়তন V₂",     unit:"L",     val:v2, set:setV2 },
  ];
  const solveLabels: Record<string,string> = { c1:"C₁ বের করো", v1:"V₁ বের করো", c2:"C₂ বের করো", v2:"V₂ বের করো" };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dilution Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">তনুকরণ হিসাব</p>
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-3 mb-5 text-center font-mono text-xl font-bold text-rose-700 dark:text-rose-300">
            C₁V₁ = C₂V₂
          </div>

          {/* Solve for */}
          <div className="mb-5">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">কোনটি বের করবে?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(solveLabels).map(([k, lbl]) => (
                <button key={k} onClick={() => { setSolve(k as "c1"|"v1"|"c2"|"v2"); reset(); }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${solve===k ? "gradient-bg text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-400"}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {fields.filter(f => f.key !== solve).map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                <div className="flex gap-2">
                  <input type="number" step="any" min="0" value={f.val} onChange={e => f.set(e.target.value)}
                    placeholder="মান দাও"
                    className="flex-1 px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                  <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-500 font-medium">{f.unit}</span>
                </div>
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
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white text-center mb-4">
                <div className="text-sm opacity-90 mb-1">{solveLabels[solve]}</div>
                <div className="text-4xl font-bold">{result.toFixed(4)}</div>
                <div className="text-sm opacity-80 mt-1">{solve.startsWith("c") ? "mol/L" : "L"}</div>
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
