/**
 * Core domain models for the blog.
 * Everything is `readonly` — post data is treated as immutable content.
 */

export type AccentName = "cyan" | "purple" | "emerald";

/** Two levels of dark: the default slate-dark and a near-black "darker". */
export type ThemeMode = "dark" | "darker";

export type CategorySlug =
  | "engineering"
  | "react"
  | "nextjs"
  | "typescript"
  | "performance"
  | "devops"
  | "ai"
  | "tech-news";

export interface Tag {
  readonly id: string;
  readonly label: string;
  readonly slug: string;
}

export interface Category {
  readonly slug: CategorySlug;
  readonly label: string;
  readonly description: string;
  /** Token name used to tint badges/glows for this category. */
  readonly accent: AccentName;
}

export interface Author {
  readonly id: string;
  readonly name: string;
  readonly handle: string;
  readonly role: string;
  readonly bio: string;
  /** Initials rendered inside the avatar chip (no external image needed). */
  readonly initials: string;
  readonly avatarGradient: readonly [string, string];
  readonly socials: Readonly<Partial<Record<SocialPlatform, string>>>;
}

export type SocialPlatform =
  | "github"
  | "x"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "website";

export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly label: string;
  readonly href: string;
}

export interface Post {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  /** ISO-8601 publication date. */
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly category: CategorySlug;
  readonly tags: readonly string[];
  readonly authorId: string;
  readonly featured: boolean;
  /** Lightweight markdown subset — parsed by `utils/markdown.ts`. */
  readonly content: string;
  readonly cover: PostCover;
}

export interface PostCover {
  readonly kind: "terminal" | "gradient" | "code" | "image";
  readonly caption: string;
  readonly snippet?: string;
  readonly language?: CodeLanguage;
  readonly image?: string;
  // readonly gradient?: readonly [string, string];
}

export type CodeLanguage =
  | "tsx"
  | "ts"
  | "js"
  | "json"
  | "bash"
  | "css"
  | "text";

/* ---------------------------------------------------------------- *
 * Derived / view-model types
 * ---------------------------------------------------------------- */

export interface Heading {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}

export interface ReadingStats {
  readonly minutes: number;
  readonly words: number;
  readonly label: string;
}

/** A `Post` joined with its author and computed reading stats. */
export interface HydratedPost extends Post {
  readonly author: Author;
  readonly reading: ReadingStats;
  readonly categoryMeta: Category;
  readonly headings: readonly Heading[];
}

export interface SearchState {
  readonly query: string;
  readonly category: CategorySlug | "all";
  readonly tags: readonly string[];
}

/* ---------------------------------------------------------------- *
 * Markdown AST (intentionally tiny — no runtime markdown dependency)
 * ---------------------------------------------------------------- */

export type MarkdownNode =
  | {
      readonly type: "heading";
      readonly level: 2 | 3;
      readonly id: string;
      readonly text: string;
    }
  | { readonly type: "paragraph"; readonly text: string }
  | {
      readonly type: "code";
      readonly language: CodeLanguage;
      readonly code: string;
      readonly filename?: string;
    }
  | {
      readonly type: "list";
      readonly ordered: boolean;
      readonly items: readonly string[];
    }
  | { readonly type: "quote"; readonly text: string }
  | { readonly type: "divider" };

/* ---------------------------------------------------------------- *
 * Shared component prop helpers
 * ---------------------------------------------------------------- */

export type BadgeVariant = "accent" | "outline" | "solid" | "ghost";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "glow";
export type Size = "sm" | "md" | "lg";
