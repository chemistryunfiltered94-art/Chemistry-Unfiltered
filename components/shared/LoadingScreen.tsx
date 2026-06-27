"use client";

// LoadingScreen.tsx — shown ONCE per browser session.
// Simple fade only — NO transform/translate to prevent GPU glitch on Android.

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const TAGLINE    = "Laugh · Learn · React";
const CHAR_DELAY = 60;
const HOLD_AFTER = 500;
const FADE_DURATION = 400;
const SESSION_KEY = "cu_splash_shown";

export default function LoadingScreen() {
  const [phase, setPhase]       = useState<"idle" | "typing" | "holding" | "fading" | "done">("idle");
  const [charCount, setCharCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  // ── On mount: check sessionStorage ────────────────────────────────────
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setPhase("done");
        return;
      }
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      setPhase("done");
      return;
    }
    setPhase("typing");
  }, []);

  // ── Phase 1: typewriter ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "typing") return;
    let i = charCount;
    let last = performance.now();

    function tick(now: number) {
      if (now - last >= CHAR_DELAY) {
        i += 1;
        last = now;
        setCharCount(i);
        if (i >= TAGLINE.length) { setPhase("holding"); return; }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Phase 2: hold → fade ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "holding") return;
    const t = setTimeout(() => setPhase("fading"), HOLD_AFTER);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Phase 3: fade → done ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "fading") return;
    const t = setTimeout(() => setPhase("done"), FADE_DURATION + 50);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done" || phase === "idle") return null;

  const isFading = phase === "fading";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // ONLY opacity fade — NO transform/translate/scale
        opacity: isFading ? 0 : 1,
        transition: isFading ? `opacity ${FADE_DURATION}ms ease` : undefined,
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: 20, overflow: "hidden",
          boxShadow: "0 0 40px rgba(99,102,241,0.35)", marginBottom: 16,
        }}>
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
        <h1 style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em",
          marginBottom: 12,
          whiteSpace: "nowrap",
        }}>
          Chemistry Unfiltered
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: "0.9rem", color: "#94a3b8",
          letterSpacing: "0.08em", fontWeight: 500, minHeight: "1.4em",
        }}>
          {TAGLINE.slice(0, charCount)}
          {charCount < TAGLINE.length && (
            <span style={{ animation: "cursorBlink 0.7s step-end infinite" }}>|</span>
          )}
        </p>
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
