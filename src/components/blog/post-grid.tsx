"use client";

import { AnimatePresence, motion } from "motion/react";
import { SearchX } from "lucide-react";
import type { HydratedPost } from "@/types/blog";
import { PostCard } from "./post-card";
import { Button } from "@/components/common/button";
import { cn } from "@/utils/cn";

export interface PostGridProps {
  readonly posts: readonly HydratedPost[];
  readonly featureFirst?: boolean;
  readonly isStale?: boolean;
  readonly onReset?: () => void;
  readonly emptyHint?: string;
}

export function PostGrid({
  posts,
  featureFirst = false,
  isStale = false,
  onReset,
  emptyHint,
}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/30 px-6 py-20 text-center"
      >
        <SearchX aria-hidden className="size-8 text-ink-faint" />
        <p className="mt-4 font-mono text-sm text-ink">no results found</p>
        <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
          {emptyHint ??
            "Nothing matched those filters. Try a broader query or clear the active tags."}
        </p>
        {onReset ? (
          <Button variant="glow" size="sm" className="mt-5" onClick={onReset}>
            reset filters
          </Button>
        ) : null}
      </motion.div>
    );
  }

  return (
    <div
      aria-busy={isStale}
      className={cn(
        "grid gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3",
        isStale && "opacity-60",
      )}
    >
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            layout
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={cn(
              featureFirst && index === 0 && "sm:col-span-2 lg:col-span-2",
            )}
          >
            <PostCard
              post={post}
              index={index}
              featured={featureFirst && index === 0}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
