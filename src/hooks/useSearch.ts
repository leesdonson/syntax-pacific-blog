import { useCallback, useDeferredValue, useMemo, useState } from "react";
import type { CategorySlug, HydratedPost } from "@/types/blog";

interface UseSearchOptions {
  readonly posts: readonly HydratedPost[];
  readonly initialCategory?: CategorySlug | "all";
}

interface UseSearchReturn {
  readonly query: string;
  readonly setQuery: (value: string) => void;
  readonly category: CategorySlug | "all";
  readonly setCategory: (value: CategorySlug | "all") => void;
  readonly activeTags: readonly string[];
  readonly toggleTag: (tag: string) => void;
  readonly clear: () => void;
  readonly results: readonly HydratedPost[];
  readonly isStale: boolean;
  readonly isFiltered: boolean;
}

/** Pre-computed lowercase haystack — avoids re-lowercasing on every keystroke. */
type IndexedPost = { readonly post: HydratedPost; readonly haystack: string };

function buildIndex(posts: readonly HydratedPost[]): readonly IndexedPost[] {
  return posts.map((post) => ({
    post,
    haystack: [
      post.title,
      post.excerpt,
      post.author.name,
      post.category,
      ...post.tags,
    ]
      .join(" ")
      .toLowerCase(),
  }));
}

/**
 * Instant client-side search: memoized index + deferred query so typing never
 * blocks the input, and filtering only re-runs when inputs actually change.
 */
export function useSearch({
  posts,
  initialCategory = "all",
}: UseSearchOptions): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategorySlug | "all">(
    initialCategory,
  );
  const [activeTags, setActiveTags] = useState<readonly string[]>([]);

  const deferredQuery = useDeferredValue(query);
  const index = useMemo(() => buildIndex(posts), [posts]);

  const results = useMemo(() => {
    const terms = deferredQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return index
      .filter(({ post, haystack }) => {
        if (category !== "all" && post.category !== category) return false;
        if (
          activeTags.length > 0 &&
          !activeTags.every((tag) => post.tags.includes(tag))
        )
          return false;
        return terms.every((term) => haystack.includes(term));
      })
      .map(({ post }) => post);
  }, [index, deferredQuery, category, activeTags]);

  const toggleTag = useCallback((tag: string) => {
    setActiveTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    );
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    setCategory("all");
    setActiveTags([]);
  }, []);

  return {
    query,
    setQuery,
    category,
    setCategory,
    activeTags,
    toggleTag,
    clear,
    results,
    isStale: query !== deferredQuery,
    isFiltered:
      query.trim() !== "" || category !== "all" || activeTags.length > 0,
  };
}
