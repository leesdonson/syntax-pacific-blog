import type { SocialLink, SocialPlatform } from "@/types/blog";
import { cn } from "@/utils/cn";
import Image from "next/image";

const ICONS: Record<SocialPlatform, string> = {
  github: "/icons/github_dark.svg",
  x: "/icons/x_dark.svg",
  tiktok: "/icons/tiktok-icon-light.svg",
  facebook: "/icons/facebook-icon.svg",
  linkedin: "/icons/linkedin.svg",
  website: "/icons/globe.svg",
};

export interface SocialLinksProps {
  readonly links: readonly SocialLink[];
  readonly className?: string;
  readonly size?: "sm" | "md";
}

export function SocialLinks({
  links,
  className,
  size = "md",
}: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map((link) => {
        const Icon = ICONS[link.platform];
        return (
          <li key={link.platform}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={link.label}
              className={cn(
                "grid place-items-center rounded-lg border border-line bg-surface/50 text-ink-muted",
                "transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent hover:shadow-glow-sm",
                size === "sm" ? "size-8" : "size-9",
              )}
            >
              <Image
                sizes="100%"
                width={16}
                height={16}
                src={Icon}
                alt={link.label}
                className="w-4 h-4"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
