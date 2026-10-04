"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import type { Heading } from "@/types/blog";

export interface ArticleLayoutProps {
  readonly headings: readonly Heading[];
  readonly header: ReactNode;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly aside?: ReactNode;
}

/**
 * Two-column reading layout: sticky TOC rail + prose column,
 * with a scroll-linked progress bar pinned under the navbar.
 */
export function ArticleLayout({
  headings,
  header,
  children,
  footer,
  aside,
}: ArticleLayoutProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(articleRef);

  return (
    <div ref={articleRef} className="relative">
      <div
        className="fixed inset-x-0 top-16 z-30 h-0.5 bg-transparent"
        aria-hidden
      >
        <motion.div
          className="h-full origin-left bg-accent shadow-[0_0_12px_var(--accent-500)]"
          style={{ scaleX: progress }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <span className="sr-only" aria-live="polite">
        {Math.round(progress * 100)}% read
      </span>

      {header}

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14 lg:px-8">
        <div className="min-w-0">
          {children}
          {footer}
        </div>

        <aside className="hidden lg:block">
          <TableOfContents headings={headings} />
          {aside}
        </aside>
      </div>
    </div>
  );
}
