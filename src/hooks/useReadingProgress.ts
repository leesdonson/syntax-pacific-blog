"use client";

import { useEffect, useState } from "react";

/** Vertical reading progress (0 → 1) of a given element, for the top bar. */
export function useReadingProgress(
  target: React.RefObject<HTMLElement | null>,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = element.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(top <= 0 ? 1 : 0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, -top / scrollable)));
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);

  return progress;
}
