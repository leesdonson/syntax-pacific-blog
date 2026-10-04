import type { ReadingStats } from "@/types/blog";

/** Average silent reading speed for technical prose. */
const WORDS_PER_MINUTE = 225;
/** Code is scanned slower than prose. */
const CODE_LINES_PER_MINUTE = 55;

const FENCE_RE = /```[\s\S]*?```/g;

export function calculateReadingTime(markdown: string): ReadingStats {
  const codeBlocks = markdown.match(FENCE_RE) ?? [];
  const codeLines = codeBlocks.reduce(
    (total, block) => total + block.split("\n").length,
    0,
  );

  const prose = markdown
    .replace(FENCE_RE, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_\-[\]()]/g, " ");

  const words = prose.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(
    1,
    Math.round(words / WORDS_PER_MINUTE + codeLines / CODE_LINES_PER_MINUTE),
  );

  return { minutes, words, label: `${minutes} min read` };
}
