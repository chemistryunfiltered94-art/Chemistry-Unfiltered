import { Metadata } from "next";
import Link from "next/link";
import { Beaker, Droplets, Wind, Zap, TrendingUp, ArrowRight, FlaskConical, Gem, Palette, Scale, Flame, ThermometerSun } from "lucide-react";

export const metadata: Metadata = {
  title: "Virtual Lab — ভার্চুয়াল রসায়ন ল্যাব",
  description: "Browser-এ Chemistry পরীক্ষা করো। Acid-Base, Titration, Gas Laws, Electrochemistry সিমুলেশন।",
};

const labs = [
  {
    id: "acid-base",
    name: "অ্যাসিড-ক্ষার মিশ্রণ ল্যাব",
    nameEn: "Acid-Base Mixing Lab",
    desc: "বিভিন্ন অ্যাসিড ও ক্ষার মিশিয়ে pH পরিবর্তন পর্যবেক্ষণ করো। ইন্ডিকেটরের রং পরিবর্তন দেখো।",
    icon: Droplets,
    color: "from-green-500 to-emerald-600",
    difficulty: "সহজ",
    duration: "১৫-২০ মিনিট",
    concepts: ["pH স্কেল", "নিরপেক্ষকরণ", "ইন্ডিকেটর"],
    href: "/virtual-lab/acid-base",
    available: true,
  },
  {
    id: "titration",
    name: "টাইট্রেশন ল্যাব",
    nameEn: "Titration Lab",
    desc: "Burette ও Pipette ব্যবহার করে টাইট্রেশন করো। Equivalence point খুঁজে বের করো।",
    icon: FlaskConical,
    color: "from-blue-500 to-indigo-600",
    difficulty: "মাঝারি",
    duration: "২০-৩০ মিনিট",
    concepts: ["টাইট্রেশন কার্ভ", "Equivalence point", "ইন্ডিকেটর বাছাই"],
    href: "/virtual-lab/titration",
    available: true,
  },
  {
    id: "gas-laws",
    name: "গ্যাসের সূত্র ল্যাব",
    nameEn: "Gas Laws Lab",
    desc: "তাপমাত্রা, চাপ ও আয়তনের সম্পর্ক পর্যবেক্ষণ করো। Boyle ও Charles-এর সূত্র যাচাই করো।",
    icon: Wind,
    color: "from-purple-500 to-violet-600",
    difficulty: "সহজ",
    duration: "১৫-২০ মিনিট",
    concepts: ["Boyle's Law", "Charles's Law", "Ideal Gas Law"],
    href: "/virtual-lab/gas-laws",
    available: true,
  },
  {
    id: "electrochemistry",
    name: "তড়িৎ রসায়ন ল্যাব",
    nameEn: "Electrochemistry Lab",
    desc: "গ্যালভানিক কোষ তৈরি করো এবং ইলেকট্রোলাইসিস পরীক্ষা করো।",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    difficulty: "কঠিন",
    duration: "৩০-৪০ মিনিট",
    concepts: ["Galvanic Cell", "ইলেকট্রোলাইসিস", "ফ্যারাডের সূত্র"],
    href: "/virtual-lab/electrochemistry",
    available: true,
  },
  {
    id: "reaction-rate",
    name: "বিক্রিয়ার হার ল্যাব",
    nameEn: "Reaction Rate Lab",
    desc: "তাপমাত্রা, ঘনত্ব ও অনুঘটকের প্রভাব পর্যবেক্ষণ করো। গ্রাফে বিক্রিয়ার হার দেখো।",
    icon: TrendingUp,
    color: "from-rose-500 to-pink-600",
    difficulty: "মাঝারি",
    duration: "২০-২৫ মিনিট",
    concepts: ["Rate Law", "Activation Energy", "Catalyst Effect"],
    href: "/virtual-lab/reaction-rate",
    available: true,
  },
  {
    id: "distillation",
    name: "পাতন ল্যাব",
    nameEn: "Distillation Lab",
    desc: "সরল ও ভগ্নাংশিক পাতন করো। মিশ্রণ থেকে বিশুদ্ধ তরল পৃথক করো।",
    icon: Beaker,
    color: "from-teal-500 to-cyan-600",
    difficulty: "মাঝারি",
    duration: "২৫-৩০ মিনিট",
    concepts: ["স্ফুটনাঙ্ক", "বাষ্পীভবন", "ঘনীভবন"],
    href: "/virtual-lab/distillation",
    available: true,
  },
  {
    id: "crystallization",
    name: "ক্রিস্টালাইজেশন ল্যাব",
    nameEn: "Crystallization Lab",
    desc: "দ্রাব্যতা বনাম তাপমাত্রার সম্পর্ক ব্যবহার করে ক্রিস্টাল তৈরি করো। ঠান্ডা করার হার অনুযায়ী ক্রিস্টালের আকার দেখো।",
    icon: Gem,
    color: "from-violet-500 to-fuchsia-600",
    difficulty: "মাঝারি",
    duration: "২০-২৫ মিনিট",
    concepts: ["দ্রাব্যতা বনাম তাপ", "সুপারস্যাচুরেশন", "ক্রিস্টাল গঠন"],
    href: "/virtual-lab/crystallization",
    available: true,
  },
  {
    id: "chromatography",
    name: "পেপার ক্রোমাটোগ্রাফি ল্যাব",
    nameEn: "Paper Chromatography Lab",
    desc: "কালি, পাতার রঞ্জক বা ফুড কালার মিশ্রণ পৃথক করো এবং প্রতিটি উপাদানের Rf মান হিসাব করো।",
    icon: Palette,
    color: "from-amber-400 to-rose-500",
    difficulty: "সহজ",
    duration: "১৫-২০ মিনিট",
    concepts: ["Rf মান", "বিশোষণ", "মিশ্রণ পৃথকীকরণ"],
    href: "/virtual-lab/chromatography",
    available: true,
  },
  {
    id: "density",
    name: "ঘনত্ব নির্ণয় ল্যাব",
    nameEn: "Density Determination Lab",
    desc: "পানি অপসারণ পদ্ধতিতে অনিয়মিত আকৃতির বস্তুর ঘনত্ব মাপো এবং ভাসা-ডোবা পর্যবেক্ষণ করো।",
    icon: Scale,
    color: "from-sky-500 to-blue-700",
    difficulty: "সহজ",
    duration: "১০-১৫ মিনিট",
    concepts: ["ঘনত্ব = ভর/আয়তন", "আর্কিমিডিসের সূত্র", "ভাসা-ডোবা"],
    href: "/virtual-lab/density",
    available: true,
  },
  {
    id: "flame-test",
    name: "শিখা পরীক্ষা ল্যাব",
    nameEn: "Flame Test Lab",
    desc: "ধাতু আয়নের নির্দিষ্ট শিখার রঙ দেখো এবং কুইজ মোডে অজানা নমুনা চিহ্নিত করার অনুশীলন করো।",
    icon: Flame,
    color: "from-orange-500 to-red-600",
    difficulty: "সহজ",
    duration: "১০-১৫ মিনিট",
    concepts: ["ইলেকট্রন উত্তেজনা", "নির্গমন স্পেকট্রাম", "গুণগত বিশ্লেষণ"],
    href: "/virtual-lab/flame-test",
    available: true,
  },
  {
    id: "calorimetry",
    name: "ক্যালরিমেট্রি ল্যাব",
    nameEn: "Calorimetry Lab",
    desc: "তাপ ভারসাম্য দিয়ে ধাতুর আপেক্ষিক তাপ ধারণক্ষমতা মাপো এবং নিরপেক্ষীকরণ বিক্রিয়ার তাপ নির্ণয় করো।",
    icon: ThermometerSun,
    color: "from-red-500 to-orange-600",
    difficulty: "মাঝারি",
    duration: "২০-২৫ মিনিট",
    concepts: ["q = mcΔT", "তাপ ভারসাম্য", "এনথালপি"],
    href: "/virtual-lab/calorimetry",
    available: true,
  },
];

