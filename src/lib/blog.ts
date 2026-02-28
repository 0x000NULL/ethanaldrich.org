import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPostMeta {
  id: string;
  filename: string;
  extension: string;
  size: number;
  date: string;
  title: string;
  description: string;
  slug: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getBlogPosts(): BlogPostMeta[] {
  // Check if directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);

  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        id: data.id || file.replace(/\.mdx?$/, ""),
        filename: data.filename || file.replace(/\.mdx?$/, "").toUpperCase(),
        extension: data.extension || "TXT",
        size: data.size || fileContents.length,
        date: data.date || new Date().toLocaleDateString("en-US"),
        title: data.title || "Untitled",
        description: data.description || "",
        slug: file.replace(/\.mdx?$/, ""),
      } as BlogPostMeta;
    })
    .sort((a, b) => {
      // Sort by date descending
      const dateA = new Date(a.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2"));
      const dateB = new Date(b.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2"));
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);

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
    id: data.id || slug,
    filename: data.filename || slug.toUpperCase(),
    extension: data.extension || "TXT",
    size: data.size || fileContents.length,
    date: data.date || new Date().toLocaleDateString("en-US"),
    title: data.title || "Untitled",
    description: data.description || "",
    slug,
    content: content.trim(),
  } as BlogPost;
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  return files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => file.replace(/\.mdx?$/, ""));
}
