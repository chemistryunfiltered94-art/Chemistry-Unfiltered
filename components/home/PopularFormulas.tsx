"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Atom } from "lucide-react";
import { Formula } from "@/types";
import { getCategoryName } from "@/lib/constants";

interface Props {
  formulas?: Formula[];
}

// Cycle through card color pairs per index so the grid stays visually varied.
const cardColors = [
  { bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300" },
  { bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-300" },
  { bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800", text: "text-purple-700 dark:text-purple-300" },
  { bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-300" },
  { bg: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800", text: "text-cyan-700 dark:text-cyan-300" },
  { bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800", text: "text-rose-700 dark:text-rose-300" },
];

export default function PopularFormulas({ formulas }: Props) {
  const hasData = formulas && formulas.length > 0;
  const display = formulas?.slice(0, 6) ?? [];

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
          <Link href="/formulas"
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all">
            সব ফর্মুলা <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {!hasData ? (
          <div className="text-center py-12 text-slate-400">
            <Atom className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">অ্যাডমিন প্যানেল থেকে ফর্মুলা যোগ করলে এখানে দেখাবে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {display.map((f, i) => {
              const colors = cardColors[i % cardColors.length];
              return (
                <motion.div key={f.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/formulas/${f.id}`}
                    className={`block p-5 rounded-2xl border ${colors.bg} card-hover group`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {getCategoryName(f.category)}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      {f.nameBn || f.name}
                    </h3>
                    <div className={`font-mono text-2xl font-bold mb-3 ${colors.text}`}>
                      {f.formula}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {f.explanation}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{f.name}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
