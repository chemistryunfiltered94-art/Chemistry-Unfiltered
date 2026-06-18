"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ArrowRight, Atom } from "lucide-react";

const allFormulas = [
  { id:"molarity",       name:"মোলারিটি",          formula:"M = n/V",                    category:"physical",   desc:"প্রতি লিটারে মোল সংখ্যা" },
  { id:"normality",      name:"নর্মালিটি",          formula:"N = n_eq/V",                 category:"physical",   desc:"প্রতি লিটারে equivalent সংখ্যা" },
  { id:"ph",             name:"pH",                 formula:"pH = -log[H⁺]",              category:"physical",   desc:"দ্রবণের অম্লতা" },
  { id:"poh",            name:"pOH",                formula:"pOH = -log[OH⁻]",            category:"physical",   desc:"দ্রবণের ক্ষারকতা" },
  { id:"ph-poh",         name:"pH + pOH সম্পর্ক",  formula:"pH + pOH = 14",              category:"physical",   desc:"25°C তাপমাত্রায়" },
  { id:"ideal-gas",      name:"আদর্শ গ্যাস সূত্র",  formula:"PV = nRT",                   category:"physical",   desc:"চাপ, আয়তন ও তাপমাত্রার সম্পর্ক" },
  { id:"boyle",          name:"বয়েলের সূত্র",      formula:"P₁V₁ = P₂V₂",               category:"physical",   desc:"স্থির তাপমাত্রায় গ্যাস" },
  { id:"charles",        name:"চার্লসের সূত্র",     formula:"V₁/T₁ = V₂/T₂",             category:"physical",   desc:"স্থির চাপে গ্যাসের আয়তন" },
  { id:"enthalpy",       name:"এনথালপি",            formula:"ΔH = ΔU + PΔV",              category:"thermo",     desc:"তাপগতীয় শক্তির পরিবর্তন" },
  { id:"gibbs",          name:"গিবস শক্তি",         formula:"ΔG = ΔH - TΔS",             category:"thermo",     desc:"বিক্রিয়ার স্বতঃস্ফূর্ততা" },
  { id:"entropy",        name:"এন্ট্রপি",            formula:"ΔS = Q_rev/T",               category:"thermo",     desc:"বিশৃঙ্খলার পরিমাপ" },
  { id:"hess-law",       name:"হেসের সূত্র",        formula:"ΔH_rxn = ΣΔH_products - ΣΔH_reactants", category:"thermo", desc:"তাপরাসায়নিক সমীকরণ" },
  { id:"arrhenius",      name:"আরহেনিয়াস সমীকরণ",  formula:"k = Ae^(-Ea/RT)",            category:"physical",   desc:"বিক্রিয়ার হার ও তাপমাত্রা" },
  { id:"nernst",         name:"Nernst সমীকরণ",      formula:"E = E° - (RT/nF)lnQ",       category:"electro",    desc:"তড়িৎরাসায়নিক কোষের EMF" },
  { id:"faraday",        name:"ফ্যারাডের সূত্র",    formula:"m = (M × I × t)/(n × F)",   category:"electro",    desc:"ইলেকট্রোলাইসিসে জমা হওয়া ভর" },
  { id:"henderson",      name:"Henderson-Hasselbalch", formula:"pH = pKa + log([A⁻]/[HA])", category:"physical", desc:"বাফার দ্রবণের pH" },
  { id:"rate-law",       name:"বিক্রিয়ার হার সূত্র", formula:"rate = k[A]^m[B]^n",        category:"physical",   desc:"বিক্রিয়ার গতিবিধি" },
  { id:"dilution",       name:"তনুকরণ সূত্র",       formula:"C₁V₁ = C₂V₂",               category:"physical",   desc:"দ্রবণ তনুকরণ" },
  { id:"molality",       name:"মোলালিটি",            formula:"m = n/(mass_solvent in kg)", category:"physical",   desc:"প্রতি কেজি দ্রাবকে মোল" },
  { id:"percent-yield",  name:"শতকরা ফলন",          formula:"% yield = (actual/theoretical) × 100", category:"analytical", desc:"বিক্রিয়ার দক্ষতা" },
];

const categories = [
  { key: "all",        label: "সব" },
  { key: "physical",   label: "ভৌত রসায়ন" },
  { key: "thermo",     label: "তাপগতিবিদ্যা" },
  { key: "electro",    label: "তড়িৎ রসায়ন" },
  { key: "analytical", label: "বিশ্লেষণী" },
];

export default function FormulasPage() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("all");

  const filtered = allFormulas.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.formula.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || f.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Atom className="w-4 h-4" />
            ফর্মুলা লাইব্রেরি
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Chemistry Formula Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400">২০০+ রসায়ন সূত্র — ব্যাখ্যা ও উদাহরণ সহ</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ফর্মুলা খোঁজো... (যেমন: pH, Molarity, PV=nRT)"
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 shadow-sm"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat.key ? "gradient-bg text-white shadow-lg" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          {filtered.length}টি ফর্মুলা পাওয়া গেছে
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/formulas/${f.id}`}
                className="block p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl card-hover group h-full"
              >
                <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2 uppercase tracking-wider">
                  {categories.find((c) => c.key === f.category)?.label || f.category}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {f.name}
                </h3>
                <div className="font-mono text-lg font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl px-3 py-2 mb-3 break-all">
                  {f.formula}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{f.desc}</p>
                <div className="flex items-center justify-end">
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Atom className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>কোনো ফর্মুলা পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
