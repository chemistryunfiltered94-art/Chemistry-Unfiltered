"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

/**
 * পর্যায় সারণির এলিমেন্ট-বক্সের আদলে লিংক কার্ড: উপরে সিরিয়াল নাম্বার,
 * ছোট সিম্বল, মাঝে আইকন, নিচে লেবেল — ঠিক যেমন Na/11/Sodium দেখতে হয়।
 * এটাই এই ড্যাশবোর্ডের সিগনেচার মোটিফ, হেডারের ব্যাজের সাথে সংগতিপূর্ণ।
 */
export default function ElementLinkCard({
  href,
  icon: Icon,
  label,
  symbol,
  number,
  color,
  delay = 0,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  symbol: string;
  number: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className="relative flex flex-col items-center gap-1.5 pt-6 pb-3 px-2 bg-slate-800 border border-slate-700 rounded-xl hover:border-primary-500/50 hover:-translate-y-1 transition-all group text-center overflow-hidden"
      >
        <span className="absolute top-1.5 left-2 text-[9px] font-mono text-slate-500 group-hover:text-primary-400/70 transition-colors">
          {number}
        </span>
        <span className="absolute top-1.5 right-2 text-[9px] font-bold text-slate-600 font-mono group-hover:text-primary-400/70 transition-colors">
          {symbol}
        </span>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-[11px] font-medium text-slate-300 leading-tight">{label}</span>
      </Link>
    </motion.div>
  );
}
