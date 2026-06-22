import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import NavSpacer from "@/components/layout/NavSpacer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <NavSpacer />
      {/*
        On desktop (lg+), AdminSidebar renders as a fixed left panel
        and the main content is offset with ml-64. On mobile, sidebar
        is hidden and content fills the full width.
      */}
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-h-screen lg:ml-64 pb-4">
          {children}
        </main>
      </div>
    </>
  );
}
