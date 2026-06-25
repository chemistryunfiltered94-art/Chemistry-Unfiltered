// app/(public)/learn/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Atom, Leaf, Beaker, BarChart3, Dna, Wind, Factory } from "lucide-react";

export const metadata: Metadata = {
  title: "বিষয়সমূহ — Chemistry Unfiltered",
  description: "রসায়নের সব শাখা এক জায়গায়।",
};

const categories = [
  { id: "physical-chemistry",      name: "ভৌত রসায়ন",       icon: Atom,     color: "from-blue-500 to-indigo-600",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
  { id: "organic-chemistry",       name: "জৈব রসায়ন",       icon: Leaf,     color: "from-green-500 to-emerald-600", bg: "bg-green-500/10",  border: "border-green-500/20"  },
  { id: "inorganic-chemistry",     name: "অজৈব রসায়ন",      icon: Beaker,   color: "from-purple-500 to-violet-600", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "analytical-chemistry",    name: "বিশ্লেষণী রসায়ন", icon: BarChart3, color: "from-orange-500 to-amber-600",  bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { id: "biochemistry",            name: "জীব রসায়ন",       icon: Dna,      color: "from-pink-500 to-rose-600",     bg: "bg-pink-500/10",   border: "border-pink-500/20"   },
  { id: "environmental-chemistry", name: "পরিবেশ রসায়ন",    icon: Wind,     color: "from-teal-500 to-green-600",    bg: "bg-teal-500/10",   border: "border-teal-500/20"   },
  { id: "industrial-chemistry",    name: "শিল্প রসায়ন",     icon: Factory,  color: "from-slate-400 to-slate-600",   bg: "bg-slate-500/10",  border: "border-slate-500/20"  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6 overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">বিষয়সমূহ</h1>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/learn/${cat.id}`}
                className={`flex flex-col items-center gap-3 p-5 ${cat.bg} border ${cat.border} rounded-2xl hover:-translate-y-1 hover:border-opacity-60 transition-all group text-center`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-200">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
