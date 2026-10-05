"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { PostGrid } from "@/components/blog/post-grid";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { categoriesBySlug, hydratedPosts } from "@/data";
import type { CategorySlug } from "@/types/blog";
import Link from "next/link";
import { Button } from "@/components/common/button";

export function CategoryDetails({ slug }: { slug: string }) {
  const category = slug ? categoriesBySlug[slug] : undefined;

  if (!category)
    return (
      <header className="mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6 sm:pt-36 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-ink-muted transition-colors hover:text-accent"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          cd ..
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            ./category/{slug}
          </p>
          <h1 className="mt-3 text-4xl capitalize font-semibold tracking-tight text-ink sm:text-5xl">
            {slug}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
            This category does not have any Posts associated with it. Please
            check back later or explore other categories.
          </p>
          <p className="mt-4 font-mono text-xs text-ink-faint">
            0 articles in this category
          </p>
          <Button
            variant="secondary"
            className="mt-6 font-mono text-xs text-ink-muted hover:text-accent"
          >
            <Link href="/">Back to home</Link>
          </Button>
        </motion.div>
      </header>
    );

  const posts = hydratedPosts.filter(
    (post) => post.category === (category?.slug as CategorySlug),
  );

  console.log(posts);

  return (
    <div className="relative">
      <GridBackdrop orbs={false} />

      <header className="mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6 sm:pt-36 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-ink-muted transition-colors hover:text-accent"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          cd ..
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            ./category/{category.slug}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {category.label}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
            {category.description}
          </p>
          <p className="mt-4 font-mono text-xs text-ink-faint">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </motion.div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <PostGrid
          posts={posts}
          emptyHint="No articles published in this category yet — check back soon."
        />
      </section>
    </div>
  );
}
