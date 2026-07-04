"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

/**
 * MathX-এর "Quick Actions" টাইলের আদলে: বাম পাশে আইকন-বাক্স, ডানে লেবেল,
 * ফুল-উইথ tinted ব্যাকগ্রাউন্ড কার্ড (গ্র্যাডিয়েন্ট রঙ প্রতিটা লিংকের জন্য আলাদা)।
 */
export default function ElementLinkCard({
  href,
  icon: Icon,
  label,
  color,
  delay = 0,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  symbol?: string;
  number?: string;
  color: string; // e.g. "from-blue-500 to-indigo-600" — icon accent বানাতে ব্যবহৃত হবে
  delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}>
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-4 bg-[#12121a] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
      >
        <span className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </span>
        <span className="text-sm font-semibold text-white leading-tight">{label}</span>
      </Link>
    </motion.div>
  );
}
