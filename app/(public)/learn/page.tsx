// app/(public)/learn/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Atom, Leaf, Beaker, BarChart3, Dna, Wind, Factory, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "বিষয়সমূহ — Chemistry Unfiltered",
  description: "রসায়নের সব শাখা এক জায়গায়।",
};

const categories = [
  {
    id: "physical-chemistry",
    name: "ভৌত রসায়ন",
    desc: "গ্যাস সূত্র, তাপগতিবিদ্যা, তড়িৎ রসায়ন",
    icon: Atom,
    gradient: "from-blue-500 to-indigo-600",
    accent: "border-blue-500/40 hover:border-blue-400",
  },
  {
    id: "organic-chemistry",
    name: "জৈব রসায়ন",
    desc: "হাইড্রোকার্বন, কার্যকরী গ্রুপ, বিক্রিয়া",
    icon: Leaf,
    gradient: "from-green-500 to-emerald-600",
    accent: "border-green-500/40 hover:border-green-400",
  },
  {
    id: "inorganic-chemistry",
    name: "অজৈব রসায়ন",
    desc: "ধাতু, পর্যায় সারণি, রাসায়নিক বন্ধন",
    icon: Beaker,
    gradient: "from-purple-500 to-violet-600",
    accent: "border-purple-500/40 hover:border-purple-400",
  },
  {
    id: "analytical-chemistry",
    name: "বিশ্লেষণী রসায়ন",
    desc: "টাইট্রেশন, ক্রোমাটোগ্রাফি, বর্ণালী",
    icon: BarChart3,
    gradient: "from-orange-500 to-amber-600",
    accent: "border-orange-500/40 hover:border-orange-400",
  },
  {
    id: "biochemistry",
    name: "জীব রসায়ন",
    desc: "প্রোটিন, DNA, কার্বোহাইড্রেট, এনজাইম",
    icon: Dna,
    gradient: "from-pink-500 to-rose-600",
    accent: "border-pink-500/40 hover:border-pink-400",
  },
  {
    id: "environmental-chemistry",
    name: "পরিবেশ রসায়ন",
    desc: "বায়ু দূষণ, জল রসায়ন, পরিবেশ বিজ্ঞান",
    icon: Wind,
    gradient: "from-teal-500 to-green-600",
    accent: "border-teal-500/40 hover:border-teal-400",
  },
  {
    id: "industrial-chemistry",
    name: "শিল্প রসায়ন",
    desc: "হেবার পদ্ধতি, সার উৎপাদন, তেল পরিশোধন",
    icon: Factory,
    gradient: "from-slate-400 to-slate-600",
    accent: "border-slate-500/40 hover:border-slate-400",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">বিষয়সমূহ</h1>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/learn/${cat.id}`}
                className={`flex flex-col items-center gap-3 p-5 bg-slate-800 border ${cat.accent} rounded-2xl active:scale-95 transition-all duration-200 group text-center`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-200 leading-snug">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
