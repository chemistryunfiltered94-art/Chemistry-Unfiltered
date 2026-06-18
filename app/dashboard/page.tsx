"use client";

import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, FlaskConical, HelpCircle, Bookmark,
  TrendingUp, Clock, Award, ArrowRight, LayoutDashboard
} from "lucide-react";

const quickLinks = [
  { href: "/learn", label: "শেখা চালিয়ে যাও", icon: BookOpen, color: "from-blue-500 to-indigo-600" },
  { href: "/formulas", label: "ফর্মুলা দেখো", icon: FlaskConical, color: "from-purple-500 to-violet-600" },
  { href: "/question-bank", label: "প্রশ্ন অনুশীলন", icon: HelpCircle, color: "from-green-500 to-emerald-600" },
  { href: "/bookmarks", label: "সংরক্ষিত আইটেম", icon: Bookmark, color: "from-orange-500 to-amber-600" },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-6 h-6 text-primary-400" />
            <span className="text-primary-400 font-medium">ড্যাশবোর্ড</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            স্বাগতম, {user.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-400 mt-1">আজকে কী শিখবে?</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "সম্পন্ন টপিক", value: "০", icon: BookOpen, color: "text-blue-400" },
            { label: "গড় স্কোর", value: "০%", icon: TrendingUp, color: "text-green-400" },
            { label: "সংরক্ষিত আইটেম", value: "০", icon: Bookmark, color: "text-orange-400" },
            { label: "অধ্যয়ন সময়", value: "০ মিনিট", icon: Clock, color: "text-purple-400" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
              >
                <Icon className={`w-6 h-6 ${stat.color} mb-3`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">দ্রুত অ্যাক্সেস</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="flex flex-col items-center gap-3 p-5 bg-slate-800 border border-slate-700 rounded-2xl hover:border-primary-500/50 transition-all hover:-translate-y-1 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 text-center">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity + Continue Learning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-400" />
              শেখা চালিয়ে যাও
            </h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm mb-4">এখনো কোনো টপিক শুরু করোনি</p>
              <Link
                href="/learn"
                className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90"
              >
                শেখা শুরু করো <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              অর্জনসমূহ
            </h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm mb-4">
                কুইজ দাও এবং ব্যাজ অর্জন করো!
              </p>
              <Link
                href="/question-bank"
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-600"
              >
                প্রশ্ন অনুশীলন <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
