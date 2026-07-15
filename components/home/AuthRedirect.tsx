"use client";

// components/home/AuthRedirect.tsx
// Landing page (/) এর content এই wrapper এর ভেতরে থাকে। যার লগইন করা
// আছে সে landing page এ না এসে সরাসরি /dashboard এ চলে যাবে।
//
// - auth state লোড হওয়া পর্যন্ত (loading === true) কিছুই দেখায় না —
//   নাহলে লগইন করা ইউজারের জন্য এক মুহূর্তের জন্য landing page ফ্ল্যাশ
//   করে তারপর dashboard এ redirect হতো।
// - loading শেষে user থাকলে redirect করে, children রেন্ডার করে না।
// - user না থাকলে (লগইন নেই) স্বাভাবিকভাবে landing page (children) দেখায়।

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/AuthProvider";

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  // Auth state এখনো লোড হচ্ছে, অথবা লগইন করা ইউজার — কোনোটাতেই landing
  // page দেখানো উচিত না (দ্বিতীয় ক্ষেত্রে dashboard এ redirect হচ্ছে)।
  if (loading || user) return null;

  return <>{children}</>;
}
