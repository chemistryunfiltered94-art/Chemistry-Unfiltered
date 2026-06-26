import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AuthProvider } from "@/components/shared/AuthProvider";
import LoadingScreen from "@/components/shared/LoadingScreen";
import PageTransition from "@/components/shared/PageTransition";
import ServiceWorkerRegister from "@/components/shared/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: {
    default: "Chemistry Unfiltered — সম্পূর্ণ Chemistry Learning Platform",
    template: "%s | Chemistry Unfiltered",
  },
  description:
    "Chemistry শেখো সহজে। Interactive Periodic Table, Formula Library, Virtual Lab, Calculator, Question Bank — সব এক জায়গায়।",
  keywords: ["chemistry", "রসায়ন", "periodic table", "formula", "HSC", "SSC", "BNBC"],
  authors: [{ name: "Chemistry Unfiltered Team" }],
  openGraph: {
    title: "Chemistry Unfiltered — সম্পূর্ণ Chemistry Learning Platform",
    description:
      "Chemistry শেখো সহজে। Interactive Periodic Table, Formula Library, Virtual Lab এবং আরো অনেক কিছু।",
    type: "website",
    locale: "bn_BD",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chemistry Unfiltered",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {/* Splash screen — first visit only */}
            <LoadingScreen />
            {/* Page-to-page transition overlay */}
            <PageTransition />
            <ServiceWorkerRegister />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
