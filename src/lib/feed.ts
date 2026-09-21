import { PROFILE } from "@/data/profile";
import type { BlogPostMeta } from "./blog";
import { toISODate } from "./blog-format";

/**
 * Escape text for inclusion in XML character data or an attribute.
 *
 * Post titles and descriptions are authored prose containing ampersands and
 * quotes; unescaped they produce a feed that readers reject outright.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Build an RSS 2.0 document for the blog.
 *
 * The site had no feed at all, which for a portfolio whose blog is its main
 * recurring surface means there is no way to follow it. Pure and DOM-free so it
 * is unit-testable; the route just sets the content type.
 */
export function buildRssFeed(posts: BlogPostMeta[], now = new Date()): string {
  const site = PROFILE.site;
  const title = `${PROFILE.name} — Writing`;
  const description = `Posts from ${PROFILE.name}: ${PROFILE.title}.`;

  const items = posts
    .map((post) => {
      const url = `${site}/blog/${post.slug}`;
      // RFC 822 is what RSS 2.0 specifies for pubDate.
      const pubDate = new Date(`${toISODate(post.date)}T00:00:00Z`).toUTCString();
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(`${site}/blog`)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    "    <language>en-us</language>",
    `    <lastBuildDate>${now.toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${site}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ]
    .filter(Boolean)
    .join("\n");
}
