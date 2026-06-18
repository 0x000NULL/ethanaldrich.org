import type { BlogPostMeta } from "./blog";

/**
 * Pure, DOM-free presentation helpers for the blog. Kept separate from blog.ts (the
 * fs/parse boundary) so all formatting/derivation logic is unit-testable and the
 * coverage-excluded page.tsx files stay thin.
 *
 * Dates are authored as "MM-DD-YYYY" strings (load-bearing across blog.ts sort and
 * sitemap.ts). All parsing is done from numeric parts — never `new Date(string)` —
 * to avoid the UTC-vs-local off-by-one.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DATE_RE = /^(\d{2})-(\d{2})-(\d{4})$/;

function parseDateMs(date: string): number {
  const m = DATE_RE.exec(date);
  if (!m) return 0;
  return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2])).getTime();
}

/** "01-15-2026" → "January 15, 2026". Returns the input unchanged if unparseable. */
export function formatDate(date: string): string {
  const m = DATE_RE.exec(date);
  if (!m) return date;
  const month = Number(m[1]);
  if (month < 1 || month > 12) return date;
  return `${MONTHS[month - 1]} ${Number(m[2])}, ${m[3]}`;
}

/** "01-15-2026" → "2026-01-15" (ISO 8601 date) for SEO/structured data. */
export function toISODate(date: string): string {
  const m = DATE_RE.exec(date);
  if (!m) return date;
  return `${m[3]}-${m[1]}-${m[2]}`;
}

/** "~200 wpm" reading estimate, floored at one minute. */
export function readingTimeLabel(content: string): string {
  const trimmed = content.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export interface AdjacentPosts {
  /** The chronologically previous (older) post, if any. */
  older?: BlogPostMeta;
  /** The chronologically next (newer) post, if any. */
  newer?: BlogPostMeta;
}

/**
 * Older/newer neighbours of `slug` within a date-descending list (the order
 * `getBlogPosts()` returns). No wrap-around; ends yield `undefined`.
 */
export function getAdjacentPosts(
  posts: BlogPostMeta[],
  slug: string
): AdjacentPosts {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { newer: posts[i - 1], older: posts[i + 1] };
}

/**
 * Posts related to `current`: ranked by shared-tag count, tie-broken by date
 * proximity (so tagless posts fall back to nearest-by-date neighbours). Always
 * excludes `current`, capped at `limit`.
 */
export function getRelatedPosts(
  posts: BlogPostMeta[],
  current: BlogPostMeta,
  limit = 3
): BlogPostMeta[] {
  const curMs = parseDateMs(current.date);
  const curTags = current.tags ?? [];
  return posts
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      p,
      overlap: (p.tags ?? []).filter((t) => curTags.includes(t)).length,
    }))
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        Math.abs(parseDateMs(a.p.date) - curMs) -
          Math.abs(parseDateMs(b.p.date) - curMs)
    )
    .slice(0, limit)
    .map((s) => s.p);
}

export interface YearGroup {
  year: string;
  posts: BlogPostMeta[];
}

/** Group posts under their year, years descending, within-year order preserved. */
export function groupPostsByYear(posts: BlogPostMeta[]): YearGroup[] {
  const groups = new Map<string, BlogPostMeta[]>();
  for (const p of posts) {
    const m = DATE_RE.exec(p.date);
    const year = m ? m[3] : "Undated";
    const bucket = groups.get(year);
    if (bucket) bucket.push(p);
    else groups.set(year, [p]);
  }
  return [...groups.entries()]
    .map(([year, ps]) => ({ year, posts: ps }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

/** Resolve an ordered list of slugs to full posts, dropping any that don't exist. */
export function resolvePostRefs(
  posts: BlogPostMeta[],
  slugs: string[]
): BlogPostMeta[] {
  return slugs
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p): p is BlogPostMeta => Boolean(p));
}
