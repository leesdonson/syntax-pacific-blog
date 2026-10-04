"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import type { CodeLanguage } from "@/types/blog";
import { highlight, TOKEN_CLASS } from "@/utils/highlights";

export interface TerminalWindowProps {
  readonly title?: string;
  readonly lines: readonly string[];
  readonly language?: CodeLanguage;
  /** Characters per second for the typing animation. */
  readonly speed?: number;
  readonly className?: string;
}

/**
 * Self-typing terminal. Respects prefers-reduced-motion by rendering the
 * full output immediately.
 */
export function TerminalWindow({
  title = "zsh — devlog",
  lines,
  language = "bash",
  speed = 42,
  className,
}: TerminalWindowProps) {
  const full = useMemo(() => lines.join("\n"), [lines]);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const [typed, setTyped] = useState(() => (reduced ? full : ""));

  useEffect(() => {
    if (reduced) {
      return () => setTyped(full);
    }
    // setTyped("");
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTyped(full.slice(0, index));
      if (index >= full.length) window.clearInterval(interval);
    }, 1000 / speed);
    return () => window.clearInterval(interval);
  }, [full, speed, reduced]);

  const renderedLines = typed.split("\n");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-[#0a0e17]/90 backdrop-blur-md",
        "shadow-[0_0_0_1px_rgba(6,182,212,0.08),0_30px_80px_-40px_rgba(6,182,212,0.5)]",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 dot-bg opacity-30" />
      <div
        aria-hidden
        className="absolute -right-16 -top-20 size-56 rounded-full bg-accent/20 blur-[80px] animate-sheen"
      />

      <div className="relative flex items-center gap-3 border-b border-line/80 bg-surface/40 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-rose-500/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span className="font-mono text-xs text-ink-faint">{title}</span>
      </div>

      <pre
        aria-label="Animated terminal session"
        className="relative min-h-54 overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed sm:text-[13px]"
      >
        <code>
          {renderedLines.map((line, index) => {
            const isLast = index === renderedLines.length - 1;
            return (
              <span key={index} className="block whitespace-pre">
                {highlight(line, language).map((token, tokenIndex) => (
                  <span key={tokenIndex} className={TOKEN_CLASS[token.kind]}>
                    {token.value}
                  </span>
                ))}
                {isLast ? (
                  <span
                    aria-hidden
                    className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-accent animate-blink"
                  />
                ) : null}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
