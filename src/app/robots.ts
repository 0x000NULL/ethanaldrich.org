import { MetadataRoute } from "next";
import { PROFILE } from "@/data/profile";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${PROFILE.site}/sitemap.xml`,
  };
}
