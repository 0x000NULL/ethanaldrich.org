import { NextResponse } from "next/server";
import { getBlogPost } from "@/lib/blog";
import { serialize } from "next-mdx-remote/serialize";
import { mdxOptions } from "@/lib/mdxOptions";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // This route Shiki-highlights MDX on every call. That is by far the most
  // expensive thing the server does, it is unauthenticated, and it runs on a
  // single 512MB instance — so it gets a limit before it gets anything else.
  const { allowed, resetIn } = checkRateLimit(getClientIp(request.headers), {
    maxRequests: 30,
    windowMs: 60_000,
  });
  if (!allowed) {
    const retryAfter = String(Math.ceil(resetIn / 1000));
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": retryAfter } }
    );
  }

  // Validate slug to prevent path traversal attacks
  const SLUG_REGEX = /^[a-z0-9-]+$/;
  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const post = getBlogPost(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Serialize MDX content for client-side rendering. Shares mdxOptions with the
  // page's compileMDX so highlighted/GFM output is identical on both paths.
  const mdxSource = await serialize(post.content, { mdxOptions });

  return NextResponse.json(
    { ...post, mdxSource },
    {
      // Published post bodies only change on redeploy, so let the edge absorb
      // the repeat traffic rather than re-highlighting per request.
      headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" },
    }
  );
}
