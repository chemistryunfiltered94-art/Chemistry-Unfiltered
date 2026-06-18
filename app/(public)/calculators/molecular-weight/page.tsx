"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Scale, RotateCcw, Plus, X } from "lucide-react";

const atomicMasses: Record<string, number> = {
  H:1.008, He:4.003, Li:6.941, Be:9.012, B:10.811, C:12.011, N:14.007,
  O:15.999, F:18.998, Ne:20.180, Na:22.990, Mg:24.305, Al:26.982, Si:28.086,
  P:30.974, S:32.065, Cl:35.453, Ar:39.948, K:39.098, Ca:40.078, Fe:55.845,
  Cu:63.546, Zn:65.38, Br:79.904, Ag:107.868, I:126.904, Ba:137.327,
  Pb:207.2,  Au:196.967, Hg:200.592, Mn:54.938, Cr:51.996, Ni:58.693,
  Co:58.933, Ti:47.867, V:50.942, W:183.84, U:238.029, Pt:195.084,
};

const commonCompounds = [
  { name:"পানি",              formula:"H₂O",    elements:[{el:"H",n:2},{el:"O",n:1}] },
  { name:"লবণ (NaCl)",        formula:"NaCl",   elements:[{el:"Na",n:1},{el:"Cl",n:1}] },
  { name:"গ্লুকোজ",           formula:"C₆H₁₂O₆",elements:[{el:"C",n:6},{el:"H",n:12},{el:"O",n:6}] },
  { name:"সালফিউরিক অ্যাসিড", formula:"H₂SO₄",  elements:[{el:"H",n:2},{el:"S",n:1},{el:"O",n:4}] },
  { name:"অ্যামোনিয়া",        formula:"NH₃",    elements:[{el:"N",n:1},{el:"H",n:3}] },
  { name:"কার্বন ডাই অক্সাইড",formula:"CO₂",   elements:[{el:"C",n:1},{el:"O",n:2}] },
  { name:"মিথেন",             formula:"CH₄",    elements:[{el:"C",n:1},{el:"H",n:4}] },
  { name:"ক্যালসিয়াম কার্বনেট",formula:"CaCO₃", elements:[{el:"Ca",n:1},{el:"C",n:1},{el:"O",n:3}] },
];

interface Element { el: string; n: number }

export default function MolecularWeightPage() {
  const [elements, setElements] = useState<Element[]>([{ el: "H", n: 2 }, { el: "O", n: 1 }]);
  const [result, setResult]     = useState<{ mw: number; breakdown: { el: string; n: number; mass: number; total: number }[] } | null>(null);
  const [error,  setError]      = useState("");

  const addElement  = () => setElements(p => [...p, { el: "C", n: 1 }]);
  const removeEl    = (i: number) => setElements(p => p.filter((_, idx) => idx !== i));
  const updateEl    = (i: number, field: "el" | "n", val: string) =>
    setElements(p => p.map((e, idx) => idx === i ? { ...e, [field]: field === "n" ? Math.max(1, parseInt(val)||1) : val.trim() } : e));

  const loadCompound = (comp: typeof commonCompounds[0]) => {
    setElements(comp.elements.map(e => ({ el: e.el, n: e.n })));
    setResult(null); setError("");
  };

  const calculate = () => {
    setError(""); setResult(null);
    const breakdown: { el: string; n: number; mass: number; total: number }[] = [];
    let mw = 0;
    for (const { el, n } of elements) {
      const mass = atomicMasses[el];
      if (!mass) { setError(`"${el}" মৌলটি পাওয়া যায়নি। সঠিক symbol দাও (যেমন: H, O, Na)।`); return; }
      const total = mass * n;
      mw += total;
      breakdown.push({ el, n, mass, total });
    }
    setResult({ mw, breakdown });
  };

  const reset = () => { setElements([{ el:"H", n:2 }, { el:"O", n:1 }]); setResult(null); setError(""); };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Molecular Weight Calculator</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">আণবিক ভর হিসাব</p>
            </div>
          </div>

          {/* Formula display */}
          <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-2xl p-3 mb-5 text-center font-mono text-lg font-bold text-cyan-700 dark:text-cyan-300">
            M.W. = Σ (পরমাণু সংখ্যা × পারমাণবিক ভর)
          </div>

          {/* Common compounds */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">সাধারণ যৌগ</p>
            <div className="flex flex-wrap gap-2">
              {commonCompounds.map(c => (
                <button key={c.formula} onClick={() => loadCompound(c)}
                  className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  {c.name} ({c.formula})
                </button>
              ))}
            </div>
          </div>

          {/* Element rows */}
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-[1fr_80px_32px] gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
              <span>মৌলের Symbol</span><span className="text-center">সংখ্যা</span><span />
            </div>
            {elements.map((e, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_32px] gap-2 items-center">
                <input value={e.el} onChange={ev => updateEl(i, "el", ev.target.value)}
                  placeholder="যেমন: C"
                  className="px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <input type="number" min="1" value={e.n} onChange={ev => updateEl(i, "n", ev.target.value)}
                  className="px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white text-center focus:outline-none focus:border-cyan-500"
                />
                <button onClick={() => removeEl(i)} disabled={elements.length <= 1}
                  className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-400 transition-colors disabled:opacity-30">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button onClick={addElement}
            className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium hover:underline mb-5">
            <Plus className="w-4 h-4" /> মৌল যোগ করো
          </button>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {result && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-5 text-white text-center mb-4">
                <div className="text-sm opacity-90 mb-1">আণবিক ভর (M.W.)</div>
                <div className="text-4xl font-bold">{result.mw.toFixed(3)}</div>
                <div className="text-sm opacity-80 mt-1">g/mol</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      <th className="text-left px-4 py-2.5 text-slate-600 dark:text-slate-300 font-semibold">মৌল</th>
                      <th className="text-center px-4 py-2.5 text-slate-600 dark:text-slate-300 font-semibold">সংখ্যা</th>
                      <th className="text-center px-4 py-2.5 text-slate-600 dark:text-slate-300 font-semibold">পারমাণবিক ভর</th>
                      <th className="text-right px-4 py-2.5 text-slate-600 dark:text-slate-300 font-semibold">মোট</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((row, i) => (
                      <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                        <td className="px-4 py-2.5 font-mono font-bold text-cyan-600 dark:text-cyan-400">{row.el}</td>
                        <td className="px-4 py-2.5 text-center text-slate-700 dark:text-slate-300">{row.n}</td>
                        <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">{row.mass}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-200">{row.total.toFixed(3)}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-cyan-50 dark:bg-cyan-900/20">
                      <td colSpan={3} className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">মোট আণবিক ভর</td>
                      <td className="px-4 py-2.5 text-right font-bold text-cyan-600 dark:text-cyan-400">{result.mw.toFixed(3)} g/mol</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
