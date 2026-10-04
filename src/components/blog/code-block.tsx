"use client";

import { memo, useMemo } from "react";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import type { CodeLanguage } from "@/types/blog";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/utils/cn";
import { highlight, TOKEN_CLASS } from "@/utils/highlights";

export interface CodeBlockProps {
  readonly code: string;
  readonly language?: CodeLanguage;
  readonly filename?: string;
  readonly showLineNumbers?: boolean;
  readonly className?: string;
}

function CodeBlockImpl({
  code,
  language = "tsx",
  filename,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard();
  const source = code.replace(/\s+$/, "");

  // Tokenizing is the expensive part — memoize per (code, language).
  const lines = useMemo(() => {
    return source.split("\n").map((line) => highlight(line, language));
  }, [source, language]);

  return (
    <figure
      className={cn(
        "group not-prose relative my-6 overflow-hidden rounded-xl border border-line bg-[#0a0e17]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_18px_50px_-24px_rgba(0,0,0,0.9)]",
        "transition-colors duration-300 hover:border-accent/30",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-line/80 bg-surface/40 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="truncate font-mono text-xs text-ink-faint">
            {filename ?? `snippet.${language}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint sm:block">
            {language}
          </span>
          <motion.button
            type="button"
            onClick={() => void copy(source)}
            whileTap={{ scale: 0.92 }}
            aria-label={
              copied ? "Code copied to clipboard" : "Copy code to clipboard"
            }
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-[11px] transition-all",
              copied
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-glow"
                : "border-line bg-elevated/70 text-ink-muted opacity-0 hover:border-accent/50 hover:text-accent focus-visible:opacity-100 group-hover:opacity-100",
            )}
          >
            {copied ? (
              <Check className="size-3" aria-hidden />
            ) : (
              <Copy className="size-3" aria-hidden />
            )}
            {copied ? "copied" : "copy"}
          </motion.button>
        </div>
      </div>

      {/* Source */}
      <div className="overflow-x-auto">
        <pre className="min-w-full py-4 font-mono text-[13px] leading-relaxed">
          <code aria-label={`${language} code sample`}>
            {lines.map((tokens, lineIndex) => (
              <span
                key={lineIndex}
                className="grid grid-cols-[auto_1fr] px-4 hover:bg-white/2.5"
              >
                {showLineNumbers ? (
                  <span
                    aria-hidden
                    className="mr-4 w-7 select-none text-right text-[11px] text-slate-700"
                  >
                    {lineIndex + 1}
                  </span>
                ) : null}
                <span className="whitespace-pre">
                  {tokens.length === 0 ? " " : null}
                  {tokens.map((token, tokenIndex) => (
                    <span key={tokenIndex} className={TOKEN_CLASS[token.kind]}>
                      {token.value}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </figure>
  );
}

/** Memoized: article re-renders (e.g. TOC scroll state) must not re-tokenize. */
export const CodeBlock = memo(CodeBlockImpl);
