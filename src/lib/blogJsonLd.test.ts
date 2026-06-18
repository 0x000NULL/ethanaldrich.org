import { describe, it, expect } from "vitest";
import type { BlogPostMeta } from "./blog";
import { buildBlogPostingJsonLd } from "./blogJsonLd";

const base: BlogPostMeta = {
  id: "montr-signage",
  slug: "montr-signage",
  date: "04-09-2026",
  title: "Building Montr",
  description: "Distributed signage",
  tags: ["rust", "nodejs"],
  readingTime: "8 min read",
};

describe("buildBlogPostingJsonLd", () => {
  it("emits a BlogPosting with ISO dates and absolute URLs", () => {
    const ld = buildBlogPostingJsonLd(base);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("BlogPosting");
    expect(ld.headline).toBe("Building Montr");
    expect(ld.datePublished).toBe("2026-04-09");
    expect(ld.dateModified).toBe("2026-04-09");
    expect(ld.url).toBe("https://ethanaldrich.org/blog/montr-signage");
    expect(ld.image).toBe(
      "https://ethanaldrich.org/blog/montr-signage/opengraph-image"
    );
    expect(ld.keywords).toBe("rust, nodejs");
  });

  it("defaults the author and honours updatedAt", () => {
    const ld = buildBlogPostingJsonLd({ ...base, updatedAt: "05-01-2026" });
    expect(ld.dateModified).toBe("2026-05-01");
    expect(ld.author).toMatchObject({ name: "Ethan Aldrich" });
  });

  it("uses a custom author when provided", () => {
    const ld = buildBlogPostingJsonLd({ ...base, author: "Jane Doe" });
    expect(ld.author).toMatchObject({ name: "Jane Doe" });
  });
});
