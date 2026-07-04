"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type Color = "purple" | "orange" | "red" | "blue" | "green" | "yellow";

const COLOR_MAP: Record<Color, { bg: string; icon: string; text: string }> = {
  purple: { bg: "from-violet-500/10 to-violet-500/0",  icon: "text-violet-400",  text: "text-white" },
  orange: { bg: "from-amber-500/10 to-amber-500/0",    icon: "text-amber-400",   text: "text-amber-400" },
  red:    { bg: "from-rose-500/10 to-rose-500/0",      icon: "text-rose-400",    text: "text-rose-400" },
  blue:   { bg: "from-cyan-500/10 to-cyan-500/0",       icon: "text-cyan-400",    text: "text-cyan-400" },
  green:  { bg: "from-emerald-500/10 to-emerald-500/0", icon: "text-emerald-400", text: "text-emerald-400" },
  yellow: { bg: "from-amber-500/10 to-amber-500/0",     icon: "text-amber-400",   text: "text-amber-400" },
};

/**
 * MathX রেফারেন্সের কালারড টাইল: হালকা গ্র্যাডিয়েন্ট ব্যাকগ্রাউন্ড,
 * উপরে আইকন, মাঝে বড় বোল্ড নাম্বার, নিচে ধূসর লেবেল।
 */
export default function StatVial({
  label,
  value,
  icon: Icon,
  color = "purple",
  delay = 0,
  unit,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: Color;
  delay?: number;
  unit?: string;
}) {
  const c = COLOR_MAP[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-b ${c.bg} border border-white/5 rounded-2xl p-4`}
    >
      <Icon className={`w-5 h-5 ${c.icon} mb-3`} />
      <p className={`text-2xl font-extrabold ${c.text} leading-none`}>
        {value}
        {unit && <span className="text-sm font-semibold ml-1">{unit}</span>}
      </p>
      <p className="text-xs text-slate-500 mt-1.5">{label}</p>
    </motion.div>
  );
}
