"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Droplets } from "lucide-react";

type Mode = "ph" | "ratio";

export default function BufferPage() {
  const [mode, setMode]       = useState<Mode>("ph");
  const [pka, setPka]         = useState("");
  const [acidConc, setAcidConc] = useState("");
  const [baseConc, setBaseConc] = useState("");
  const [targetPh, setTargetPh] = useState("");
  const [result, setResult]   = useState<{ ph?: number; ratio?: number; steps: string[] } | null>(null);
  const [error, setError]     = useState("");

  const calculate = () => {
    setError(""); setResult(null);
    const pkaVal = parseFloat(pka);
    if (isNaN(pkaVal)) { setError("pKa মান দাও"); return; }

    if (mode === "ph") {
      const a = parseFloat(acidConc), b = parseFloat(baseConc);
      if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { setError("অ্যাসিড ও বেসের ঘনমাত্রা দাও"); return; }
      const ph = pkaVal + Math.log10(b / a);
      const steps = [
        `Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])`,
        `pKa = ${pkaVal}`,
        `[A⁻] (কনজুগেট বেস) = ${b} mol/L`,
        `[HA] (দুর্বল অ্যাসিড) = ${a} mol/L`,
        `log(${b}/${a}) = log(${(b/a).toFixed(4)}) = ${Math.log10(b/a).toFixed(4)}`,
        `pH = ${pkaVal} + (${Math.log10(b/a).toFixed(4)}) = ${ph.toFixed(4)}`,
      ];
      setResult({ ph, steps });
    } else {
      const tph = parseFloat(targetPh);
      if (isNaN(tph)) { setError("কাঙ্ক্ষিত pH দাও"); return; }
      const ratio = Math.pow(10, tph - pkaVal);
      const steps = [
        `[A⁻]/[HA] = 10^(pH - pKa)`,
        `= 10^(${tph} - ${pkaVal})`,
        `= 10^${(tph - pkaVal).toFixed(4)}`,
        `= ${ratio.toFixed(4)}`,
        `অর্থাৎ বেস : অ্যাসিড = ${ratio.toFixed(4)} : 1`,
      ];
      setResult({ ratio, steps });
    }
  };

  const reset = () => {
    setPka(""); setAcidConc(""); setBaseConc(""); setTargetPh(""); setResult(null); setError("");
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Buffer Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Henderson-Hasselbalch সমীকরণ</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {([["ph", "pH হিসাব করো"], ["ratio", "বেস:অ্যাসিড অনুপাত"]] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? "gradient-bg text-white" : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-4 mb-6 text-center">
            <p className="text-sky-800 dark:text-sky-300 font-mono text-lg font-bold">pH = pKa + log([A⁻]/[HA])</p>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">অ্যাসিডের pKa</label>
              <input type="number" value={pka} onChange={e => setPka(e.target.value)} placeholder="যেমন: 4.74 (অ্যাসিটিক অ্যাসিড)" step="any"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-sky-500" />
            </div>

            {mode === "ph" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">দুর্বল অ্যাসিড [HA] (mol/L)</label>
                  <input type="number" value={acidConc} onChange={e => setAcidConc(e.target.value)} placeholder="যেমন: 0.1" step="any" min="0"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">কনজুগেট বেস [A⁻] (mol/L)</label>
                  <input type="number" value={baseConc} onChange={e => setBaseConc(e.target.value)} placeholder="যেমন: 0.1" step="any" min="0"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-sky-500" />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">কাঙ্ক্ষিত pH</label>
                <input type="number" value={targetPh} onChange={e => setTargetPh(e.target.value)} placeholder="যেমন: 5.0" step="any"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-sky-500" />
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5" /></button>
          </div>

          {result && (
            <div>
              <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl p-5 text-white text-center mb-6">
                {result.ph !== undefined ? (
                  <>
                    <div className="text-sm opacity-90 mb-1">বাফার pH</div>
                    <div className="text-4xl font-bold">{result.ph.toFixed(4)}</div>
                    <div className="text-xs opacity-80 mt-1">
                      {result.ph < 7 ? "অম্লীয় বাফার" : result.ph > 7 ? "ক্ষারীয় বাফার" : "নিরপেক্ষ বাফার"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm opacity-90 mb-1">বেস : অ্যাসিড অনুপাত</div>
                    <div className="text-4xl font-bold">{result.ratio!.toFixed(4)} : 1</div>
                  </>
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
