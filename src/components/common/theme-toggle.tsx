"use client";

import { motion } from "motion/react";
import { Moon, Palette, Sparkles } from "lucide-react";
import type { AccentName, ThemeMode } from "@/types/blog";
import { cn } from "@/utils/cn";

export interface ThemeToggleProps {
  readonly mode: ThemeMode;
  readonly accent: AccentName;
  readonly onToggleMode: () => void;
  readonly onAccentChange: (accent: AccentName) => void;
}

const ACCENTS: readonly { name: AccentName; hex: string; label: string }[] = [
  { name: "cyan", hex: "#06b6d4", label: "Cyan accent" },
  { name: "purple", hex: "#8b5cf6", label: "Electric purple accent" },
  { name: "emerald", hex: "#10b981", label: "Neon emerald accent" },
];

/** Dark ⇄ Darker switch plus a three-way accent picker. */
export function ThemeToggle({
  mode,
  accent,
  onToggleMode,
  onAccentChange,
}: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        role="radiogroup"
        aria-label="Accent color"
        className="hidden items-center gap-1 rounded-full border border-line bg-surface/60 p-1 backdrop-blur-md sm:flex"
      >
        <Palette aria-hidden className="ml-1 size-3.5 text-ink-faint" />
        {ACCENTS.map((option) => (
          <button
            key={option.name}
            type="button"
            role="radio"
            aria-checked={accent === option.name}
            aria-label={option.label}
            onClick={() => onAccentChange(option.name)}
            className={cn(
              "relative size-5 cursor-pointer rounded-full transition-transform duration-200 hover:scale-110",
              accent === option.name && "ring-2 ring-offset-2 ring-offset-base",
            )}
            style={{
              backgroundColor: option.hex,
              boxShadow:
                accent === option.name ? `0 0 14px ${option.hex}` : "none",
              ...(accent === option.name
                ? ({ "--tw-ring-color": option.hex } as React.CSSProperties)
                : {}),
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onToggleMode}
        aria-label={`Switch to ${mode === "dark" ? "darker" : "dark"} theme`}
        aria-pressed={mode === "darker"}
        title={mode === "dark" ? "Dark · slate" : "Darker · void"}
        className={cn(
          "relative flex h-9 w-16 cursor-pointer items-center rounded-full border border-line bg-surface/60 px-1",
          "backdrop-blur-md transition-colors hover:border-accent/50",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
          className={cn(
            "flex size-7 items-center justify-center rounded-full bg-accent/15 text-accent",
            mode === "darker" ? "ml-auto" : "mr-auto",
          )}
        >
          {mode === "dark" ? (
            <Moon className="size-3.5" />
          ) : (
            <Sparkles className="size-3.5" />
          )}
        </motion.span>
      </button>
    </div>
  );
}
