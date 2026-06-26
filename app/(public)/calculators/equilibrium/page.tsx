"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Scale } from "lucide-react";

type Mode = "kc" | "kp" | "qc";

export default function EquilibriumPage() {
  const [mode, setMode]             = useState<Mode>("kc");
  const [prodConc, setProdConc]     = useState([{ conc: "", coef: "1" }, { conc: "", coef: "1" }]);
  const [reactConc, setReactConc]   = useState([{ conc: "", coef: "1" }, { conc: "", coef: "1" }]);
  const [temp, setTemp]             = useState("");
  const [deltaN, setDeltaN]         = useState("");
  const [result, setResult]         = useState<{ K: number; Kp?: number; steps: string[] } | null>(null);
  const [error, setError]           = useState("");

  const updateItem = (
    arr: { conc: string; coef: string }[],
    setter: React.Dispatch<React.SetStateAction<{ conc: string; coef: string }[]>>,
    idx: number, key: "conc" | "coef", val: string
  ) => setter(arr.map((item, i) => i === idx ? { ...item, [key]: val } : item));

  const calculate = () => {
    setError(""); setResult(null);
    try {
      const prodVal = prodConc.reduce((acc, p) => {
        const c = parseFloat(p.conc), n = parseFloat(p.coef);
        if (isNaN(c) || isNaN(n) || c <= 0 || n <= 0) throw new Error("products");
        return acc * Math.pow(c, n);
      }, 1);
      const reactVal = reactConc.reduce((acc, r) => {
        const c = parseFloat(r.conc), n = parseFloat(r.coef);
        if (isNaN(c) || isNaN(n) || c <= 0 || n <= 0) throw new Error("reactants");
        return acc * Math.pow(c, n);
      }, 1);
      const K = prodVal / reactVal;
      const steps = [
        `উৎপাদ: ${prodConc.map(p => `[${p.conc}]^${p.coef}`).join(" × ")} = ${prodVal.toExponential(4)}`,
        `বিক্রিয়ক: ${reactConc.map(r => `[${r.conc}]^${r.coef}`).join(" × ")} = ${reactVal.toExponential(4)}`,
        `Kc = ${prodVal.toExponential(4)} / ${reactVal.toExponential(4)} = ${K.toExponential(4)}`,
      ];
      let Kp: number | undefined;
      if (mode === "kp" && temp && deltaN) {
        const T = parseFloat(temp) + 273.15;
        const dn = parseFloat(deltaN);
        const R = 0.08206;
        Kp = K * Math.pow(R * T, dn);
        steps.push(`Kp = Kc × (RT)^Δn`);
        steps.push(`T = ${temp}°C = ${T.toFixed(2)} K, Δn = ${dn}, R = 0.08206 L·atm/mol·K`);
        steps.push(`Kp = ${K.toExponential(4)} × (${R} × ${T.toFixed(2)})^${dn} = ${Kp.toExponential(4)}`);
      }
      if (mode === "qc") {
        steps.push(K > 1 ? `Qc > 1: বিক্রিয়া সামনের দিকে এগিয়ে যাবে` : K < 1 ? `Qc < 1: বিক্রিয়া পেছনের দিকে যাবে` : `Qc = 1: সাম্যাবস্থায় আছে`);
      }
      setResult({ K, Kp, steps });
    } catch {
      setError("সব ঘনমাত্রা ও সহগ সঠিকভাবে পূরণ করো");
    }
  };

  const reset = () => {
    setProdConc([{ conc: "", coef: "1" }, { conc: "", coef: "1" }]);
    setReactConc([{ conc: "", coef: "1" }, { conc: "", coef: "1" }]);
    setTemp(""); setDeltaN(""); setResult(null); setError("");
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Equilibrium Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">সাম্যধ্রুবক Kc, Kp ও Qc হিসাব</p>
            </div>
          </div>

          {/* Mode selector */}
          <div className="flex gap-2 mb-6">
            {(["kc", "kp", "qc"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? "gradient-bg text-white" : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"}`}>
                {m === "kc" ? "Kc (ঘনমাত্রা)" : m === "kp" ? "Kp (চাপ)" : "Qc (প্রতিক্রিয়া ভাগফল)"}
              </button>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 text-center">
            <p className="text-amber-800 dark:text-amber-300 font-mono text-lg font-bold">Kc = [উৎপাদ]^n / [বিক্রিয়ক]^m</p>
          </div>

          {/* Inputs */}
          {[
            { label: "উৎপাদ (Products)", arr: prodConc, setter: setProdConc },
            { label: "বিক্রিয়ক (Reactants)", arr: reactConc, setter: setReactConc },
          ].map(({ label, arr, setter }) => (
            <div key={label} className="mb-5">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">{label}</p>
              {arr.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="number" value={item.conc} onChange={e => updateItem(arr, setter, i, "conc", e.target.value)}
                    placeholder={`ঘনমাত্রা ${i + 1} (mol/L)`} step="any" min="0"
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                  <input type="number" value={item.coef} onChange={e => updateItem(arr, setter, i, "coef", e.target.value)}
                    placeholder="সহগ" step="any" min="0"
                    className="w-20 px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                </div>
              ))}
            </div>
          ))}

          {mode === "kp" && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">তাপমাত্রা (°C)</label>
                <input type="number" value={temp} onChange={e => setTemp(e.target.value)} placeholder="যেমন: 25"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Δn (মোলের পরিবর্তন)</label>
                <input type="number" value={deltaN} onChange={e => setDeltaN(e.target.value)} placeholder="যেমন: 1"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5" /></button>
          </div>

          {result && (
            <div>
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: result.Kp !== undefined ? "1fr 1fr" : "1fr" }}>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white text-center">
                  <div className="text-sm opacity-90 mb-1">Kc</div>
                  <div className="text-2xl font-bold font-mono">{result.K.toExponential(4)}</div>
                </div>
                {result.Kp !== undefined && (
                  <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white text-center">
                    <div className="text-sm opacity-90 mb-1">Kp</div>
                    <div className="text-2xl font-bold font-mono">{result.Kp.toExponential(4)}</div>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">ধাপে ধাপে সমাধান</h3>
                <ol className="space-y-2">
                  {result.steps.map((step, i) => (
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
