"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Filter, X } from "lucide-react";
import { SearchBar } from "@/components/common/search-bar";
import { TagPill } from "@/components/common/badge";
import { categories } from "@/data";
import type { CategorySlug } from "@/types/blog";
import { cn } from "@/utils/cn";

export interface FilterBarProps {
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly category: CategorySlug | "all";
  readonly onCategoryChange: (value: CategorySlug | "all") => void;
  readonly tags: readonly string[];
  readonly activeTags: readonly string[];
  readonly onToggleTag: (tag: string) => void;
  readonly resultCount: number;
  readonly isFiltered: boolean;
  readonly onClear: () => void;
}

export function FilterBar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  tags,
  activeTags,
  onToggleTag,
  resultCount,
  isFiltered,
  onClear,
}: FilterBarProps) {
  const options = useMemo(
    () => [
      { slug: "all" as const, label: "All" },
      ...categories.map((c) => ({ slug: c.slug, label: c.label })),
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <SearchBar
        value={query}
        onChange={onQueryChange}
        resultCount={resultCount}
      />

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter by category"
      >
        {options.map((option) => {
          const isActive = category === option.slug;
          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => onCategoryChange(option.slug)}
              aria-pressed={isActive}
              className={cn(
                "relative cursor-pointer rounded px-3.5 py-1.5 text-sm transition-colors duration-200",
                isActive
                  ? "text-slate-950 bg-accent-soft"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="category-chip"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 -z-10 rounded-lg bg-accent shadow-[0_6px_24px_-8px_var(--accent-500)]"
                />
              ) : null}
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          <Filter aria-hidden className="size-3" />
          tags
        </span>
        {tags.map((tag) => (
          <TagPill
            key={tag}
            tag={tag}
            active={activeTags.includes(tag)}
            onToggle={onToggleTag}
          />
        ))}

        {isFiltered ? (
          <button
            type="button"
            onClick={onClear}
            className="ml-1 inline-flex cursor-pointer items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-xs text-rose-300 transition-colors hover:bg-rose-500/20"
          >
            <X aria-hidden className="size-3" />
            clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
