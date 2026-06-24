"use client";

// app/dashboard/page.tsx

import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProgress, useBookmarks } from "@/hooks/useProgress";
import { useCollection } from "@/hooks/useFirestore";
import {
  getTopics,
  getArticles,
  getUserProgress,
  getUserBookmarks,
} from "@/lib/firestore";
import {
  BookOpen, FlaskConical, HelpCircle, Bookmark,
  TrendingUp, Clock, Award, ArrowRight, Users,
  Atom, Beaker, Calculator, CheckCircle2,
  FileText, Layers, ChevronRight, Star,
} from "lucide-react";
import { Topic, Article, Progress, Bookmark as BookmarkType } from "@/types";

function toBn(n: number) {
  return n.toLocaleString("bn-BD");
}

function timeAgo(date: Date | undefined): string {
  if (!date) return "";
  const now = new Date();
  const d = date instanceof Date ? date : new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60)   return "এইমাত্র";
  if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ঘণ্টা আগে`;
  return `${Math.floor(diff / 86400)} দিন আগে`;
}

const quickLinks = [
  { href: "/learn",          label: "বিষয়/টপিক",     icon: BookOpen,     color: "from-blue-500 to-indigo-600" },
  { href: "/formulas",       label: "ফর্মুলা",         icon: Atom,         color: "from-purple-500 to-violet-600" },
  { href: "/question-bank",  label: "প্রশ্নব্যাংক",    icon: HelpCircle,   color: "from-green-500 to-emerald-600" },
  { href: "/periodic-table", label: "পর্যায় সারণি",   icon: FlaskConical, color: "from-cyan-500 to-teal-600" },
  { href: "/calculators",    label: "ক্যালকুলেটর",     icon: Calculator,   color: "from-orange-500 to-amber-600" },
  { href: "/virtual-lab",    label: "ভার্চুয়াল ল্যাব", icon: Beaker,       color: "from-pink-500 to-rose-600" },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { completedCount, progress } = useProgress();
  const { count: bookmarkCount, bookmarks } = useBookmarks();

  // Platform stats
  const { data: allUsers }     = useCollection<{ id: string }>("users");
  const { data: allTopics }    = useCollection<{ id: string }>("topics");
  const { data: allFormulas }  = useCollection<{ id: string }>("formulas");
  const { data: allQuestions } = useCollection<{ id: string }>("questions");

  // Recent activity data
  const [recentTopics,   setRecentTopics]   = useState<Topic[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [completedTopics, setCompletedTopics] = useState<Topic[]>([]);
  const [savedItems, setSavedItems]           = useState<BookmarkType[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch recent topics + articles + user completed topics + bookmarks
  useEffect(() => {
    if (!user) return;

    async function load() {
      setActivityLoading(true);
      const [topics, articles, userProgress, userBookmarks] = await Promise.all([
        getTopics({ limitCount: 5 }),
        getArticles({ limitCount: 5 }),
        getUserProgress(user!.uid),
        getUserBookmarks(user!.uid),
      ]);

      setRecentTopics(topics);
      setRecentArticles(articles);
      setSavedItems(userBookmarks.slice(0, 5));

      // Match completed topic IDs to actual topic names
      const completedIds = userProgress
        .filter((p) => p.completed)
        .map((p) => p.topicId);
      const matched = topics.filter((t) => completedIds.includes(t.id));
      setCompletedTopics(matched.slice(0, 5));

      setActivityLoading(false);
    }

    load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "বন্ধু";

  return (
    <div className="min-h-screen bg-slate-900">

      {/* ── Greeting Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 px-4 py-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary-200 text-sm font-medium mb-1">স্বাগতম</p>
            <h1 className="text-3xl font-bold text-white mb-1">{firstName}!</h1>
            <p className="text-primary-200 text-sm">আজকে কী শিখবে?</p>
          </motion.div>

          {/* Personal quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex gap-3 mt-6 flex-wrap"
          >
            {[
              { label: "সম্পন্ন টপিক", value: toBn(completedCount), icon: CheckCircle2 },
              { label: "সংরক্ষিত",     value: toBn(bookmarkCount),  icon: Bookmark },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                  <Icon className="w-4 h-4 text-primary-200" />
                  <div>
                    <div className="text-white font-bold text-lg leading-none">{s.value}</div>
                    <div className="text-primary-200 text-xs mt-0.5">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── 1. সম্পন্ন টপিক ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              সম্পন্ন টপিক
            </h2>
            <Link href="/learn" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              সব দেখো <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {activityLoading ? (
            <div className="grid grid-cols-1 gap-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : completedTopics.length > 0 ? (
            <div className="space-y-2">
              {completedTopics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/learn/${topic.categoryId}/${topic.slug}`}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-green-500/40 transition-all group"
                  >
                    <div className="w-8 h-8 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{topic.title}</p>
                      <p className="text-xs text-slate-400">{topic.estimatedTime} মিনিট</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-green-400 transition-colors flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-slate-800 border border-slate-700 rounded-2xl text-center">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm mb-4">এখনো কোনো টপিক সম্পন্ন হয়নি</p>
              <Link href="/learn"
                className="flex items-center gap-2 px-5 py-2 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                শেখা শুরু করো <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.section>

        {/* ── 2. সংরক্ষিত আইটেম ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-yellow-400" />
              সংরক্ষিত
            </h2>
            <Link href="/dashboard/bookmarks" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              সব দেখো <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {activityLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : savedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {savedItems.map((item, i) => {
                const typeLabel: Record<string, string> = {
                  article:  "আর্টিকেল",
                  formula:  "ফর্মুলা",
                  reaction: "বিক্রিয়া",
                  question: "প্রশ্ন",
                };
                const typeHref: Record<string, string> = {
                  article:  "/articles",
                  formula:  "/formulas",
                  reaction: "/reactions",
                  question: "/question-bank",
                };
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                  >
                    <Link href={typeHref[item.refType] || "/"}
                      className="flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-yellow-500/40 transition-all group"
                    >
                      <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">{item.refId}</p>
                        <p className="text-xs text-slate-400">{typeLabel[item.refType]}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-slate-800 border border-slate-700 rounded-2xl text-center">
              <Bookmark className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm mb-4">এখনো কিছু সংরক্ষণ করোনি</p>
              <Link href="/formulas"
                className="flex items-center gap-2 px-5 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl text-sm font-semibold hover:bg-yellow-500/20 transition-colors">
                ফর্মুলা দেখো <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.section>

        {/* ── 3. প্ল্যাটফর্মের তথ্য ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            প্ল্যাটফর্মের তথ্য
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "সক্রিয় শিক্ষার্থী", value: toBn(allUsers.length),     icon: Users,      color: "from-blue-500 to-indigo-600" },
              { label: "শিক্ষামূলক টপিক",   value: toBn(allTopics.length),    icon: BookOpen,   color: "from-green-500 to-emerald-600" },
              { label: "রসায়ন ফর্মুলা",     value: toBn(allFormulas.length),  icon: Atom,       color: "from-purple-500 to-violet-600" },
              { label: "অনুশীলন প্রশ্ন",     value: toBn(allQuestions.length), icon: HelpCircle, color: "from-orange-500 to-amber-600" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.06 }}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold gradient-text leading-none">{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 4. সর্বশেষ অ্যাক্টিভিটি ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-400" />
            সর্বশেষ অ্যাক্টিভিটি
          </h2>

          <div className="space-y-4">

            {/* সর্বশেষ টপিক */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" /> সর্বশেষ টপিক
                </p>
                <Link href="/learn" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  সব <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {activityLoading ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTopics.slice(0, 3).map((topic, i) => (
                    <motion.div key={topic.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link href={`/learn/${topic.categoryId}/${topic.slug}`}
                        className="flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500/40 transition-all group"
                      >
                        <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{topic.title}</p>
                          <p className="text-xs text-slate-400">{topic.estimatedTime} মিনিট • {topic.level}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* সর্বশেষ আর্টিকেল */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" /> সর্বশেষ আর্টিকেল
                </p>
                <Link href="/articles" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  সব <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {activityLoading ? (
                <div className="space-y-2">
                  {[1,2].map(i => <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {recentArticles.slice(0, 3).map((article, i) => (
                    <motion.div key={article.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link href={`/articles/${article.slug}`}
                        className="flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-purple-500/40 transition-all group"
                      >
                        <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{article.title}</p>
                          <p className="text-xs text-slate-400 truncate">{article.summary}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </motion.section>

        {/* ── 5. দ্রুত অ্যাক্সেস ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-primary-400" />
            দ্রুত অ্যাক্সেস
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
                  <Link href={link.href}
                    className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-primary-500/50 hover:-translate-y-1 transition-all group text-center"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-300 leading-tight">{link.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
