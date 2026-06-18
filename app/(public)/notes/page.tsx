import { Metadata } from "next";
import Link from "next/link";
import { FileText, BookOpen, RotateCcw, ClipboardList, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Notes — রসায়ন নোটস",
  description: "Class Notes, Revision Notes ও Practical Notes।",
};

const noteCategories = [
  { icon: BookOpen,     label: "ক্লাস নোটস",     desc: "বিষয়ভিত্তিক বিস্তারিত নোট",        color: "from-blue-500 to-indigo-600",   count: 45, href: "/notes?type=class" },
  { icon: RotateCcw,    label: "রিভিশন নোটস",    desc: "দ্রুত পুনরালোচনার জন্য সংক্ষিপ্ত নোট", color: "from-green-500 to-emerald-600",  count: 30, href: "/notes?type=revision" },
  { icon: ClipboardList,label: "প্র্যাকটিক্যাল নোটস", desc: "ল্যাবরেটরি পরীক্ষার নোট",      color: "from-purple-500 to-violet-600", count: 20, href: "/notes?type=practical" },
  { icon: FileText,     label: "ফর্মুলা শিট",     desc: "সব গুরুত্বপূর্ণ সূত্রের সংকলন",     color: "from-orange-500 to-amber-600",  count: 15, href: "/notes?type=formula" },
];

const recentNotes = [
  { title: "অ্যাসিড-ক্ষার বিক্রিয়া — সংক্ষিপ্ত নোট", type: "রিভিশন", category: "ভৌত রসায়ন", date: "আজকে" },
  { title: "জৈব যৌগের শ্রেণিবিভাগ", type: "ক্লাস", category: "জৈব রসায়ন", date: "গতকাল" },
  { title: "ইলেক্ট্রোলাইসিস প্র্যাকটিক্যাল", type: "প্র্যাকটিক্যাল", category: "তড়িৎ রসায়ন", date: "২ দিন আগে" },
  { title: "হেসের সূত্র ও তাপরাসায়নিক হিসাব", type: "ক্লাস", category: "তাপগতিবিদ্যা", date: "৩ দিন আগে" },
];

export default function NotesPage() {
  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            নোটস সেন্টার
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Chemistry Notes</h1>
          <p className="text-slate-600 dark:text-slate-400">Class Notes, Revision Notes ও Practical Notes — সব এক জায়গায়</p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {noteCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link key={i} href={cat.href}
                className="block p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl card-hover group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{cat.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{cat.count}টি নোট</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Notes */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">সাম্প্রতিক নোটস</h2>
          <div className="space-y-3">
            {recentNotes.map((note, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{note.type}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{note.category}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{note.date}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
