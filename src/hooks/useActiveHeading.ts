"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/types/blog";

/**
 * Tracks which heading is currently in view for the sticky Table of Contents.
 * Uses a single IntersectionObserver with a top-biased root margin so the
 * active item flips as a section reaches the upper third of the viewport.
 */
export function useActiveHeading(headings: readonly Heading[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    if (headings.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const firstVisible = headings.find((heading) =>
          visible.has(heading.id),
        );
        if (firstVisible) setActiveId(firstVisible.id);
      },
      { rootMargin: "-88px 0px -66% 0px", threshold: 0 },
    );

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}
