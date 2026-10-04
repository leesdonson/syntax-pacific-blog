"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Cpu, Rss, Zap } from "lucide-react";
import { TerminalWindow } from "./terminal-window";
import { Button } from "@/components/common/button";
import { SocialLinks } from "@/components/common/social-links";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { categories, siteSocials } from "@/data";

const TERMINAL_LINES = [
  "$ npx create-devlog@latest ./notes --stack react19,vite,tailwind4",
  "",
  "  ✔ scaffolding content pipeline",
  "  ✔ compiling design tokens   (@theme inline)",
  "  ✔ indexing 5 articles       (12ms)",
  "",
  "$ devlog stats --since 2026",
  "  posts: 5   avg read: 6m   bundle: 12.4 kB gzip",
  "",
  "$ devlog serve --port 5173",
  "  ready → http://localhost:5173",
];

const STATS = [
  { icon: Cpu, label: "deep dives", value: "48" },
  { icon: Zap, label: "avg LCP", value: "1.1s" },
  { icon: Rss, label: "subscribers", value: "2.4k" },
] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      <GridBackdrop />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3 py-1.5 font-mono text-[11px] text-accent backdrop-blur-md"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            new · React 19 server component patterns
          </motion.span>

          <motion.h1
            id="hero-heading"
            variants={item}
            className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Engineering notes
            <br />
            from the{" "}
            <span className="relative whitespace-nowrap">
              <span className="accent-gradient bg-clip-text text-transparent text-glow">
                terminal
              </span>
              <span aria-hidden className="animate-blink text-accent">
                _
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl leading-relaxed text-ink-muted sm:text-lg"
          >
            Long-form, source-level writing on React internals, type-level
            design and the unglamorous performance work that makes products feel
            instant. No listicles. No hot takes.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/post/server-components-are-a-data-primitive"
              className="inline-flex"
            >
              <Button
                variant="primary"
                size="md"
                className="text-neutral-100"
                icon={<ArrowRight className="size-4" />}
                iconPosition="right"
                tabIndex={-1}
              >
                Read the latest
              </Button>
            </Link>
            <a href="#latest" className="inline-flex rounded">
              <Button
                className="text-neutral-100"
                variant="glow"
                size="md"
                tabIndex={-1}
              >
                Browse all posts
              </Button>
            </a>
            <SocialLinks links={siteSocials} className="ml-1" />
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-2"
            aria-label="Categories"
          >
            {categories.slice(0, 5).map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex rounded-full border border-line bg-surface/50 px-3 py-1 font-mono text-xs text-ink-muted backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="perspective-distant"
        >
          <TerminalWindow lines={TERMINAL_LINES} />

          <dl className="mt-5 grid grid-cols-3 gap-3">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-line bg-surface/40 px-4 py-3 backdrop-blur-md transition-colors hover:border-accent/30"
              >
                <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                  <Icon aria-hidden className="size-3" />
                  {label}
                </dt>
                <dd className="mt-1 font-mono text-xl font-semibold text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
