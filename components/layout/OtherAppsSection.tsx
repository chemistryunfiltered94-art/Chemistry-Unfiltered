"use client";

// components/layout/OtherAppsSection.tsx
// "অন্যান্য অ্যাপস" — shown inside the Navbar hamburger drawer.
// MathX & PhysicsVerse are coming-soon placeholders (non-clickable).
// CIVION flies in as a live, clickable external link.

import { motion } from "framer-motion";
import { Sigma, Orbit, ExternalLink, Clock, Boxes } from "lucide-react";

const comingSoonApps = [
  { name: "MathX",        icon: Sigma, tint: "from-blue-500/20 to-indigo-500/20", ring: "border-blue-500/20" },
  { name: "PhysicsVerse",  icon: Orbit, tint: "from-purple-500/20 to-fuchsia-500/20", ring: "border-purple-500/20" },
];

export default function OtherAppsSection() {
  return (
    <div className="pt-3 mt-3 border-t border-slate-700/60">
      <div className="flex items-center gap-2 px-4 pb-2">
        <Boxes className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          অন্যান্য অ্যাপস
        </span>
      </div>

      {/* Coming soon apps */}
      <div className="px-4 space-y-2 mb-1">
        {comingSoonApps.map((app, i) => {
          const Icon = app.icon;
          return (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/60 border ${app.ring} overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${app.tint} opacity-40`} />
              <div className="relative w-9 h-9 rounded-lg bg-slate-900/60 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-slate-300" />
              </div>
              <span className="relative flex-1 text-sm font-medium text-slate-300">
                {app.name}
              </span>
              <span className="relative inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-1">
                <Clock className="w-3 h-3" />
                শীঘ্রই আসছে
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* CIVION — flies in, live link */}
      <motion.a
        href="https://mrcivion.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: -24, scale: 0.85, rotate: -3 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ delay: 0.22, duration: 0.55, type: "spring", stiffness: 140, damping: 12 }}
        className="relative mx-4 mb-1 flex items-center gap-3 px-4 py-3.5 rounded-xl overflow-hidden gradient-bg shadow-lg shadow-primary-900/40 group"
      >
        <motion.div
          className="absolute inset-0 bg-white/10"
          animate={{ x: ["-120%", "220%"] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
          style={{ width: "35%", skewX: -20 }}
        />
        <div className="relative w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
          <Boxes className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="relative flex-1 min-w-0">
          <div className="text-sm font-bold text-white tracking-wide">CIVION</div>
          <div className="text-[11px] text-white/70 truncate">mrcivion.vercel.app</div>
        </div>
        <ExternalLink className="relative w-4 h-4 text-white/80 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </motion.a>
    </div>
  );
}
