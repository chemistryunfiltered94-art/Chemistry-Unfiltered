"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Metadata } from "next";
import { ArrowLeft, Calculator, RotateCcw } from "lucide-react";
import Link from "next/link";

type Mode = "hToPhMode" | "phToHMode" | "ohToPoH";

export default function PHCalculatorPage() {
  const [mode, setMode] = useState<Mode>("hToPhMode");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ ph?: number; poh?: number; h?: number; oh?: number } | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult(null);
    setSteps([]);
    const val = parseFloat(input);
    if (isNaN(val) || val <= 0) {
      setError("সঠিক সংখ্যা দাও (শূন্যের বেশি)");
      return;
    }

    if (mode === "hToPhMode") {
      const ph = -Math.log10(val);
      setResult({ ph, poh: 14 - ph });
      setSteps([
        `[H⁺] = ${val} mol/L`,
        `pH = -log[H⁺]`,
        `pH = -log(${val})`,
        `pH = ${ph.toFixed(4)}`,
        `pOH = 14 - pH = 14 - ${ph.toFixed(4)} = ${(14 - ph).toFixed(4)}`,
      ]);
    } else if (mode === "phToHMode") {
      if (val < 0 || val > 14) { setError("pH মান ০ থেকে ১৪ এর মধ্যে হতে হবে"); return; }
      const h = Math.pow(10, -val);
      setResult({ ph: val, poh: 14 - val, h, oh: Math.pow(10, -(14 - val)) });
      setSteps([
        `pH = ${val}`,
        `[H⁺] = 10^(-pH)`,
        `[H⁺] = 10^(-${val})`,
        `[H⁺] = ${h.toExponential(4)} mol/L`,
        `pOH = 14 - ${val} = ${14 - val}`,
        `[OH⁻] = 10^(-pOH) = ${Math.pow(10, -(14 - val)).toExponential(4)} mol/L`,
      ]);
    } else {
      const poh = -Math.log10(val);
      const ph = 14 - poh;
      setResult({ ph, poh, oh: val });
      setSteps([
        `[OH⁻] = ${val} mol/L`,
        `pOH = -log[OH⁻] = -log(${val}) = ${poh.toFixed(4)}`,
        `pH = 14 - pOH = 14 - ${poh.toFixed(4)} = ${ph.toFixed(4)}`,
      ]);
    }
  };

  const reset = () => { setInput(""); setResult(null); setSteps([]); setError(""); };

  const phColor = (ph: number) => {
    if (ph < 3) return "bg-red-500";
    if (ph < 6) return "bg-orange-400";
    if (ph < 7.5) return "bg-green-500";
    if (ph < 10) return "bg-blue-400";
    return "bg-purple-500";
  };
  const phLabel = (ph: number) => {
    if (ph < 7) return "অম্লীয় (Acidic)";
    if (ph === 7) return "নিরপেক্ষ (Neutral)";
    return "ক্ষারীয় (Basic)";
  };

  const modes = [
    { key: "hToPhMode", label: "[H⁺] → pH" },
    { key: "phToHMode", label: "pH → [H⁺]" },
    { key: "ohToPoH",  label: "[OH⁻] → pOH" },
  ];

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">pH Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">দ্রবণের pH ও pOH হিসাব</p>
            </div>
          </div>

          {/* Formula Display */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6 text-center">
            <p className="text-green-800 dark:text-green-300 font-mono text-lg font-bold">
              pH = -log[H⁺]
            </p>
            <p className="text-green-700 dark:text-green-400 font-mono text-sm mt-1">
              pH + pOH = 14 (25°C তে)
            </p>
          </div>

          {/* Mode Selection */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-6">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => { setMode(m.key as Mode); reset(); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === m.key ? "gradient-bg text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {mode === "hToPhMode" && "[H⁺] এর মান দাও (mol/L)"}
              {mode === "phToHMode" && "pH এর মান দাও (০-১৪)"}
              {mode === "ohToPoH"   && "[OH⁻] এর মান দাও (mol/L)"}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "phToHMode" ? "যেমন: 7" : "যেমন: 0.001"}
                step="any"
                min="0"
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400"
                onKeyDown={(e) => e.key === "Enter" && calculate()}
              />
              <button
                onClick={reset}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>
          )}

          <button
            onClick={calculate}
            className="w-full py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 transition-opacity mb-6"
          >
            হিসাব করো
          </button>

          {/* Result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* pH Scale Visual */}
              {result.ph !== undefined && (
                <div className="mb-6">
                  <div className="h-6 rounded-full overflow-hidden mb-2" style={{
                    background: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)"
                  }}>
                    <div
                      className="h-full w-4 bg-white rounded-full shadow-lg transition-all"
                      style={{ marginLeft: `calc(${(result.ph / 14) * 100}% - 8px)` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0 (অম্লীয়)</span><span>7 (নিরপেক্ষ)</span><span>14 (ক্ষারীয়)</span>
                  </div>
                </div>
              )}

              {/* Result Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {result.ph !== undefined && (
                  <div className={`${phColor(result.ph)} rounded-2xl p-4 text-white text-center`}>
                    <div className="text-sm opacity-90 mb-1">pH</div>
                    <div className="text-3xl font-bold">{result.ph.toFixed(4)}</div>
                    <div className="text-xs opacity-80 mt-1">{phLabel(result.ph)}</div>
                  </div>
                )}
                {result.poh !== undefined && (
                  <div className="bg-slate-600 rounded-2xl p-4 text-white text-center">
                    <div className="text-sm opacity-90 mb-1">pOH</div>
                    <div className="text-3xl font-bold">{result.poh.toFixed(4)}</div>
                  </div>
                )}
                {result.h !== undefined && (
                  <div className="bg-blue-600 rounded-2xl p-4 text-white text-center">
                    <div className="text-sm opacity-90 mb-1">[H⁺]</div>
                    <div className="text-lg font-bold">{result.h.toExponential(4)}</div>
                    <div className="text-xs opacity-80">mol/L</div>
                  </div>
                )}
                {result.oh !== undefined && (
                  <div className="bg-purple-600 rounded-2xl p-4 text-white text-center">
                    <div className="text-sm opacity-90 mb-1">[OH⁻]</div>
                    <div className="text-lg font-bold">{(typeof result.oh === "number" ? result.oh : 0).toExponential(4)}</div>
                    <div className="text-xs opacity-80">mol/L</div>
                  </div>
                )}
              </div>

              {/* Steps */}
              {steps.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">ধাপে ধাপে সমাধান</h3>
                  <ol className="space-y-2">
                    {steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
