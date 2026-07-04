"use client";

import { motion } from "framer-motion";
import { Sparkles, Flame, CalendarCheck, Star, Trophy, LucideIcon, Lock } from "lucide-react";
import { Achievement } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Flame,
  CalendarCheck,
  Star,
  Trophy,
};

function toBn(n: number) {
  return n.toLocaleString("bn-BD");
}

function Badge({ achievement, unlocked, delay }: { achievement: Achievement; unlocked: boolean; delay: number }) {
  const Icon = ICON_MAP[achievement.icon] || Star;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`relative flex flex-col items-center text-center gap-2 p-3 rounded-xl border ${
        unlocked
          ? "bg-gradient-to-b from-violet-500/10 to-transparent border-violet-500/30"
          : "bg-[#12121a] border-white/5 border-dashed"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center ${
          unlocked ? "bg-gradient-to-br from-violet-500 to-fuchsia-500" : "bg-white/5"
        }`}
      >
        {unlocked ? (
          <Icon className="w-5 h-5 text-white" />
        ) : (
          <Lock className="w-4 h-4 text-slate-500" />
        )}
      </div>
      <div>
        <p className={`text-xs font-semibold leading-tight ${unlocked ? "text-white" : "text-slate-500"}`}>
          {achievement.titleBn}
        </p>
        <p className={`text-[10px] mt-0.5 ${unlocked ? "text-violet-300" : "text-slate-600"}`}>
          +{toBn(achievement.xpReward)} XP
        </p>
      </div>
    </motion.div>
  );
}

export default function GamificationAchievements({
  unlocked,
  locked,
}: {
  unlocked: Achievement[];
  locked: Achievement[];
}) {
  const all = [...unlocked, ...locked];
  if (all.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {unlocked.map((a, i) => (
          <Badge key={a.id} achievement={a} unlocked delay={i * 0.05} />
        ))}
        {locked.map((a, i) => (
          <Badge key={a.id} achievement={a} unlocked={false} delay={(unlocked.length + i) * 0.05} />
        ))}
      </div>
    </div>
  );
}
