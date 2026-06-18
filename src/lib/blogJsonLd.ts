import type { BlogPostMeta } from "./blog";
import { toISODate } from "./blog-format";

const SITE = "https://ethanaldrich.org";
const DEFAULT_AUTHOR = "Ethan Aldrich";

/**
 * Build the schema.org `BlogPosting` object for a post. Pure (no DOM) so it can be
 * unit-tested; the page renders it as a `<script type="application/ld+json">`.
 */
export function buildBlogPostingJsonLd(
  post: BlogPostMeta
): Record<string, unknown> {
  const url = `${SITE}/blog/${post.slug}`;
  const author = post.author ?? DEFAULT_AUTHOR;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: toISODate(post.date),
    dateModified: toISODate(post.updatedAt ?? post.date),
    author: { "@type": "Person", name: author, url: SITE },
    publisher: { "@type": "Person", name: DEFAULT_AUTHOR, url: SITE },
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${url}/opengraph-image`,
    keywords: post.tags.join(", "),
  };
}
