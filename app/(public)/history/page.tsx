import { Metadata } from "next";
import Link from "next/link";
import { ScrollText, Award, Users2 } from "lucide-react";

export const metadata: Metadata = {
  title: "ইতিহাস — Chemistry Unfiltered",
  description: "রসায়নের ইতিহাস, নোবেল বিজয়ী ও বিখ্যাত রসায়নবিদদের সম্পর্কে জানো।",
};

const sections = [
  {
    href: "/history/timeline",
    title: "রসায়নের ইতিহাস",
    titleEn: "History of Chemistry",
    desc: "প্রাচীন আলকেমি থেকে আধুনিক রসায়ন পর্যন্ত — যুগে যুগে গুরুত্বপূর্ণ আবিষ্কার ও তত্ত্বের সময়রেখা।",
    icon: ScrollText,
    gradient: "from-amber-500 to-orange-600",
    accent: "border-amber-500/40 hover:border-amber-400",
  },
  {
    href: "/history/nobel-laureates",
    title: "নোবেল বিজয়ী",
    titleEn: "Nobel Laureates",
    desc: "রসায়নে নোবেল পুরস্কারপ্রাপ্ত বিজ্ঞানীদের অবদান, জীবনী ও আবিষ্কার।",
    icon: Award,
    gradient: "from-yellow-500 to-amber-600",
    accent: "border-yellow-500/40 hover:border-yellow-400",
  },
  {
    href: "/history/scientists",
    title: "বিজ্ঞানী / Chemists",
    titleEn: "Scientists & Chemists",
    desc: "ইতিহাসের সবচেয়ে প্রভাবশালী রসায়নবিদদের জীবনী ও তাঁদের যুগান্তকারী কাজ।",
    icon: Users2,
    gradient: "from-purple-500 to-violet-600",
    accent: "border-purple-500/40 hover:border-purple-400",
  },
];

export default function HistoryHubPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">
              ইতিহাস
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-4">
              রসায়নের ইতিহাস ও মনীষীরা
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              রসায়ন কীভাবে আজকের রূপে এসেছে, কারা এর পেছনে ছিলেন — তাঁদের গল্প,
              আবিষ্কার ও স্বীকৃতি এক জায়গায়।
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={`flex items-center gap-4 p-4 bg-slate-800 border ${s.accent} rounded-2xl transition-all active:scale-95`}
                >
                  <div
                    className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="block text-base font-semibold text-slate-100 leading-snug">
                      {s.title}
                    </span>
                    <span className="block text-xs text-slate-400 mt-0.5 truncate">
                      {s.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
