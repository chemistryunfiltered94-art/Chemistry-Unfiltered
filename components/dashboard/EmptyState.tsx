"use client";

import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

type Tone = "violet" | "yellow";

const TONE_MAP: Record<Tone, string> = {
  violet: "text-violet-400 hover:text-violet-300",
  yellow: "text-amber-400 hover:text-amber-300",
};

export default function EmptyState({
  icon: Icon,
  text,
  ctaLabel,
  ctaHref,
  tone = "violet",
}: {
  icon: LucideIcon;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  tone?: Tone;
}) {
  return (
    <div className="bg-[#12121a] border border-white/5 rounded-2xl py-10 px-6 flex flex-col items-center text-center gap-3">
      <Icon className="w-8 h-8 text-slate-600" />
      <p className="text-sm text-slate-400 max-w-xs">{text}</p>
      <Link href={ctaHref} className={`text-sm font-semibold flex items-center gap-1 ${TONE_MAP[tone]}`}>
        {ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
