"use client";

// components/home/OtherAppsSection.tsx
// Full-page "অন্যান্য অ্যাপস" section, shown at /other-apps.
// MathX & PhysicsVerse are coming-soon placeholders (non-clickable).
// CIVION is a live, clickable external link.
//
// CSS-only keyframe animations (see globals.css) — no framer-motion,
// to stay consistent with the rest of the nav/drawer system which
// avoids framer-motion for Android GPU-compositing stability.

import Link from "next/link";
import { Sigma, Orbit, ExternalLink, Clock, Boxes, Sparkles, ArrowLeft } from "lucide-react";

const comingSoonApps = [
  { name: "MathX",        tagline: "গণিতের ইন্টারেক্টিভ জগৎ",   icon: Sigma, ring: "border-blue-500/20",   tint: "from-blue-500/10 to-indigo-500/10" },
  { name: "PhysicsVerse",  tagline: "পদার্থবিজ্ঞান শেখার প্ল্যাটফর্ম", icon: Orbit, ring: "border-purple-500/20", tint: "from-purple-500/10 to-fuchsia-500/10" },
];

export default function OtherAppsSection() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* background accents */}
      <div className="molecule-bg opacity-40" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-primary-600/20 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          হোমে ফিরে যাও
        </Link>

        {/* heading */}
        <div className="text-center mb-14 app-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            আমাদের ইকোসিস্টেম
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            অন্যান্য <span className="gradient-text">অ্যাপস</span>
          </h1>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed">
            Chemistry Unfiltered–এর পাশাপাশি আরও কিছু প্ল্যাটফর্ম তৈরি হচ্ছে —
            নিচে দেখো কী কী আসছে, আর কী কী এখনই ব্যবহার করা যাচ্ছে।
          </p>
        </div>

        {/* Coming soon apps */}
        <div className="space-y-4 mb-6">
          {comingSoonApps.map((app, i) => {
            const Icon = app.icon;
            return (
              <div
                key={app.name}
                className="app-fade-in relative flex items-center gap-4 px-5 py-5 sm:px-6 sm:py-6 rounded-2xl bg-slate-800/50 glass border overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${app.tint} pointer-events-none`} />
                <div className={`absolute inset-0 rounded-2xl border ${app.ring} pointer-events-none`} />
                <div className="relative w-14 h-14 rounded-xl bg-slate-900/60 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-slate-300" />
                </div>
                <div className="relative flex-1 min-w-0">
                  <div className="text-lg font-bold text-white">{app.name}</div>
                  <div className="text-sm text-slate-400">{app.tagline}</div>
                </div>
                <span className="relative inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  শীঘ্রই আসছে
                </span>
              </div>
            );
          })}
        </div>

        {/* CIVION — flies in, live link */}
        <a
          href="https://mrcivion.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="civion-fly-in relative flex items-center gap-4 px-5 py-6 sm:px-6 sm:py-7 rounded-2xl overflow-hidden gradient-bg shadow-2xl shadow-primary-900/40 group"
          style={{ animationDelay: "260ms" }}
        >
          <span
            aria-hidden
            className="civion-shine absolute inset-y-0 left-0 w-1/3 bg-white/10 pointer-events-none"
          />
          <div className="relative w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
            <Boxes className="w-7 h-7 text-white" />
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="text-xl font-bold text-white tracking-wide">CIVION</div>
            <div className="text-sm text-white/70 truncate">mrcivion.vercel.app</div>
          </div>
          <ExternalLink className="relative w-5 h-5 text-white/80 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}
