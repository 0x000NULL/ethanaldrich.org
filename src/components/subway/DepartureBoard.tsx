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
      className="pointer-events-auto absolute bottom-5 left-5 z-10 w-96 rounded-lg border bg-[#141414] p-5 text-[#f2c14e] shadow-xl"
      style={{ borderColor: "#000" }}
      aria-label="Recently departed — latest writing"
    >
      <div className="board-type mb-3 text-xl font-bold uppercase tracking-widest text-[#f2c14e]/80">
        ▸ Now Departing
      </div>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <a
              href={`/blog/${p.slug}`}
              className="board-type flex items-baseline justify-between gap-4 text-2xl hover:text-white"
            >
              <span className="truncate">{p.title}</span>
              <span className="flex-none text-[#f2c14e]/60">{p.date.slice(0, 5)}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
