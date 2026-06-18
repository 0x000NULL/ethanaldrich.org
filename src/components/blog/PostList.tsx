import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/blog-format";
import PostCard from "./PostCard";

export interface PostListProps {
  posts: BlogPostMeta[];
  emptyMessage?: string;
}

/**
 * A line of stations: posts strung along a vertical rule with stop markers. Owns
 * the empty state so pages stay one-liners. Computes the formatted date here so
 * PostCard receives only precomputed strings.
 */
export default function PostList({
  posts,
  emptyMessage = "No departures scheduled yet.",
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="mt-8">
        <p className="text-[var(--metro-ink-dim)]">{emptyMessage}</p>
        <Link
          href="/"
          className="mt-2 inline-block text-sm underline underline-offset-2 hover:no-underline"
        >
          ← Back to the map
        </Link>
      </div>
    );
  }

  return (
    <ol
      className="relative ml-2 space-y-8 border-l-2 pl-6"
      style={{ borderColor: "var(--metro-border)" }}
    >
      {posts.map((post) => (
        <li key={post.slug} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-1.5 h-3 w-3 rounded-full border-2"
            style={{
              left: "calc(-1.5rem - 7px)",
              background: "var(--metro-roundel)",
              borderColor: "var(--metro-ink)",
            }}
          />
          <PostCard post={post} formattedDate={formatDate(post.date)} />
        </li>
      ))}
    </ol>
  );
}
