"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ArrowRight, Atom } from "lucide-react";
import { Formula } from "@/types";

interface Props {
  formulas: Formula[];
  categories: { key: string; label: string }[];
}

export default function FormulasClient({ formulas, categories }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = formulas.filter((f) => {
    const matchSearch =
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.nameBn?.toLowerCase().includes(search.toLowerCase()) ||
      f.formula?.toLowerCase().includes(search.toLowerCase()) ||
      f.explanation?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || f.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat.key
                ? "gradient-bg text-white shadow-lg"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"
            }`}
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
                {f.nameBn || f.name}
              </h3>
              <div className="font-mono text-lg font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl px-3 py-2 mb-3 break-all">
                {f.formula}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                {f.explanation}
              </p>
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
          <p>
            {formulas.length === 0
              ? "এখনো কোনো ফর্মুলা যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে যোগ করো।"
              : "কোনো ফর্মুলা পাওয়া যায়নি।"}
          </p>
        </div>
      )}
    </>
  );
}
