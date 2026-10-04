"use client";

import { useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { useHotkey } from "@/hooks/useHotkey";

export interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly resultCount?: number;
  readonly className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search posts, tags, authors…",
  resultCount,
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useHotkey("k", focus, { meta: true, allowInInput: true });
  useHotkey("/", focus, { meta: false });

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded border border-line bg-surface/60 px-4",
        "backdrop-blur-md transition-all duration-300",
        "focus-within:border-accent/50 focus-within:shadow-glow-sm hover:border-line-soft",
        className,
      )}
    >
      <Search
        aria-hidden
        className="size-4 shrink-0 text-ink-faint transition-colors group-focus-within:text-accent"
      />

      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && onChange("")}
        placeholder={placeholder}
        aria-label="Search blog posts"
        aria-describedby={
          typeof resultCount === "number" ? "search-result-count" : undefined
        }
        className={cn(
          "h-11 w-full bg-transparent text-sm text-ink outline-none",
          "placeholder:text-ink-faint [&::-webkit-search-cancel-button]:appearance-none",
        )}
      />

      {typeof resultCount === "number" ? (
        <span
          id="search-result-count"
          aria-live="polite"
          className="hidden shrink-0 font-mono text-[11px] text-ink-faint sm:block"
        >
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      ) : null}

      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="cursor-pointer rounded-md p-1 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        <kbd
          aria-hidden
          className="hidden shrink-0 rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-ink-faint md:block"
        >
          ⌘K
        </kbd>
      )}
    </div>
  );
}
