"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

const POSTS_PER_PAGE = 5;

interface BlogPostMeta {
  id: string;
  filename: string;
  extension: string;
  size: number;
  date: string;
  title: string;
  description: string;
  slug: string;
}

interface BlogPost extends BlogPostMeta {
  content: string;
  mdxSource?: MDXRemoteSerializeResult;
}

// Custom MDX components with retro DOS styling
const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-bios-success text-xl font-bold mb-4 mt-2" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-bios-success text-lg font-bold mb-3 mt-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-bios-success text-base font-bold mb-2 mt-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-3 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-3 ml-4 space-y-1" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-3 ml-4 space-y-1 list-decimal" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="before:content-['►'] before:text-bios-success before:mr-2 before:text-xs" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-[#00AAAA] hover:underline hover:text-[#00FFFF]" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-black text-bios-success px-1 py-0.5 text-sm font-mono" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-black text-bios-success p-3 overflow-x-auto mb-3 border border-[#444] text-sm font-mono" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-bios-success pl-4 italic mb-3 text-[#AAAAAA]" {...props} />
  ),
  hr: () => <hr className="border-[#444] my-4" />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-bios-success font-bold" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="text-[#AAAAAA] italic" {...props} />
  ),
};

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch posts list
  const fetchPosts = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/blog", { signal });
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await res.json();
      setPosts(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError("Failed to load blog posts. Please try again.");
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch blog posts:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    const controller = new AbortController();
    fetchPosts(controller.signal);
    return () => controller.abort();
  }, [fetchPosts]);

  // Pagination
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, page]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const handleSelectPost = async (slug: string) => {
    setLoadingPost(true);
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) {
        throw new Error("Failed to fetch post");
      }
      const post = await res.json();
      setSelectedPost(post);
    } catch (err: unknown) {
      setError("Failed to load blog post. Please try again.");
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch blog post:", err);
      }
    }
    setLoadingPost(false);
  };

  const handleRetry = () => {
    setError(null);
    fetchPosts();
  };

  if (error && !selectedPost) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <div className="text-[var(--bios-error)]">{error}</div>
        <button
          onClick={handleRetry}
          className="px-4 py-1 border border-[var(--bios-success)] text-[var(--bios-success)] hover:bg-[var(--bios-success)] hover:text-black"
        >
          [ RETRY ]
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-bios-success blink">Loading directory...</div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-[#000000] hover:text-bios-success"
          >
            ← Back to Directory
          </button>
          <span className="text-[#606060]">
            {selectedPost.filename}.{selectedPost.extension}
          </span>
        </div>

        <div className="border border-[#444444] p-4">
          <div className="text-bios-success text-lg mb-2">{selectedPost.title}</div>
          <div className="text-[#606060] text-xs mb-4">
            Last modified: {selectedPost.date} | Size: {selectedPost.size.toLocaleString()} bytes
          </div>
          <div className="prose-dos text-sm">
            {selectedPost.mdxSource ? (
              <MDXRemote {...selectedPost.mdxSource} components={mdxComponents} />
            ) : (
              <pre className="whitespace-pre-wrap font-mono">
                {selectedPost.content}
              </pre>
            )}
          </div>
        </div>

        <div className="text-[#606060] text-xs text-center">
          Press ESC to return to directory | PgUp/PgDn to scroll
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-[#000000] text-lg mb-4">
        ╔══════════════════════════════════════════════════════════╗
        <br />
        ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DIRECTORY OF C:\BLOG&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        <br />
        ╚══════════════════════════════════════════════════════════╝
      </div>

      <div className="text-sm mb-2">
        <span className="text-black">Volume in drive C is </span>
        <span className="text-[#000000]">ALDRICH_BLOG</span>
      </div>
      <div className="text-sm mb-4">
        <span className="text-black">Directory of C:\BLOG</span>
      </div>

      <div className="border border-[#444444] p-2 font-mono text-sm overflow-x-auto">
        <table className="w-full" style={{ borderSpacing: '1rem 0.25rem', borderCollapse: 'separate' }}>
          <thead>
            <tr className="text-bios-success">
              <th className="text-left whitespace-nowrap">FILENAME</th>
              <th className="text-left">EXT</th>
              <th className="text-right">SIZE</th>
              <th className="text-left">DATE</th>
              <th className="text-left">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.map((post) => (
              <tr
                key={post.id}
                onClick={() => handleSelectPost(post.slug)}
                className={`cursor-pointer hover:bg-[#000080] hover:text-white ${
                  loadingPost ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <td className="text-[#000000] whitespace-nowrap">{post.filename}</td>
                <td className="text-black">{post.extension}</td>
                <td className="text-black text-right whitespace-nowrap">
                  {post.size.toLocaleString()}
                </td>
                <td className="text-black whitespace-nowrap">{post.date}</td>
                <td className="text-[#444444]">{post.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm">
        <span className="text-black">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{posts.length} file(s)
        </span>
        <span className="text-[#444444]">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {posts.reduce((acc, p) => acc + p.size, 0).toLocaleString()} bytes
        </span>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-2 py-1 ${
              page === 1
                ? "text-[#606060] cursor-not-allowed"
                : "text-bios-success hover:underline"
            }`}
          >
            &lt; Prev
          </button>
          <span className="text-[#AAAAAA]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-2 py-1 ${
              page === totalPages
                ? "text-[#606060] cursor-not-allowed"
                : "text-bios-success hover:underline"
            }`}
          >
            Next &gt;
          </button>
        </div>
      )}

      <div className="text-[#606060] text-xs text-center mt-4">
        Click on a file to read | Press ESC to exit
      </div>
    </div>
  );
}
