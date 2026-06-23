"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FlaskConical, Atom, Zap, BookOpen } from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import AuthModal from "@/components/shared/AuthModal";

const floatingElements = [
  { symbol: "H₂O", x: "10%", y: "20%", delay: 0 },
  { symbol: "CO₂", x: "85%", y: "15%", delay: 0.5 },
  { symbol: "NH₃", x: "15%", y: "70%", delay: 1 },
  { symbol: "C₆H₆", x: "80%", y: "65%", delay: 1.5 },
  { symbol: "NaCl", x: "50%", y: "10%", delay: 0.8 },
  { symbol: "HCl", x: "90%", y: "45%", delay: 1.2 },
];

interface HeroStats {
  topics: number;
  formulas: number;
  reactions: number;
}

export default function HeroSection({ heroStats }: { heroStats?: HeroStats }) {
  const { user } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleStartLearning = () => {
    if (user) {
      router.push("/learn");
    } else {
      setAuthModalOpen(true);
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="molecule-bg" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating molecule labels */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex items-center justify-center"
          style={{ left: el.x, top: el.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.8, 1, 0.8],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5 text-white/70 text-sm font-mono font-medium">
            {el.symbol}
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-8"
        >
          <Zap className="w-4 h-4" />
          বাংলাদেশের #১ Chemistry Learning Platform
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          রসায়ন শেখো{" "}
          <span className="gradient-text">সহজে</span>
          <br />
          <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-300">
            এবং মজার সাথে
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Interactive Periodic Table, Formula Library, Virtual Lab, Calculator, Question Bank —
          SSC, HSC, Admission থেকে BCS পর্যন্ত সব প্রস্তুতি{" "}
          <span className="text-white font-medium">এক জায়গায়</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={handleStartLearning}
            className="group flex items-center gap-2 px-8 py-4 gradient-bg text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-primary-500/30"
          >
            <BookOpen className="w-5 h-5" />
            শেখা শুরু করো
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            href="/periodic-table"
            className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all hover:scale-105"
          >
            <Atom className="w-5 h-5" />
            পর্যায় সারণি দেখো
          </Link>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {[
            { value: heroStats ? `${heroStats.topics}+` : "৫০০+",   label: "টপিক" },
            { value: heroStats ? `${heroStats.formulas}+` : "২০০+", label: "ফর্মুলা" },
            { value: heroStats ? `${heroStats.reactions}+` : "১০০+",label: "বিক্রিয়া" },
            { value: "৫টি",                                           label: "ভার্চুয়াল ল্যাব" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="login"
      />
    </section>
  );
}
