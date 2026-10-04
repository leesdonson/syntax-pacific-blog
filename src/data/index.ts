import type { CategorySlug, HydratedPost } from "@/types/blog";
import { authorsById, categoriesBySlug } from "./authors";
import { posts } from "./posts";
import { calculateReadingTime } from "@/utils/reading-time";
import { extractHeadings } from "@/utils/markdown";
import { byNewest } from "@/utils/date";

/**
 * Content is static, so hydration (author join + reading time + heading
 * extraction) happens exactly once at module scope instead of per render.
 */
export const hydratedPosts: readonly HydratedPost[] = posts
  .map((post) => ({
    ...post,
    author: authorsById[post.authorId],
    categoryMeta: categoriesBySlug[post.category],
    reading: calculateReadingTime(post.content),
    headings: extractHeadings(post.content),
  }))
  .sort(byNewest);

const bySlug = new Map(hydratedPosts.map((post) => [post.slug, post]));

export function getPostBySlug(
  slug: string | undefined,
): HydratedPost | undefined {
  return slug ? bySlug.get(slug) : undefined;
}

export function getPostsByCategory(
  category: CategorySlug,
): readonly HydratedPost[] {
  return hydratedPosts.filter((post) => post.category === category);
}

/** Same category first, then shared tags — used by the "keep reading" rail. */
export function getRelatedPosts(
  post: HydratedPost,
  limit = 2,
): readonly HydratedPost[] {
  return hydratedPosts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.category === post.category ? 2 : 0) +
        candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export const featuredPost: HydratedPost =
  hydratedPosts.find((post) => post.featured) ?? hydratedPosts[0];

export {
  authors,
  authorsById,
  categories,
  categoriesBySlug,
  siteSocials,
} from "./authors";
export { posts, allTags } from "./posts";
