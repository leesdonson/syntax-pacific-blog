/** Date helpers — all output is deterministic (en-US, UTC) to avoid SSR/CSR drift. */

const FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return FORMATTER.format(date);
}

export function toISODate(iso: string): string {
  return iso.slice(0, 10);
}

/** "3 days ago" / "in 2 months" — relative to `now` (injectable for tests). */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  const diffSeconds = (date.getTime() - now.getTime()) / 1000;

  const units: readonly [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  for (const [unit, seconds] of units) {
    const value = diffSeconds / seconds;
    if (Math.abs(value) >= 1) return rtf.format(Math.round(value), unit);
  }
  return "just now";
}

/** Newest first. */
export function byNewest<T extends { publishedAt: string }>(
  a: T,
  b: T,
): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}
