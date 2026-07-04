"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { LevelInfo, getLevelTitle } from "@/lib/gamification";

function toBn(n: number) {
  return n.toLocaleString("bn-BD");
}

/**
 * MathX রেফারেন্স ডিজাইন: বাম পাশে বড় "Lv N" + টাইটেল + প্রগ্রেস বার,
 * ডান পাশে আলাদা ফ্লেম/স্ট্রিক কার্ড। দুটো একসাথে একটা flex row-এ বসানো হয়েছে।
 */
export default function LevelProgressCard({
  levelInfo,
  streak,
}: {
  levelInfo: LevelInfo;
  streak: number;
}) {
  const title = getLevelTitle(levelInfo.level);
  const percent = Math.round(levelInfo.progress * 100);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* স্ট্রিক কার্ড — রেফারেন্সে হিরোর ডানপাশে বসে, মোবাইলে উপরে আনা হলো */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="order-1 sm:order-2 sm:w-36 flex-shrink-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-b from-rose-500/10 to-transparent border border-rose-500/20 rounded-2xl py-5"
        >
          <Flame className="w-7 h-7 text-rose-400" />
          <span className="text-3xl font-extrabold text-rose-400 leading-none">{toBn(streak)}</span>
          <span className="text-xs text-slate-500">দিন ধারা</span>
        </motion.div>
      )}

      {/* লেভেল কার্ড */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="order-2 sm:order-1 flex-1 bg-[#12121a] border border-white/5 rounded-2xl p-5"
      >
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">Lv {toBn(levelInfo.level)}</span>
            <span className="text-violet-300 text-base font-medium">{title}</span>
          </div>
          <span className="text-sm text-slate-500">
            পরের লেভেলে {toBn(levelInfo.xpToNext)} XP বাকি
          </span>
        </div>

        <div className="relative h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
          />
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-500">{toBn(levelInfo.xpInLevel)} XP</span>
          <span className="text-xs text-slate-500">{toBn(percent)}%</span>
        </div>
      </motion.div>
    </div>
  );
}
