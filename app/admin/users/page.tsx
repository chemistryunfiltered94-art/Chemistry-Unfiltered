"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { getAllUsers, updateUser } from "@/lib/firestore";
import { User } from "@/types";
import { motion } from "framer-motion";
import { Users, Shield, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminUsersPage() {
  const { isAdmin } = useAuth();
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    getAllUsers().then(data => { setUsers(data); setLoading(false); });
  }, [isAdmin]);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (uid: string, role: "student" | "admin") => {
    setUpdating(uid);
    await updateUser(uid, { role });
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
    setUpdating(null);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ব্যবহারকারী ব্যবস্থাপনা</h1>
              <p className="text-slate-400 text-sm">মোট {users.length} জন ব্যবহারকারী</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="নাম বা ইমেইল দিয়ে খোঁজো..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "মোট ব্যবহারকারী", value: users.length,                             color: "from-blue-500 to-indigo-600" },
            { label: "শিক্ষার্থী",       value: users.filter(u=>u.role==="student").length, color: "from-green-500 to-emerald-600" },
            { label: "অ্যাডমিন",         value: users.filter(u=>u.role==="admin").length,   color: "from-purple-500 to-violet-600" },
          ].map(s => (
            <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center">
              <div className={`text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* User Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">ব্যবহারকারী</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">ইমেইল</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">ভূমিকা</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <motion.tr key={user.uid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{user.name || "Unknown"}</p>
                          <p className="text-xs text-slate-500 sm:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400 hidden sm:table-cell">{user.email}</td>
                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={user.role || "student"}
                          onChange={e => handleRoleChange(user.uid, e.target.value as "student" | "admin")}
                          disabled={updating === user.uid}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none transition-colors ${
                            user.role === "admin"
                              ? "bg-purple-900/40 border-purple-600 text-purple-300"
                              : "bg-blue-900/40 border-blue-600 text-blue-300"
                          } ${updating === user.uid ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <option value="student">শিক্ষার্থী</option>
                          <option value="admin">অ্যাডমিন</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current pointer-events-none" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>কোনো ব্যবহারকারী পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
