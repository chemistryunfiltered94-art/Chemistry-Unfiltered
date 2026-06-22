"use client";

import Link from "next/link";
import { useAuth } from "@/components/shared/AuthProvider";
import { ArrowLeft, Settings, User, Mail, Shield, Info } from "lucide-react";

export default function AdminSettingsPage() {
  const { user, isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">সেটিংস</h1>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">অ্যাকাউন্ট তথ্য</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500">নাম</p>
                <p className="text-white text-sm font-medium">{user?.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500">ইমেইল</p>
                <p className="text-white text-sm font-medium">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500">ভূমিকা</p>
                <p className="text-white text-sm font-medium capitalize">{user?.role || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">সম্পর্কিত</h2>
          <div className="space-y-2">
            <Link href="/admin/users" className="block text-sm text-primary-400 hover:text-primary-300">
              ব্যবহারকারী ও admin role পরিচালনা করো →
            </Link>
            <Link href="/profile" className="block text-sm text-primary-400 hover:text-primary-300">
              নিজের প্রোফাইল দেখো →
            </Link>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-2xl p-6 text-center">
          <Info className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          <p className="text-slate-400 text-sm">
            সাইট-লেভেল সেটিংস (থিম, নোটিফিকেশন, ব্যাকআপ ইত্যাদি) পরবর্তী আপডেটে যোগ করা হবে।
          </p>
        </div>
      </div>
    </div>
  );
}
