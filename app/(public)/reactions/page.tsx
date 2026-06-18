"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Search, ChevronDown, ChevronUp, Thermometer, Zap } from "lucide-react";

const reactions = [
  {
    id: "haber-process",
    name: "হেবার পদ্ধতি",
    nameEn: "Haber Process",
    equation: "N₂ + 3H₂ ⇌ 2NH₃",
    category: "industrial",
    type: "synthesis",
    conditions: { temperature: "450°C", pressure: "150-300 atm" },
    catalyst: "আয়রন (Fe) + প্রমোটার (K₂O, Al₂O₃)",
    mechanism: [
      "N₂ এবং H₂ আয়রন অনুঘটকের পৃষ্ঠে শোষিত হয়",
      "N≡N ট্রিপল বন্ধন ভাঙে",
      "H₂ বিচ্ছিন্ন হয় এবং H পরমাণু তৈরি হয়",
      "N ও H পরমাণু ধাপে ধাপে NH₃ তৈরি করে",
      "NH₃ পৃষ্ঠ থেকে বিচ্ছিন্ন হয়",
    ],
    products: ["অ্যামোনিয়া (NH₃)"],
    applications: ["সার উৎপাদন", "বিস্ফোরক তৈরি", "পরিষ্কার পণ্য"],
    thermodynamics: { deltaH: -92, type: "exothermic" },
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "contact-process",
    name: "সংস্পর্শ পদ্ধতি",
    nameEn: "Contact Process",
    equation: "2SO₂ + O₂ ⇌ 2SO₃",
    category: "industrial",
    type: "oxidation",
    conditions: { temperature: "450-500°C", pressure: "1-2 atm" },
    catalyst: "ভ্যানাডিয়াম পেন্টক্সাইড (V₂O₅)",
    mechanism: [
      "SO₂ এবং O₂ অনুঘটকের পৃষ্ঠে শোষিত হয়",
      "O₂ বিচ্ছিন্ন হয় এবং SO₂ অক্সিডাইজ হয়",
      "SO₃ উৎপন্ন হয় এবং পৃষ্ঠ থেকে মুক্ত হয়",
    ],
    products: ["সালফার ট্রাইঅক্সাইড (SO₃)", "সালফিউরিক অ্যাসিড (H₂SO₄)"],
    applications: ["সালফিউরিক অ্যাসিড শিল্প", "সার তৈরি", "রং শিল্প"],
    thermodynamics: { deltaH: -197, type: "exothermic" },
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "aldol-condensation",
    name: "অ্যালডল ঘনীভবন",
    nameEn: "Aldol Condensation",
    equation: "2CH₃CHO → CH₃CH(OH)CH₂CHO",
    category: "organic",
    type: "condensation",
    conditions: { temperature: "কক্ষ তাপমাত্রা", pressure: "স্বাভাবিক চাপ" },
    catalyst: "NaOH (দুর্বল ক্ষার)",
    mechanism: [
      "ক্ষার প্রথম অ্যালডিহাইড থেকে α-H সরায়",
      "এনোলেট আয়ন তৈরি হয়",
      "এনোলেট আয়ন দ্বিতীয় অ্যালডিহাইডের কার্বনাইল কার্বনে আক্রমণ করে",
      "অ্যালকোক্সাইড আয়ন প্রোটন গ্রহণ করে β-হাইড্রক্সি অ্যালডিহাইড তৈরি করে",
    ],
    products: ["β-হাইড্রক্সি অ্যালডিহাইড (Aldol)", "α,β-অসম্পৃক্ত অ্যালডিহাইড"],
    applications: ["জৈব সংশ্লেষণ", "ওষুধ তৈরি", "সুগন্ধি শিল্প"],
    thermodynamics: { deltaH: -50, type: "exothermic" },
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "friedel-crafts",
    name: "ফ্রিডেল-ক্রাফট বিক্রিয়া",
    nameEn: "Friedel-Crafts Reaction",
    equation: "C₆H₆ + RCl → C₆H₅R + HCl",
    category: "organic",
    type: "substitution",
    conditions: { temperature: "কক্ষ তাপমাত্রা - 80°C", pressure: "স্বাভাবিক" },
    catalyst: "অ্যালুমিনিয়াম ক্লোরাইড (AlCl₃)",
    mechanism: [
      "AlCl₃ RCl থেকে কার্বোক্যাটায়ন (R⁺) তৈরি করে",
      "R⁺ বেঞ্জিন রিংয়ের π ইলেকট্রনে আক্রমণ করে",
      "Arenium ion (σ কমপ্লেক্স) মধ্যবর্তী যৌগ তৈরি হয়",
      "H⁺ হারিয়ে আরোমাটিক পণ্য তৈরি হয়",
    ],
    products: ["অ্যালকাইলবেঞ্জিন", "HCl"],
    applications: ["পেট্রোকেমিক্যাল শিল্প", "ওষুধ সংশ্লেষণ", "প্লাস্টিক তৈরি"],
    thermodynamics: { deltaH: -125, type: "exothermic" },
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "saponification",
    name: "সাবানীকরণ",
    nameEn: "Saponification",
    equation: "RCOOR' + NaOH → RCOONa + R'OH",
    category: "organic",
    type: "hydrolysis",
    conditions: { temperature: "গরম করা প্রয়োজন", pressure: "স্বাভাবিক" },
    catalyst: "NaOH (ক্ষার)",
    mechanism: [
      "OH⁻ এস্টারের কার্বনাইল কার্বনে আক্রমণ করে",
      "টেট্রাহেড্রাল মধ্যবর্তী যৌগ তৈরি হয়",
      "R'O⁻ বের হয় এবং কার্বোক্সিলিক অ্যাসিড তৈরি হয়",
      "ক্ষার কার্বোক্সিলিক অ্যাসিডকে লবণে রূপান্তরিত করে",
    ],
    products: ["কার্বোক্সিলেট লবণ (সাবান)", "অ্যালকোহল"],
    applications: ["সাবান তৈরি", "গ্লিসারিন উৎপাদন", "এস্টার বিশ্লেষণ"],
    thermodynamics: { deltaH: -40, type: "exothermic" },
    color: "from-cyan-500 to-teal-600",
  },
  {
    id: "neutralization",
    name: "নিরপেক্ষকরণ বিক্রিয়া",
    nameEn: "Neutralization",
    equation: "HCl + NaOH → NaCl + H₂O",
    category: "inorganic",
    type: "acid-base",
    conditions: { temperature: "কক্ষ তাপমাত্রা", pressure: "স্বাভাবিক" },
    catalyst: "অনুঘটকের প্রয়োজন নেই",
    mechanism: [
      "HCl → H⁺ + Cl⁻ (আয়নিকরণ)",
      "NaOH → Na⁺ + OH⁻ (বিচ্ছেদ)",
      "H⁺ + OH⁻ → H₂O (নিরপেক্ষকরণ)",
      "Na⁺ + Cl⁻ → NaCl (লবণ গঠন)",
    ],
    products: ["সোডিয়াম ক্লোরাইড (NaCl)", "পানি (H₂O)"],
    applications: ["pH নিয়ন্ত্রণ", "অ্যান্টাসিড ওষুধ", "ঔদ্যোগিক প্রক্রিয়া"],
    thermodynamics: { deltaH: -57, type: "exothermic" },
    color: "from-rose-500 to-pink-600",
  },
];

