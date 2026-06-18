"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--metro-bg)] p-8 text-[var(--metro-ink)]"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-full max-w-md text-center">
        <div className="board-type mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[var(--line-s)] text-xl font-bold">
          ⚠
        </div>
        <h1 className="mb-2 text-2xl font-bold">Service disruption</h1>
        <p className="mb-2 text-[var(--metro-ink-dim)]">
          A signal fault halted this train. You can retry or head back to the
          map.
        </p>
        {error.digest && (
          <p className="board-type mb-8 text-xs text-[var(--metro-ink-dim)]">
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="min-h-[44px] cursor-pointer rounded-md border-2 border-[var(--metro-ink)] px-6 py-3 font-bold transition-colors hover:bg-[var(--metro-ink)] hover:text-[var(--metro-bg)]"
          >
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border-2 border-[var(--metro-ink)] px-6 py-3 font-bold transition-colors hover:bg-[var(--metro-ink)] hover:text-[var(--metro-bg)]"
          >
            Back to the map
          </Link>
        </div>
      </div>
    </div>
  );
}
