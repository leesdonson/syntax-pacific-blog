"use client";

import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock,
  RefreshCw,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { AuthorCard } from "@/components/blog/author-card";
import { Avatar } from "@/components/blog/avatar";
import { Badge } from "@/components/common/badge";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { getPostBySlug, getRelatedPosts } from "@/data";
import { formatDate, formatRelative, toISODate } from "@/utils/date";
import Link from "next/link";
import { ArticleLayout } from "@/layouts/article-layout";
import Image from "next/image";

export function PostDetailPage({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);

  if (!post) {
    return <div className="">Loading</div>;
  }
  const related = getRelatedPosts(post);
  const header = (
    <header className="relative mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6 sm:pt-36 lg:px-8">
      <GridBackdrop />

      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-xs text-ink-muted transition-colors hover:text-accent"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        cd ..
      </Link>
      <div className="flex w-full space-x-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl md:w-[60%]"
        >
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link href={`/category/${post.category}`}>
              <Badge variant="accent" size="md">
                {post.categoryMeta?.label}
              </Badge>
            </Link>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>

          <h1 className="mt-5 text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            {post.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
            <div className="flex items-center gap-2.5">
              <Avatar author={post.author} size="md" />
              <div>
                <p className="text-sm font-medium text-ink">
                  {post.author.name}
                </p>
                <p className="font-mono text-[11px] text-ink-faint">
                  {post.author.role}
                </p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 font-mono text-xs text-ink-faint">
              <CalendarDays aria-hidden className="size-3.5" />
              <time dateTime={toISODate(post.publishedAt)}>
                {formatDate(post.publishedAt)}
              </time>
            </span>

            <span className="flex items-center gap-1.5 font-mono text-xs text-ink-faint">
              <Clock aria-hidden className="size-3.5" />
              {post.reading.label} ·{" "}
              {post.reading.words.toLocaleString("en-US")} words
            </span>

            {post.updatedAt ? (
              <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-glow">
                <RefreshCw aria-hidden className="size-3.5" />
                updated {formatRelative(post.updatedAt)}
              </span>
            ) : null}
          </div>
        </motion.div>
        {post?.cover?.image && (
          <div className="relative hidden md:flex w-[40%] border border-accent/50 h-90 hover:scale-105 transition duration-300 ease-in-out rounded-2xl overflow-hidden">
            <Image
              alt={post.title}
              src={post?.cover?.image}
              fill
              sizes="100%"
            />
          </div>
        )}
      </div>
    </header>
  );

  const footer = (
    <div className="mt-14 space-y-10">
      <AuthorCard author={post.author} />

      {related.length > 0 ? (
        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-faint"
          >
            keep reading
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/post/${item.slug}`}
                className="group rounded-xl border border-line bg-surface/40 p-5 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/40"
              >
                <p className="font-mono text-[11px] text-accent">
                  {item.categoryMeta?.label}
                </p>
                <p className="mt-2 font-medium leading-snug text-ink group-hover:text-accent">
                  {item.title}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                  {item.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-ink-faint">
                  {item.reading?.label}
                  <ArrowUpRight
                    aria-hidden
                    className="size-3 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );

  return (
    <ArticleLayout headings={post.headings} header={header} footer={footer}>
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="prose prose-invert prose-devlog max-w-none prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl prose-p:leading-[1.8] prose-a:no-underline prose-pre:p-0"
      >
        <MarkdownRenderer content={post.content} />
      </motion.article>
    </ArticleLayout>
  );
}
