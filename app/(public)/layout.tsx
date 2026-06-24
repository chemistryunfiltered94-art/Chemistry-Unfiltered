// app/(public)/layout.tsx
// NOTE: This is a Server Component. Conditional rendering of BottomNav/Footer
// is handled inside the client wrapper LandingGuard.

import LandingGuard from "@/components/layout/LandingGuard";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandingGuard>{children}</LandingGuard>;
}
