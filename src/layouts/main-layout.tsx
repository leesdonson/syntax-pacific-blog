"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/common/navbar";
import { useTheme } from "@/hooks/useTheme";
import { Footer } from "@/components/common/footer";

export interface MainLayoutProps {
  readonly children: ReactNode;
}

/** App shell: skip link, fixed navbar, main region, footer. */
export function MainLayout({ children }: MainLayoutProps) {
  const { mode, accent, toggleMode, setAccent } = useTheme();

  return (
    <div className="relative flex min-h-dvh flex-col bg-base">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-accent/50 focus:bg-elevated focus:px-4 focus:py-2 focus:text-sm focus:text-accent"
      >
        Skip to content
      </a>

      <Navbar
        mode={mode}
        accent={accent}
        onToggleMode={toggleMode}
        onAccentChange={setAccent}
      />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
