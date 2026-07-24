"use client";

// components/home/FinalCTASection.tsx
// পেজের একদম নিচের CTA ব্যানার — Footer সরিয়ে দেওয়ার পর এটাই পেজের শেষ সেকশন।

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";

export default function FinalCTASection() {
  const { user } = useAuth();
  const router = useRouter();

  const handleStartLearning = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="molecule-bg" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4"
        >
          আজই শুরু করো তোমার{" "}
          <span className="gradient-text">রসায়ন যাত্রা</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-slate-400 mb-8"
        >
          সম্পূর্ণ ফ্রি — এখনই একটা অ্যাকাউন্ট বানিয়ে শেখা শুরু করে দাও
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={handleStartLearning}
            className="group inline-flex items-center gap-2 px-8 py-4 gradient-bg text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-primary-500/30"
          >
            <BookOpen className="w-5 h-5" />
            শেখা শুরু করো
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
