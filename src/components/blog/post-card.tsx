"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import type { HydratedPost } from "@/types/blog";
import { Badge } from "@/components/common/badge";
import { Avatar } from "./avatar";
import { formatDate, toISODate } from "@/utils/date";
import { cn } from "@/utils/cn";

export interface PostCardProps {
  readonly post: HydratedPost;
  readonly index?: number;
  /** Wide hero treatment used for the first/featured card. */
  readonly featured?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: Math.min(index * 0.07, 0.35),
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function PostCardImpl({ post, index = 0, featured = false }: PostCardProps) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/50 backdrop-blur-md",
        "transition-colors duration-300 hover:border-accent/40",
        featured && "md:col-span-2 md:flex-row",
      )}
    >
      {/* Hover glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: "0 24px 70px -30px var(--accent-500)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Cover / snippet preview */}
      <div
        className={cn(
          "relative overflow-hidden border-b border-line bg-[#0a0e17] p-4",
          featured && "md:w-[46%] md:shrink-0 md:border-b-0 md:border-r",
        )}
      >
        <div aria-hidden className="absolute inset-0 dot-bg opacity-40" />
        <div
          aria-hidden
          className="absolute -right-8 -top-10 size-32 rounded-full bg-accent/20 blur-3xl transition-all duration-500 group-hover:bg-accent/30"
        />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span aria-hidden className="flex gap-1.5">
              <span className="size-2 rounded-full bg-rose-500/60" />
              <span className="size-2 rounded-full bg-amber-400/60" />
              <span className="size-2 rounded-full bg-emerald-400/60" />
            </span>
            <span className="truncate font-mono text-[11px] text-ink-faint">
              {post.cover.caption}
            </span>
          </div>

          <pre className="overflow-hidden font-mono text-[11px] leading-relaxed text-slate-400">
            <code>{post.cover.snippet ?? post.excerpt.slice(0, 120)}</code>
          </pre>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="accent">{post.categoryMeta.label}</Badge>
          {post.tags.slice(0, featured ? 3 : 2).map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>

        <h3
          className={cn(
            "font-semibold tracking-tight text-ink",
            featured ? "text-2xl" : "text-lg",
          )}
        >
          <Link
            href={`/post/${post.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-accent focus-visible:text-accent"
          >
            {post.title}
          </Link>
        </h3>

        <p
          className={cn(
            "mt-2 text-sm leading-relaxed text-ink-muted",
            featured ? "line-clamp-4" : "line-clamp-3",
          )}
        >
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/70 pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar author={post.author} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink">
                {post.author.name}
              </p>
              <p className="truncate font-mono text-[11px] text-ink-faint">
                {post.author.handle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 font-mono text-[11px] text-ink-faint">
            <span className="hidden items-center gap-1 sm:flex">
              <CalendarDays aria-hidden className="size-3" />
              <time dateTime={toISODate(post.publishedAt)}>
                {formatDate(post.publishedAt)}
              </time>
            </span>
            <span className="flex items-center gap-1">
              <Clock aria-hidden className="size-3" />
              {post.reading.minutes}m
            </span>
          </div>
        </div>
      </div>

      <ArrowUpRight
        aria-hidden
        className="absolute right-4 top-4 size-4 text-ink-faint opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
      />
    </motion.article>
  );
}

export const PostCard = memo(PostCardImpl);
