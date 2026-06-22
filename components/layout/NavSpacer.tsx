"use client";

import { usePathname } from "next/navigation";

/**
 * Renders an invisible spacer that accounts for the navbar height.
 * Landing page (/) uses a 1-row transparent navbar (64px).
 * All other pages use a 2-row opaque navbar (≈110px).
 *
 * This keeps the layout in sync with Navbar.tsx's two-mode rendering
 * without duplicating the height logic in multiple places.
 */
export default function NavSpacer() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  return (
    <div
      style={{ height: isLanding ? "64px" : "110px" }}
      aria-hidden="true"
    />
  );
}
