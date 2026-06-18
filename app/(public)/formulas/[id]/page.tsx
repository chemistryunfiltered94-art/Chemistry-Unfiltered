import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";

const formulaDetails: Record<string, {
  name: string; nameBn: string; formula: string;
  category: string; variables: { symbol: string; meaning: string; unit: string }[];
  explanation: string; derivation?: string;
  example: { question: string; steps: string[]; answer: string };
  relatedFormulas: { id: string; name: string; formula: string }[];
  relatedTopics: { slug: string; title: string; categorySlug: string }[];
  calculatorHref?: string;
}> = {
  "molarity": {
    name: "Molarity", nameBn: "মোলারিটি",
    formula: "M = n / V",
    category: "ভৌত রসায়ন",
    variables: [
      { symbol:"M", meaning:"মোলারিটি",         unit:"mol/L" },
      { symbol:"n", meaning:"দ্রবীভূত পদার্থের মোল সংখ্যা", unit:"mol" },
      { symbol:"V", meaning:"দ্রবণের আয়তন",     unit:"L" },
    ],
    explanation: "মোলারিটি হল প্রতি লিটার দ্রবণে দ্রবীভূত পদার্থের মোল সংখ্যা। এটি দ্রবণের ঘনত্ব পরিমাপের সবচেয়ে সাধারণ পদ্ধতি। মোলারিটি তাপমাত্রার উপর নির্ভরশীল কারণ তাপমাত্রা পরিবর্তনে দ্রবণের আয়তন পরিবর্তন হয়।",
    example: {
      question: "500 mL দ্রবণে 5.85 g NaCl (M.W. = 58.5) দ্রবীভূত থাকলে মোলারিটি কত?",
      steps: [
        "n = mass / M.W. = 5.85 / 58.5 = 0.1 mol",
        "V = 500 mL = 0.5 L",
        "M = n / V = 0.1 / 0.5",
      ],
      answer: "M = 0.2 mol/L",
    },
    relatedFormulas: [
      { id:"normality", name:"Normality", formula:"N = n_eq/V" },
      { id:"molality",  name:"Molality",  formula:"m = n/kg" },
      { id:"dilution",  name:"Dilution",  formula:"C₁V₁ = C₂V₂" },
    ],
    relatedTopics: [
      { slug:"solutions", title:"দ্রবণ রসায়ন", categorySlug:"physical-chemistry" },
      { slug:"acid-base",  title:"অ্যাসিড ও ক্ষার", categorySlug:"physical-chemistry" },
    ],
    calculatorHref: "/calculators/molarity",
  },
  "ph": {
    name: "pH Formula", nameBn: "pH সূত্র",
    formula: "pH = -log[H⁺]",
    category: "ভৌত রসায়ন",
    variables: [
      { symbol:"pH",   meaning:"হাইড্রোজেন আয়নের ঘনত্বের ঋণাত্মক log", unit:"(dimensionless)" },
      { symbol:"[H⁺]", meaning:"হাইড্রোজেন আয়নের মোলার ঘনত্ব",         unit:"mol/L" },
    ],
    explanation: "pH হল দ্রবণের অম্লতা বা ক্ষারত্বের পরিমাপ। pH স্কেল 0 থেকে 14 পর্যন্ত। pH < 7 অম্লীয়, pH = 7 নিরপেক্ষ, pH > 7 ক্ষারীয়। প্রতি 1 একক pH পরিবর্তনে [H⁺] 10 গুণ পরিবর্তন হয়।",
    example: {
      question: "0.001 M HCl দ্রবণের pH কত?",
      steps: [
        "HCl → H⁺ + Cl⁻ (সম্পূর্ণ আয়নিকরণ)",
        "[H⁺] = 0.001 = 10⁻³ mol/L",
        "pH = -log(10⁻³) = -(-3)",
      ],
      answer: "pH = 3",
    },
    relatedFormulas: [
      { id:"poh",      name:"pOH",   formula:"pOH = -log[OH⁻]" },
      { id:"ph-poh",   name:"pH+pOH", formula:"pH + pOH = 14" },
      { id:"henderson",name:"Henderson-Hasselbalch", formula:"pH = pKa + log([A⁻]/[HA])" },
    ],
    relatedTopics: [
      { slug:"acid-base", title:"অ্যাসিড ও ক্ষার", categorySlug:"physical-chemistry" },
    ],
    calculatorHref: "/calculators/ph",
  },
  "ideal-gas-law": {
    name: "Ideal Gas Law", nameBn: "আদর্শ গ্যাস সূত্র",
    formula: "PV = nRT",
    category: "ভৌত রসায়ন",
    variables: [
      { symbol:"P", meaning:"চাপ",             unit:"atm" },
      { symbol:"V", meaning:"আয়তন",           unit:"L" },
      { symbol:"n", meaning:"মোল সংখ্যা",     unit:"mol" },
      { symbol:"R", meaning:"সার্বজনীন গ্যাস ধ্রুবক", unit:"0.0821 L·atm/mol·K" },
      { symbol:"T", meaning:"পরম তাপমাত্রা",  unit:"K" },
    ],
    explanation: "আদর্শ গ্যাস সূত্র Boyle, Charles এবং Avogadro-র সূত্রের সমন্বয়। এটি কম চাপে ও উচ্চ তাপমাত্রায় সব গ্যাসের জন্য প্রযোজ্য। তাপমাত্রা অবশ্যই Kelvin-এ দিতে হবে (K = °C + 273)।",
    example: {
      question: "27°C তাপমাত্রায় 2 atm চাপে 3 mol গ্যাসের আয়তন কত?",
      steps: [
        "T = 27 + 273 = 300 K, P = 2 atm, n = 3 mol",
        "V = nRT/P",
        "V = 3 × 0.0821 × 300 / 2",
      ],
      answer: "V = 36.945 L ≈ 36.9 L",
    },
    relatedFormulas: [
      { id:"boyle",   name:"Boyle's Law",   formula:"P₁V₁ = P₂V₂" },
      { id:"charles", name:"Charles's Law", formula:"V₁/T₁ = V₂/T₂" },
    ],
    relatedTopics: [
      { slug:"gas-laws", title:"গ্যাসের সূত্রসমূহ", categorySlug:"physical-chemistry" },
    ],
    calculatorHref: "/calculators/gas-laws",
  },
  "gibbs-energy": {
    name: "Gibbs Free Energy", nameBn: "গিবস শক্তি",
    formula: "ΔG = ΔH - TΔS",
    category: "তাপগতিবিদ্যা",
    variables: [
      { symbol:"ΔG", meaning:"গিবস শক্তির পরিবর্তন", unit:"kJ/mol" },
      { symbol:"ΔH", meaning:"এনথালপির পরিবর্তন",   unit:"kJ/mol" },
      { symbol:"T",  meaning:"পরম তাপমাত্রা",       unit:"K" },
      { symbol:"ΔS", meaning:"এন্ট্রপির পরিবর্তন",  unit:"kJ/mol·K" },
    ],
    explanation: "ΔG < 0 হলে বিক্রিয়া স্বতঃস্ফূর্ত (Spontaneous), ΔG > 0 হলে অস্বতঃস্ফূর্ত, ΔG = 0 হলে সাম্যাবস্থা। তাপমোচী ও এন্ট্রপি বৃদ্ধি পাওয়া বিক্রিয়া সর্বদা স্বতঃস্ফূর্ত।",
    example: {
      question: "ΔH = -100 kJ/mol, ΔS = 0.2 kJ/mol·K, T = 300 K হলে বিক্রিয়া কি স্বতঃস্ফূর্ত?",
      steps: [
        "ΔG = ΔH - TΔS",
        "ΔG = -100 - (300 × 0.2)",
        "ΔG = -100 - 60 = -160 kJ/mol",
      ],
      answer: "ΔG = -160 kJ/mol < 0, তাই বিক্রিয়া স্বতঃস্ফূর্ত",
    },
    relatedFormulas: [
      { id:"enthalpy", name:"Enthalpy",        formula:"ΔH = ΔU + PΔV" },
      { id:"entropy",  name:"Entropy",         formula:"ΔS = Q_rev/T" },
      { id:"hess-law", name:"Hess's Law",      formula:"ΔH_rxn = ΣΔH_f(products) - ΣΔH_f(reactants)" },
    ],
    relatedTopics: [
      { slug:"thermodynamics", title:"তাপগতিবিদ্যা", categorySlug:"physical-chemistry" },
    ],
  },
};

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const f = formulaDetails[id];
  if (!f) return { title: "Formula Not Found" };
  return {
    title: `${f.nameBn} (${f.name}) — Formula | ChemistryOS`,
    description: f.explanation.slice(0, 160),
  };
}

