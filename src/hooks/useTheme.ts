"use client";

import { useCallback, useEffect, useState } from "react";
import type { AccentName, ThemeMode } from "@/types/blog";

const MODE_KEY = "devlog:mode";
const ACCENT_KEY = "devlog:accent";

const isAccent = (value: string | null): value is AccentName =>
  value === "cyan" || value === "purple" || value === "emerald";

const isMode = (value: string | null): value is ThemeMode =>
  value === "dark" || value === "darker";

function read<T extends string>(
  key: string,
  guard: (v: string | null) => v is T,
  fallback: T,
): T {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  return guard(stored) ? stored : fallback;
}

interface UseThemeReturn {
  readonly mode: ThemeMode;
  readonly accent: AccentName;
  readonly toggleMode: () => void;
  readonly setAccent: (accent: AccentName) => void;
}

/**
 * The app is dark-only by design; the toggle switches between "dark" (slate)
 * and "darker" (near-black), plus a three-way accent swap. Both are written to
 * <html> data attributes that the CSS token layer reacts to.
 */
export function useTheme(): UseThemeReturn {
  const [mode, setMode] = useState<ThemeMode>(() =>
    read(MODE_KEY, isMode, "dark"),
  );
  const [accent, setAccentState] = useState<AccentName>(() =>
    read(ACCENT_KEY, isAccent, "cyan"),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    window.localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    window.localStorage.setItem(ACCENT_KEY, accent);
  }, [accent]);

  const toggleMode = useCallback(
    () => setMode((current) => (current === "dark" ? "darker" : "dark")),
    [],
  );
  const setAccent = useCallback((next: AccentName) => setAccentState(next), []);

  return { mode, accent, toggleMode, setAccent };
}
