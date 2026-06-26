"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Beaker } from "lucide-react";

type Mode = "boiling" | "freezing" | "osmotic";

const SOLVENTS: Record<string, { kb: number; kf: number; bp: number; fp: number; label: string }> = {
  water:    { kb: 0.512, kf: 1.86,  bp: 100, fp: 0,    label: "পানি (H₂O)" },
  benzene:  { kb: 2.53,  kf: 5.12,  bp: 80.1,fp: 5.5,  label: "বেনজিন" },
  ethanol:  { kb: 1.22,  kf: 1.99,  bp: 78.4,fp: -114.6,label: "ইথানল" },
  acetic:   { kb: 3.07,  kf: 3.90,  bp: 117.9,fp: 16.6, label: "অ্যাসিটিক অ্যাসিড" },
};

export default function ColligativePage() {
  const [mode, setMode]         = useState<Mode>("boiling");
  const [solvent, setSolvent]   = useState("water");
  const [massSolute, setMassSolute] = useState("");
  const [mwSolute, setMwSolute]     = useState("");
  const [massSolvent, setMassSolvent] = useState("");
  const [vant, setVant]         = useState("1");
  // osmotic
  const [conc, setConc]         = useState("");
  const [tempC, setTempC]       = useState("25");

  const [result, setResult] = useState<{ value: number; final: number; unit: string; label: string; steps: string[] } | null>(null);
  const [error, setError]   = useState("");

  const calculate = () => {
    setError(""); setResult(null);
    const sv = SOLVENTS[solvent];

    if (mode === "osmotic") {
      const M = parseFloat(conc), T = parseFloat(tempC) + 273.15, i = parseFloat(vant);
      if ([M, T, i].some(v => isNaN(v) || v <= 0)) { setError("সব মান পূরণ করো"); return; }
      const R = 0.08206;
      const pi = i * M * R * T;
      const steps = [
        `π = iMRT`,
        `i (van't Hoff ফ্যাক্টর) = ${i}`,
        `M (মোলারিটি) = ${M} mol/L`,
        `R = 0.08206 L·atm/mol·K`,
        `T = ${parseFloat(tempC)}°C = ${T.toFixed(2)} K`,
        `π = ${i} × ${M} × 0.08206 × ${T.toFixed(2)} = ${pi.toFixed(4)} atm`,
      ];
      setResult({ value: pi, final: pi, unit: "atm", label: "অভিস্রাবণ চাপ (π)", steps });
      return;
    }

    const ms = parseFloat(massSolute), mw = parseFloat(mwSolute), msv = parseFloat(massSolvent), i = parseFloat(vant);
    if ([ms, mw, msv, i].some(v => isNaN(v) || v <= 0)) { setError("সব মান পূরণ করো"); return; }

    const moles = ms / mw;
    const molality = moles / (msv / 1000);
    const steps = [
      `দ্রব্যের মোল = ${ms} / ${mw} = ${moles.toFixed(5)} mol`,
      `মোলালিটি = ${moles.toFixed(5)} / (${msv}/1000) = ${molality.toFixed(4)} mol/kg`,
    ];

    if (mode === "boiling") {
      const dTb = i * sv.kb * molality;
      const finalBp = sv.bp + dTb;
      steps.push(`ΔTb = i × Kb × m = ${i} × ${sv.kb} × ${molality.toFixed(4)} = ${dTb.toFixed(4)} °C`);
      steps.push(`নতুন স্ফুটনাঙ্ক = ${sv.bp} + ${dTb.toFixed(4)} = ${finalBp.toFixed(4)} °C`);
      setResult({ value: dTb, final: finalBp, unit: "°C", label: "ΔTb (স্ফুটনাঙ্ক বৃদ্ধি)", steps });
    } else {
      const dTf = i * sv.kf * molality;
      const finalFp = sv.fp - dTf;
      steps.push(`ΔTf = i × Kf × m = ${i} × ${sv.kf} × ${molality.toFixed(4)} = ${dTf.toFixed(4)} °C`);
      steps.push(`নতুন হিমাঙ্ক = ${sv.fp} − ${dTf.toFixed(4)} = ${finalFp.toFixed(4)} °C`);
      setResult({ value: dTf, final: finalFp, unit: "°C", label: "ΔTf (হিমাঙ্ক অবনমন)", steps });
    }
  };

  const reset = () => {
    setMassSolute(""); setMwSolute(""); setMassSolvent(""); setVant("1"); setConc(""); setTempC("25"); setResult(null); setError("");
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Colligative Properties</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">স্ফুটনাঙ্ক, হিমাঙ্ক, অভিস্রাবণ</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {([["boiling", "স্ফুটনাঙ্ক বৃদ্ধি"], ["freezing", "হিমাঙ্ক অবনমন"], ["osmotic", "অভিস্রাবণ চাপ"]] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? "gradient-bg text-white" : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"}`}>
                {label}
              </button>
            ))}
          </div>

          {mode !== "osmotic" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">দ্রাবক</label>
              <select value={solvent} onChange={e => setSolvent(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500">
                {Object.entries(SOLVENTS).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-4 mb-4">
            {mode !== "osmotic" ? (
              <>
                {[
                  { label: "দ্রব্যের ভর (g)", val: massSolute, set: setMassSolute, placeholder: "যেমন: 10" },
                  { label: "দ্রব্যের আণবিক ভর (g/mol)", val: mwSolute, set: setMwSolute, placeholder: "যেমন: 180 (গ্লুকোজ)" },
                  { label: "দ্রাবকের ভর (g)", val: massSolvent, set: setMassSolvent, placeholder: "যেমন: 500" },
                  { label: "van't Hoff ফ্যাক্টর (i)", val: vant, set: setVant, placeholder: "যেমন: 1 (অবিদ্যুৎবিশ্লেষ্য), 2 (NaCl)" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                    <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} step="any" min="0"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { label: "মোলারিটি (mol/L)", val: conc, set: setConc, placeholder: "যেমন: 0.5" },
                  { label: "তাপমাত্রা (°C)", val: tempC, set: setTempC, placeholder: "যেমন: 25" },
                  { label: "van't Hoff ফ্যাক্টর (i)", val: vant, set: setVant, placeholder: "যেমন: 1" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                    <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} step="any" min="0"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  </div>
                ))}
              </>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5" /></button>
          </div>

          {result && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-5 text-white text-center">
                  <div className="text-sm opacity-90 mb-1">{result.label}</div>
                  <div className="text-3xl font-bold">{result.value.toFixed(4)}</div>
                  <div className="text-xs opacity-80">{result.unit}</div>
                </div>
                {mode !== "osmotic" && (
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white text-center">
                    <div className="text-sm opacity-90 mb-1">{mode === "boiling" ? "নতুন স্ফুটনাঙ্ক" : "নতুন হিমাঙ্ক"}</div>
                    <div className="text-3xl font-bold">{result.final.toFixed(4)}</div>
                    <div className="text-xs opacity-80">°C</div>
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
