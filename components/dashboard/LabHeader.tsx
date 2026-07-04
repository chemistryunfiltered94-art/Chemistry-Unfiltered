"use client";

import { motion } from "framer-motion";
import { FlaskConical, Menu } from "lucide-react";
import Link from "next/link";

function toBn(n: number) {
  return n.toLocaleString("bn-BD");
}

/**
 * নতুন UI — MathX রেফারেন্স ডিজাইন অনুসরণ করে:
 * সলিড ব্র্যান্ড হেডার + নিচে বড় নাম্বার-স্ট্যাট (স্ট্রিক) সহ হিরো।
 * পুরনো "ল্যাব লগবুক" ভাষাই রাখা হয়েছে, কিন্তু ভিজ্যুয়াল লেআউট বদলানো হয়েছে।
 */
export default function LabHeader({
  firstName,
  completedCount,
  bookmarkCount,
}: {
  firstName: string;
  completedCount: number;
  bookmarkCount: number;
}) {
  return (
    <div>
      {/* টপ ন্যাভ */}
      <header className="bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <FlaskConical className="w-4.5 h-4.5 text-white" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Chemistry<span className="text-violet-400">Unfiltered</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/ai-tutor"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
            >
              AI টিউটর
            </Link>
            <button
              aria-label="মেনু"
              className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* হিরো / প্রগ্রেস স্ট্রিপ */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex items-start justify-between gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs font-mono tracking-widest text-violet-400 mb-2">
                // পার্সোনাল ড্যাশবোর্ড
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                স্বাগতম, {firstName}!
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                {toBn(completedCount)} টি টপিক সম্পন্ন · {toBn(bookmarkCount)} টি সংরক্ষিত
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
