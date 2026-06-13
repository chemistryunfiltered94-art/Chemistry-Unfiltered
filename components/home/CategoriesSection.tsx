"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Atom, Leaf, Beaker, BarChart3, Dna, Wind, Factory } from "lucide-react";

const categories = [
  {
    id: "physical-chemistry",
    name: "ভৌত রসায়ন",
    nameEn: "Physical Chemistry",
    icon: Atom,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    topics: 120,
    description: "পদার্থের ভৌত ধর্ম, গ্যাস সূত্র, তাপগতিবিদ্যা",
  },
  {
    id: "organic-chemistry",
    name: "জৈব রসায়ন",
    nameEn: "Organic Chemistry",
    icon: Leaf,
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    topics: 150,
    description: "কার্বন যৌগ, হাইড্রোকার্বন, জৈব বিক্রিয়া",
  },
  {
    id: "inorganic-chemistry",
    name: "অজৈব রসায়ন",
    nameEn: "Inorganic Chemistry",
    icon: Beaker,
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    topics: 100,
    description: "ধাতু, অধাতু, অজৈব যৌগ, পর্যায় সারণি",
  },
  {
    id: "analytical-chemistry",
    name: "বিশ্লেষণী রসায়ন",
    nameEn: "Analytical Chemistry",
    icon: BarChart3,
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    topics: 60,
    description: "টাইট্রেশন, ক্রোমাটোগ্রাফি, বর্ণালী বিশ্লেষণ",
  },
  {
    id: "biochemistry",
    name: "জীব রসায়ন",
    nameEn: "Biochemistry",
    icon: Dna,
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-200 dark:border-pink-800",
    topics: 80,
    description: "প্রোটিন, কার্বোহাইড্রেট, DNA, এনজাইম",
  },
  {
    id: "environmental-chemistry",
    name: "পরিবেশ রসায়ন",
    nameEn: "Environmental Chemistry",
    icon: Wind,
    color: "from-teal-500 to-green-500",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-800",
    topics: 45,
    description: "বায়ু দূষণ, জল রসায়ন, পরিবেশ বিজ্ঞান",
  },
  {
    id: "industrial-chemistry",
    name: "শিল্প রসায়ন",
    nameEn: "Industrial Chemistry",
    icon: Factory,
    color: "from-slate-500 to-gray-500",
    bg: "bg-slate-50 dark:bg-slate-800/50",
    border: "border-slate-200 dark:border-slate-700",
    topics: 55,
    description: "হেবার পদ্ধতি, সার, তেল পরিশোধন",
  },
];

export default function CategoriesSection() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-800/30">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
            বিষয়সমূহ
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
            রসায়নের সব শাখা
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Physical থেকে Biochemistry পর্যন্ত, সব ধরনের রসায়ন শিক্ষার উপকরণ
            আমাদের কাছে পাবে
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/learn/${cat.id}`}
                  className={`block p-5 rounded-2xl border ${cat.bg} ${cat.border} card-hover group`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {cat.topics}টি টপিক
                    </span>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
