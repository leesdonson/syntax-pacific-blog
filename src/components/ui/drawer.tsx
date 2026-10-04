import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DrawerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
  readonly side?: "left" | "right";
}

/** Accessible slide-over: focus-trapping-lite, Escape to close, scroll lock. */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className={cn(
              "fixed inset-y-0 z-50 flex w-[min(21rem,88vw)] flex-col border-line bg-elevated/95 backdrop-blur-xl",
              side === "right" ? "right-0 border-l" : "left-0 border-r",
            )}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                {title}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="cursor-pointer rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
