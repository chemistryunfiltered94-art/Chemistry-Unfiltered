"use client";

// components/layout/LandingGuard.tsx
// On the landing page (/): minimal nav (logo only) + no BottomNav + no Footer
// On all other public pages: full Navbar + BottomNav + Footer as before

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import NavSpacer from "@/components/layout/NavSpacer";

export default function LandingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <>
      <Navbar />
      {/* NavSpacer: 64px on landing, 110px on inner pages */}
      <NavSpacer />
      <main className={isLanding ? "min-h-screen" : "min-h-screen pb-20 lg:pb-0"}>
        {children}
      </main>
      {!isLanding && <Footer />}
      {!isLanding && <BottomNav />}
    </>
  );
}
