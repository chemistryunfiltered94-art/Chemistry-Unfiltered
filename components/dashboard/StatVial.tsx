"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

const fillMap = {
  blue:   "bg-blue-500",
  green:  "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
} as const;

const textMap = {
  blue:   "text-blue-400",
  green:  "text-green-400",
  purple: "text-purple-400",
  orange: "text-orange-400",
} as const;

/**
 * ছোট্ট ভার্টিকাল 'ভায়াল' — উচ্চতা দিয়ে আপেক্ষিক পরিমাণ বোঝায় না (স্ট্যাটগুলো
 * ভিন্ন স্কেলের), বরং কার্ডের নিজস্ব ভিজ্যুয়াল সিগনেচার হিসেবে কাজ করে: প্রতিটা
 * সংখ্যাকে যেন একটা 'নমুনা' মনে হয়, জেনেরিক gradient-square icon-এর বদলে।
 */
export default function StatVial({
  label,
  value,
  icon: Icon,
  color,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  color: keyof typeof fillMap;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center gap-3 min-w-0"
    >
      {/* ভায়াল */}
      <div className="relative w-3 h-9 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex-shrink-0">
        <div className={`absolute bottom-0 left-0 right-0 h-2/3 ${fillMap[color]} opacity-70`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${textMap[color]} flex-shrink-0`} />
          <div className="text-xl font-bold text-white leading-none">{value}</div>
        </div>
        <div className="text-[11px] text-slate-400 mt-1.5 leading-tight break-words">{label}</div>
      </div>
    </motion.div>
  );
}
