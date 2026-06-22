"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useCollection } from "@/hooks/useFirestore";
import { deleteDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { Reaction } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical, Search, Plus, Trash2 } from "lucide-react";

export default function AdminReactionsPage() {
  const { isAdmin } = useAuth();
  const { data: reactions, loading } = useCollection<Reaction>("reactions");
  const { toast, showToast, hideToast } = useToast();
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (!isAdmin) return null;

  const filtered = reactions.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.nameBn?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setBusyId(id);
    const ok = await deleteDocument("reactions", id);
    setBusyId(null);
    setConfirmDeleteId(null);
    if (ok) showToast("success", "বিক্রিয়া মুছে ফেলা হয়েছে।");
    else showToast("error", "মুছে ফেলা যায়নি, আবার চেষ্টা করো।");
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">বিক্রিয়া ম্যানেজ</h1>
              <p className="text-slate-400 text-sm">মোট {reactions.length}টি বিক্রিয়া</p>
            </div>
          </div>
          <Link href="/admin/reactions/new"
            className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> নতুন বিক্রিয়া
          </Link>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="বিক্রিয়ার নাম দিয়ে খোঁজো..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl text-center py-16 text-slate-400">
            <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>কোনো বিক্রিয়া পাওয়া যায়নি।</p>
            <Link href="/admin/reactions/new" className="inline-block mt-3 text-primary-400 hover:text-primary-300 text-sm font-medium">
              প্রথম বিক্রিয়া যোগ করো →
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-2xl p-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{r.nameBn || r.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono truncate">{r.equation}</p>
                </div>

                {confirmDeleteId === r.id ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleDelete(r.id)} disabled={busyId === r.id}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 disabled:opacity-50">
                      নিশ্চিত
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-600">
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(r.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
