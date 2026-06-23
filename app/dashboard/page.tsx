"use client";

import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useCollection } from "@/hooks/useFirestore";
import {
  BookOpen, FlaskConical, HelpCircle, Bookmark,
  TrendingUp, Clock, Award, ArrowRight, Users,
  Atom, Beaker, Calculator, ChevronRight,
} from "lucide-react";

const quickLinks = [
  { href: "/learn",          label: "বিষয়/টপিক",       icon: BookOpen,    color: "from-blue-500 to-indigo-600" },
  { href: "/formulas",       label: "ফর্মুলা",           icon: Atom,        color: "from-purple-500 to-violet-600" },
  { href: "/question-bank",  label: "প্রশ্নব্যাংক",      icon: HelpCircle,  color: "from-green-500 to-emerald-600" },
  { href: "/periodic-table", label: "পর্যায় সারণি",      icon: FlaskConical,color: "from-cyan-500 to-teal-600" },
  { href: "/calculators",    label: "ক্যালকুলেটর",       icon: Calculator,  color: "from-orange-500 to-amber-600" },
  { href: "/virtual-lab",    label: "ভার্চুয়াল ল্যাব",   icon: Beaker,      color: "from-pink-500 to-rose-600" },
];

function toBn(n: number) {
  return n.toLocaleString("bn-BD");
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { completedCount } = useProgress();

  // Site-level stats via real-time listeners
  const { data: allUsers }     = useCollection<{ id: string }>("users");
  const { data: allTopics }    = useCollection<{ id: string }>("topics");
  const { data: allFormulas }  = useCollection<{ id: string }>("formulas");
  const { data: allQuestions } = useCollection<{ id: string }>("questions");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

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

      {/* ── Hero / Greeting Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 px-4 py-10">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary-200 text-sm font-medium mb-1">স্বাগতম 👋</p>
            <h1 className="text-3xl font-bold text-white mb-1">{firstName}!</h1>
            <p className="text-primary-200 text-sm">আজকে কী শিখবে?</p>
          </motion.div>

          {/* Personal stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex gap-4 mt-6 flex-wrap"
          >
            {[
              { label: "সম্পন্ন টপিক", value: toBn(completedCount), icon: BookOpen },
              { label: "সংরক্ষিত",     value: "—",                  icon: Bookmark },
              { label: "অধ্যয়ন সময়",  value: "—",                  icon: Clock },
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

        {/* ── Site Stats Cards ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            প্ল্যাটফর্মের তথ্য
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "সক্রিয় শিক্ষার্থী", value: toBn(allUsers.length),     icon: Users,      color: "from-blue-500 to-indigo-600" },
              { label: "শিক্ষামূলক টপিক",   value: toBn(allTopics.length),    icon: BookOpen,   color: "from-green-500 to-emerald-600" },
              { label: "রসায়ন ফর্মুলা",     value: toBn(allFormulas.length),  icon: Atom,       color: "from-purple-500 to-violet-600" },
              { label: "অনুশীলন প্রশ্ন",     value: toBn(allQuestions.length), icon: HelpCircle, color: "from-orange-500 to-amber-600" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.06 }}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold gradient-text leading-none mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Quick Access Grid ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-primary-400" />
            দ্রুত অ্যাক্সেস
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <Link href={link.href}
                    className="flex flex-col items-center gap-2.5 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-primary-500/50 hover:-translate-y-1 transition-all group text-center"
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
        </motion.div>

        {/* ── Continue Learning + Achievements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
          >
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-400" /> শেখা চালিয়ে যাও
            </h2>
            {completedCount > 0 ? (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm">তুমি এখন পর্যন্ত <span className="text-primary-400 font-bold">{toBn(completedCount)}টি</span> টপিক সম্পন্ন করেছ।</p>
                <Link href="/learn"
                  className="flex items-center justify-between px-4 py-3 bg-primary-900/30 border border-primary-700/50 rounded-xl text-primary-400 text-sm font-medium hover:bg-primary-900/50 transition-colors">
                  আরো টপিক দেখো <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-14 h-14 bg-slate-700/50 rounded-full flex items-center justify-center mb-3">
                  <BookOpen className="w-7 h-7 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm mb-4">এখনো কোনো টপিক শুরু করোনি</p>
                <Link href="/learn"
                  className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  শেখা শুরু করো <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
          >
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" /> অর্জনসমূহ
            </h2>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-14 h-14 bg-slate-700/50 rounded-full flex items-center justify-center mb-3">
                <Award className="w-7 h-7 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm mb-4">কুইজ দাও এবং ব্যাজ অর্জন করো!</p>
              <Link href="/question-bank/mock-test"
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl text-sm font-semibold hover:bg-yellow-500/20 transition-colors">
                Mock Test দাও <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
