"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";

const accentMap = {
  green:  { spine: "bg-green-500",  iconBg: "bg-green-500/10 border-green-500/30",   icon: "text-green-400",  hover: "hover:border-green-500/40",  arrow: "group-hover:text-green-400" },
  blue:   { spine: "bg-blue-500",   iconBg: "bg-blue-500/10 border-blue-500/20",     icon: "text-blue-400",   hover: "hover:border-blue-500/40",   arrow: "group-hover:text-blue-400" },
  purple: { spine: "bg-purple-500", iconBg: "bg-purple-500/10 border-purple-500/20", icon: "text-purple-400", hover: "hover:border-purple-500/40", arrow: "group-hover:text-purple-400" },
  yellow: { spine: "bg-yellow-500", iconBg: "bg-yellow-500/10 border-yellow-500/30", icon: "text-yellow-400", hover: "hover:border-yellow-500/40", arrow: "group-hover:text-yellow-400" },
} as const;

export type RecordAccent = keyof typeof accentMap;

/**
 * ল্যাব-রেকর্ড কার্ড — বাম পাশে রঙিন 'স্পাইন' (ল্যাব নোটবুকের ট্যাব-ডিভাইডারের
 * আদলে), যা প্রতিটা এন্ট্রির ধরন এক নজরে বুঝিয়ে দেয়। জেনেরিক flat card না।
 */
export default function RecordRow({
  href,
  icon: Icon,
  title,
  meta,
  accent,
  delay = 0,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  meta: string;
  accent: RecordAccent;
  delay?: number;
}) {
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className={`relative flex items-center gap-3 pl-4 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg overflow-hidden transition-all group ${a.hover}`}
      >
        <span className={`absolute left-0 top-0 bottom-0 w-1 ${a.spine}`} />
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${a.iconBg}`}>
          <Icon className={`w-4 h-4 ${a.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{title}</p>
          <p className="text-xs text-slate-400 truncate">{meta}</p>
        </div>
        <ArrowRight className={`w-4 h-4 text-slate-600 transition-colors flex-shrink-0 ${a.arrow}`} />
      </Link>
    </motion.div>
  );
}
