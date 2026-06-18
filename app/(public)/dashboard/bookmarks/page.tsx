"use client";

import { useAuth } from "@/components/shared/AuthProvider";
import { useBookmarks } from "@/hooks/useProgress";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Bookmark, BookOpen, Atom, FlaskConical, HelpCircle, ArrowRight } from "lucide-react";
import { InlineLoading } from "@/components/ui/Loading";

const typeConfig = {
  article:  { icon: BookOpen,    label: "আর্টিকেল",  color: "text-cyan-500",   bg: "bg-cyan-100 dark:bg-cyan-900/30", href: (id: string) => `/articles/${id}` },
  formula:  { icon: Atom,        label: "ফর্মুলা",   color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30", href: (id: string) => `/formulas/${id}` },
  reaction: { icon: FlaskConical,label: "বিক্রিয়া",  color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30", href: (id: string) => `/reactions#${id}` },
  question: { icon: HelpCircle,  label: "প্রশ্ন",    color: "text-green-500",  bg: "bg-green-100 dark:bg-green-900/30", href: () => `/question-bank` },
};

export default function BookmarksPage() {
  const { user, loading } = useAuth();
  const { bookmarks, loading: bLoading } = useBookmarks();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || bLoading) return <InlineLoading message="সংরক্ষিত আইটেম লোড হচ্ছে..." />;
  if (!user) return null;

  const tabs = ["article", "formula", "reaction", "question"] as const;

  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">সংরক্ষিত আইটেম</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">মোট {bookmarks.length}টি</p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl">
            <Bookmark className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">কিছু সংরক্ষিত নেই</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Formula, Article, Reaction পড়ার সময় Bookmark করো</p>
            <Link href="/learn" className="inline-flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl font-medium">
              শেখা শুরু করো <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {tabs.map(type => {
              const items = bookmarks.filter(b => b.refType === type);
              if (items.length === 0) return null;
              const config = typeConfig[type];
              const Icon = config.icon;
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-xl ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{config.label}</h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">({items.length}টি)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(b => (
                      <Link key={b.refId} href={config.href(b.refId)}
                        className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-all group">
                        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {b.refId}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{config.label}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
