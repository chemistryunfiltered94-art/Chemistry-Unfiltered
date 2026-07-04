"use client";

// app/dashboard/page.tsx

import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProgress, useBookmarks } from "@/hooks/useProgress";
import { useCollection } from "@/hooks/useFirestore";
import { useGamification } from "@/hooks/useGamification";
import {
  getTopics,
  getArticles,
  getUserProgress,
  getUserBookmarks,
  getSiteStats,
} from "@/lib/firestore";
import {
  BookOpen, FlaskConical, HelpCircle, Bookmark,
  TrendingUp, Clock, Users,
  Atom, Beaker, Calculator, CheckCircle2,
  FileText, Layers, ChevronRight, Star, Microscope,
  Zap, Award as AwardIcon, CalendarDays,
} from "lucide-react";
import { Topic, Article, Progress, Bookmark as BookmarkType } from "@/types";

import LabHeader from "@/components/dashboard/LabHeader";
import RecordRow from "@/components/dashboard/RecordRow";
import EmptyState from "@/components/dashboard/EmptyState";
import StatVial from "@/components/dashboard/StatVial";
import ElementLinkCard from "@/components/dashboard/ElementLinkCard";
import LevelProgressCard from "@/components/dashboard/LevelProgressCard";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import GamificationAchievements from "@/components/dashboard/GamificationAchievements";

function toBn(n: number) {
  return n.toLocaleString("bn-BD");
}

const quickLinks = [
  { href: "/learn",          label: "বিষয়/টপিক",     icon: BookOpen,     color: "from-blue-500 to-indigo-600",  symbol: "Tp", number: "01" },
  { href: "/formulas",       label: "ফর্মুলা",         icon: Atom,         color: "from-purple-500 to-violet-600", symbol: "Fm", number: "02" },
  { href: "/question-bank",  label: "প্রশ্নব্যাংক",    icon: HelpCircle,   color: "from-green-500 to-emerald-600", symbol: "Qb", number: "03" },
  { href: "/periodic-table", label: "পর্যায় সারণি",   icon: FlaskConical, color: "from-cyan-500 to-teal-600",     symbol: "Pt", number: "04" },
  { href: "/calculators",    label: "ক্যালকুলেটর",     icon: Calculator,   color: "from-orange-500 to-amber-600",  symbol: "Cl", number: "05" },
  { href: "/virtual-lab",    label: "ভার্চুয়াল ল্যাব", icon: Beaker,       color: "from-pink-500 to-rose-600",     symbol: "Vl", number: "06" },
];

