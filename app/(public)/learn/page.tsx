import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, Atom, Leaf, Beaker, BarChart3, Dna, Wind, Factory } from "lucide-react";

export const metadata: Metadata = {
  title: "Learning Center — রসায়ন শেখো",
  description: "Beginner থেকে Advanced পর্যন্ত সম্পূর্ণ Chemistry শিক্ষার পথ।",
};

const levels = [
  {
    name: "Beginner",
    nameBn: "শুরু করো",
    color: "from-green-500 to-emerald-600",
    border: "border-green-500",
    href: "/learn/beginner",
    desc: "কোনো পূর্ব জ্ঞান ছাড়াই শুরু করো",
    topics: ["পদার্থের অবস্থা", "পরমাণু ও অণু", "মৌল ও যৌগ", "রাসায়নিক সূত্র"],
  },
  {
    name: "Intermediate",
    nameBn: "এগিয়ে যাও",
    color: "from-blue-500 to-indigo-600",
    border: "border-blue-500",
    href: "/learn/intermediate",
    desc: "SSC ও HSC মানের রসায়ন",
    topics: ["পরমাণুর গঠন", "রাসায়নিক বন্ধন", "অ্যাসিড-ক্ষার", "তাপগতিবিদ্যা"],
  },
  {
    name: "Advanced",
    nameBn: "দক্ষ হও",
    color: "from-purple-500 to-violet-600",
    border: "border-purple-500",
    href: "/learn/advanced",
    desc: "University ও উচ্চতর পড়াশোনার জন্য",
    topics: ["জৈব বিক্রিয়ার মেকানিজম", "তড়িৎ রসায়ন", "কোয়ান্টাম রসায়ন", "জীব রসায়ন"],
  },
];

const categories = [
  { id: "physical-chemistry",     name: "ভৌত রসায়ন",       icon: Atom,     color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { id: "organic-chemistry",      name: "জৈব রসায়ন",       icon: Leaf,     color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  { id: "inorganic-chemistry",    name: "অজৈব রসায়ন",      icon: Beaker,   color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { id: "analytical-chemistry",   name: "বিশ্লেষণী রসায়ন", icon: BarChart3, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
  { id: "biochemistry",           name: "জীব রসায়ন",       icon: Dna,      color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { id: "environmental-chemistry",name: "পরিবেশ রসায়ন",    icon: Wind,     color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" },
  { id: "industrial-chemistry",   name: "শিল্প রসায়ন",     icon: Factory,  color: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400" },
];

export default function LearnPage() {
  return (
    <div className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Learning Center
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            রসায়ন শেখার পথ
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            তোমার মান অনুযায়ী শেখা শুরু করো এবং ধাপে ধাপে এগিয়ে যাও
          </p>
        </div>

        {/* Level cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {levels.map((level) => (
            <Link
              key={level.name}
              href={level.href}
              className={`block p-7 rounded-3xl border-2 ${level.border} border-opacity-50 bg-white dark:bg-slate-800 shadow-lg hover:-translate-y-1 transition-all group`}
            >
              <div className={`inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold bg-gradient-to-r ${level.color} mb-4`}>
                {level.name}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{level.nameBn}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">{level.desc}</p>
              <ul className="space-y-2 mb-6">
                {level.topics.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${level.color} bg-clip-text text-transparent group-hover:gap-3 transition-all`}>
                শুরু করো <ArrowRight className="w-4 h-4" style={{ color: "inherit" }} />
              </div>
            </Link>
          ))}
        </div>

        {/* Browse by Category */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            বিষয় অনুযায়ী ব্রাউজ করো
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/learn/${cat.id}`}
                  className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:-translate-y-1 transition-all hover:shadow-lg group text-center"
                >
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
