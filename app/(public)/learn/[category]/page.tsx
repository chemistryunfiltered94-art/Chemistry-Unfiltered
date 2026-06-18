import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, BookOpen, ArrowRight } from "lucide-react";
import { LevelBadge } from "@/components/ui/Badge";

// ── Static category data ──────────────────────────────────────────
const categories: Record<string, {
  name: string; desc: string;
  color: string; icon: string;
  topics: { slug: string; title: string; level: "beginner"|"intermediate"|"advanced"; time: number; summary: string }[]
}> = {
  "physical-chemistry": {
    name: "ভৌত রসায়ন", desc: "পদার্থের ভৌত ধর্ম, গ্যাস সূত্র, তাপগতিবিদ্যা, তড়িৎ রসায়ন এবং রাসায়নিক গতিবিদ্যা।",
    color: "from-blue-500 to-indigo-600", icon: "⚛️",
    topics: [
      { slug:"states-of-matter",    title:"পদার্থের অবস্থা",       level:"beginner",     time:20, summary:"কঠিন, তরল ও গ্যাস অবস্থার বৈশিষ্ট্য এবং পরিবর্তন।" },
      { slug:"gas-laws",            title:"গ্যাসের সূত্রসমূহ",     level:"intermediate", time:30, summary:"Boyle, Charles, Gay-Lussac এবং Ideal Gas Law।" },
      { slug:"acid-base",           title:"অ্যাসিড ও ক্ষার",       level:"intermediate", time:25, summary:"অ্যাসিড-ক্ষারের সংজ্ঞা, pH স্কেল, নিরপেক্ষকরণ বিক্রিয়া।" },
      { slug:"thermodynamics",      title:"তাপগতিবিদ্যা",          level:"intermediate", time:35, summary:"এনথালপি, এন্ট্রপি, গিবস শক্তি এবং তাপগতিবিদ্যার সূত্র।" },
      { slug:"chemical-equilibrium",title:"রাসায়নিক সাম্যাবস্থা", level:"intermediate", time:30, summary:"Le Chatelier নীতি, K_eq, সাম্যের প্রভাবকসমূহ।" },
      { slug:"electrochemistry",    title:"তড়িৎ রসায়ন",           level:"advanced",     time:40, summary:"গ্যালভানিক কোষ, ইলেকট্রোলাইসিস, Nernst সমীকরণ।" },
      { slug:"chemical-kinetics",   title:"রাসায়নিক গতিবিদ্যা",   level:"advanced",     time:35, summary:"বিক্রিয়ার হার, Rate Law, Arrhenius সমীকরণ।" },
      { slug:"solutions",           title:"দ্রবণ রসায়ন",           level:"intermediate", time:25, summary:"মোলারিটি, মোলালিটি, দ্রাব্যতা, বাষ্পচাপ হ্রাস।" },
    ],
  },
  "organic-chemistry": {
    name: "জৈব রসায়ন", desc: "কার্বন যৌগের রসায়ন — হাইড্রোকার্বন, কার্যকরী গ্রুপ, জৈব বিক্রিয়া এবং জৈব সংশ্লেষণ।",
    color: "from-green-500 to-emerald-600", icon: "🌿",
    topics: [
      { slug:"hydrocarbons",        title:"হাইড্রোকার্বন",           level:"beginner",     time:30, summary:"অ্যালকেন, অ্যালকিন, অ্যালকাইন এবং তাদের বৈশিষ্ট্য।" },
      { slug:"functional-groups",   title:"কার্যকরী গ্রুপ",         level:"intermediate", time:25, summary:"অ্যালকোহল, অ্যালডিহাইড, কিটোন, কার্বোক্সিলিক অ্যাসিড।" },
      { slug:"organic-reactions",   title:"জৈব বিক্রিয়া",          level:"advanced",     time:45, summary:"SN1, SN2, E1, E2, Aldol condensation, Friedel-Crafts।" },
      { slug:"aromatic-compounds",  title:"সুগন্ধি যৌগ",            level:"advanced",     time:35, summary:"বেঞ্জিন, আরোমাটিক বিক্রিয়া, ইলেকট্রোফিলিক প্রতিস্থাপন।" },
      { slug:"polymers",            title:"পলিমার",                  level:"intermediate", time:25, summary:"যুত পলিমার, ঘনীভবন পলিমার, জৈব-বিভাজ্য পলিমার।" },
      { slug:"carbohydrates",       title:"কার্বোহাইড্রেট",          level:"intermediate", time:30, summary:"মনোস্যাকারাইড, ডাইস্যাকারাইড, পলিস্যাকারাইড।" },
    ],
  },
  "inorganic-chemistry": {
    name: "অজৈব রসায়ন", desc: "ধাতু, অধাতু, পর্যায় সারণি, রাসায়নিক বন্ধন এবং সমন্বয় যৌগের রসায়ন।",
    color: "from-purple-500 to-violet-600", icon: "🔬",
    topics: [
      { slug:"periodic-table",      title:"পর্যায় সারণি",          level:"beginner",     time:30, summary:"মৌলের পর্যায়বৃত্ত ধর্ম, গ্রুপ ও পর্যায়, ইলেকট্রন বিন্যাস।" },
      { slug:"atomic-structure",    title:"পরমাণুর গঠন",            level:"beginner",     time:25, summary:"Bohr মডেল, কোয়ান্টাম সংখ্যা, অরবিটাল এবং ইলেকট্রন বিন্যাস।" },
      { slug:"chemical-bonding",    title:"রাসায়নিক বন্ধন",        level:"intermediate", time:30, summary:"আয়নিক, সমযোজী, ধাতব বন্ধন, VSEPR থিওরি, হাইব্রিডাইজেশন।" },
      { slug:"coordination-compounds", title:"সমন্বয় যৌগ",       level:"advanced",     time:35, summary:"জটিল যৌগ, লিগ্যান্ড, Crystal Field Theory।" },
      { slug:"metals-nonmetals",    title:"ধাতু ও অধাতু",          level:"intermediate", time:25, summary:"ধাতুর ধর্ম, অধাতুর ধর্ম, ধাতুকল্প।" },
    ],
  },
  "analytical-chemistry": {
    name: "বিশ্লেষণী রসায়ন", desc: "টাইট্রেশন, ক্রোমাটোগ্রাফি, বর্ণালী বিশ্লেষণ এবং গুণগত-পরিমাণগত বিশ্লেষণ।",
    color: "from-orange-500 to-amber-600", icon: "📊",
    topics: [
      { slug:"titration",           title:"টাইট্রেশন",              level:"intermediate", time:30, summary:"অ্যাসিড-ক্ষার, রেডক্স, জটিলমিতি টাইট্রেশন।" },
      { slug:"chromatography",      title:"ক্রোমাটোগ্রাফি",         level:"intermediate", time:25, summary:"TLC, কলাম, HPLC — মিশ্রণ পৃথকীকরণ পদ্ধতি।" },
      { slug:"spectroscopy",        title:"বর্ণালী বিশ্লেষণ",       level:"advanced",     time:35, summary:"UV-Vis, IR, NMR বর্ণালীমিতি।" },
      { slug:"gravimetric-analysis",title:"গুরুত্বমিতি বিশ্লেষণ",   level:"intermediate", time:20, summary:"অধক্ষেপণ এবং ভর পরিমাপের মাধ্যমে বিশ্লেষণ।" },
    ],
  },
  "biochemistry": {
    name: "জীব রসায়ন", desc: "প্রোটিন, কার্বোহাইড্রেট, লিপিড, নিউক্লিক অ্যাসিড এবং বিপাক ক্রিয়ার রসায়ন।",
    color: "from-pink-500 to-rose-600", icon: "🧬",
    topics: [
      { slug:"proteins",            title:"প্রোটিন",                 level:"intermediate", time:30, summary:"অ্যামিনো অ্যাসিড, পেপটাইড বন্ধন, প্রোটিনের গঠন।" },
      { slug:"enzymes",             title:"এনজাইম",                  level:"advanced",     time:35, summary:"এনজাইমের কার্যপদ্ধতি, inhibition, Michaelis-Menten।" },
      { slug:"dna-rna",             title:"DNA ও RNA",               level:"intermediate", time:30, summary:"নিউক্লিওটাইড, ডবল হেলিক্স, DNA প্রতিলিপি।" },
      { slug:"metabolic-pathways",  title:"বিপাক পথ",               level:"advanced",     time:40, summary:"গ্লাইকোলাইসিস, Krebs চক্র, অক্সিডেটিভ ফসফোরাইলেশন।" },
    ],
  },
  "environmental-chemistry": {
    name: "পরিবেশ রসায়ন", desc: "বায়ু দূষণ, জল রসায়ন, গ্রিন হাউস গ্যাস এবং পরিবেশ বিজ্ঞান।",
    color: "from-teal-500 to-green-600", icon: "🌍",
    topics: [
      { slug:"air-pollution",       title:"বায়ু দূষণ",              level:"intermediate", time:25, summary:"CO₂, SO₂, NOₓ — কারণ, প্রভাব ও প্রতিকার।" },
      { slug:"water-chemistry",     title:"জল রসায়ন",               level:"intermediate", time:25, summary:"পানির pH, কঠিনতা, দূষণ এবং পরিশোধন।" },
      { slug:"greenhouse-effect",   title:"গ্রিনহাউস প্রভাব",        level:"beginner",     time:20, summary:"গ্রিনহাউস গ্যাস, জলবায়ু পরিবর্তন, প্রভাব।" },
    ],
  },
  "industrial-chemistry": {
    name: "শিল্প রসায়ন", desc: "হেবার পদ্ধতি, সংস্পর্শ পদ্ধতি, সার উৎপাদন, তেল পরিশোধন এবং শিল্প প্রক্রিয়া।",
    color: "from-slate-500 to-gray-600", icon: "🏭",
    topics: [
      { slug:"haber-process",       title:"হেবার পদ্ধতি",            level:"intermediate", time:25, summary:"অ্যামোনিয়া উৎপাদনের শিল্প প্রক্রিয়া।" },
      { slug:"contact-process",     title:"সংস্পর্শ পদ্ধতি",         level:"intermediate", time:25, summary:"সালফিউরিক অ্যাসিড উৎপাদনের শিল্প প্রক্রিয়া।" },
      { slug:"petroleum-refining",  title:"তেল পরিশোধন",             level:"intermediate", time:30, summary:"ভগ্নাংশিক পাতন, ক্র্যাকিং, পেট্রোলিয়াম পণ্য।" },
      { slug:"fertilizers",         title:"সার উৎপাদন",              level:"intermediate", time:20, summary:"নাইট্রোজেন, ফসফেট, পটাশ সার এবং উৎপাদন পদ্ধতি।" },
    ],
  },
};

