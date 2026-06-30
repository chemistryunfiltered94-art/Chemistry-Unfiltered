"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, Search, ChevronDown, ChevronUp,
  Thermometer, Zap, Shield, Factory, Dna, Atom,
} from "lucide-react";
import { Reaction } from "@/types";

// ─── Category colour map ─────────────────────────────────────────────
const categoryGradient: Record<string, string> = {
  organic:     "from-green-500 to-emerald-600",
  inorganic:   "from-rose-500 to-pink-600",
  industrial:  "from-blue-500 to-indigo-600",
  biochemical: "from-teal-500 to-cyan-600",
  nuclear:     "from-orange-500 to-red-600",
  physical:    "from-purple-500 to-violet-600",
  analytical:  "from-cyan-500 to-teal-600",
};

// Organic sub-type badge colours
const subTypeBadge: Record<string, string> = {
  "substitution-sn1":          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "substitution-sn2":          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "elimination-e1":            "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  "elimination-e2":            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "addition-hydrogenation":    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "addition-halogenation":     "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "addition-hydrohalogenation":"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "oxidation-kmno4":           "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "oxidation-ozonolysis":      "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "named-aldol":               "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "named-cannizzaro":          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "named-friedel-crafts":      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "named-grignard":            "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "named-wurtz":               "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "named-sandmeyer":           "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "named-reimer-tiemann":      "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "named-claisen":             "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
};

// ─── Category icon ───────────────────────────────────────────────────
function CategoryIcon({ cat }: { cat: string }) {
  const cls = "w-5 h-5 flex-shrink-0";
  if (cat === "nuclear")     return <Atom className={cls} />;
  if (cat === "biochemical") return <Dna className={cls} />;
  if (cat === "industrial")  return <Factory className={cls} />;
  return <FlaskConical className={cls} />;
}

