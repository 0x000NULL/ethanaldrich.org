import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { groupPostsByYear } from "@/lib/blog-format";
import PostList from "@/components/blog/PostList";

const BLOG_DESCRIPTION =
  "Field notes on infrastructure, homelab, distributed systems, security, and the occasional engine swap.";

export const metadata: Metadata = {
  title: "Writing | Ethan Aldrich",
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "https://ethanaldrich.org/blog" },
  openGraph: {
    type: "website",
    title: "Writing | Ethan Aldrich",
    description: BLOG_DESCRIPTION,
    url: "https://ethanaldrich.org/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing | Ethan Aldrich",
    description: BLOG_DESCRIPTION,
  },
};

/** The blog index — every post strung along a line, grouped by year. */
export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const groups = groupPostsByYear(posts);

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[var(--metro-bg)] px-5 py-10 text-[var(--metro-ink)]">
      <Link
        href="/"
        className="text-sm underline underline-offset-2 hover:no-underline"
      >
        ← Back to the map
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-bold">Writing</h1>
        <p className="board-type mt-1 text-sm uppercase tracking-wide text-[var(--metro-ink-dim)]">
          ▸ Now departing · {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </header>

      {posts.length === 0 ? (
        <PostList posts={posts} />
      ) : (
        groups.map((group) => (
          <section key={group.year} className="mt-8">
            <h2 className="board-type mb-4 text-lg font-bold text-[var(--metro-ink-dim)]">
              {group.year}
            </h2>
            <PostList posts={group.posts} />
          </section>
        ))
      )}
    </main>
  );
}
