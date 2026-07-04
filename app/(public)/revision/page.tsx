import Link from "next/link";
import { RotateCcw, ChevronRight, GraduationCap, BookMarked } from "lucide-react";

export const metadata = {
  title: "রিভিশন — Chemistry Unfiltered",
  description: "উচ্চ মাধ্যমিক ও অনার্স স্তরের বিগত সালের প্রশ্ন ও উত্তর দিয়ে রিভিশন দাও।",
};

const levels = [
  {
    href: "/revision/hsc",
    title: "উচ্চ মাধ্যমিক",
    subtitle: "HSC",
    desc: "একাদশ-দ্বাদশ শ্রেণির বিগত সালের বোর্ড প্রশ্ন ও উত্তর।",
    icon: BookMarked,
    color: "from-blue-500 to-indigo-600",
  },
  {
    href: "/revision/honours",
    title: "অনার্স",
    subtitle: "Honours",
    desc: "বিশ্ববিদ্যালয় পর্যায়ের বিগত সালের প্রশ্ন ও উত্তর।",
    icon: GraduationCap,
    color: "from-purple-500 to-violet-600",
  },
];

export default function RevisionPage() {
  return (
    <div className="section-padding">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <RotateCcw className="w-4 h-4" /> রিভিশন
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">রিভিশন করো</h1>
          <p className="text-slate-600 dark:text-slate-400">
            তোমার স্তর বেছে নাও, তারপর বিষয় ও সাল অনুযায়ী প্রশ্ন-উত্তর দেখো।
          </p>
        </div>

        <div className="space-y-4">
          {levels.map((lvl) => {
            const Icon = lvl.icon;
            return (
              <Link
                key={lvl.href}
                href={lvl.href}
                className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-500 hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lvl.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{lvl.title}</p>
                  <p className="text-xs text-slate-400 mb-1">{lvl.subtitle}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{lvl.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
