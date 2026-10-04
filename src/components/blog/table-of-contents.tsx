"use client";

import { motion } from "motion/react";
import { List } from "lucide-react";
import type { Heading } from "@/types/blog";
import { useActiveHeading } from "@/hooks/useActiveHeading";
import { cn } from "@/utils/cn";

export interface TableOfContentsProps {
  readonly headings: readonly Heading[];
  readonly className?: string;
}

/** Sticky article outline with scroll-spy highlighting. */
export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn("sticky top-24", className)}
    >
      <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
        <List aria-hidden className="size-3.5" />
        on this page
      </p>

      <ul className="space-y-0.5 border-l border-line">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id} className="relative">
              {isActive ? (
                <motion.span
                  layoutId="toc-indicator"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute -left-px top-0 h-full w-0.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent-500)]"
                />
              ) : null}
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block py-1.5 pr-2 text-sm transition-colors duration-200",
                  heading.level === 3 ? "pl-7" : "pl-4",
                  isActive ? "text-accent" : "text-ink-muted hover:text-ink",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
