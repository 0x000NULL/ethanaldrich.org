import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import PostList from "@/components/blog/PostList";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const label = decodeURIComponent(tag);
  return {
    title: `#${label} | Ethan Aldrich`,
    description: `Writing tagged “${label}”.`,
    alternates: { canonical: `https://ethanaldrich.org/blog/tag/${tag}` },
  };
}

/** Posts filtered by a single tag (SSG, one page per tag in use). */
export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const label = decodeURIComponent(tag);
  const posts = getPostsByTag(label);
  if (posts.length === 0) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[var(--metro-bg)] px-5 py-10 text-[var(--metro-ink)]">
      <Link
        href="/blog"
        className="text-sm underline underline-offset-2 hover:no-underline"
      >
        ← All writing
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-bold">#{label}</h1>
        <p className="board-type mt-1 text-sm uppercase tracking-wide text-[var(--metro-ink-dim)]">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </header>

      <div className="mt-8">
        <PostList posts={posts} />
      </div>
    </main>
  );
}
