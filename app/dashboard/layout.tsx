import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import NavSpacer from "@/components/layout/NavSpacer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <NavSpacer />
      <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
      <BottomNav />
    </>
  );
}
