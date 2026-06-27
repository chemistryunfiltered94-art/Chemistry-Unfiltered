"use client";

// PageTransition.tsx
// Shows a brief overlay during Next.js client-side navigation.
// Skipped if this is the very first load (LoadingScreen handles that).

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "cu_splash_shown";

export default function PageTransition() {
  const pathname  = usePathname();
  const prevPath  = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // On first render, record current path but don't show overlay
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }

    // pathname changed → navigation happened
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;

      // Show overlay only after the splash has been shown at least once
      try {
        if (!sessionStorage.getItem(SESSION_KEY)) return;
      } catch {
        return;
      }

      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 350);
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
        backgroundColor: "#0f172a", // solid slate-900 — never transparent
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "ptFadeIn 0.12s ease-out both",
        pointerEvents: "none",
      }}
    >
      {/* Simple spinner instead of complex animation */}
      <div style={{
        width: 36,
        height: 36,
        border: "3px solid rgba(99,102,241,0.2)",
        borderTop: "3px solid #6366f1",
        borderRadius: "50%",
        animation: "ptSpin 0.7s linear infinite",
      }} />

      <style>{`
        @keyframes ptFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ptSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
