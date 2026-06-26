"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Zap } from "lucide-react";

type Mode = "faraday" | "nernst" | "ecell";

export default function ElectrochemistryPage() {
  const [mode, setMode]       = useState<Mode>("faraday");

  // Faraday
  const [current, setCurrent]     = useState("");
  const [time, setTime]           = useState("");
  const [timeUnit, setTimeUnit]   = useState("s");
  const [molarMass, setMolarMass] = useState("");
  const [nElec, setNElec]         = useState("2");

  // Nernst
  const [e0, setE0]           = useState("");
  const [nNernst, setNNernst] = useState("2");
  const [temp, setTemp]       = useState("25");
  const [Q, setQ]             = useState("");

  // Ecell
  const [cathode, setCathode] = useState("");
  const [anode, setAnode]     = useState("");

  const [result, setResult]   = useState<{ value: number; unit: string; label: string; steps: string[] } | null>(null);
  const [error, setError]     = useState("");

  const calculate = () => {
    setError(""); setResult(null);

    if (mode === "faraday") {
      const I = parseFloat(current), t_raw = parseFloat(time), M = parseFloat(molarMass), n = parseFloat(nElec);
      if ([I, t_raw, M, n].some(v => isNaN(v) || v <= 0)) { setError("সব মান পূরণ করো"); return; }
      const t = timeUnit === "min" ? t_raw * 60 : timeUnit === "h" ? t_raw * 3600 : t_raw;
      const F = 96485;
      const Q_charge = I * t;
      const moles = Q_charge / (n * F);
      const mass = moles * M;
      const steps = [
        `বিদ্যুৎ প্রবাহ (I) = ${I} A`,
        `সময় (t) = ${t_raw} ${timeUnit} = ${t} s`,
        `চার্জ (Q) = I × t = ${I} × ${t} = ${Q_charge.toFixed(2)} C`,
        `ফ্যারাডে ধ্রুবক (F) = 96485 C/mol`,
        `ইলেকট্রন সংখ্যা (n) = ${n}`,
        `মোল = Q / (n × F) = ${Q_charge.toFixed(2)} / (${n} × 96485) = ${moles.toFixed(6)} mol`,
        `ভর = ${moles.toFixed(6)} × ${M} = ${mass.toFixed(4)} g`,
      ];
      setResult({ value: mass, unit: "g", label: "জমা পদার্থের ভর", steps });
    }

    else if (mode === "nernst") {
      const E0val = parseFloat(e0), n = parseFloat(nNernst), T = parseFloat(temp) + 273.15, Qval = parseFloat(Q);
      if ([E0val, n, Qval].some(v => isNaN(v)) || n <= 0 || Qval <= 0) { setError("সব মান পূরণ করো"); return; }
      const R = 8.314, F = 96485;
      const E = E0val - (R * T / (n * F)) * Math.log(Qval);
      const steps = [
        `Nernst সমীকরণ: E = E° - (RT/nF) × ln(Q)`,
        `E° = ${E0val} V`,
        `T = ${parseFloat(temp)}°C = ${T.toFixed(2)} K`,
        `n = ${n}, Q = ${Qval}`,
        `RT/nF = (8.314 × ${T.toFixed(2)}) / (${n} × 96485) = ${(R * T / (n * F)).toFixed(6)}`,
        `ln(${Qval}) = ${Math.log(Qval).toFixed(5)}`,
        `E = ${E0val} - ${((R * T / (n * F)) * Math.log(Qval)).toFixed(5)} = ${E.toFixed(4)} V`,
      ];
      setResult({ value: E, unit: "V", label: "কোষ বিভব (E)", steps });
    }

    else {
      const Ec = parseFloat(cathode), Ea = parseFloat(anode);
      if (isNaN(Ec) || isNaN(Ea)) { setError("ক্যাথোড ও অ্যানোডের বিভব দাও"); return; }
      const Ecell = Ec - Ea;
      const steps = [
        `E°cell = E°cathode - E°anode`,
        `E°cathode = ${Ec} V`,
        `E°anode = ${Ea} V`,
        `E°cell = ${Ec} - (${Ea}) = ${Ecell.toFixed(4)} V`,
        Ecell > 0 ? `E° > 0: স্বতঃস্ফূর্ত বিক্রিয়া ✓` : `E° < 0: অস্বতঃস্ফূর্ত বিক্রিয়া ✗`,
      ];
      setResult({ value: Ecell, unit: "V", label: "E°cell", steps });
    }
  };

  const reset = () => {
    setCurrent(""); setTime(""); setMolarMass(""); setNElec("2");
    setE0(""); setNNernst("2"); setTemp("25"); setQ("");
    setCathode(""); setAnode(""); setResult(null); setError("");
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Electrochemistry</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">ফ্যারাডে সূত্র, Nernst সমীকরণ, Ecell</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {([["faraday", "ফ্যারাডে"], ["nernst", "Nernst"], ["ecell", "E°cell"]] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? "gradient-bg text-white" : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === "faraday" && (
            <div className="space-y-4 mb-4">
              <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 text-center mb-2">
                <p className="text-violet-800 dark:text-violet-300 font-mono font-bold">m = (I × t × M) / (n × F)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">বিদ্যুৎ প্রবাহ I (A)</label>
                <input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="যেমন: 2.5" step="any" min="0"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">সময়</label>
                <div className="flex gap-2">
                  <input type="number" value={time} onChange={e => setTime(e.target.value)} placeholder="যেমন: 3600" step="any" min="0"
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500" />
                  <select value={timeUnit} onChange={e => setTimeUnit(e.target.value)}
                    className="px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none">
                    <option value="s">s</option>
                    <option value="min">min</option>
                    <option value="h">h</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">আণবিক ভর M (g/mol)</label>
                <input type="number" value={molarMass} onChange={e => setMolarMass(e.target.value)} placeholder="যেমন: 63.5 (Cu)" step="any" min="0"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">ইলেকট্রন সংখ্যা (n)</label>
                <input type="number" value={nElec} onChange={e => setNElec(e.target.value)} placeholder="যেমন: 2" step="1" min="1"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500" />
              </div>
            </div>
          )}

          {mode === "nernst" && (
            <div className="space-y-4 mb-4">
              <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 text-center mb-2">
                <p className="text-violet-800 dark:text-violet-300 font-mono font-bold">E = E° − (RT/nF) ln Q</p>
              </div>
              {[
                { label: "E° (আদর্শ কোষ বিভব, V)", val: e0, set: setE0, placeholder: "যেমন: 1.10" },
                { label: "ইলেকট্রন সংখ্যা (n)", val: nNernst, set: setNNernst, placeholder: "যেমন: 2" },
                { label: "তাপমাত্রা (°C)", val: temp, set: setTemp, placeholder: "যেমন: 25" },
                { label: "বিক্রিয়া ভাগফল Q", val: Q, set: setQ, placeholder: "যেমন: 0.01" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} step="any"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500" />
                </div>
              ))}
            </div>
          )}

          {mode === "ecell" && (
            <div className="space-y-4 mb-4">
              <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 text-center mb-2">
                <p className="text-violet-800 dark:text-violet-300 font-mono font-bold">E°cell = E°cathode − E°anode</p>
              </div>
              {[
                { label: "ক্যাথোডের বিভব E° (V)", val: cathode, set: setCathode, placeholder: "যেমন: +0.34 (Cu²⁺/Cu)" },
                { label: "অ্যানোডের বিভব E° (V)", val: anode, set: setAnode, placeholder: "যেমন: -0.76 (Zn²⁺/Zn)" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} step="any"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500" />
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
              <div className={`bg-gradient-to-br ${result.value >= 0 ? "from-violet-500 to-purple-600" : "from-red-500 to-rose-600"} rounded-2xl p-5 text-white text-center mb-6`}>
                <div className="text-sm opacity-90 mb-1">{result.label}</div>
                <div className="text-4xl font-bold">{result.value.toFixed(4)}</div>
                <div className="text-xs opacity-80 mt-1">{result.unit}</div>
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
