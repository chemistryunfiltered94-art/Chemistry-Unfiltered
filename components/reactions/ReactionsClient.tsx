"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Search, ChevronDown, ChevronUp, Thermometer, Zap } from "lucide-react";
import { Reaction } from "@/types";

const categoryColors: Record<string, string> = {
  industrial: "from-blue-500 to-indigo-600",
  organic: "from-green-500 to-emerald-600",
  inorganic: "from-rose-500 to-pink-600",
  physical: "from-purple-500 to-violet-600",
  analytical: "from-cyan-500 to-teal-600",
};

function ReactionCard({ r }: { r: Reaction }) {
  const [expanded, setExpanded] = useState(false);
  const color = categoryColors[r.category] || "from-slate-500 to-slate-600";
  const isExothermic = r.thermodynamics?.type === "exothermic";

  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${color} p-5 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{r.nameBn || r.name}</h3>
            <p className="text-white/70 text-sm">{r.name}</p>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
            {r.type}
          </span>
        </div>

        {/* Equation */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 font-mono text-lg font-bold text-center">
          {r.equation}
        </div>
      </div>

      {/* Quick Info */}
      <div className="p-5">
        {(r.conditions?.temperature || r.conditions?.pressure) && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {r.conditions?.temperature && (
              <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                <Thermometer className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">তাপমাত্রা</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.conditions.temperature}</p>
                </div>
              </div>
            )}
            {r.conditions?.pressure && (
              <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">চাপ</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.conditions.pressure}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Catalyst */}
        {r.catalyst && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">অনুঘটক</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">{r.catalyst}</p>
          </div>
        )}

        {/* Thermodynamics */}
        {r.thermodynamics && (
          <div className={`rounded-xl p-3 mb-4 ${isExothermic ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"}`}>
            <p className={`text-xs font-medium mb-1 ${isExothermic ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}>
              তাপগতীয় ধর্ম
            </p>
            <p className={`text-sm font-bold ${isExothermic ? "text-red-800 dark:text-red-300" : "text-blue-800 dark:text-blue-300"}`}>
              ΔH = {r.thermodynamics.deltaH} {r.thermodynamics.unit || "kJ/mol"} ({isExothermic ? "তাপমোচী" : "তাপগ্রাহী"})
            </p>
          </div>
        )}

        {/* Toggle details */}
        {(r.mechanism?.length > 0 || r.products?.length > 0 || r.applications?.length > 0) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="w-4 h-4" /> বিস্তারিত লুকাও</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> মেকানিজম ও প্রয়োগ দেখো</>
            )}
          </button>
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 dark:border-slate-700"
          >
            <div className="p-5 space-y-4">
              {r.mechanism?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">বিক্রিয়ার কৌশল (Mechanism)</h4>
                  <ol className="space-y-2">
                    {r.mechanism.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} text-white flex items-center justify-center flex-shrink-0 text-xs font-bold`}>
                          {i + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {r.products?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">পণ্য (Products)</h4>
                  <div className="flex flex-wrap gap-2">
                    {r.products.map((p, i) => (
                      <span key={i} className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {r.applications?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">প্রয়োগ (Applications)</h4>
                  <div className="flex flex-wrap gap-2">
                    {r.applications.map((app, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface Props {
  reactions: Reaction[];
  categories: { key: string; label: string }[];
}

export default function ReactionsClient({ reactions, categories }: Props) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = reactions.filter((r) => {
    const matchCat = category === "all" || r.category === category;
    const matchSearch =
      r.nameBn?.toLowerCase().includes(search.toLowerCase()) ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.equation?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="বিক্রিয়া খোঁজো... (যেমন: Haber, NaOH, CH₃)"
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 shadow-sm"
        />
      </div>

      {/* Category Filter */}
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

      <p className="text-slate-500 text-sm mb-6">{filtered.length}টি বিক্রিয়া পাওয়া গেছে</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((r) => <ReactionCard key={r.id} r={r} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <FlaskConical className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>
            {reactions.length === 0
              ? "এখনো কোনো বিক্রিয়া যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে যোগ করো।"
              : "কোনো বিক্রিয়া পাওয়া যায়নি।"}
          </p>
        </div>
      )}
    </>
  );
}
