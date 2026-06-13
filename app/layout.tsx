import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AuthProvider } from "@/components/shared/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "ChemistryOS — সম্পূর্ণ Chemistry Learning Platform",
    template: "%s | ChemistryOS",
  },
  description:
    "Chemistry শেখো সহজে। Interactive Periodic Table, Formula Library, Virtual Lab, Calculator, Question Bank — সব এক জায়গায়।",
  keywords: ["chemistry", "রসায়ন", "periodic table", "formula", "HSC", "SSC", "BNBC"],
  authors: [{ name: "ChemistryOS Team" }],
  openGraph: {
    title: "ChemistryOS — সম্পূর্ণ Chemistry Learning Platform",
    description: "Chemistry শেখো সহজে। Interactive Periodic Table, Formula Library, Virtual Lab এবং আরো অনেক কিছু।",
    type: "website",
    locale: "bn_BD",
  },
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
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
