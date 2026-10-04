"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export interface ModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly description?: string;
  readonly children?: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
            className="absolute inset-0 bg-void/75 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-md rounded-2xl border border-line bg-elevated/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 cursor-pointer rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="size-4" />
            </button>
            <h2 className="pr-8 text-lg font-semibold text-ink">{title}</h2>
            {description ? (
              <p className="mt-1.5 text-sm text-ink-muted">{description}</p>
            ) : null}
            {children ? <div className="mt-5">{children}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
