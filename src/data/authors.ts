import type { Author, Category, SocialLink } from "@/types/blog";

export const authors: readonly Author[] = [
  {
    id: "lee-donson",
    name: "Lee Donson",
    handle: "@leedonson",
    role: "Full-Stack Lead Engineer @ ColorBytes",
    bio: "Ships design systems and rendering pipelines for teams that hate slow apps. Currently obsessed with React 19 compiler output, streaming SSR, and shaving kilobytes off the critical path.",
    initials: "LD",
    avatarGradient: ["#06b6d4", "#8b5cf6"],
    socials: {
      github: "https://github.com/leesdonson",
      x: "https://x.com/leedonson",
      website: "https://leedonson.vercel.app",
    },
  },
  {
    id: "a-nova",
    name: "Nova Ardelean",
    handle: "@novabuilds",
    role: "Principal Frontend Engineer @ ColorBytes",
    bio: "Ships design systems and rendering pipelines for teams that hate slow apps. Currently obsessed with React 19 compiler output, streaming SSR, and shaving kilobytes off the critical path.",
    initials: "NA",
    avatarGradient: ["#06b6d4", "#8b5cf6"],
    socials: {
      github: "https://github.com",
      x: "https://x.com",
      website: "https://example.dev",
    },
  },
  {
    id: "a-kade",
    name: "Kade Ishiguro",
    handle: "@kade_rt",
    role: "Staff Engineer, Runtime & Tooling",
    bio: "Spends his days in bundler internals and his nights benchmarking things nobody asked him to benchmark. Maintainer of three build plugins and one very opinionated ESLint config.",
    initials: "KI",
    avatarGradient: ["#8b5cf6", "#f472b6"],
    socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
  },
  {
    id: "a-imani",
    name: "Imani Okafor",
    handle: "@imani.types",
    role: "TypeScript Architect",
    bio: "Turns tribal knowledge into compiler errors. Writes about type-level design, API ergonomics, and why your generics probably need a constraint.",
    initials: "IO",
    avatarGradient: ["#10b981", "#06b6d4"],
    socials: {
      github: "https://github.com",
      x: "https://x.com",
      rss: "/rss.xml",
    },
  },
] as const;

export const authorsById: Readonly<Record<string, Author>> = Object.fromEntries(
  authors.map((author) => [author.id, author]),
);

export const categories: readonly Category[] = [
  {
    slug: "react",
    label: "React",
    description:
      "Components, concurrency, and everything the renderer does behind your back.",
    accent: "cyan",
  },
  {
    slug: "typescript",
    label: "TypeScript",
    description:
      "Type-level design patterns that make invalid states unrepresentable.",
    accent: "emerald",
  },
  {
    slug: "performance",
    label: "Performance",
    description:
      "Budgets, profiles, and the unglamorous work of making things fast.",
    accent: "purple",
  },
  {
    slug: "engineering",
    label: "Engineering",
    description:
      "Architecture notes, postmortems, and hard-won team practices.",
    accent: "cyan",
  },
  {
    slug: "devops",
    label: "DevOps",
    description:
      "Pipelines, edge runtimes, and shipping on a Friday without fear.",
    accent: "emerald",
  },
  {
    slug: "ai",
    label: "AI",
    description: "Practical LLM plumbing for product engineers.",
    accent: "purple",
  },
] as const;

export const categoriesBySlug: Readonly<Record<string, Category>> =
  Object.fromEntries(categories.map((category) => [category.slug, category]));

export const siteSocials: readonly SocialLink[] = [
  { platform: "github", label: "GitHub", href: "https://github.com" },
  { platform: "x", label: "X / Twitter", href: "https://x.com" },
  { platform: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
  { platform: "tiktok", label: "TikTok", href: "https://tiktok.com" },
  { platform: "facebook", label: "Facebook", href: "https://facebook.com" },
] as const;
