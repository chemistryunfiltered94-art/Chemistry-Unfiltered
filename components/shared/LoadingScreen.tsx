"use client";

// LoadingScreen.tsx
// Splash Screen — shown ONCE per browser session only.
// Uses sessionStorage to skip on subsequent navigations.

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const TAGLINE = "Laugh · Learn · React";
const CHAR_DELAY = 60;    // ms per character
const HOLD_AFTER = 600;   // ms to hold after tagline completes
const RISE_DURATION = 500; // ms for the rise animation

const SESSION_KEY = "cu_splash_shown";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"idle" | "typing" | "holding" | "rising" | "done">("idle");
  const [charCount, setCharCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  // ── On mount: check sessionStorage ─────────────────────────────────────
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        // Already shown this session — skip immediately
        setPhase("done");
        return;
      }
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage blocked (private mode etc.) — skip splash
      setPhase("done");
      return;
    }
    setPhase("typing");
  }, []);

  // ── Phase 1: type tagline ───────────────────────────────────────────────
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

  // ── Phase 2: hold → rise ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "holding") return;
    const t = setTimeout(() => setPhase("rising"), HOLD_AFTER);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Phase 3: rise → done ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "rising") return;
    const t = setTimeout(() => setPhase("done"), RISE_DURATION + 100);
    return () => clearTimeout(t);
  }, [phase]);

  // Fully unmount when done
  if (phase === "done" || phase === "idle") return null;

  const isRising = phase === "rising";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0f172a", // always solid slate-900 — never transparent
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Only fade inner content, not this background wrapper
        pointerEvents: "none",
      }}
    >
      {/* Subtle dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Inner content — fades out during rising */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          opacity: isRising ? 0 : 1,
          transform: isRising
            ? `translateY(-42vh) scale(0.55)`
            : "translateY(0) scale(1)",
          transition: isRising
            ? `transform ${RISE_DURATION}ms cubic-bezier(0.4,0,0.2,1), opacity ${RISE_DURATION * 0.4}ms ease`
            : undefined,
          animation: !isRising ? "splashFadeIn 0.5s ease-out both" : undefined,
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
          }}
        >
          {TAGLINE.slice(0, charCount)}
          {charCount < TAGLINE.length && (
            <span style={{ animation: "cursorBlink 0.7s step-end infinite" }}>|</span>
          )}
        </p>
      </div>

      {/* Background fade-out overlay — covers dot grid after content rises */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0f172a",
          opacity: isRising ? 1 : 0,
          transition: isRising ? `opacity ${RISE_DURATION}ms ease ${RISE_DURATION * 0.3}ms` : undefined,
          pointerEvents: "none",
        }}
      />

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
