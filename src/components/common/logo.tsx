import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";

export interface LogoProps {
  readonly className?: string;
  readonly compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="devlog — home"
      className={cn("group flex items-center gap-2.5 rounded-lg", className)}
    >
      <span className="relative grid place-items-center transition-all duration-300 group-hover:shadow-glow-sm">
        <Image
          src="/colorbytes-icon.png"
          sizes="100%"
          width={32}
          height={32}
          alt="Logo"
          className="w-8 h-8"
        />
        <span className="absolute inset-0 -z-10 rounded-xl bg-accent/25 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
      </span>

      {!compact && (
        <span className="font-mono text-[15px] font-semibold tracking-tight text-ink">
          blogs.
          <span className="text-accent">colorbytes.dev</span>
        </span>
      )}
    </Link>
  );
}
