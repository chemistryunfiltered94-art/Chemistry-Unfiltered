"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Atom, RotateCcw, Plus, Trash2 } from "lucide-react";

const ELEMENTS: Record<string, number> = {
  H:1.008,He:4.003,Li:6.941,Be:9.012,B:10.811,C:12.011,N:14.007,O:15.999,
  F:18.998,Ne:20.180,Na:22.990,Mg:24.305,Al:26.982,Si:28.086,P:30.974,
  S:32.065,Cl:35.453,Ar:39.948,K:39.098,Ca:40.078,Fe:55.845,Cu:63.546,
  Zn:65.38,Br:79.904,Ag:107.868,I:126.904,Ba:137.327,Pb:207.2,
};

interface Row { element: string; percent: string; }

export default function EmpiricalFormulaPage() {
  const [rows, setRows]           = useState<Row[]>([{ element: "C", percent: "" }, { element: "H", percent: "" }, { element: "O", percent: "" }]);
  const [molMass, setMolMass]     = useState("");
  const [result, setResult]       = useState<{ empirical: string; molecular: string; steps: string[] } | null>(null);
  const [error, setError]         = useState("");

  const addRow    = () => setRows(r => [...r, { element: "", percent: "" }]);
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, key: keyof Row, val: string) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row));

  const gcd = (a: number, b: number): number => b < 0.0001 ? a : gcd(b, a % b);

  const calculate = () => {
    setError(""); setResult(null);
    const valid = rows.filter(r => r.element && r.percent);
    if (valid.length < 2) { setError("কমপক্ষে ২টি মৌল দাও"); return; }
    const sum = valid.reduce((s, r) => s + parseFloat(r.percent), 0);
    if (Math.abs(sum - 100) > 1) { setError(`শতকরা ভরের যোগফল ${sum.toFixed(1)}% — ১০০% হতে হবে`); return; }

    const steps: string[] = [];
    steps.push(`মৌলগুলোর শতকরা ভর: ${valid.map(r => `${r.element}=${r.percent}%`).join(", ")}`);

    const moles = valid.map(r => {
      const aw = ELEMENTS[r.element] ?? parseFloat(r.element);
      if (!aw || isNaN(aw)) { setError(`${r.element} এর পারমাণবিক ভর পাওয়া যায়নি`); return null; }
      const mol = parseFloat(r.percent) / aw;
      steps.push(`${r.element}: ${r.percent} / ${aw} = ${mol.toFixed(5)} mol`);
      return { element: r.element, mol };
    });
    if (moles.some(m => m === null)) return;

    const minMol = Math.min(...(moles as {element:string;mol:number}[]).map(m => m.mol));
    steps.push(`সর্বনিম্ন মোল = ${minMol.toFixed(5)}`);

    const ratios = (moles as {element:string;mol:number}[]).map(m => {
      const ratio = m.mol / minMol;
      steps.push(`${m.element}: ${m.mol.toFixed(5)} / ${minMol.toFixed(5)} = ${ratio.toFixed(3)}`);
      return { element: m.element, ratio };
    });

    // round to nearest 0.5, multiply to make integers
    const multipliers = [1, 2, 3, 4, 5, 6];
    let bestMult = 1;
    for (const mult of multipliers) {
      if (ratios.every(r => Math.abs(r.ratio * mult - Math.round(r.ratio * mult)) < 0.1)) {
        bestMult = mult; break;
      }
    }

    const intRatios = ratios.map(r => ({ element: r.element, n: Math.round(r.ratio * bestMult) }));
    const gcdVal = intRatios.reduce((g, r) => gcd(g, r.n), intRatios[0].n);
    const empiricalRatios = intRatios.map(r => ({ element: r.element, n: r.n / gcdVal }));
    const empirical = empiricalRatios.map(r => `${r.element}${r.n > 1 ? r.n : ""}`).join("");
    steps.push(`সহজতম অনুপাতে মূলসূত্র (empirical formula): ${empirical}`);

    let molecular = empirical;
    if (molMass) {
      const mm = parseFloat(molMass);
      if (!isNaN(mm) && mm > 0) {
        const empMass = empiricalRatios.reduce((s, r) => s + r.n * (ELEMENTS[r.element] ?? 0), 0);
        const n = Math.round(mm / empMass);
        molecular = empiricalRatios.map(r => `${r.element}${r.n * n > 1 ? r.n * n : ""}`).join("");
        steps.push(`মূলসূত্রের ভর = ${empMass.toFixed(3)} g/mol`);
        steps.push(`n = ${mm} / ${empMass.toFixed(3)} = ${n}`);
        steps.push(`আণবিক সূত্র (molecular formula): ${molecular}`);
      }
    }

    setResult({ empirical, molecular, steps });
  };

  const reset = () => {
    setRows([{ element: "C", percent: "" }, { element: "H", percent: "" }, { element: "O", percent: "" }]);
    setMolMass(""); setResult(null); setError("");
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ক্যালকুলেটর
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Empirical & Molecular Formula</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">মূলসূত্র ও আণবিক সূত্র নির্ণয়</p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-6 text-center">
            <p className="text-emerald-800 dark:text-emerald-300 font-mono text-lg font-bold">শতকরা ভর → মোল → সহজতম অনুপাত</p>
          </div>

          <div className="space-y-3 mb-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">মৌলের শতকরা ভর</p>
            {rows.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input value={row.element} onChange={e => updateRow(i, "element", e.target.value.toUpperCase())}
                  placeholder="মৌল (যেমন: C)" maxLength={2}
                  className="w-24 px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-center font-bold" />
                <input type="number" value={row.percent} onChange={e => updateRow(i, "percent", e.target.value)}
                  placeholder="% ভর" step="any" min="0" max="100"
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                {rows.length > 2 && (
                  <button onClick={() => removeRow(i)} className="px-3 text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addRow} className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              <Plus className="w-4 h-4" /> মৌল যোগ করো
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">আণবিক ভর (g/mol) — ঐচ্ছিক</label>
            <input type="number" value={molMass} onChange={e => setMolMass(e.target.value)}
              placeholder="আণবিক সূত্রের জন্য দাও (যেমন: 180)"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
          </div>

          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          <div className="flex gap-2 mb-6">
            <button onClick={calculate} className="flex-1 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">হিসাব করো</button>
            <button onClick={reset} className="px-4 py-3.5 border border-slate-300 dark:border-slate-600 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><RotateCcw className="w-5 h-5" /></button>
          </div>

          {result && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white text-center">
                  <div className="text-sm opacity-90 mb-2">মূলসূত্র (Empirical)</div>
                  <div className="text-3xl font-bold font-mono">{result.empirical}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white text-center">
                  <div className="text-sm opacity-90 mb-2">আণবিক সূত্র (Molecular)</div>
                  <div className="text-3xl font-bold font-mono">{result.molecular}</div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">ধাপে ধাপে সমাধান</h3>
                <ol className="space-y-2">
                  {result.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
                      <span className="text-slate-700 dark:text-slate-300">{step}</span>
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
