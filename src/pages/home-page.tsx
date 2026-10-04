"use client";

import { motion } from "motion/react";
import { Hero } from "@/components/home/hero";
import { FilterBar } from "@/components/blog/filter-bar";
import { PostGrid } from "@/components/blog/post-grid";
import { useSearch } from "@/hooks/useSearch";
import { allTags, hydratedPosts } from "@/data";

export default function HomePage() {
  const {
    query,
    setQuery,
    category,
    setCategory,
    activeTags,
    toggleTag,
    clear,
    results,
    isStale,
    isFiltered,
  } = useSearch({ posts: hydratedPosts });

  return (
    <div>
      <Hero />

      <section
        id="latest"
        aria-labelledby="latest-heading"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                ./posts
              </p>
              <h2
                id="latest-heading"
                className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Latest writing
              </h2>
            </div>
            <p className="font-mono text-xs text-ink-faint">
              {results.length} of {hydratedPosts.length} articles
            </p>
          </div>

          <FilterBar
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            tags={allTags}
            activeTags={activeTags}
            onToggleTag={toggleTag}
            resultCount={results.length}
            isFiltered={isFiltered}
            onClear={clear}
          />
        </motion.div>

        <PostGrid
          posts={results}
          featureFirst={!isFiltered}
          isStale={isStale}
          onReset={clear}
        />
      </section>
    </div>
  );
}