const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };

interface Props { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categories[category];
  if (!cat) return { title: "Not Found" };
  return {
    title: `${cat.name} — Chemistry Topics`,
    description: cat.desc,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = categories[category];
  if (!cat) notFound();

  const sorted = [...cat.topics].sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
  const levelGroups = {
    beginner:     sorted.filter(t => t.level === "beginner"),
    intermediate: sorted.filter(t => t.level === "intermediate"),
    advanced:     sorted.filter(t => t.level === "advanced"),
  };
  const levelInfo = {
    beginner:     { label: "শুরু (Beginner)",         color: "text-green-600 dark:text-green-400",  bg: "bg-green-100 dark:bg-green-900/30" },
    intermediate: { label: "মধ্যবর্তী (Intermediate)", color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-100 dark:bg-blue-900/30" },
    advanced:     { label: "উন্নত (Advanced)",         color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  };

  return (
    <div className="section-padding">
      <div className="container-max">
        {/* Back */}
        <Link href="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব বিষয়
        </Link>

        {/* Header */}
        <div className={`bg-gradient-to-r ${cat.color} rounded-3xl p-8 text-white mb-10`}>
          <div className="text-5xl mb-4">{cat.icon}</div>
          <h1 className="text-4xl font-bold mb-2">{cat.name}</h1>
          <p className="text-white/80 max-w-2xl">{cat.desc}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{cat.topics.length}টি টপিক</span>
          </div>
        </div>

        {/* Topics by level */}
        {(["beginner","intermediate","advanced"] as const).map((level) => {
          const topics = levelGroups[level];
          if (topics.length === 0) return null;
          const info = levelInfo[level];
          return (
            <div key={level} className="mb-10">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 ${info.bg} ${info.color}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {info.label}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/learn/${category}/${topic.slug}`}
                    className="block p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl card-hover group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <LevelBadge level={topic.level} />
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />{topic.time} মি
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
        })}
      </div>
    </div>
  );
}
