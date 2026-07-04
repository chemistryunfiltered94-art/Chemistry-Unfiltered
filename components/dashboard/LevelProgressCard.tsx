"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { LevelInfo, getLevelTitle } from "@/lib/gamification";

function toBn(n: number) {
  return n.toLocaleString("bn-BD");
}

/**
 * লেভেল-প্রগ্রেস বার এখানে টাইট্রেশন ফ্লাস্কের ফিল-লাইনের আদলে —
 * ল্যাব-লগবুক থিমের সাথে সংগতি রেখে, জেনেরিক rounded progress bar না।
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 font-mono tracking-wide mb-1">// পরীক্ষণ পর্যায়</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold text-white">Lv {toBn(levelInfo.level)}</span>
            <span className="text-primary-300 text-sm font-medium">{title}</span>
          </div>
        </div>

        {streak > 0 && (
          <div className="flex flex-col items-center bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2 flex-shrink-0">
            <Flame className="w-4 h-4 text-orange-400 mb-0.5" />
            <span className="text-orange-300 font-bold text-sm leading-none">{toBn(streak)}</span>
            <span className="text-orange-400/70 text-[10px] mt-0.5">দিন ধারা</span>
          </div>
        )}
      </div>

      {/* টাইট্রেশন-বার: ফ্লাস্কের ফিল-লেভেল হিসেবে প্রগ্রেস */}
      <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
        />
        {/* মিলিলিটার-মার্কের আভাস — প্রতি ২৫% এ একটা টিক */}
        {[25, 50, 75].map((tick) => (
          <span
            key={tick}
            className="absolute top-0 bottom-0 w-px bg-slate-950/40"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-slate-500">{toBn(levelInfo.xpInLevel)} XP</span>
        <span className="text-xs text-slate-500">পরের লেভেলে {toBn(levelInfo.xpToNext)} XP বাকি</span>
      </div>
    </motion.div>
  );
}