const diffColor: Record<string, string> = {
  "সহজ":   "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "মাঝারি": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  "কঠিন":  "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function VirtualLabPage() {
  return (
    <div className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Beaker className="w-4 h-4" />
            Virtual Laboratory
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ভার্চুয়াল রসায়ন ল্যাব
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Browser-এই করো Chemistry পরীক্ষা! কোনো Equipment লাগবে না।
            যেকোনো জায়গা থেকে, যেকোনো সময় পরীক্ষা করো।
          </p>
        </div>

        {/* Safety Note */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-10 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">ভার্চুয়াল ল্যাব নিরাপত্তা</p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              এগুলো সম্পূর্ণ সিমুলেশন। বাস্তব পরীক্ষায় সবসময় নিরাপত্তা সরঞ্জাম পরো এবং
              শিক্ষকের তত্ত্বাবধানে কাজ করো।
            </p>
          </div>
        </div>

        {/* Lab Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => {
            const Icon = lab.icon;
            return (
              <div
                key={lab.id}
                className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden ${lab.available ? "card-hover" : "opacity-70"}`}
              >
                {/* Color Header */}
                <div className={`bg-gradient-to-r ${lab.color} p-6 text-white relative`}>
                  {!lab.available && (
                    <div className="absolute top-3 right-3 bg-black/30 text-white text-xs px-2 py-1 rounded-full">
                      শীঘ্রই আসছে
                    </div>
                  )}
                  <Icon className="w-10 h-10 mb-3 opacity-90" />
                  <h2 className="text-lg font-bold mb-1">{lab.name}</h2>
                  <p className="text-white/70 text-sm">{lab.nameEn}</p>
                </div>

                <div className="p-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {lab.desc}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diffColor[lab.difficulty]}`}>
                      {lab.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ⏱ {lab.duration}
                    </span>
                  </div>

                  {/* Concepts */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {lab.concepts.map((c) => (
                      <span key={c} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                        {c}
                      </span>
                    ))}
                  </div>

                  {lab.available ? (
                    <Link
                      href={lab.href}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${lab.color} hover:opacity-90 transition-opacity group`}
                    >
                      ল্যাব শুরু করো
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <button disabled className="w-full py-3 rounded-xl text-slate-400 dark:text-slate-500 font-semibold border border-slate-200 dark:border-slate-700 cursor-not-allowed">
                      শীঘ্রই আসছে...
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
