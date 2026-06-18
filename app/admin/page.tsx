"use client";

import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, BookOpen, HelpCircle,
  FlaskConical, Atom, FileText, TrendingUp,
  Settings, Plus, Eye, Edit
} from "lucide-react";

const stats = [
  { label: "মোট ব্যবহারকারী",  value: "০",    icon: Users,      color: "from-blue-500 to-indigo-600" },
  { label: "মোট টপিক",          value: "০",    icon: BookOpen,   color: "from-green-500 to-emerald-600" },
  { label: "মোট প্রশ্ন",        value: "০",    icon: HelpCircle, color: "from-purple-500 to-violet-600" },
  { label: "মোট আর্টিকেল",     value: "০",    icon: FileText,   color: "from-orange-500 to-amber-600" },
];

const quickActions = [
  { href: "/admin/topics/new",    label: "নতুন টপিক যোগ",      icon: BookOpen,  color: "from-green-500 to-emerald-600" },
  { href: "/admin/questions/new", label: "প্রশ্ন যোগ করো",     icon: HelpCircle,color: "from-purple-500 to-violet-600" },
  { href: "/admin/articles/new",  label: "আর্টিকেল লেখো",      icon: FileText,  color: "from-orange-500 to-amber-600" },
  { href: "/admin/formulas/new",  label: "ফর্মুলা যোগ",        icon: Atom,      color: "from-cyan-500 to-teal-600" },
  { href: "/admin/reactions/new", label: "বিক্রিয়া যোগ",      icon: FlaskConical,color:"from-rose-500 to-pink-600" },
  { href: "/admin/users",         label: "ব্যবহারকারী দেখো",   icon: Users,     color: "from-blue-500 to-indigo-600" },
];

const menuItems = [
  { href: "/admin/topics",    label: "টপিক ম্যানেজ",    icon: BookOpen },
  { href: "/admin/questions", label: "প্রশ্ন ম্যানেজ",   icon: HelpCircle },
  { href: "/admin/articles",  label: "আর্টিকেল ম্যানেজ", icon: FileText },
  { href: "/admin/formulas",  label: "ফর্মুলা ম্যানেজ",  icon: Atom },
  { href: "/admin/reactions", label: "বিক্রিয়া ম্যানেজ",icon: FlaskConical },
  { href: "/admin/users",     label: "ব্যবহারকারী",      icon: Users },
  { href: "/admin/settings",  label: "সেটিংস",           icon: Settings },
];

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-6 h-6 text-primary-400" />
            <span className="text-primary-400 font-medium">অ্যাডমিন প্যানেল</span>
          </div>
          <h1 className="text-3xl font-bold text-white">ChemistryOS Admin</h1>
          <p className="text-slate-400 mt-1">স্বাগতম, {user?.name}! সব কন্টেন্ট এখান থেকে পরিচালনা করো।</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">দ্রুত কাজ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link key={i} href={action.href}
                    className="flex flex-col items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-primary-500/50 transition-all hover:-translate-y-1 group text-center"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Menu */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">নেভিগেশন</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link key={i} href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700 last:border-0"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
