"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calculator, RotateCcw } from "lucide-react";

export default function DensityPage() {
  const [solve, setSolve] = useState<"density"|"mass"|"volume">("density");
  const [mass,   setMass]   = useState("");
  const [vol,    setVol]    = useState("");
  const [dens,   setDens]   = useState("");
  const [result, setResult] = useState<number|null>(null);
  const [steps,  setSteps]  = useState<string[]>([]);
  const [error,  setError]  = useState("");

  const reset = () => { setMass(""); setVol(""); setDens(""); setResult(null); setSteps([]); setError(""); };

  const calculate = () => {
    setError(""); setResult(null); setSteps([]);
    const m=parseFloat(mass), v=parseFloat(vol), d=parseFloat(dens);
    if (solve==="density") {
      if (isNaN(m)||isNaN(v)||m<=0||v<=0) { setError("ভর ও আয়তন দাও।"); return; }
      const res = m/v;
      setResult(res);
      setSteps([`ρ = m/V`,`ρ = ${m}/${v}`,`ρ = ${res.toFixed(4)} g/mL`]);
    } else if (solve==="mass") {
      if (isNaN(d)||isNaN(v)||d<=0||v<=0) { setError("ঘনত্ব ও আয়তন দাও।"); return; }
      const res = d*v;
      setResult(res);
      setSteps([`m = ρ × V`,`m = ${d} × ${v}`,`m = ${res.toFixed(4)} g`]);
    } else {
      if (isNaN(m)||isNaN(d)||m<=0||d<=0) { setError("ভর ও ঘনত্ব দাও।"); return; }
      const res = m/d;
      setResult(res);
      setSteps([`V = m/ρ`,`V = ${m}/${d}`,`V = ${res.toFixed(4)} mL`]);
    }
  };

  const labels: Record<string,{label:string;unit:string}> = {
    density:{ label:"ঘনত্ব (ρ)", unit:"g/mL" },
    mass:   { label:"ভর (m)",    unit:"g" },
    volume: { label:"আয়তন (V)", unit:"mL" },
  };

  const fieldMap = {
    density: [{ label:"ভর (g)",m:mass,set:setMass,ph:"যেমন: 50"}, {label:"আয়তন (mL)",m:vol,set:setVol,ph:"যেমন: 25"}],
    mass:    [{ label:"ঘনত্ব (g/mL)",m:dens,set:setDens,ph:"যেমন: 2.7"}, {label:"আয়তন (mL)",m:vol,set:setVol,ph:"যেমন: 25"}],
    volume:  [{ label:"ভর (g)",m:mass,set:setMass,ph:"যেমন: 50"}, {label:"ঘনত্ব (g/mL)",m:dens,set:setDens,ph:"যেমন: 2.7"}],
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4"/> সব ক্যালকুলেটর
        </Link>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white"/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Density Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">ঘনত্ব হিসাব — ρ = m/V</p>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-3 mb-5 text-center font-mono text-xl font-bold text-slate-700 dark:text-slate-300">
            ρ = m / V
          </div>

          <div className="mb-5">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">কোনটি বের করবে?</p>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              {(["density","mass","volume"] as const).map(k => (
                <button key={k} onClick={()=>{setSolve(k);reset();}}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${solve===k?"gradient-bg text-white":"text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>
                  {labels[k].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-4">
            {fieldMap[solve].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                <input type="number" step="any" min="0" value={f.m} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-500"
                />
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5"/></button>
          </div>

          {result !== null && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-5 text-white text-center mb-4">
                <div className="text-sm opacity-90 mb-1">{labels[solve].label}</div>
                <div className="text-4xl font-bold">{result.toFixed(4)}</div>
                <div className="text-sm opacity-80 mt-1">{labels[solve].unit}</div>
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
