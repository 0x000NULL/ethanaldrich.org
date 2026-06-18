import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIONS, getStation, LINE_MAP } from "@/data/subway";
import { transfersForStation } from "@/lib/subway/selectors";

export function generateStaticParams() {
  return STATIONS.map((s) => ({ code: s.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const station = getStation(code);
  if (!station) return { title: "Station not found | Ethan Aldrich" };
  return {
    title: `${station.name} (${station.code}) | Ethan Aldrich`,
    description: station.summary,
    alternates: { canonical: `https://ethanaldrich.org/station/${station.code}` },
  };
}

/**
 * Crawlable per-station page (SSG). Renders the case study as real HTML for SEO and
 * as a no-JS fallback, then links into the interactive map at /?station=CODE.
 */
export default async function StationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const station = getStation(code);
  if (!station) notFound();

  const transfers = transfersForStation(station.code);

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[var(--metro-bg)] px-5 py-10 text-[var(--metro-ink)]">
      <Link href="/" className="text-sm underline underline-offset-2 hover:no-underline">
        ← Back to the map
      </Link>

      <header className="mt-6 flex items-center gap-3">
        <span
          className="board-type inline-flex h-12 w-12 items-center justify-center rounded-full border-[5px] text-sm font-bold"
          style={{ borderColor: LINE_MAP[station.lineCodes[0]]?.color }}
        >
          {station.code}
        </span>
        <div>
          <h1 className="text-2xl font-bold leading-tight">{station.name}</h1>
          <p className="text-sm text-[var(--metro-ink-dim)]">{station.nameJa}</p>
        </div>
      </header>

      <p className="mt-2 text-sm text-[var(--metro-ink-dim)]">
        Lines served: {station.lineCodes.map((c) => LINE_MAP[c]?.name).join(", ")}
        {station.dates ? ` · ${station.dates}` : ""}
      </p>

      <p className="station-prose mt-4">{station.summary}</p>

      {station.stack && station.stack.length > 0 && (
        <p className="mt-4 text-sm">
          <span className="font-bold">Stack:</span> {station.stack.join(" · ")}
        </p>
      )}

      {transfers.length > 0 && (
        <p className="mt-4 text-sm">
          <span className="font-bold">Transfers:</span>{" "}
          {transfers.map((t) => `${t.partnerName} (${t.lineCodes.join(", ")})`).join("; ")}
        </p>
      )}

      {station.links && station.links.length > 0 && (
        <ul className="mt-4 space-y-1">
          {station.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="underline" target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}

      {station.relatedPosts && station.relatedPosts.length > 0 && (
        <ul className="mt-4 space-y-1">
          {station.relatedPosts.map((slug) => (
            <li key={slug}>
              <Link href={`/blog/${slug}`} className="underline">
                Read: /blog/{slug}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8">
        <Link
          href={`/?station=${station.code}`}
          className="inline-flex min-h-[44px] items-center rounded-md border-2 border-[var(--metro-ink)] px-5 py-2 font-bold hover:bg-[var(--metro-ink)] hover:text-[var(--metro-bg)]"
        >
          View on the map
        </Link>
      </p>
    </main>
  );
}
