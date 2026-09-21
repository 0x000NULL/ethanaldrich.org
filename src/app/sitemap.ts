import { MetadataRoute } from "next";
import { getBlogPosts, getAllTags } from "@/lib/blog";
import { STATIONS } from "@/data/subway";
import { getStationsWithBodies } from "@/lib/stations";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ethanaldrich.org";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      // Static asset, but a crawlable one — nothing else links to it otherwise.
      url: `${baseUrl}/resume.pdf`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const posts = getBlogPosts();

  // Newest post date, so /blog's lastModified reflects the content rather than
  // the deploy.
  const newestPost = posts[0]
    ? new Date(posts[0].date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2"))
    : new Date();

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: newestPost,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(
      post.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2")
    ),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tagPages: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${baseUrl}/blog/tag/${tag}`,
    lastModified: newestPost,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  // Each station is an indexable page (the SSG /station/[code] route). The six
  // carrying a case study are substantially richer than the nineteen that are a
  // summary line, so they are not advertised at the same priority.
  const withBodies = new Set(getStationsWithBodies());
  const stationPages: MetadataRoute.Sitemap = STATIONS.map((station) => ({
    url: `${baseUrl}/station/${station.code}`,
    lastModified: newestPost,
    changeFrequency: "monthly" as const,
    priority: withBodies.has(station.code) ? 0.7 : 0.4,
  }));

  return [
    ...staticPages,
    ...blogIndex,
    ...blogPages,
    ...stationPages,
    ...tagPages,
  ];
}
