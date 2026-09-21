import Link from "next/link";
import { LINES, getStationsForLine } from "@/data/subway";
import { PROFILE, PROFILE_LINKS } from "@/data/profile";
import type { StationStatus } from "@/data/subway/types";

const STATUS_LABEL: Record<StationStatus, string> = {
  operational: "In service",
  "in-progress": "In progress",
  planned: "Planned",
};

/**
 * The server-rendered homepage.
 *
 * This is NOT a loading placeholder. It is the real content, as plain semantic
 * HTML: who Ethan is, how to reach him, and every line and station with a link
 * to its own page. Crawlers, link-preview scrapers and no-JS visitors get all of
 * it in the initial payload; previously the homepage shipped the single string
 * "Loading map…" and nothing else until the client bundle hydrated.
 *
 * SubwayShell renders this as its pre-mount state, so it is both what the server
 * emits and what the client's first render produces (hydration-safe), and it
 * unmounts cleanly when the map takes over rather than lingering as a hidden
 * duplicate of every station in the DOM.
 */
export default function StaticNetworkOutline() {
  return (
    <main
      id="static-outline"
      className="mx-auto max-w-2xl px-5 py-10 text-[var(--metro-ink)]"
    >
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{PROFILE.name}</h1>
        <p className="mt-1 text-lg text-[var(--metro-ink-dim)]">
          {PROFILE.title}
        </p>
        <p className="mt-1 text-sm text-[var(--metro-ink-dim)]">
          {PROFILE.location}
        </p>
        <p className="mt-4 max-w-prose">{PROFILE.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {PROFILE_LINKS.map((l) => (
            <li key={l.href}>
              {l.external ? (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline underline-offset-2 hover:no-underline"
                >
                  {l.label} ↗
                </a>
              ) : (
                <Link
                  href={l.href}
                  className="font-semibold underline underline-offset-2 hover:no-underline"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </header>

      <p className="mt-8 text-sm text-[var(--metro-ink-dim)]">
        This site draws that career as a transit map. Each line is a thread;
        each station is a milestone with its own page.
      </p>

      {LINES.map((line) => {
        const stations = getStationsForLine(line.code);
        if (stations.length === 0) return null;
        return (
          <section key={line.code} className="mt-8">
            <h2 className="flex items-center gap-3 text-lg font-bold">
              <span
                aria-hidden="true"
                className="board-type inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border-[3px] text-sm font-bold"
                style={{ borderColor: line.color }}
              >
                {line.code}
              </span>
              {line.name}
            </h2>
            <ul
              className="mt-3 ml-4 space-y-3 border-l-2 pl-5"
              style={{ borderColor: line.color }}
            >
              {stations.map((station) => (
                <li key={station.code}>
                  <Link
                    href={`/station/${station.code}`}
                    className="font-semibold underline underline-offset-2 hover:no-underline"
                  >
                    {station.name}
                  </Link>
                  <span className="ml-2 text-xs text-[var(--metro-ink-dim)]">
                    {station.code} · {STATUS_LABEL[station.status]}
                    {station.dates ? ` · ${station.dates}` : ""}
                  </span>
                  <p className="mt-0.5 text-sm text-[var(--metro-ink-dim)]">
                    {station.summary}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
