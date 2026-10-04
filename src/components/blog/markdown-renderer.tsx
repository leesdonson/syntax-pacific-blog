"use client";

import { Fragment, memo, useMemo } from "react";
import { Link2 } from "lucide-react";
import type { MarkdownNode } from "@/types/blog";
import { parseInline, parseMarkdown, type InlineToken } from "@/utils/markdown";
import { CodeBlock } from "./code-block";

function Inline({ text }: { readonly text: string }) {
  const tokens = useMemo<InlineToken[]>(() => parseInline(text), [text]);

  return (
    <>
      {tokens.map((token, index) => {
        switch (token.type) {
          case "code":
            return (
              <code
                key={index}
                className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-accent before:content-none after:content-none"
              >
                {token.value}
              </code>
            );
          case "strong":
            return (
              <strong key={index} className="font-semibold text-ink">
                {token.value}
              </strong>
            );
          case "em":
            return (
              <em key={index} className="text-ink">
                {token.value}
              </em>
            );
          case "link":
            return (
              <a
                key={index}
                href={token.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {token.value}
              </a>
            );
          default:
            return <Fragment key={index}>{token.value}</Fragment>;
        }
      })}
    </>
  );
}

function renderNode(node: MarkdownNode, key: number) {
  switch (node.type) {
    case "heading": {
      const Tag = node.level === 2 ? "h2" : "h3";
      return (
        <Tag key={key} id={node.id} className="group scroll-mt-28">
          <a href={`#${node.id}`} className="no-underline hover:text-accent">
            {node.text}
            <Link2
              aria-hidden
              className="ml-2 inline size-4 -translate-y-px text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
            />
          </a>
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p key={key}>
          <Inline text={node.text} />
        </p>
      );
    case "code":
      return (
        <CodeBlock
          key={key}
          code={node.code}
          language={node.language}
          filename={node.filename}
        />
      );
    case "list": {
      const Tag = node.ordered ? "ol" : "ul";
      return (
        <Tag key={key}>
          {node.items.map((item, index) => (
            <li key={index}>
              <Inline text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote
          key={key}
          className="not-italic rounded-r-xl border-l-2 border-accent bg-accent/5 py-1 pl-5 pr-4 backdrop-blur-sm"
        >
          <p className="text-ink">
            <Inline text={node.text} />
          </p>
        </blockquote>
      );
    case "divider":
      return <hr key={key} className="border-line" />;
    default:
      return null;
  }
}

/** Renders our markdown subset — no dangerouslySetInnerHTML anywhere. */
function MarkdownRendererImpl({ content }: { readonly content: string }) {
  const nodes = useMemo(() => parseMarkdown(content), [content]);
  return <>{nodes.map(renderNode)}</>;
}

export const MarkdownRenderer = memo(MarkdownRendererImpl);
