"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Bookmark, FlaskConical } from "lucide-react";

function toBn(n: number) {
  return n.toLocaleString("bn-BD");
}

/** পর্যায় সারণির একটা এলিমেন্ট-বক্সের আদলে ছোট্ট ব্যাজ — সিগনেচার মোটিফ */
function ElementBadge({
  symbol,
  number,
  label,
  value,
  icon: Icon,
  delay,
}: {
  symbol: string;
  number: string;
  label: string;
  value: string;
  icon: typeof CheckCircle2;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative flex items-center gap-3 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 pt-5 min-w-[9.5rem]"
    >
      {/* এলিমেন্ট নাম্বার — পর্যায় সারণির বক্সের মতো উপরের-বাম কোণে */}
      <span className="absolute top-1.5 left-2 text-[10px] font-mono text-primary-200/70 tracking-wide">
        {number}
      </span>
      {/* এলিমেন্ট সিম্বল — উপরের-ডান কোণে, একদম হালকা */}
      <span className="absolute top-1.5 right-2.5 text-[10px] font-bold text-white/30 font-mono">
        {symbol}
      </span>
      <Icon className="w-4 h-4 text-primary-200 flex-shrink-0" />
      <div>
        <div className="text-white font-bold text-lg leading-none">{value}</div>
        <div className="text-primary-200 text-xs mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

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
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 px-4 py-10">
      {/* ব্যাকগ্রাউন্ড আলোকচ্ছটা — সরল, নিয়ন্ত্রিত */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* খুব হালকা ডট-গ্রিড টেক্সচার — গ্রাফ পেপার/ল্যাব নোটবুকের আভাস */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary-200 text-xs font-semibold tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" />
            ল্যাব লগবুক
          </p>
          <h1 className="text-3xl font-bold text-white mb-1">
            স্বাগতম, {firstName}!
          </h1>
          <p className="text-primary-200 text-sm">আজকের পরীক্ষা কী হবে?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mt-6 flex-wrap"
        >
          <ElementBadge
            symbol="Cp"
            number="01"
            label="সম্পন্ন টপিক"
            value={toBn(completedCount)}
            icon={CheckCircle2}
            delay={0.15}
          />
          <ElementBadge
            symbol="Bk"
            number="02"
            label="সংরক্ষিত"
            value={toBn(bookmarkCount)}
            icon={Bookmark}
            delay={0.2}
          />
        </motion.div>
      </div>
    </div>
  );
}