// ─── ReactionCard ────────────────────────────────────────────────────
function ReactionCard({ r }: { r: Reaction }) {
  const [expanded, setExpanded] = useState(false);
  const color       = categoryGradient[r.category] || "from-slate-500 to-slate-600";
  const isExo       = r.thermodynamics?.type === "exothermic";
  const badgeCls    = subTypeBadge[r.subType ?? ""] || "bg-white/20 text-white";
  const hasDetails  =
    (r.mechanism?.length   > 0) ||
    (r.intermediates?.length ?? 0) > 0 ||
    (r.products?.length    > 0) ||
    (r.applications?.length > 0) ||
    (r.industrialUses?.length ?? 0) > 0 ||
    (r.safetyNotes?.length  ?? 0) > 0 ||
    !!r.nuclearData ||
    !!r.biochemData;

  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
    >
      {/* ── Header ── */}
      <div className={`bg-gradient-to-r ${color} p-5 text-white`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-bold mb-0.5 truncate">{r.nameBn || r.name}</h3>
            <p className="text-white/70 text-sm">{r.name}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
              {r.category}
            </span>
            {r.subType && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeCls}`}>
                {r.type || r.subType}
              </span>
            )}
          </div>
        </div>

        {/* Equation */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 font-mono text-lg font-bold text-center break-all">
          {r.equation}
        </div>
      </div>

      {/* ── Quick Info ── */}
      <div className="p-5">
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
          {r.conditions?.other && (
            <div className="col-span-2 flex items-start gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
              <CategoryIcon cat={r.category} />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">অন্যান্য শর্ত</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.conditions.other}</p>
              </div>
            </div>
          )}
        </div>

        {/* Catalyst */}
        {r.catalyst && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">অনুঘটক</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">{r.catalyst}</p>
          </div>
        )}

        {/* Thermodynamics */}
        {r.thermodynamics && (
          <div className={`rounded-xl p-3 mb-4 ${isExo
            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          }`}>
            <p className={`text-xs font-medium mb-1 ${isExo ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}>
              তাপগতীয় ধর্ম
            </p>
            <p className={`text-sm font-bold ${isExo ? "text-red-800 dark:text-red-300" : "text-blue-800 dark:text-blue-300"}`}>
              ΔH = {r.thermodynamics.deltaH} {r.thermodynamics.unit || "kJ/mol"} ({isExo ? "তাপমোচী" : "তাপগ্রাহী"})
            </p>
          </div>
        )}

        {/* Nuclear quick pill */}
        {r.nuclearData?.halfLife && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 mb-4">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">অর্ধজীবন</p>
            <p className="text-sm font-bold text-orange-800 dark:text-orange-300">{r.nuclearData.halfLife}</p>
          </div>
        )}

        {/* Biochem quick pill */}
        {r.biochemData?.atp && (
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-3 mb-4">
            <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mb-1">ATP</p>
            <p className="text-sm font-bold text-teal-800 dark:text-teal-300">{r.biochemData.atp}</p>
          </div>
        )}

        {/* Toggle */}
        {hasDetails && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {expanded
              ? <><ChevronUp className="w-4 h-4" /> বিস্তারিত লুকাও</>
              : <><ChevronDown className="w-4 h-4" /> মেকানিজম, ইন্টারমিডিয়েট ও প্রয়োগ দেখো</>
            }
          </button>
        )}
      </div>

      {/* ── Expanded Details ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 dark:border-slate-700"
          >
            <div className="p-5 space-y-5">
              {/* Mechanism */}
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

              {/* Intermediates */}
              {(r.intermediates?.length ?? 0) > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">ইন্টারমিডিয়েট যৌগ (Intermediates)</h4>
                  <div className="flex flex-wrap gap-2">
                    {r.intermediates!.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium font-mono">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
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

              {/* Applications */}
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

              {/* Industrial Uses */}
              {(r.industrialUses?.length ?? 0) > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Factory className="w-4 h-4 text-blue-500" /> শিল্প ব্যবহার (Industrial Uses)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {r.industrialUses!.map((u, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Notes */}
              {(r.safetyNotes?.length ?? 0) > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> নিরাপত্তা তথ্য (Safety)
                  </h4>
                  <ul className="space-y-1">
                    {r.safetyNotes!.map((note, i) => (
                      <li key={i} className="text-sm text-red-800 dark:text-red-300 flex gap-2">
                        <span className="flex-shrink-0">⚠️</span> {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nuclear Data */}
              {r.nuclearData && Object.keys(r.nuclearData).length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                    <Atom className="w-4 h-4" /> নিউক্লিয় তথ্য
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {r.nuclearData.parentNuclide   && <div><span className="text-orange-500 font-medium">মূল নিউক্লাইড:</span> <span className="dark:text-orange-200 font-mono">{r.nuclearData.parentNuclide}</span></div>}
                    {r.nuclearData.daughterNuclide  && <div><span className="text-orange-500 font-medium">উৎপন্ন:</span> <span className="dark:text-orange-200 font-mono">{r.nuclearData.daughterNuclide}</span></div>}
                    {r.nuclearData.radiation        && <div><span className="text-orange-500 font-medium">বিকিরণ:</span> <span className="dark:text-orange-200">{r.nuclearData.radiation}</span></div>}
                    {r.nuclearData.halfLife         && <div><span className="text-orange-500 font-medium">অর্ধজীবন:</span> <span className="dark:text-orange-200">{r.nuclearData.halfLife}</span></div>}
                    {r.nuclearData.energyMeV !== undefined && <div className="col-span-2"><span className="text-orange-500 font-medium">শক্তি:</span> <span className="dark:text-orange-200">{r.nuclearData.energyMeV} MeV</span></div>}
                  </div>
                </div>
              )}

              {/* Biochem Data */}
              {r.biochemData && Object.keys(r.biochemData).length > 0 && (
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
                  <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-3 flex items-center gap-2">
                    <Dna className="w-4 h-4" /> জৈব রাসায়নিক তথ্য
                  </h4>
                  <div className="space-y-2 text-sm">
                    {r.biochemData.atp      && <p><span className="text-teal-600 font-medium">ATP:</span> <span className="dark:text-teal-200">{r.biochemData.atp}</span></p>}
                    {r.biochemData.location && <p><span className="text-teal-600 font-medium">অবস্থান:</span> <span className="dark:text-teal-200">{r.biochemData.location}</span></p>}
                    {r.biochemData.enzymes?.length && (
                      <div>
                        <p className="text-teal-600 font-medium mb-1">এনজাইম:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.biochemData.enzymes.map((e, i) => (
                            <span key={i} className="px-2.5 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 rounded-full text-xs font-medium">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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

// ─── Main Client Component ───────────────────────────────────────────
interface Props {
  reactions: Reaction[];
  categories: { key: string; label: string; emoji?: string }[];
  organicGroups?: { label: string; subTypes: string[] }[];
}

export default function ReactionsClient({ reactions, categories, organicGroups }: Props) {
  const [category,  setCategory]  = useState("all");
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const [search,    setSearch]    = useState("");

  const handleCategoryClick = (key: string) => {
    setCategory(key);
    setSubFilter(null);
  };

  const filtered = reactions.filter((r) => {
    const matchCat    = category === "all" || r.category === category;
    const matchSub    = !subFilter || r.subType === subFilter;
    const q           = search.toLowerCase();
    const matchSearch =
      !q ||
      r.nameBn?.toLowerCase().includes(q) ||
      r.name?.toLowerCase().includes(q) ||
      r.equation?.toLowerCase().includes(q) ||
      r.type?.toLowerCase().includes(q) ||
      r.subType?.toLowerCase().includes(q);
    return matchCat && matchSub && matchSearch;
  });

  // Organic sub-groups for drill-down
  const showOrganicSubFilter = category === "organic" && organicGroups && organicGroups.length > 0;

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="বিক্রিয়া খোঁজো... (যেমন: Grignard, SN2, Haber, Glycolysis)"
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 shadow-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              category === cat.key
                ? "gradient-bg text-white shadow-lg"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400"
            }`}
          >
            {cat.emoji && <span>{cat.emoji}</span>}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Organic Sub-filter */}
      {showOrganicSubFilter && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-3 uppercase tracking-wide">জৈব বিক্রিয়ার ধরন</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSubFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !subFilter
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-slate-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:border-green-500"
              }`}
            >
              সব জৈব
            </button>
            {organicGroups!.map((grp) => (
              grp.subTypes.map((st) => (
                <button
                  key={st}
                  onClick={() => setSubFilter(subFilter === st ? null : st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    subFilter === st
                      ? "bg-green-600 text-white"
                      : "bg-white dark:bg-slate-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:border-green-500"
                  }`}
                >
                  {st.replace(/^[a-z]+-/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))
            ))}
          </div>
        </div>
      )}

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
