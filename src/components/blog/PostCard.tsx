import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

export interface PostCardProps {
  post: BlogPostMeta;
  /** Precomputed by the caller (PostList) so this card stays logic-free. */
  formattedDate: string;
}

/**
 * One "stop" in the writing line: title, date · reading time, description, and
 * tag chips (reusing the station-stack chip style). Pure presentational.
 */
export default function PostCard({ post, formattedDate }: PostCardProps) {
  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className="touch-target inline-block font-bold leading-snug hover:underline"
      >
        <span className="text-xl">{post.title}</span>
      </Link>

      <p className="board-type mt-1 text-xs uppercase tracking-wide text-[var(--metro-ink-dim)]">
        {formattedDate} · {post.readingTime}
      </p>

      {post.description && (
        <p className="mt-2 leading-relaxed text-[var(--metro-ink)]">
          {post.description}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="board-type rounded px-2 py-0.5 text-xs hover:underline"
              style={{
                background: "var(--metro-bg)",
                border: "1px solid var(--metro-border)",
              }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
