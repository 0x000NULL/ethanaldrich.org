import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getBlogPost, getBlogPosts, getAllBlogSlugs } from "@/lib/blog";
import { mdxComponents } from "@/lib/mdxComponents";
import { mdxOptions } from "@/lib/mdxOptions";
import {
  formatDate,
  toISODate,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/blog-format";
import { buildBlogPostingJsonLd } from "@/lib/blogJsonLd";
import PostList from "@/components/blog/PostList";

const SITE = "https://ethanaldrich.org";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found | Ethan Aldrich" };

  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: `${post.title} | Ethan Aldrich`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: toISODate(post.date),
      modifiedTime: toISODate(post.updatedAt ?? post.date),
      authors: [post.author ?? "Ethan Aldrich"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  // Compile up front so malformed MDX falls back to raw text instead of crashing.
  let body: ReactNode;
  try {
    const { content } = await compileMDX({
      source: post.content,
      components: mdxComponents,
      options: { mdxOptions },
    });
    body = content;
  } catch {
    body = (
      <pre className="board-type whitespace-pre-wrap text-sm">{post.content}</pre>
    );
  }

  const all = getBlogPosts();
  const { older, newer } = getAdjacentPosts(all, post.slug);
  const related = getRelatedPosts(all, post);
  const jsonLd = buildBlogPostingJsonLd(post);

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[var(--metro-bg)] px-5 py-10 text-[var(--metro-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex flex-wrap items-center gap-4 text-sm">
        <Link href="/" className="underline underline-offset-2 hover:no-underline">
          ← Back to the map
        </Link>
        <Link
          href="/blog"
          className="underline underline-offset-2 hover:no-underline"
        >
          ← All writing
        </Link>
      </nav>

      <article className="station-prose mx-auto mt-6">
        <header className="mb-6 text-center">
          <h1 className="mb-1 text-3xl font-bold">{post.title}</h1>
          <p className="board-type text-sm uppercase tracking-wide text-[var(--metro-ink-dim)]">
            {formatDate(post.date)} · {post.readingTime}
          </p>
        </header>
        {body}
      </article>

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-1.5">
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

      {(older || newer) && (
        <nav
          className="mt-10 flex justify-between gap-4 border-t pt-6 text-sm"
          style={{ borderColor: "var(--metro-border)" }}
        >
          <div className="max-w-[45%]">
            {older && (
              <Link href={`/blog/${older.slug}`} className="hover:underline">
                <span className="block text-xs uppercase tracking-wide text-[var(--metro-ink-dim)]">
                  ← Older
                </span>
                {older.title}
              </Link>
            )}
          </div>
          <div className="max-w-[45%] text-right">
            {newer && (
              <Link href={`/blog/${newer.slug}`} className="hover:underline">
                <span className="block text-xs uppercase tracking-wide text-[var(--metro-ink-dim)]">
                  Newer →
                </span>
                {newer.title}
              </Link>
            )}
          </div>
        </nav>
      )}

      {related.length > 0 && (
        <section
          className="mt-10 border-t pt-6"
          style={{ borderColor: "var(--metro-border)" }}
        >
          <h2 className="board-type mb-4 text-xs font-bold uppercase tracking-wide text-[var(--metro-ink-dim)]">
            Related writing
          </h2>
          <PostList posts={related} />
        </section>
      )}
    </main>
  );
}
