"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const formulas = [
  {
    name: "মোলারিটি",
    nameEn: "Molarity",
    formula: "M = n/V",
    desc: "প্রতি লিটার দ্রবণে মোলের সংখ্যা",
    category: "ভৌত রসায়ন",
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    href: "/formulas/molarity",
  },
  {
    name: "pH সূত্র",
    nameEn: "pH Formula",
    formula: "pH = -log[H⁺]",
    desc: "দ্রবণের অম্লতা নির্ধারণ",
    category: "ভৌত রসায়ন",
    color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    href: "/formulas/ph",
  },
  {
    name: "আদর্শ গ্যাস সূত্র",
    nameEn: "Ideal Gas Law",
    formula: "PV = nRT",
    desc: "গ্যাসের চাপ, আয়তন ও তাপমাত্রার সম্পর্ক",
    category: "ভৌত রসায়ন",
    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
    href: "/formulas/ideal-gas-law",
  },
  {
    name: "গিবস শক্তি",
    nameEn: "Gibbs Energy",
    formula: "ΔG = ΔH - TΔS",
    desc: "বিক্রিয়ার স্বতঃস্ফূর্ততা নির্ধারণ",
    category: "তাপগতিবিদ্যা",
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
    href: "/formulas/gibbs-energy",
  },
  {
    name: "Nernst সমীকরণ",
    nameEn: "Nernst Equation",
    formula: "E = E° - (RT/nF)ln Q",
    desc: "তড়িৎরাসায়নিক কোষের EMF",
    category: "তড়িৎ রসায়ন",
    color: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800",
    textColor: "text-cyan-700 dark:text-cyan-300",
    href: "/formulas/nernst-equation",
  },
  {
    name: "Henderson-Hasselbalch",
    nameEn: "Henderson-Hasselbalch",
    formula: "pH = pKa + log([A⁻]/[HA])",
    desc: "বাফার দ্রবণের pH নির্ধারণ",
    category: "ভৌত রসায়ন",
    color: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800",
    textColor: "text-rose-700 dark:text-rose-300",
    href: "/formulas/henderson-hasselbalch",
  },
];

export default function PopularFormulas() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
              গুরুত্বপূর্ণ সূত্র
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              জনপ্রিয় ফর্মুলা
            </h2>
          </div>
          <Link
            href="/formulas"
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all"
          >
            সব ফর্মুলা <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formulas.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={f.href}
                className={`block p-5 rounded-2xl border ${f.color} card-hover group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {f.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {f.name}
                </h3>

                {/* Formula display */}
                <div className={`font-mono text-2xl font-bold mb-3 ${f.textColor}`}>
                  {f.formula}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {f.desc}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{f.nameEn}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
