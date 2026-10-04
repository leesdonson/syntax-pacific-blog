"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils/cn";

export interface TooltipProps {
  readonly label: string;
  readonly children: ReactNode;
  readonly side?: "top" | "bottom";
  readonly className?: string;
}

/** Hover + focus tooltip wired to aria-describedby. */
export function Tooltip({
  label,
  children,
  side = "top",
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined} className="inline-flex">
        {children}
      </span>

      <AnimatePresence>
        {open ? (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg",
              "border border-line bg-elevated px-2.5 py-1.5 font-mono text-[11px] text-ink shadow-xl",
              side === "top"
                ? "bottom-[calc(100%+8px)]"
                : "top-[calc(100%+8px)]",
            )}
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
