import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { readingTimeLabel } from "./blog-format";

export interface BlogPostMeta {
  id: string;
  slug: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  author?: string;
  updatedAt?: string;
  readingTime: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

/** Map parsed frontmatter + body into a BlogPostMeta with safe defaults. */
function mapFrontmatter(
  slug: string,
  data: Record<string, unknown>,
  content: string
): BlogPostMeta {
  return {
    id: (data.id as string) || slug,
    slug,
    date: (data.date as string) || new Date().toLocaleDateString("en-US"),
    title: (data.title as string) || "Untitled",
    description: (data.description as string) || "",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    author: (data.author as string) || undefined,
    updatedAt: (data.updatedAt as string) || undefined,
    readingTime: readingTimeLabel(content),
  };
}

/** Sort comparator: newest "MM-DD-YYYY" first. */
function byDateDesc(a: BlogPostMeta, b: BlogPostMeta): number {
  const dateA = new Date(a.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2"));
  const dateB = new Date(b.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2"));
  return dateB.getTime() - dateA.getTime();
}

export function getBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const fileContents = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(fileContents);
      return mapFrontmatter(slug, data, content);
    })
    .sort(byDateDesc);
}

export function getBlogPost(slug: string): BlogPost | null {
  // Sanitize slug to prevent path traversal
  const sanitizedSlug = slug.replace(/[^a-zA-Z0-9_-]/g, "");
  const mdxPath = path.join(BLOG_DIR, `${sanitizedSlug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${sanitizedSlug}.md`);

  let filePath: string | null = null;
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  }

  if (!filePath) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...mapFrontmatter(slug, data, content),
    content: content.trim(),
  };
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

/** Every tag in use, with how many posts carry it (count desc, then alphabetical). */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getBlogPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts carrying a given tag, preserving the date-descending order. */
export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getBlogPosts().filter((post) => post.tags.includes(tag));
}
