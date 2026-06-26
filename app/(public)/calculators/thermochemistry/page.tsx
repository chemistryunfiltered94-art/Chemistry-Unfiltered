"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Thermometer } from "lucide-react";

type Mode = "hess" | "gibbs" | "specific_heat";

export default function ThermochemistryPage() {
  const [mode, setMode] = useState<Mode>("hess");

  // Hess's Law
  const [hProducts, setHProducts] = useState("");
  const [hReactants, setHReactants] = useState("");

  // Gibbs
  const [deltaH, setDeltaH] = useState("");
  const [deltaS, setDeltaS] = useState("");
  const [tempC, setTempC]   = useState("25");

  // Specific Heat
  const [mass, setMass]     = useState("");
  const [shc, setShc]       = useState("");
  const [dTemp, setDTemp]   = useState("");

  const [result, setResult] = useState<{ value: number; unit: string; label: string; extra?: string; steps: string[] } | null>(null);
  const [error, setError]   = useState("");

  const calculate = () => {
    setError(""); setResult(null);

    if (mode === "hess") {
      const prod = parseFloat(hProducts), react = parseFloat(hReactants);
      if (isNaN(prod) || isNaN(react)) { setError("উৎপাদ ও বিক্রিয়কের এনথালপি দাও"); return; }
      const dH = prod - react;
      const steps = [
        `ΔH = ΣΔHf°(উৎপাদ) − ΣΔHf°(বিক্রিয়ক)`,
        `ΔHf°(উৎপাদ) = ${prod} kJ/mol`,
        `ΔHf°(বিক্রিয়ক) = ${react} kJ/mol`,
        `ΔH = ${prod} − (${react}) = ${dH.toFixed(4)} kJ/mol`,
        dH < 0 ? `ΔH < 0: তাপোৎপাদী (exothermic) বিক্রিয়া 🔥` : dH > 0 ? `ΔH > 0: তাপশোষী (endothermic) বিক্রিয়া ❄️` : `ΔH = 0: তাপ নিরপেক্ষ`,
      ];
      setResult({ value: dH, unit: "kJ/mol", label: "ΔH (এনথালপি পরিবর্তন)", extra: dH < 0 ? "তাপোৎপাদী" : "তাপশোষী", steps });
    }

    else if (mode === "gibbs") {
      const dH = parseFloat(deltaH), dS = parseFloat(deltaS), T = parseFloat(tempC) + 273.15;
      if ([dH, dS].some(isNaN) || isNaN(T)) { setError("ΔH, ΔS ও তাপমাত্রা দাও"); return; }
      const dG = dH - T * (dS / 1000); // dS in J/mol·K → kJ
      const steps = [
        `Gibbs মুক্ত শক্তি: ΔG = ΔH − TΔS`,
        `ΔH = ${dH} kJ/mol`,
        `ΔS = ${dS} J/mol·K = ${(dS/1000).toFixed(5)} kJ/mol·K`,
        `T = ${parseFloat(tempC)}°C = ${T.toFixed(2)} K`,
        `TΔS = ${T.toFixed(2)} × ${(dS/1000).toFixed(5)} = ${(T * dS/1000).toFixed(4)} kJ/mol`,
        `ΔG = ${dH} − (${(T*dS/1000).toFixed(4)}) = ${dG.toFixed(4)} kJ/mol`,
        dG < 0 ? `ΔG < 0: স্বতঃস্ফূর্ত বিক্রিয়া ✓` : dG > 0 ? `ΔG > 0: অস্বতঃস্ফূর্ত বিক্রিয়া ✗` : `ΔG = 0: সাম্যাবস্থা`,
      ];
      setResult({ value: dG, unit: "kJ/mol", label: "ΔG (Gibbs মুক্ত শক্তি)", extra: dG < 0 ? "স্বতঃস্ফূর্ত" : "অস্বতঃস্ফূর্ত", steps });
    }

    else {
      const m = parseFloat(mass), c = parseFloat(shc), dt = parseFloat(dTemp);
      if ([m, c, dt].some(v => isNaN(v) || v <= 0)) { setError("ভর, আপেক্ষিক তাপধারণ ক্ষমতা ও তাপমাত্রা পার্থক্য দাও"); return; }
      const q = m * c * dt;
      const steps = [
        `q = mcΔT`,
        `m = ${m} g`,
        `c = ${c} J/g·°C`,
        `ΔT = ${dt} °C`,
        `q = ${m} × ${c} × ${dt} = ${q.toFixed(4)} J = ${(q/1000).toFixed(4)} kJ`,
      ];
      setResult({ value: q, unit: "J", label: "তাপ (q)", steps });
    }
  };

  const reset = () => {
    setHProducts(""); setHReactants(""); setDeltaH(""); setDeltaS(""); setTempC("25");
    setMass(""); setShc(""); setDTemp(""); setResult(null); setError("");
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thermochemistry</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Hess সূত্র, Gibbs শক্তি, আপেক্ষিক তাপ</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {([["hess", "Hess সূত্র"], ["gibbs", "Gibbs (ΔG)"], ["specific_heat", "আপেক্ষিক তাপ"]] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? "gradient-bg text-white" : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === "hess" && (
            <div className="space-y-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center">
                <p className="text-red-800 dark:text-red-300 font-mono font-bold">ΔH = ΣΔHf°(prod) − ΣΔHf°(react)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">উৎপাদের ΔHf° যোগফল (kJ/mol)</label>
                <input type="number" value={hProducts} onChange={e => setHProducts(e.target.value)} placeholder="যেমন: -393.5" step="any"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">বিক্রিয়কের ΔHf° যোগফল (kJ/mol)</label>
                <input type="number" value={hReactants} onChange={e => setHReactants(e.target.value)} placeholder="যেমন: 0" step="any"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500" />
              </div>
            </div>
          )}

          {mode === "gibbs" && (
            <div className="space-y-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center">
                <p className="text-red-800 dark:text-red-300 font-mono font-bold">ΔG = ΔH − TΔS</p>
              </div>
              {[
                { label: "ΔH (kJ/mol)", val: deltaH, set: setDeltaH, placeholder: "যেমন: -285.8" },
                { label: "ΔS (J/mol·K)", val: deltaS, set: setDeltaS, placeholder: "যেমন: -163.2" },
                { label: "তাপমাত্রা (°C)", val: tempC, set: setTempC, placeholder: "যেমন: 25" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} step="any"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500" />
                </div>
              ))}
            </div>
          )}

          {mode === "specific_heat" && (
            <div className="space-y-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center">
                <p className="text-red-800 dark:text-red-300 font-mono font-bold">q = mcΔT</p>
              </div>
              {[
                { label: "ভর m (g)", val: mass, set: setMass, placeholder: "যেমন: 100" },
                { label: "আপেক্ষিক তাপধারণ ক্ষমতা c (J/g·°C)", val: shc, set: setShc, placeholder: "যেমন: 4.184 (পানি)" },
                { label: "তাপমাত্রা পরিবর্তন ΔT (°C)", val: dTemp, set: setDTemp, placeholder: "যেমন: 20" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} step="any"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-red-500" />
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5" /></button>
          </div>

          {result && (
            <div>
              <div className={`bg-gradient-to-br ${result.value < 0 ? "from-blue-500 to-indigo-600" : "from-red-500 to-orange-600"} rounded-2xl p-5 text-white text-center mb-6`}>
                <div className="text-sm opacity-90 mb-1">{result.label}</div>
                <div className="text-4xl font-bold">{result.value.toFixed(4)}</div>
                <div className="text-xs opacity-80 mt-1">{result.unit} {result.extra ? `— ${result.extra}` : ""}</div>
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
