import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fs module before importing blog
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
}));

// Mock gray-matter
vi.mock("gray-matter", () => ({
  default: vi.fn((content: string) => {
    // Parse YAML frontmatter manually for testing
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (match) {
      const frontmatter = match[1];
      const body = match[2];
      const data: Record<string, string> = {};

      frontmatter.split("\n").forEach((line) => {
        const [key, ...valueParts] = line.split(": ");
        if (key && valueParts.length) {
          data[key.trim()] = valueParts.join(": ").trim();
        }
      });

      return { data, content: body };
    }
    return { data: {}, content };
  }),
}));

import fs from "fs";
import { getBlogPosts, getBlogPost, getAllBlogSlugs } from "./blog";

describe("blog utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getBlogPosts", () => {
    it("should return empty array when directory does not exist", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const posts = getBlogPosts();

      expect(posts).toEqual([]);
    });

    it("should return blog posts sorted by date descending", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "older-post.mdx",
        "newer-post.mdx",
      ] as unknown as ReturnType<typeof fs.readdirSync>);

      vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
        if (String(filePath).includes("older-post")) {
          return `---
title: Older Post
date: 01-15-2025
description: An older post
---
Content`;
        }
        return `---
title: Newer Post
date: 02-28-2026
description: A newer post
---
Content`;
      });

      const posts = getBlogPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe("Newer Post");
      expect(posts[1].title).toBe("Older Post");
    });

    it("should filter for only .md and .mdx files", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "post.mdx",
        "post2.md",
        "readme.txt",
        "config.json",
      ] as unknown as ReturnType<typeof fs.readdirSync>);

      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: Test Post
date: 02-28-2026
---
Content`);

      const posts = getBlogPosts();

      expect(posts).toHaveLength(2);
    });

    it("should provide default values for missing frontmatter", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "minimal-post.mdx",
      ] as unknown as ReturnType<typeof fs.readdirSync>);

      vi.mocked(fs.readFileSync).mockReturnValue(`---
---
Just content, no frontmatter`);

      const posts = getBlogPosts();

      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe("minimal-post");
      expect(posts[0].filename).toBe("MINIMAL-POST");
      expect(posts[0].extension).toBe("TXT");
      expect(posts[0].title).toBe("Untitled");
      expect(posts[0].description).toBe("");
      expect(posts[0].slug).toBe("minimal-post");
    });

    it("should extract slug from filename without extension", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "my-blog-post.mdx",
      ] as unknown as ReturnType<typeof fs.readdirSync>);

      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: My Blog Post
date: 02-28-2026
---
Content`);

      const posts = getBlogPosts();

      expect(posts[0].slug).toBe("my-blog-post");
    });

    it("should use file size when size not in frontmatter", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "post.mdx",
      ] as unknown as ReturnType<typeof fs.readdirSync>);

      const content = `---
title: Test
date: 02-28-2026
---
This is the content`;

      vi.mocked(fs.readFileSync).mockReturnValue(content);

      const posts = getBlogPosts();

      expect(posts[0].size).toBe(content.length);
    });
  });

  describe("getBlogPost", () => {
    it("should return null when post does not exist", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const post = getBlogPost("nonexistent");

      expect(post).toBeNull();
    });

    it("should prefer .mdx over .md files", () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath) => {
        return String(filePath).endsWith(".mdx");
      });

      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: MDX Post
date: 02-28-2026
---
MDX Content`);

      const post = getBlogPost("test-post");

      expect(post).not.toBeNull();
      expect(post?.title).toBe("MDX Post");
    });

    it("should fallback to .md when .mdx does not exist", () => {
      vi.mocked(fs.existsSync).mockImplementation((filePath) => {
        return String(filePath).endsWith(".md") && !String(filePath).endsWith(".mdx");
      });

      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: MD Post
date: 02-28-2026
---
MD Content`);

      const post = getBlogPost("test-post");

      expect(post).not.toBeNull();
      expect(post?.title).toBe("MD Post");
    });

    it("should include trimmed content", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: Test
date: 02-28-2026
---

  Content with whitespace

`);

      const post = getBlogPost("test-post");

      expect(post?.content).toBe("Content with whitespace");
    });

    it("should use slug from parameter", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: Test
date: 02-28-2026
---
Content`);

      const post = getBlogPost("my-slug");

      expect(post?.slug).toBe("my-slug");
    });

    it("should provide default values for missing frontmatter", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`---
---
Just content`);

      const post = getBlogPost("test");

      expect(post?.id).toBe("test");
      expect(post?.filename).toBe("TEST");
      expect(post?.extension).toBe("TXT");
      expect(post?.title).toBe("Untitled");
      expect(post?.description).toBe("");
    });
  });

  describe("getAllBlogSlugs", () => {
    it("should return empty array when directory does not exist", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const slugs = getAllBlogSlugs();

      expect(slugs).toEqual([]);
    });

    it("should return slugs without file extensions", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "post-one.mdx",
        "post-two.md",
        "post-three.mdx",
      ] as unknown as ReturnType<typeof fs.readdirSync>);

      const slugs = getAllBlogSlugs();

      expect(slugs).toEqual(["post-one", "post-two", "post-three"]);
    });

    it("should only include .md and .mdx files", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "post.mdx",
        "readme.txt",
        "config.json",
        "other.md",
      ] as unknown as ReturnType<typeof fs.readdirSync>);

      const slugs = getAllBlogSlugs();

      expect(slugs).toEqual(["post", "other"]);
    });
  });
});
