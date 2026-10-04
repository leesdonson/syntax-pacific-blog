import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { BadgeVariant, Size } from "@/types/blog";

export interface BadgeProps {
  readonly children: ReactNode;
  readonly variant?: BadgeVariant;
  readonly size?: Exclude<Size, "lg">;
  readonly icon?: ReactNode;
  readonly className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  accent: "bg-accent/10 text-accent border-accent/25",
  outline: "bg-transparent text-ink-muted border-line",
  solid: "bg-surface-2 text-ink border-transparent",
  ghost: "bg-transparent text-ink-faint border-transparent",
};

export function Badge({
  children,
  variant = "outline",
  size = "sm",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono tracking-tight",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        VARIANTS[variant],
        className,
      )}
    >
      {icon ? (
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

export interface TagPillProps {
  readonly tag: string;
  readonly active?: boolean;
  readonly count?: number;
  readonly onToggle?: (tag: string) => void;
}

/** Interactive filter pill — a real <button> so it is keyboard reachable. */
export function TagPill({
  tag,
  active = false,
  count,
  onToggle,
}: TagPillProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle?.(tag)}
      aria-pressed={active}
      aria-label={`Filter by tag ${tag}`}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs",
        "transition-all duration-200 hover:-translate-y-0.5",
        active
          ? "border-accent/60 bg-accent/15 text-accent shadow-glow-sm"
          : "border-line bg-surface/60 text-ink-muted hover:border-accent/40 hover:text-ink",
      )}
    >
      <span
        className={cn(
          "transition-colors",
          active ? "text-accent" : "text-ink-faint group-hover:text-accent",
        )}
      >
        #
      </span>
      {tag}
      {typeof count === "number" ? (
        <span className="text-ink-faint">{count}</span>
      ) : null}
    </button>
  );
}