const categories = [
  { key: "all",       label: "সব বিক্রিয়া" },
  { key: "industrial",label: "শিল্প বিক্রিয়া" },
  { key: "organic",   label: "জৈব বিক্রিয়া" },
  { key: "inorganic", label: "অজৈব বিক্রিয়া" },
];

function ReactionCard({ r }: { r: typeof reactions[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${r.color} p-5 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{r.name}</h3>
            <p className="text-white/70 text-sm">{r.nameEn}</p>
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
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <Thermometer className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">তাপমাত্রা</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.conditions.temperature}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">চাপ</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.conditions.pressure}</p>
            </div>
          </div>
        </div>

        {/* Catalyst */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">অনুঘটক</p>
          <p className="text-sm text-amber-800 dark:text-amber-300">{r.catalyst}</p>
        </div>

        {/* Thermodynamics */}
        <div className={`rounded-xl p-3 mb-4 ${r.thermodynamics.type === "exothermic" ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"}`}>
          <p className={`text-xs font-medium mb-1 ${r.thermodynamics.type === "exothermic" ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}>
            তাপগতীয় ধর্ম
          </p>
          <p className={`text-sm font-bold ${r.thermodynamics.type === "exothermic" ? "text-red-800 dark:text-red-300" : "text-blue-800 dark:text-blue-300"}`}>
            ΔH = {r.thermodynamics.deltaH} kJ/mol ({r.thermodynamics.type === "exothermic" ? "তাপমোচী" : "তাপগ্রাহী"})
          </p>
        </div>

        {/* Toggle details */}
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
              {/* Mechanism */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">বিক্রিয়ার কৌশল (Mechanism)</h4>
                <ol className="space-y-2">
                  {r.mechanism.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${r.color} text-white flex items-center justify-center flex-shrink-0 text-xs font-bold`}>
                        {i + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Products */}
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

              {/* Applications */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ReactionsPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = reactions.filter((r) => {
    const matchCat = category === "all" || r.category === category;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      r.equation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <FlaskConical className="w-4 h-4" />
            বিক্রিয়া ডেটাবেস
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Reaction Database</h1>
          <p className="text-slate-600 dark:text-slate-400">১০০+ গুরুত্বপূর্ণ রসায়ন বিক্রিয়া — মেকানিজম ও প্রয়োগ সহ</p>
        </div>

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
            <p>কোনো বিক্রিয়া পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
