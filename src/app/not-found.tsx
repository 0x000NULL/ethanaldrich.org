import type { Metadata } from "next";
import Link from "next/link";
import { PROFILE } from "@/data/profile";

/**
 * Without its own metadata this page inherited the root canonical — an absolute
 * URL to the homepage — so a 404 served under any arbitrary path presented
 * itself to crawlers as the site root.
 *
 * `robots` must be set explicitly. Next emits its own `noindex` for not-found,
 * but the root layout declares `index: true`, and without an override here that
 * is inherited — producing a page that says both `noindex` and `index, follow`.
 * Two agreeing tags are untidy; two contradicting ones are a real signal.
 */
export const metadata: Metadata = {
  title: `Station not found | ${PROFILE.name}`,
  description: "This stop isn't on the map.",
  alternates: { canonical: undefined },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--metro-bg)] p-8 text-[var(--metro-ink)]"
      role="main"
    >
      <div className="w-full max-w-md text-center">
        <div className="board-type mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[var(--line-c)] text-2xl font-bold">
          404
        </div>
        <h1 className="mb-2 text-2xl font-bold">Station not found</h1>
        <p className="mb-8 text-[var(--metro-ink-dim)]">
          This stop isn&apos;t on the map. It may have been renamed, or the line
          never ran here.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-md border-2 border-[var(--metro-ink)] px-6 py-3 font-bold transition-colors hover:bg-[var(--metro-ink)] hover:text-[var(--metro-bg)]"
        >
          Return to the map
        </Link>
      </div>
    </div>
  );
}
