import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import NavSpacer from "@/components/layout/NavSpacer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* NavSpacer pushes content below the fixed navbar (height varies by page mode) */}
      <NavSpacer />
      {/*
        pb-20 lg:pb-0 — extra bottom padding on mobile so the last content
        row is never hidden behind the fixed BottomNav (≈80px tall).
      */}
      <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
