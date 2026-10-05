"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Menu, Search } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { SocialLinks } from "./social-links";
import { Drawer } from "@/components/ui/drawer";
import { categories, siteSocials } from "@/data";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/utils/cn";
import type { AccentName, ThemeMode } from "@/types/blog";
import { useHotkey } from "@/hooks/useHotkey";
import { usePathname, useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa6";

export interface NavbarProps {
  readonly mode: ThemeMode;
  readonly accent: AccentName;
  readonly onToggleMode: () => void;
  readonly onAccentChange: (accent: AccentName) => void;
}

const PRIMARY_LINKS = [
  { href: "/", label: "Home", end: true },
  { href: "/category/react", label: "React", end: false },
  { href: "/category/nextjs", label: "Next.js", end: false },
  { href: "/category/typescript", label: "TypeScript", end: false },
  { href: "/category/performance", label: "Performance", end: false },
  { href: "/category/tech-news", label: "Tech News", end: false },
] as const;

export function Navbar({
  mode,
  accent,
  onToggleMode,
  onAccentChange,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const scrolled = useScrolled(8);

  useHotkey("Escape", () => setMenuOpen(false), { allowInInput: true });

  const focusSearch = () => {
    router.push("/");
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(
        'input[role="searchbox"]',
      );
      input?.focus();
      input?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  };

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 30,
          delay: 0.05,
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-line bg-elevated/80 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        {/* Top hairline glow */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-accent/60 to-transparent",
            "transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // end={link.end}

                className={cn(
                  "relative rounded px-3 py-2 text-sm transition-colors duration-200",
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {
                  <>
                    {link.label}
                    {isActive ? (
                      <motion.span
                        onClick={() =>
                          pathname === link.href && setIsActive(true)
                        }
                        layoutId="nav-active"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                        className="absolute inset-0 -z-10 rounded border border-accent/30 bg-accent/10 shadow-glow-sm"
                      />
                    ) : null}
                  </>
                }
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={focusSearch}
              aria-label="Search posts"
              className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line bg-surface/50 text-ink-muted transition-all hover:border-accent/50 hover:text-accent lg:hidden"
            >
              <Search className="size-4" />
            </button>

            <div className="hidden lg:block">
              <ThemeToggle
                mode={mode}
                accent={accent}
                onToggleMode={onToggleMode}
                onAccentChange={onAccentChange}
              />
            </div>

            <a
              href="https://github.com/leesdonson/syntax-pacific-blog"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden items-center gap-2 rounded border border-accent/40 bg-accent/8 px-3.5 py-2 font-mono text-xs text-accent transition-all lg:inline-flex"
            >
              Edit on
              <FaGithub aria-hidden className="size-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line bg-surface/50 text-ink-muted transition-all hover:border-accent/50 hover:text-accent md:hidden"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="navigation"
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              //   end={link.end}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "border border-accent/30 bg-accent/10 text-accent"
                  : "text-ink-muted hover:bg-surface hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="mt-6 mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          all categories
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-line bg-surface/60 px-3 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              {category.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6">
          <ThemeToggle
            mode={mode}
            accent={accent}
            onToggleMode={onToggleMode}
            onAccentChange={onAccentChange}
          />
          <SocialLinks links={siteSocials} size="sm" />
        </div>
      </Drawer>
    </>
  );
}
