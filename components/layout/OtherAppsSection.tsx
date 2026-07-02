// components/layout/OtherAppsSection.tsx
// "অন্যান্য অ্যাপস" — shown inside the Navbar hamburger drawer.
// MathX & PhysicsVerse are coming-soon placeholders (non-clickable).
// CIVION flies in as a live, clickable external link.
//
// NO framer-motion here — plain CSS keyframes only. The drawer is a
// scrollable, conditionally-rendered block inside a fixed nav on
// Android WebViews; framer-motion's transform-based animations were
// causing GPU compositing tearing/ghosting with the page underneath.

import { Sigma, Orbit, ExternalLink, Clock, Boxes } from "lucide-react";

const comingSoonApps = [
  { name: "MathX",        icon: Sigma, ring: "border-blue-500/20",     tint: "from-blue-500/10 to-indigo-500/10" },
  { name: "PhysicsVerse", icon: Orbit, ring: "border-purple-500/20",   tint: "from-purple-500/10 to-fuchsia-500/10" },
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
            <div
              key={app.name}
              className="app-fade-in relative flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/60 border overflow-hidden"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${app.tint} pointer-events-none`} />
              <div className={`absolute inset-0 rounded-xl border ${app.ring} pointer-events-none`} />
              <div className="relative w-9 h-9 rounded-lg bg-slate-900/60 flex items-center justify-center flex-shrink-0">
                <Icon className="w-[18px] h-[18px] text-slate-300" />
              </div>
              <span className="relative flex-1 text-sm font-medium text-slate-300">
                {app.name}
              </span>
              <span className="relative inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-1 flex-shrink-0">
                <Clock className="w-3 h-3" />
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
        className="civion-fly-in relative mx-4 mb-1 flex items-center gap-3 px-4 py-3.5 rounded-xl overflow-hidden gradient-bg shadow-lg shadow-primary-900/40 group"
        style={{ animationDelay: "180ms" }}
      >
        <span
          aria-hidden
          className="civion-shine absolute inset-y-0 left-0 w-1/3 bg-white/10 pointer-events-none"
        />
        <div className="relative w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
          <Boxes className="w-[18px] h-[18px] text-white" />
        </div>
        <div className="relative flex-1 min-w-0">
          <div className="text-sm font-bold text-white tracking-wide">CIVION</div>
          <div className="text-[11px] text-white/70 truncate">mrcivion.vercel.app</div>
        </div>
        <ExternalLink className="relative w-4 h-4 text-white/80 flex-shrink-0" />
      </a>
    </div>
  );
}
