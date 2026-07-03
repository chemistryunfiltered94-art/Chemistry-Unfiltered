"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  text,
  ctaLabel,
  ctaHref,
  tone = "primary",
}: {
  icon: LucideIcon;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  tone?: "primary" | "yellow";
}) {
  return (
    <div className="flex flex-col items-center justify-center py-9 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl text-center">
      <div className="w-11 h-11 rounded-full border border-slate-700 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <p className="text-slate-400 text-sm mb-4 max-w-[16rem]">{text}</p>
      <Link
        href={ctaHref}
        className={
          tone === "yellow"
            ? "flex items-center gap-2 px-5 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm font-semibold hover:bg-yellow-500/20 transition-colors"
            : "flex items-center gap-2 px-5 py-2 gradient-bg text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        }
      >
        {ctaLabel} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
