import { MetadataRoute } from "next";
import { getBlogPosts, getAllTags } from "@/lib/blog";
import { STATIONS } from "@/data/subway";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ethanaldrich.org";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const posts = getBlogPosts();
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
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  // Each station is an indexable page (the SSG /station/[code] route).
  const stationPages: MetadataRoute.Sitemap = STATIONS.map((station) => ({
    url: `${baseUrl}/station/${station.code}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...blogIndex,
    ...blogPages,
    ...stationPages,
    ...tagPages,
  ];
}
