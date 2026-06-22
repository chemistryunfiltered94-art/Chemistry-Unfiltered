import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, BookOpen, ArrowRight } from "lucide-react";
import { LevelBadge } from "@/components/ui/Badge";
import { getTopics } from "@/lib/firestore";
import { ChemistryCategory } from "@/types";

// Static decorative metadata per category (name, description, icon, color).
// This is presentation-only — actual topic content comes from Firestore.
const categoryMeta: Record<ChemistryCategory, { name: string; desc: string; color: string; icon: string }> = {
  "physical-chemistry": {
    name: "ভৌত রসায়ন",
    desc: "পদার্থের ভৌত ধর্ম, গ্যাস সূত্র, তাপগতিবিদ্যা, তড়িৎ রসায়ন এবং রাসায়নিক গতিবিদ্যা।",
    color: "from-blue-500 to-indigo-600", icon: "⚛️",
  },
  "organic-chemistry": {
    name: "জৈব রসায়ন",
    desc: "কার্বন যৌগের রসায়ন — হাইড্রোকার্বন, কার্যকরী গ্রুপ, জৈব বিক্রিয়া এবং জৈব সংশ্লেষণ।",
    color: "from-green-500 to-emerald-600", icon: "🌿",
  },
  "inorganic-chemistry": {
    name: "অজৈব রসায়ন",
    desc: "ধাতু, অধাতু, পর্যায় সারণি, রাসায়নিক বন্ধন এবং সমন্বয় যৌগের রসায়ন।",
    color: "from-purple-500 to-violet-600", icon: "🔬",
  },
  "analytical-chemistry": {
    name: "বিশ্লেষণী রসায়ন",
    desc: "টাইট্রেশন, ক্রোমাটোগ্রাফি, বর্ণালী বিশ্লেষণ এবং গুণগত-পরিমাণগত বিশ্লেষণ।",
    color: "from-orange-500 to-amber-600", icon: "📊",
  },
  biochemistry: {
    name: "জীব রসায়ন",
    desc: "প্রোটিন, কার্বোহাইড্রেট, লিপিড, নিউক্লিক অ্যাসিড এবং বিপাক ক্রিয়ার রসায়ন।",
    color: "from-pink-500 to-rose-600", icon: "🧬",
  },
  "environmental-chemistry": {
    name: "পরিবেশ রসায়ন",
    desc: "বায়ু দূষণ, জল রসায়ন, গ্রিন হাউস গ্যাস এবং পরিবেশ বিজ্ঞান।",
    color: "from-teal-500 to-green-600", icon: "🌍",
  },
  "industrial-chemistry": {
    name: "শিল্প রসায়ন",
    desc: "হেবার পদ্ধতি, সংস্পর্শ পদ্ধতি, সার উৎপাদন, তেল পরিশোধন এবং শিল্প প্রক্রিয়া।",
    color: "from-slate-500 to-gray-600", icon: "🏭",
  },
};

const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
const levelInfo = {
  beginner: { label: "শুরু (Beginner)", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
  intermediate: { label: "মধ্যবর্তী (Intermediate)", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  advanced: { label: "উন্নত (Advanced)", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
};

interface Props { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category as ChemistryCategory];
  if (!meta) return { title: "Not Found" };
  return { title: `${meta.name} — Chemistry Topics`, description: meta.desc };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = categoryMeta[category as ChemistryCategory];
  if (!meta) notFound();

  const topics = await getTopics({ categoryId: category });
  const sorted = [...topics].sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
  const levelGroups = {
    beginner: sorted.filter((t) => t.level === "beginner"),
    intermediate: sorted.filter((t) => t.level === "intermediate"),
    advanced: sorted.filter((t) => t.level === "advanced"),
  };

  return (
    <div className="section-padding">
      <div className="container-max">
        <Link href="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব বিষয়
        </Link>

        <div className={`bg-gradient-to-r ${meta.color} rounded-3xl p-8 text-white mb-10`}>
          <div className="text-5xl mb-4">{meta.icon}</div>
          <h1 className="text-4xl font-bold mb-2">{meta.name}</h1>
          <p className="text-white/80 max-w-2xl">{meta.desc}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{topics.length}টি টপিক</span>
          </div>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>এই বিষয়ে এখনো কোনো টপিক যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে যোগ করো।</p>
          </div>
        ) : (
          ([ "beginner", "intermediate", "advanced" ] as const).map((level) => {
            const levelTopics = levelGroups[level];
            if (levelTopics.length === 0) return null;
            const info = levelInfo[level];
            return (
              <div key={level} className="mb-10">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 ${info.bg} ${info.color}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {info.label}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/learn/${category}/${topic.slug}`}
                      className="block p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl card-hover group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <LevelBadge level={topic.level} />
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />{topic.estimatedTime} মি
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {topic.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-end">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
