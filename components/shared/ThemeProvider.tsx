"use client";

// components/shared/ThemeProvider.tsx
// Dark mode is fixed — no toggle, no system preference, always dark.

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
