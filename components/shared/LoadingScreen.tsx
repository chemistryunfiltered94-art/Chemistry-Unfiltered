"use client";

// LoadingScreen.tsx
// ─── Splash Screen (first visit only) ───────────────────────────────────────
// 1. Logo + "Chemistry Unfiltered" fades in at center
// 2. Tagline "Laugh · Learn · React" types character by character
// 3. Logo + name slide UP into the navbar position → page reveals

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const TAGLINE = "Laugh · Learn · React";
const CHAR_DELAY = 60;   // ms per character
const HOLD_AFTER = 600;  // ms to hold after tagline completes
const RISE_DURATION = 600; // ms for the rise-to-navbar animation

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"typing" | "holding" | "rising" | "done">("typing");
  const [charCount, setCharCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  // ── Phase 1: type tagline ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "typing") return;

    let i = charCount;
    let last = performance.now();

    function tick(now: number) {
      if (now - last >= CHAR_DELAY) {
        i += 1;
        last = now;
        setCharCount(i);
        if (i >= TAGLINE.length) {
          setPhase("holding");
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Phase 2: hold → rise ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "holding") return;
    const t = setTimeout(() => setPhase("rising"), HOLD_AFTER);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Phase 3: rise → done ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "rising") return;
    const t = setTimeout(() => setPhase("done"), RISE_DURATION + 100);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  const isRising = phase === "rising";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900"
      style={{
        // Fade out the overlay itself slightly after logo leaves
        transition: isRising ? `opacity ${RISE_DURATION}ms ease-in ${RISE_DURATION * 0.6}ms` : undefined,
        opacity: isRising ? 0 : 1,
        pointerEvents: "none",
      }}
    >
      {/* ── Subtle dot grid bg ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Logo + Name block ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          // Rise to top: translate to approx navbar position
          transform: isRising ? "translateY(-42vh) scale(0.55)" : "translateY(0) scale(1)",
          transition: isRising
            ? `transform ${RISE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : undefined,
          // Fade in on mount
          animation: "splashFadeIn 0.5s ease-out both",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(99,102,241,0.35)",
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo.png"
            alt="Chemistry Unfiltered"
            width={80}
            height={80}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            priority
          />
        </div>

        {/* Site name */}
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            marginBottom: 12,
            whiteSpace: "nowrap",
          }}
        >
          Chemistry Unfiltered
        </h1>

        {/* Tagline typewriter */}
        <p
          style={{
            fontSize: "0.9rem",
            color: "#94a3b8",
            letterSpacing: "0.08em",
            fontWeight: 500,
            minHeight: "1.4em",
            opacity: isRising ? 0 : 1,
            transition: isRising ? `opacity ${RISE_DURATION * 0.3}ms ease` : undefined,
          }}
        >
          {TAGLINE.slice(0, charCount)}
          {/* blinking cursor */}
          {charCount < TAGLINE.length && (
            <span style={{ animation: "cursorBlink 0.7s step-end infinite" }}>|</span>
          )}
        </p>
      </div>

      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