export default async function FormulaDetailPage({ params }: Props) {
  const { id } = await params;
  const f = formulaDetails[id];
  if (!f) notFound();

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/formulas" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> ফর্মুলা লাইব্রেরি
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 mb-5">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">{f.category}</span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-1">{f.nameBn}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{f.name}</p>

          {/* Big Formula Display */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 rounded-2xl p-8 text-center mb-6">
            <div className="font-mono text-4xl font-bold text-primary-700 dark:text-primary-300">
              {f.formula}
            </div>
          </div>

          {/* Variables */}
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">চলরাশিসমূহ</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {f.variables.map((v, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                <span className="font-mono font-bold text-primary-600 dark:text-primary-400 w-10 text-center flex-shrink-0">{v.symbol}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{v.meaning}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{v.unit}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.explanation}</p>
        </div>

        {/* Example */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">✏️ উদাহরণ</h2>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-4">
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">প্রশ্ন: {f.example.question}</p>
          </div>
          <div className="space-y-2 mb-4">
            {f.example.steps.map((step, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono pt-0.5">{step}</span>
              </div>
            ))}
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-2.5">
            <p className="text-green-800 dark:text-green-300 text-sm font-semibold">✅ উত্তর: {f.example.answer}</p>
          </div>

          {f.calculatorHref && (
            <Link href={f.calculatorHref}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 w-fit">
              <Calculator className="w-4 h-4" /> এই সূত্রের Calculator
            </Link>
          )}
        </div>

        {/* Related Formulas */}
        {f.relatedFormulas.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">সম্পর্কিত সূত্র</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {f.relatedFormulas.map((rf) => (
                <Link key={rf.id} href={`/formulas/${rf.id}`}
                  className="block p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-colors group text-center">
                  <div className="font-mono text-base font-bold text-primary-600 dark:text-primary-400 mb-1">{rf.formula}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">{rf.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Topics */}
        {f.relatedTopics.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">সম্পর্কিত টপিক</h2>
            <div className="space-y-2">
              {f.relatedTopics.map((rt) => (
                <Link key={rt.slug} href={`/learn/${rt.categorySlug}/${rt.slug}`}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-all group">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">{rt.title}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
