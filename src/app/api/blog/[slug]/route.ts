import { NextResponse } from "next/server";
import { getBlogPost } from "@/lib/blog";
import { serialize } from "next-mdx-remote/serialize";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Validate slug to prevent path traversal attacks
  const SLUG_REGEX = /^[a-z0-9-]+$/;
  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const post = getBlogPost(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Serialize MDX content for client-side rendering
  const mdxSource = await serialize(post.content);

  return NextResponse.json({
    ...post,
    mdxSource,
  });
}
