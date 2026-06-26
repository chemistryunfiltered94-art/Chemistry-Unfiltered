"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, TrendingUp } from "lucide-react";

type Mode = "rate_law" | "half_life" | "arrhenius";

export default function ReactionRatePage() {
  const [mode, setMode]         = useState<Mode>("rate_law");

  // Rate Law
  const [k, setK]               = useState("");
  const [concA, setConcA]       = useState("");
  const [orderA, setOrderA]     = useState("1");
  const [concB, setConcB]       = useState("");
  const [orderB, setOrderB]     = useState("0");

  // Half-life
  const [hlOrder, setHlOrder]   = useState<"1" | "2">("1");
  const [kHl, setKHl]           = useState("");
  const [concHl, setConcHl]     = useState("");

  // Arrhenius
  const [ea, setEa]             = useState("");
  const [a, setA]               = useState("");
  const [t1, setT1]             = useState("");
  const [t2, setT2]             = useState("");
  const [k1, setK1]             = useState("");

  const [result, setResult] = useState<{ value: number; unit: string; label: string; extra?: string; steps: string[] } | null>(null);
  const [error, setError]   = useState("");

  const calculate = () => {
    setError(""); setResult(null);

    if (mode === "rate_law") {
      const kv = parseFloat(k), cA = parseFloat(concA), mA = parseFloat(orderA), cB = parseFloat(concB), mB = parseFloat(orderB);
      if ([kv, cA, mA].some(v => isNaN(v) || v < 0)) { setError("k, [A] ও m পূরণ করো"); return; }
      const rate = kv * Math.pow(cA, mA) * (isNaN(cB) || isNaN(mB) ? 1 : Math.pow(cB, mB));
      const steps = [
        `বিক্রিয়ার হার: rate = k[A]^m[B]^n`,
        `k = ${kv}`,
        `[A] = ${cA} mol/L, m = ${mA}`,
        ...((!isNaN(cB) && !isNaN(mB) && mB > 0) ? [`[B] = ${cB} mol/L, n = ${mB}`] : []),
        `rate = ${kv} × ${cA}^${mA}${(!isNaN(cB) && mB > 0) ? ` × ${cB}^${mB}` : ""}`,
        `rate = ${rate.toExponential(4)} mol/L·s`,
      ];
      setResult({ value: rate, unit: "mol/L·s", label: "বিক্রিয়ার হার", steps });
    }

    else if (mode === "half_life") {
      const kv = parseFloat(kHl), c0 = parseFloat(concHl);
      if (isNaN(kv) || kv <= 0) { setError("হার ধ্রুবক k দাও"); return; }
      if (hlOrder === "1") {
        const t_half = Math.LN2 / kv;
        const steps = [
          `প্রথম ক্রম বিক্রিয়া: t₁/₂ = ln2 / k`,
          `k = ${kv} s⁻¹`,
          `t₁/₂ = 0.6931 / ${kv} = ${t_half.toFixed(4)} s`,
          `অর্ধায়ু প্রাথমিক ঘনমাত্রার উপর নির্ভর করে না`,
        ];
        setResult({ value: t_half, unit: "s", label: "অর্ধায়ু t₁/₂", extra: "১ম ক্রম", steps });
      } else {
        if (isNaN(c0) || c0 <= 0) { setError("২য় ক্রমের জন্য প্রাথমিক ঘনমাত্রা [A]₀ দাও"); return; }
        const t_half = 1 / (kv * c0);
        const steps = [
          `দ্বিতীয় ক্রম বিক্রিয়া: t₁/₂ = 1 / (k[A]₀)`,
          `k = ${kv} L/mol·s`,
          `[A]₀ = ${c0} mol/L`,
          `t₁/₂ = 1 / (${kv} × ${c0}) = ${t_half.toFixed(4)} s`,
        ];
        setResult({ value: t_half, unit: "s", label: "অর্ধায়ু t₁/₂", extra: "২য় ক্রম", steps });
      }
    }

    else {
      const Ea = parseFloat(ea), T1 = parseFloat(t1) + 273.15, T2 = parseFloat(t2) + 273.15, k1v = parseFloat(k1), Av = parseFloat(a);
      const R = 8.314;
      if (!isNaN(Ea) && !isNaN(T1) && !isNaN(T2) && !isNaN(k1v)) {
        const k2 = k1v * Math.exp(-Ea/R * (1/T2 - 1/T1));
        const steps = [
          `Arrhenius সমীকরণ: ln(k₂/k₁) = -Ea/R × (1/T₂ − 1/T₁)`,
          `Ea = ${Ea} J/mol, R = 8.314 J/mol·K`,
          `T₁ = ${parseFloat(t1)}°C = ${T1.toFixed(2)} K`,
          `T₂ = ${parseFloat(t2)}°C = ${T2.toFixed(2)} K`,
          `k₁ = ${k1v}`,
          `k₂ = ${k1v} × e^(${(-Ea/R*(1/T2-1/T1)).toFixed(5)}) = ${k2.toExponential(4)}`,
        ];
        setResult({ value: k2, unit: "", label: "k₂ (নতুন হার ধ্রুবক)", steps });
      } else if (!isNaN(Av) && !isNaN(Ea) && !isNaN(T1)) {
        const kval = Av * Math.exp(-Ea / (R * T1));
        const steps = [
          `k = A × e^(-Ea/RT)`,
          `A = ${Av}, Ea = ${Ea} J/mol`,
          `T = ${parseFloat(t1)}°C = ${T1.toFixed(2)} K`,
          `k = ${Av} × e^(${(-Ea/(R*T1)).toFixed(5)}) = ${kval.toExponential(4)}`,
        ];
        setResult({ value: kval, unit: "", label: "হার ধ্রুবক k", steps });
      } else {
        setError("হয় (Ea, T1, T2, k1) অথবা (A, Ea, T) দাও");
      }
    }
  };

  const reset = () => {
    setK(""); setConcA(""); setOrderA("1"); setConcB(""); setOrderB("0");
    setKHl(""); setConcHl(""); setEa(""); setA(""); setT1(""); setT2(""); setK1("");
    setResult(null); setError("");
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reaction Rate</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">হারের সূত্র, অর্ধায়ু, Arrhenius</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {([["rate_law", "হারের সূত্র"], ["half_life", "অর্ধায়ু"], ["arrhenius", "Arrhenius"]] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? "gradient-bg text-white" : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === "rate_law" && (
            <div className="space-y-4 mb-4">
              <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-2xl p-4 text-center">
                <p className="text-pink-800 dark:text-pink-300 font-mono font-bold">rate = k[A]^m [B]^n</p>
              </div>
              {[
                { label: "হার ধ্রুবক k", val: k, set: setK, placeholder: "যেমন: 0.025" },
                { label: "[A] ঘনমাত্রা (mol/L)", val: concA, set: setConcA, placeholder: "যেমন: 0.5" },
                { label: "A এর বিক্রিয়া ক্রম (m)", val: orderA, set: setOrderA, placeholder: "যেমন: 1" },
                { label: "[B] ঘনমাত্রা — ঐচ্ছিক", val: concB, set: setConcB, placeholder: "যেমন: 0.3" },
                { label: "B এর বিক্রিয়া ক্রম (n)", val: orderB, set: setOrderB, placeholder: "যেমন: 0" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} step="any"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-pink-500" />
                </div>
              ))}
            </div>
          )}

          {mode === "half_life" && (
            <div className="space-y-4 mb-4">
              <div className="flex gap-2 mb-2">
                {(["1", "2"] as const).map(o => (
                  <button key={o} onClick={() => setHlOrder(o)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${hlOrder === o ? "gradient-bg text-white" : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"}`}>
                    {o === "1" ? "১ম ক্রম" : "২য় ক্রম"}
                  </button>
                ))}
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-2xl p-4 text-center">
                <p className="text-pink-800 dark:text-pink-300 font-mono font-bold">
                  {hlOrder === "1" ? "t₁/₂ = ln2 / k" : "t₁/₂ = 1 / (k[A]₀)"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">হার ধ্রুবক k</label>
                <input type="number" value={kHl} onChange={e => setKHl(e.target.value)} placeholder="যেমন: 0.0231" step="any" min="0"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-pink-500" />
              </div>
              {hlOrder === "2" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">প্রাথমিক ঘনমাত্রা [A]₀ (mol/L)</label>
                  <input type="number" value={concHl} onChange={e => setConcHl(e.target.value)} placeholder="যেমন: 0.5" step="any" min="0"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-pink-500" />
                </div>
              )}
            </div>
          )}

          {mode === "arrhenius" && (
            <div className="space-y-4 mb-4">
              <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-2xl p-4 text-center">
                <p className="text-pink-800 dark:text-pink-300 font-mono font-bold">k = Ae^(-Ea/RT)</p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">দুটি তাপমাত্রায় k পরিবর্তন, অথবা A দিয়ে k হিসাব:</p>
              {[
                { label: "সক্রিয়করণ শক্তি Ea (J/mol)", val: ea, set: setEa, placeholder: "যেমন: 50000" },
                { label: "T₁ (°C)", val: t1, set: setT1, placeholder: "যেমন: 25" },
                { label: "T₂ (°C) — k₂ বের করতে", val: t2, set: setT2, placeholder: "যেমন: 35" },
                { label: "k₁ — k₂ বের করতে", val: k1, set: setK1, placeholder: "যেমন: 0.01" },
                { label: "ফ্রিকোয়েন্সি ফ্যাক্টর A — k বের করতে", val: a, set: setA, placeholder: "যেমন: 1e13" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} step="any"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-pink-500" />
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
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white text-center mb-6">
                <div className="text-sm opacity-90 mb-1">{result.label} {result.extra ? `(${result.extra})` : ""}</div>
                <div className="text-4xl font-bold">{result.value < 0.001 || result.value > 99999 ? result.value.toExponential(4) : result.value.toFixed(4)}</div>
                {result.unit && <div className="text-xs opacity-80 mt-1">{result.unit}</div>}
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
