"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FlaskConical, RotateCcw } from "lucide-react";

export default function MolarityCalculatorPage() {
  const [mass, setMass]   = useState("");
  const [mw,   setMw]     = useState("");
  const [vol,  setVol]    = useState("");
  const [unit, setUnit]   = useState("mL");
  const [result, setResult] = useState<{ moles: number; molarity: number } | null>(null);
  const [steps, setSteps]  = useState<string[]>([]);
  const [error, setError]  = useState("");

  const calculate = () => {
    setError(""); setResult(null); setSteps([]);
    const m = parseFloat(mass), w = parseFloat(mw), v = parseFloat(vol);
    if (isNaN(m) || isNaN(w) || isNaN(v) || m <= 0 || w <= 0 || v <= 0) {
      setError("সব মান সঠিকভাবে পূরণ করো (শূন্যের বেশি)"); return;
    }
    const vL = unit === "mL" ? v / 1000 : unit === "μL" ? v / 1e6 : v;
    const moles    = m / w;
    const molarity = moles / vL;
    setResult({ moles, molarity });
    setSteps([
      `ভর (m) = ${m} g`,
      `আণবিক ভর (M) = ${w} g/mol`,
      `আয়তন (V) = ${v} ${unit} = ${vL} L`,
      `মোল সংখ্যা (n) = m / M = ${m} / ${w} = ${moles.toFixed(6)} mol`,
      `মোলারিটি (M) = n / V = ${moles.toFixed(6)} / ${vL} = ${molarity.toFixed(4)} mol/L`,
    ]);
  };

  const reset = () => { setMass(""); setMw(""); setVol(""); setResult(null); setSteps([]); setError(""); };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Molarity Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">মোলারিটি হিসাব করো</p>
            </div>
          </div>

          {/* Formula */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6 text-center">
            <p className="text-blue-800 dark:text-blue-300 font-mono text-xl font-bold">M = n / V</p>
            <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">n = m / M_w</p>
          </div>

          {/* Inputs */}
          <div className="space-y-4 mb-4">
            {[
              { label: "দ্রবীভূত পদার্থের ভর (g)", val: mass, set: setMass, placeholder: "যেমন: 5.85" },
              { label: "আণবিক ভর (g/mol)", val: mw, set: setMw, placeholder: "যেমন: 58.44 (NaCl)" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                <input
                  type="number" value={f.val} onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder} step="any" min="0"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}

            {/* Volume with unit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">দ্রবণের আয়তন</label>
              <div className="flex gap-2">
                <input
                  type="number" value={vol} onChange={(e) => setVol(e.target.value)}
                  placeholder="যেমন: 500" step="any" min="0"
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <select
                  value={unit} onChange={(e) => setUnit(e.target.value)}
                  className="px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="mL">mL</option>
                  <option value="L">L</option>
                  <option value="μL">μL</option>
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">
              হিসাব করো
            </button>
            <button onClick={reset} className="px-4 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white text-center">
                  <div className="text-sm opacity-90 mb-1">মোল সংখ্যা (n)</div>
                  <div className="text-2xl font-bold">{result.moles.toFixed(6)}</div>
                  <div className="text-xs opacity-80">mol</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-5 text-white text-center">
                  <div className="text-sm opacity-90 mb-1">মোলারিটি (M)</div>
                  <div className="text-2xl font-bold">{result.molarity.toFixed(4)}</div>
                  <div className="text-xs opacity-80">mol/L</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">ধাপে ধাপে সমাধান</h3>
                <ol className="space-y-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">{step}</span>
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
