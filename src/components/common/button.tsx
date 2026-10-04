import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/utils/cn";
import type { ButtonVariant, Size } from "@/types/blog";

type NativeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof HTMLMotionProps<"button">
>;

export interface ButtonProps
  extends NativeProps, Omit<HTMLMotionProps<"button">, "children"> {
  readonly variant?: ButtonVariant;
  readonly size?: Size;
  readonly icon?: ReactNode;
  readonly iconPosition?: "left" | "right";
  readonly children?: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-slate-950 font-semibold hover:bg-accent-soft",
  secondary:
    "bg-surface text-ink border border-line hover:border-accent/60 hover:bg-surface-2",
  ghost: "text-ink-muted hover:text-ink hover:bg-surface/70",
  glow: "text-accent border border-accent/40 bg-accent/5 hover:bg-accent/12 ",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconPosition = "left",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center whitespace-nowrap transition-colors duration-200",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {icon && iconPosition === "left" ? (
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
      {icon && iconPosition === "right" ? (
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
      ) : null}
    </motion.button>
  );
}
