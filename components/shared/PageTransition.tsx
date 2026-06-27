"use client";

// PageTransition.tsx
// Shows a centered CSS flask animation during Next.js client-side navigation.
// Mounts on routeChangeStart, unmounts on routeChangeComplete.
// Uses Next.js App Router's usePathname to detect navigation.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const pathname = usePathname();
  const prevPath  = useRef<string>(pathname);
  const [visible, setVisible] = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // pathname changed → navigation happened
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;

      // Show overlay immediately
      setVisible(true);

      // Auto-hide after content likely loaded (short minimum duration for feel)
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 400);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "ptFadeIn 0.15s ease-out both",
      }}
    >
      {/* ── CSS Flask ────────────────────────────────────────── */}
      <div className="cu-flask-wrap">
        <svg
          viewBox="0 0 100 120"
          width="80"
          height="96"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          {/* ── Clip path so liquid & bubbles stay inside flask ── */}
          <defs>
            <clipPath id="flaskClip">
              {/* neck */}
              <rect x="36" y="8" width="28" height="30" rx="4" />
              {/* body */}
              <path d="M36 36 L10 100 Q10 110 20 110 L80 110 Q90 110 90 100 L64 36 Z" />
            </clipPath>
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* ── Flask outline (white stroke) ── */}
          <g fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
            {/* neck */}
            <rect x="36" y="8" width="28" height="30" rx="4" fill="#334155" />
            {/* body */}
            <path
              d="M36 36 L10 100 Q10 110 20 110 L80 110 Q90 110 90 100 L64 36 Z"
              fill="#1e3a5f"
            />
          </g>

          {/* ── Liquid fill (clipped to flask body) ── */}
          <g clipPath="url(#flaskClip)">
            {/* liquid block — fills ~55% of body */}
            <rect x="0" y="60" width="100" height="60" fill="url(#liquidGrad)" />

            {/* Bubble 1 */}
            <circle className="cu-bubble cu-b1" cx="30" cy="105" r="5" fill="#60a5fa" opacity="0.8" />
            {/* Bubble 2 */}
            <circle className="cu-bubble cu-b2" cx="55" cy="108" r="3.5" fill="#93c5fd" opacity="0.7" />
            {/* Bubble 3 */}
            <circle className="cu-bubble cu-b3" cx="70" cy="100" r="4" fill="#60a5fa" opacity="0.75" />
            {/* Bubble 4 — small, fast */}
            <circle className="cu-bubble cu-b4" cx="42" cy="106" r="2.5" fill="#bfdbfe" opacity="0.6" />
          </g>

          {/* ── Neck bubbles (above liquid, outside clip) ── */}
          <circle className="cu-neck-bubble cu-nb1" cx="50" cy="30" r="3" fill="#60a5fa" opacity="0" />
          <circle className="cu-neck-bubble cu-nb2" cx="44" cy="22" r="2" fill="#93c5fd" opacity="0" />
          <circle className="cu-neck-bubble cu-nb3" cx="56" cy="16" r="2.5" fill="#60a5fa" opacity="0" />

          {/* ── Flask glass sheen ── */}
          <path
            d="M42 40 L22 90"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <style>{`
        @keyframes ptFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Body bubbles: rise up through liquid ── */
        @keyframes bubbleRise {
          0%   { transform: translateY(0)    scale(1);    opacity: 0.8; }
          80%  { transform: translateY(-42px) scale(1.1); opacity: 0.6; }
          100% { transform: translateY(-50px) scale(0.5); opacity: 0;   }
        }

        /* ── Neck bubbles: appear and float up out of flask ── */
        @keyframes neckBubble {
          0%   { transform: translateY(0);    opacity: 0;   }
          20%  { opacity: 0.85; }
          100% { transform: translateY(-28px); opacity: 0;  }
        }

        .cu-flask-wrap {
          filter: drop-shadow(0 0 18px rgba(59,130,246,0.55));
          animation: flaskBob 1.6s ease-in-out infinite;
        }

        @keyframes flaskBob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }

        /* staggered bubbles */
        .cu-bubble { animation: bubbleRise 1.4s ease-in infinite; }
        .cu-b1 { animation-delay: 0s;    animation-duration: 1.5s; }
        .cu-b2 { animation-delay: 0.4s;  animation-duration: 1.2s; }
        .cu-b3 { animation-delay: 0.75s; animation-duration: 1.6s; }
        .cu-b4 { animation-delay: 0.2s;  animation-duration: 1.0s; }

        .cu-neck-bubble { animation: neckBubble 1.4s ease-out infinite; }
        .cu-nb1 { animation-delay: 0.55s; animation-duration: 1.3s; }
        .cu-nb2 { animation-delay: 0.9s;  animation-duration: 1.1s; }
        .cu-nb3 { animation-delay: 1.15s; animation-duration: 1.5s; }
      `}</style>
    </div>
  );
}
