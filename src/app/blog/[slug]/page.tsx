import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getBlogPost, getAllBlogSlugs } from "@/lib/blog";
import { mdxComponents } from "@/lib/mdxComponents";

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
  return {
    title: `${post.title} | Ethan Aldrich`,
    description: post.description,
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
    });
    body = content;
  } catch {
    body = (
      <pre className="board-type whitespace-pre-wrap text-sm">{post.content}</pre>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[var(--metro-bg)] px-5 py-10 text-[var(--metro-ink)]">
      <Link
        href="/"
        className="text-sm underline underline-offset-2 hover:no-underline"
      >
        ← Back to the map
      </Link>
      <article className="station-prose mt-6">
        <h1 className="mb-1 text-3xl font-bold">{post.title}</h1>
        <p className="mb-6 text-sm text-[var(--metro-ink-dim)]">{post.date}</p>
        {body}
      </article>
    </main>
  );
}