export default function DashboardPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const { completedCount, progress } = useProgress();
  const { count: bookmarkCount, bookmarks } = useBookmarks();
  const { xp, streak, levelInfo, unlockedAchievements, lockedAchievements, activityLog } = useGamification();

  // Platform stats
  // "users" ও "topics" কালেকশনে firestore.rules per-document read গার্ড
  // করে (owner/admin, বা published==true), তাই সাধারণ ইউজারের জন্য raw
  // useCollection("users")/("topics") permission-denied দিয়ে ফেইল করে
  // এবং চুপচাপ ০ রিটার্ন করে। "formulas" ও "questions" পাবলিকলি রিডেবল
  // বলে raw listing-এ সমস্যা নেই। users/topics-এর সঠিক কাউন্টের জন্য
  // getSiteStats() ব্যবহার করা হচ্ছে, যেটা getTopics()-এর মতোই
  // published==true ফিল্টার করে এবং rules মেনে কাজ করে।
  const { data: allFormulas }  = useCollection<{ id: string }>("formulas");
  const { data: allQuestions } = useCollection<{ id: string }>("questions");
  const [platformStats, setPlatformStats] = useState({ users: 0, topics: 0 });

  useEffect(() => {
    if (!user) return;
    getSiteStats().then((s) => setPlatformStats({ users: s.users, topics: s.topics }));
  }, [user]);

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
    <div className="min-h-screen bg-slate-900">

      <LabHeader
        firstName={firstName}
        completedCount={completedCount}
        bookmarkCount={bookmarkCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── 0. পরীক্ষণ অগ্রগতি (গ্যামিফিকেশন) ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <LevelProgressCard levelInfo={levelInfo} streak={streak} />

          <div className="grid grid-cols-3 gap-3 mt-3">
            <StatVial label="লেভেল"        value={toBn(levelInfo.level)} icon={Zap}          color="purple" delay={0.1} />
            <StatVial label="মোট XP"       value={toBn(xp)}              icon={AwardIcon}    color="orange" delay={0.15} />
            <StatVial label="সম্পন্ন টপিক" value={toBn(completedCount)}  icon={CheckCircle2} color="green"  delay={0.2} />
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mt-3">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary-400" />
              অ্যাক্টিভিটি — গত ৫২ সপ্তাহ
            </h3>
            <ActivityHeatmap activityLog={activityLog} />
          </div>

          {(unlockedAchievements.length > 0 || lockedAchievements.length > 0) && (
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">ল্যাব ব্যাজ</h3>
              <GamificationAchievements unlocked={unlockedAchievements} locked={lockedAchievements} />
            </div>
          )}
        </motion.section>

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
                <RecordRow
                  key={topic.id}
                  href={`/learn/${topic.categoryId}/${topic.slug}`}
                  icon={CheckCircle2}
                  title={topic.title}
                  meta={`${topic.estimatedTime} মিনিট`}
                  accent="green"
                  delay={i * 0.06}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Microscope}
              text="এখনো কোনো টপিক সম্পন্ন হয়নি — প্রথম পরীক্ষাটা শুরু করো।"
              ctaLabel="শেখা শুরু করো"
              ctaHref="/learn"
            />
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
              {savedItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                >
                  <Link href={typeHref[item.refType] || "/"}
                    className="relative flex items-center gap-3 pl-4 pr-3 py-3 bg-slate-800/80 border border-slate-700 rounded-lg overflow-hidden hover:border-yellow-500/40 transition-all group"
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">{item.refId}</p>
                      <p className="text-xs text-slate-400">{typeLabel[item.refType]}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bookmark}
              text="এখনো কিছু সংরক্ষণ করোনি — কাজে লাগবে এমন ফর্মুলা তুলে রাখো।"
              ctaLabel="ফর্মুলা দেখো"
              ctaHref="/formulas"
              tone="yellow"
            />
          )}
        </motion.section>

        {/* ── 3. প্ল্যাটফর্মের তথ্য ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            প্ল্যাটফর্মের তথ্য
          </h2>
          <div className={isAdmin ? "grid grid-cols-2 gap-3" : "grid grid-cols-3 gap-3"}>
            {/* firestore.rules-এ /users/{id} শুধু owner/admin read করতে পারে,
                তাই এই কার্ডে সঠিক সংখ্যা কেবল অ্যাডমিনের জন্যই আসে। non-admin
                ইউজারকে ভুল/০ সংখ্যা দেখানোর বদলে কার্ডটাই বাদ দেওয়া হচ্ছে,
                আর বাদ দিলে গ্রিড ৩-কলামে বদলে যায় যাতে খালি জায়গা না থাকে। */}
            {isAdmin && (
              <StatVial
                label="সক্রিয় শিক্ষার্থী"
                value={toBn(platformStats.users)}
                icon={Users}
                color="blue"
                delay={0.25}
              />
            )}
            <StatVial
              label="শিক্ষামূলক টপিক"
              value={toBn(platformStats.topics)}
              icon={BookOpen}
              color="green"
              delay={0.31}
            />
            <StatVial
              label="রসায়ন ফর্মুলা"
              value={toBn(allFormulas.length)}
              icon={Atom}
              color="purple"
              delay={0.37}
            />
            <StatVial
              label="অনুশীলন প্রশ্ন"
              value={toBn(allQuestions.length)}
              icon={HelpCircle}
              color="orange"
              delay={0.43}
            />
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
                    <RecordRow
                      key={topic.id}
                      href={`/learn/${topic.categoryId}/${topic.slug}`}
                      icon={BookOpen}
                      title={topic.title}
                      meta={`${topic.estimatedTime} মিনিট • ${topic.level}`}
                      accent="blue"
                      delay={i * 0.05}
                    />
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
                    <RecordRow
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      icon={FileText}
                      title={article.title}
                      meta={article.summary}
                      accent="purple"
                      delay={i * 0.05}
                    />
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
            {quickLinks.map((link, i) => (
              <ElementLinkCard
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                symbol={link.symbol}
                number={link.number}
                color={link.color}
                delay={0.35 + i * 0.05}
              />
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
