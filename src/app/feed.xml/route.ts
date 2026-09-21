import { getBlogPosts } from "@/lib/blog";
import { buildRssFeed } from "@/lib/feed";

/**
 * RSS 2.0 at /feed.xml. Drafts are already excluded by getBlogPosts.
 */
export function GET() {
  return new Response(buildRssFeed(getBlogPosts()), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
