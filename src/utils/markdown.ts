import type { CodeLanguage, Heading, MarkdownNode } from "@/types/blog";
import { slugify } from "./slugify";

const LANGS: readonly CodeLanguage[] = [
  "tsx",
  "ts",
  "js",
  "json",
  "bash",
  "css",
  "text",
];

function normalizeLanguage(raw: string): CodeLanguage {
  const lang = raw.toLowerCase().trim();
  const alias: Record<string, CodeLanguage> = {
    typescript: "ts",
    javascript: "js",
    jsx: "tsx",
    sh: "bash",
    shell: "bash",
    zsh: "bash",
  };
  const mapped = alias[lang] ?? (lang as CodeLanguage);
  return LANGS.includes(mapped) ? mapped : "text";
}

/**
 * Parses the markdown subset used by our content files into a typed AST.
 * Supported: h2/h3, paragraphs, fenced code (```lang title=file), ul/ol,
 * blockquote and `---` dividers. Inline formatting is handled at render time.
 */
export function parseMarkdown(markdown: string): MarkdownNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: MarkdownNode[] = [];

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];

    // --- fenced code -------------------------------------------------
    if (line.startsWith("```")) {
      const meta = line.slice(3).trim();
      const [langToken, ...rest] = meta.split(/\s+/);
      const filenameToken = rest.find((token) => token.startsWith("title="));
      const buffer: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        buffer.push(lines[index]);
        index += 1;
      }
      index += 1; // consume closing fence
      nodes.push({
        type: "code",
        language: normalizeLanguage(langToken ?? ""),
        code: buffer.join("\n"),
        ...(filenameToken
          ? {
              filename: filenameToken
                .slice("title=".length)
                .replace(/["']/g, ""),
            }
          : {}),
      });
      continue;
    }

    // --- headings ----------------------------------------------------
    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length === 2 ? 2 : 3;
      const text = heading[2].trim();
      nodes.push({ type: "heading", level, id: slugify(text), text });
      index += 1;
      continue;
    }

    // --- divider -----------------------------------------------------
    if (/^---+$/.test(line.trim())) {
      nodes.push({ type: "divider" });
      index += 1;
      continue;
    }

    // --- blockquote --------------------------------------------------
    if (line.startsWith("> ")) {
      const buffer: string[] = [];
      while (index < lines.length && lines[index].startsWith("> ")) {
        buffer.push(lines[index].slice(2));
        index += 1;
      }
      nodes.push({ type: "quote", text: buffer.join(" ") });
      continue;
    }

    // --- lists -------------------------------------------------------
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const ordered = /^\d+\.\s+(.*)$/.exec(line);
    if (bullet || ordered) {
      const isOrdered = Boolean(ordered);
      const items: string[] = [];
      while (index < lines.length) {
        const current = lines[index];
        const match = isOrdered
          ? /^\d+\.\s+(.*)$/.exec(current)
          : /^[-*]\s+(.*)$/.exec(current);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      nodes.push({ type: "list", ordered: isOrdered, items });
      continue;
    }

    // --- paragraph ----------------------------------------------------
    if (line.trim() === "") {
      index += 1;
      continue;
    }
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !/^(#{2,3}\s|```|>\s|[-*]\s|\d+\.\s|---+$)/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    nodes.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return nodes;
}

/** Extracts the h2/h3 outline used by the sticky Table of Contents. */
export function extractHeadings(markdown: string): Heading[] {
  return parseMarkdown(markdown)
    .filter(
      (node): node is Extract<MarkdownNode, { type: "heading" }> =>
        node.type === "heading",
    )
    .map(({ id, text, level }) => ({ id, text, level }));
}

export type InlineToken =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "link"; value: string; href: string };

const INLINE_RE =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;

/** Splits a paragraph into inline tokens (code / bold / italic / links). */
export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE_RE)) {
    const start = match.index ?? 0;
    if (start > cursor)
      tokens.push({ type: "text", value: text.slice(cursor, start) });

    const raw = match[0];
    if (raw.startsWith("`")) {
      tokens.push({ type: "code", value: raw.slice(1, -1) });
    } else if (raw.startsWith("**")) {
      tokens.push({ type: "strong", value: raw.slice(2, -2) });
    } else if (raw.startsWith("*")) {
      tokens.push({ type: "em", value: raw.slice(1, -1) });
    } else {
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(raw);
      if (link) tokens.push({ type: "link", value: link[1], href: link[2] });
    }
    cursor = start + raw.length;
  }

  if (cursor < text.length)
    tokens.push({ type: "text", value: text.slice(cursor) });
  return tokens;
}
