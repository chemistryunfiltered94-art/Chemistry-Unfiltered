"use client";

import Link from "next/link";
import { Atom, Leaf, Beaker, BarChart3, Dna, Wind, Factory } from "lucide-react";

const categories = [
  {
    id: "physical-chemistry",
    name: "ভৌত রসায়ন",
    nameEn: "Physical Chemistry",
    icon: Atom,
    gradient: "from-blue-500 to-indigo-600",
    accent: "border-blue-500/40 hover:border-blue-400",
    topics: 120,
    description: "পদার্থের ভৌত ধর্ম, গ্যাস সূত্র, তাপগতিবিদ্যা",
  },
  {
    id: "organic-chemistry",
    name: "জৈব রসায়ন",
    nameEn: "Organic Chemistry",
    icon: Leaf,
    gradient: "from-green-500 to-emerald-600",
    accent: "border-green-500/40 hover:border-green-400",
    topics: 150,
    description: "কার্বন যৌগ, হাইড্রোকার্বন, জৈব বিক্রিয়া",
  },
  {
    id: "inorganic-chemistry",
    name: "অজৈব রসায়ন",
    nameEn: "Inorganic Chemistry",
    icon: Beaker,
    gradient: "from-purple-500 to-violet-600",
    accent: "border-purple-500/40 hover:border-purple-400",
    topics: 100,
    description: "ধাতু, অধাতু, অজৈব যৌগ, পর্যায় সারণি",
  },
  {
    id: "analytical-chemistry",
    name: "বিশ্লেষণী রসায়ন",
    nameEn: "Analytical Chemistry",
    icon: BarChart3,
    gradient: "from-orange-500 to-amber-600",
    accent: "border-orange-500/40 hover:border-orange-400",
    topics: 60,
    description: "টাইট্রেশন, ক্রোমাটোগ্রাফি, বর্ণালী বিশ্লেষণ",
  },
  {
    id: "biochemistry",
    name: "জীব রসায়ন",
    nameEn: "Biochemistry",
    icon: Dna,
    gradient: "from-pink-500 to-rose-600",
    accent: "border-pink-500/40 hover:border-pink-400",
    topics: 80,
    description: "প্রোটিন, কার্বোহাইড্রেট, DNA, এনজাইম",
  },
  {
    id: "environmental-chemistry",
    name: "পরিবেশ রসায়ন",
    nameEn: "Environmental Chemistry",
    icon: Wind,
    gradient: "from-teal-500 to-green-600",
    accent: "border-teal-500/40 hover:border-teal-400",
    topics: 45,
    description: "বায়ু দূষণ, জল রসায়ন, পরিবেশ বিজ্ঞান",
  },
  {
    id: "industrial-chemistry",
    name: "শিল্প রসায়ন",
    nameEn: "Industrial Chemistry",
    icon: Factory,
    gradient: "from-slate-400 to-slate-600",
    accent: "border-slate-500/40 hover:border-slate-400",
    topics: 55,
    description: "হেবার পদ্ধতি, সার, তেল পরিশোধন",
  },
];

export default function CategoriesSection() {
  return (
    <section className="section-padding bg-slate-800/30">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">
            বিষয়সমূহ
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-4">
            রসায়নের সব শাখা
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Physical থেকে Biochemistry পর্যন্ত, সব ধরনের রসায়ন শিক্ষার উপকরণ
            আমাদের কাছে পাবে
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/learn/${cat.id}`}
                className={`block p-5 bg-slate-800 border ${cat.accent} rounded-2xl transition-all duration-200 active:scale-95 group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">
                    {cat.topics}টি টপিক
                  </span>
                  <span className="text-xs text-primary-400 font-medium">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
