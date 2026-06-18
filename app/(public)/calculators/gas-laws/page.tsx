"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Wind, RotateCcw } from "lucide-react";

type Law = "boyle"|"charles"|"combined"|"ideal";

interface BoyleResult   { v2: number }
interface CharlesResult { v2: number }
interface CombinedResult{ v2: number }
interface IdealResult   { result: number; quantity: string }
type CalcResult = BoyleResult | CharlesResult | CombinedResult | IdealResult | null;

export default function GasLawsCalculatorPage() {
  const [law, setLaw] = useState<Law>("boyle");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalcResult>(null);
  const [steps,  setSteps]  = useState<string[]>([]);
  const [error,  setError]  = useState("");

  const set = (k: string, v: string) => { setInputs(p => ({...p, [k]: v})); setResult(null); };
  const num = (k: string) => parseFloat(inputs[k] || "");
  const reset = () => { setInputs({}); setResult(null); setSteps([]); setError(""); };

  const calculate = () => {
    setError(""); setResult(null); setSteps([]);
    if (law === "boyle") {
      const [p1,v1,p2] = [num("p1"),num("v1"),num("p2")];
      if ([p1,v1,p2].some(isNaN) || [p1,v1,p2].some(x=>x<=0)) { setError("সব মান দাও (শূন্যের বেশি)"); return; }
      const v2 = (p1*v1)/p2;
      setResult({ v2 });
      setSteps([`P₁V₁ = P₂V₂`, `${p1} × ${v1} = ${p2} × V₂`, `V₂ = (${p1} × ${v1}) / ${p2}`, `V₂ = ${v2.toFixed(4)} L`]);
    } else if (law === "charles") {
      const [v1,t1,t2] = [num("v1"),num("t1"),num("t2")];
      if ([v1,t1,t2].some(isNaN)||[v1,t1,t2].some(x=>x<=0)) { setError("সব মান দাও। তাপমাত্রা অবশ্যই Kelvin-এ দাও।"); return; }
      const v2 = (v1*t2)/t1;
      setResult({ v2 });
      setSteps([`V₁/T₁ = V₂/T₂`, `${v1}/${t1} = V₂/${t2}`, `V₂ = (${v1} × ${t2}) / ${t1}`, `V₂ = ${v2.toFixed(4)} L`]);
    } else if (law === "combined") {
      const [p1,v1,t1,p2,t2] = [num("p1"),num("v1"),num("t1"),num("p2"),num("t2")];
      if ([p1,v1,t1,p2,t2].some(isNaN)||[p1,v1,t1,p2,t2].some(x=>x<=0)) { setError("সব মান দাও।"); return; }
      const v2 = (p1*v1*t2)/(t1*p2);
      setResult({ v2 });
      setSteps([`P₁V₁/T₁ = P₂V₂/T₂`, `V₂ = P₁V₁T₂ / (T₁P₂)`, `V₂ = ${p1}×${v1}×${t2} / (${t1}×${p2})`, `V₂ = ${v2.toFixed(4)} L`]);
    } else {
      // Ideal: solve for missing
      const [p,v,n,t] = [num("p"),num("v"),num("n"),num("t")];
      const R = 0.0821;
      const defined = { p:!isNaN(p)&&p>0, v:!isNaN(v)&&v>0, n:!isNaN(n)&&n>0, t:!isNaN(t)&&t>0 };
      const missing = Object.entries(defined).find(([,ok])=>!ok)?.[0];
      if (!missing) { setError("একটি মান খালি রাখো (যেটা বের করতে চাও)।"); return; }
      if (Object.values(defined).filter(Boolean).length < 3) { setError("৩টি মান দাও, একটি খালি রাখো।"); return; }
      let res = 0, qty = "";
      if (missing==="v") { res=(n*R*t)/p; qty="আয়তন (V)"; setSteps([`PV=nRT → V=nRT/P`, `V = ${n}×${R}×${t}/${p}`, `V = ${res.toFixed(4)} L`]); }
      if (missing==="p") { res=(n*R*t)/v; qty="চাপ (P)"; setSteps([`PV=nRT → P=nRT/V`, `P = ${n}×${R}×${t}/${v}`, `P = ${res.toFixed(4)} atm`]); }
      if (missing==="n") { res=(p*v)/(R*t); qty="মোল (n)"; setSteps([`PV=nRT → n=PV/RT`, `n = ${p}×${v}/(${R}×${t})`, `n = ${res.toFixed(4)} mol`]); }
      if (missing==="t") { res=(p*v)/(n*R); qty="তাপমাত্রা (T)"; setSteps([`PV=nRT → T=PV/nR`, `T = ${p}×${v}/(${n}×${R})`, `T = ${res.toFixed(2)} K = ${(res-273).toFixed(2)}°C`]); }
      setResult({ result: res, quantity: qty });
    }
  };

  const laws = [
    { key:"boyle",    label:"Boyle's Law",    formula:"P₁V₁=P₂V₂" },
    { key:"charles",  label:"Charles's Law",  formula:"V₁/T₁=V₂/T₂" },
    { key:"combined", label:"সম্মিলিত সূত্র", formula:"P₁V₁/T₁=P₂V₂/T₂" },
    { key:"ideal",    label:"Ideal Gas Law",  formula:"PV=nRT" },
  ];

  const fieldGroups: Record<Law, { key:string; label:string; placeholder:string; unit:string }[]> = {
    boyle: [
      { key:"p1", label:"প্রারম্ভিক চাপ P₁", placeholder:"যেমন: 2", unit:"atm" },
      { key:"v1", label:"প্রারম্ভিক আয়তন V₁", placeholder:"যেমন: 5", unit:"L" },
      { key:"p2", label:"চূড়ান্ত চাপ P₂", placeholder:"যেমন: 4", unit:"atm" },
    ],
    charles: [
      { key:"v1", label:"প্রারম্ভিক আয়তন V₁", placeholder:"যেমন: 2", unit:"L" },
      { key:"t1", label:"প্রারম্ভিক তাপমাত্রা T₁", placeholder:"যেমন: 300", unit:"K" },
      { key:"t2", label:"চূড়ান্ত তাপমাত্রা T₂", placeholder:"যেমন: 400", unit:"K" },
    ],
    combined: [
      { key:"p1", label:"P₁", placeholder:"atm", unit:"atm" },
      { key:"v1", label:"V₁", placeholder:"L",   unit:"L" },
      { key:"t1", label:"T₁", placeholder:"K",   unit:"K" },
      { key:"p2", label:"P₂", placeholder:"atm", unit:"atm" },
      { key:"t2", label:"T₂", placeholder:"K",   unit:"K" },
    ],
    ideal: [
      { key:"p", label:"চাপ P (atm)",          placeholder:"খালি = হিসাব করবে", unit:"atm" },
      { key:"v", label:"আয়তন V (L)",           placeholder:"খালি = হিসাব করবে", unit:"L" },
      { key:"n", label:"মোল n (mol)",           placeholder:"খালি = হিসাব করবে", unit:"mol" },
      { key:"t", label:"তাপমাত্রা T (K)",       placeholder:"খালি = হিসাব করবে", unit:"K" },
    ],
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gas Laws Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">গ্যাসের সূত্র হিসাব</p>
            </div>
          </div>

          {/* Law Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {laws.map(l => (
              <button key={l.key} onClick={() => { setLaw(l.key as Law); reset(); }}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${law===l.key ? "gradient-bg text-white shadow-lg" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"}`}>
                <div>{l.label}</div>
                <div className="font-mono opacity-70 text-[10px] mt-0.5">{l.formula}</div>
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {fieldGroups[law].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                <div className="flex gap-2">
                  <input type="number" step="any" min="0" value={inputs[f.key]||""}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="flex-1 px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
                  />
                  <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-500 font-medium">{f.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {law==="ideal" && <p className="text-xs text-amber-600 dark:text-amber-400 mb-4 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl">💡 একটি মান খালি রাখো — সেটাই হিসাব করা হবে। R = 0.0821 L·atm/mol·K</p>}

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {result && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-5 text-white text-center mb-4">
                {"v2" in result && <><div className="text-sm opacity-90 mb-1">চূড়ান্ত আয়তন (V₂)</div><div className="text-4xl font-bold">{result.v2.toFixed(4)}</div><div className="text-sm opacity-80 mt-1">L</div></>}
                {"result" in result && <><div className="text-sm opacity-90 mb-1">{result.quantity}</div><div className="text-4xl font-bold">{result.result.toFixed(4)}</div></>}
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-sm">ধাপে ধাপে সমাধান</p>
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
