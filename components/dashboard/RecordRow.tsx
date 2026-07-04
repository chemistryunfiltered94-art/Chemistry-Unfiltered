"use client";

import { motion } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

type Accent = "blue" | "purple" | "green" | "yellow";

const ACCENT_MAP: Record<Accent, string> = {
  blue:   "text-cyan-400",
  purple: "text-violet-400",
  green:  "text-emerald-400",
  yellow: "text-amber-400",
};

export default function RecordRow({
  href,
  icon: Icon,
  title,
  meta,
  accent = "blue",
  delay = 0,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  meta: string;
  accent?: Accent;
  delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3.5 bg-[#12121a] border border-white/5 rounded-xl hover:border-violet-500/30 transition-colors group"
      >
        <span className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
          <Icon className={`w-4.5 h-4.5 ${ACCENT_MAP[accent]}`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{title}</p>
          <p className="text-xs text-slate-500 truncate">{meta}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
      </Link>
    </motion.div>
  );
}
