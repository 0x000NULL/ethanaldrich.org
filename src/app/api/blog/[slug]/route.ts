import { NextResponse } from "next/server";
import { getBlogPost } from "@/lib/blog";
import { serialize } from "next-mdx-remote/serialize";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
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
