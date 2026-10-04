import Link from "next/link";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";
import { Newsletter } from "./newsletter";
import { categories, siteSocials } from "@/data";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-elevated/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-translate-y-12">
          <Newsletter />
        </div>

        <div className="grid gap-10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Engineering notes from the terminal. Deep dives on React,
              TypeScript, and the tooling that ships them.
            </p>
            <SocialLinks links={siteSocials} className="mt-5" size="sm" />
          </div>

          <nav aria-label="Categories">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {["RSS feed", "Uses", "Speaking", "Open source", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-ink-muted transition-colors hover:text-accent"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-6 sm:flex-row">
          <p className="font-mono text-xs text-ink-faint">
            © {YEAR} ColorBytes.dev — built with React 19, Vite &amp; Tailwind
            v4
          </p>
          <p className="font-mono text-xs text-ink-faint">
            <span className="text-emerald-glow">●</span> all systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
