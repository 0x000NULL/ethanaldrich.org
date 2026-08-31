"use client";

import { useEffect, useState } from "react";

interface BoardPost {
  slug: string;
  title: string;
  date: string;
}

/** A split-flap-style "Now Departing" board of recently shipped writing. */
export default function DepartureBoard() {
  const [posts, setPosts] = useState<BoardPost[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/blog", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: BoardPost[]) => setPosts(data.slice(0, 3)))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (posts.length === 0) return null;

  return (
    <aside
      className="pointer-events-auto absolute bottom-5 left-5 z-10 w-[26rem] max-w-[calc(100%-2.5rem)] rounded-lg border bg-[var(--metro-board-bg)] p-5 text-[var(--metro-board-ink)] shadow-xl"
      style={{ borderColor: "var(--metro-board-edge)" }}
      aria-label="Recently departed — latest writing"
    >
      <div className="board-type mb-3 text-sm font-bold uppercase tracking-widest text-[var(--metro-board-ink)]/80">
        ▸ Now Departing
      </div>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <a
              href={`/blog/${p.slug}`}
              className="board-type flex items-baseline justify-between gap-3 text-sm hover:text-white"
            >
              <span className="line-clamp-2">{p.title}</span>
              <span className="flex-none text-[var(--metro-board-ink)]/60">{p.date.slice(0, 5)}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
