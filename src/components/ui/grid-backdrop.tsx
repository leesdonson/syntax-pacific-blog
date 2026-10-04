import { cn } from "@/utils/cn";

export interface GridBackdropProps {
  readonly className?: string;
  readonly variant?: "grid" | "dots";
  /** Adds two slow-floating accent orbs behind the grid. */
  readonly orbs?: boolean;
}

/**
 * Decorative page backdrop: masked grid + accent glow orbs.
 * Purely presentational, hidden from assistive tech.
 */
export function GridBackdrop({
  className,
  variant = "grid",
  orbs = true,
}: GridBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-70",
          variant === "grid" ? "grid-bg" : "dot-bg",
          "[mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_35%,transparent_100%)]",
        )}
      />
      {orbs ? (
        <>
          <div className="absolute -left-24 -top-24 size-104 rounded-full bg-accent/12 blur-[120px] animate-float" />
          <div className="absolute -right-32 top-24 size-88 rounded-full bg-purple-glow/10 blur-[120px] animate-float [animation-delay:-3s]" />
        </>
      ) : null}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
    </div>
  );
}
