"use client";

import { useState } from "react";
import { LINES } from "@/data/subway";
import type { LineCode } from "@/data/subway/types";
import { useNavStore } from "@/store/nav-store";
import { PROFILE, PROFILE_LINKS } from "@/data/profile";
import {
  getViewBox,
  lineBounds,
  transformForBounds,
} from "@/lib/subway/selectors";

/** Identity card + collapsible legend. Owns the page h1 and the contact links;
 *  clicking a line frames it. */
export default function StationIndex() {
  const [open, setOpen] = useState(true);
  const setTransform = useNavStore((s) => s.setTransform);

  const frameLine = (code: LineCode) =>
    setTransform(transformForBounds(lineBounds(code), getViewBox()));

  return (
    <aside
      className="pointer-events-auto absolute left-5 top-5 z-10 w-fit max-w-[18rem] rounded-xl border bg-[var(--metro-panel)]/95 p-5 text-[var(--metro-ink)] shadow-lg backdrop-blur"
      style={{ borderColor: "var(--metro-border)" }}
      aria-label="Map legend"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {/* The page's one persistent h1. The intro splash used to own it, and
              took it with it when dismissed, leaving the homepage headingless. */}
          <h1 className="text-xl font-bold tracking-tight">{PROFILE.name}</h1>
          <p className="text-xs leading-snug text-[var(--metro-ink-dim)]">
            {PROFILE.title}
          </p>
          <p className="text-xs text-[var(--metro-ink-dim)]">{PROFILE.location}</p>
        </div>
        <button
          className="flex-none text-sm text-[var(--metro-ink-dim)] underline"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? "hide" : "lines"}
        </button>
      </div>

      {/* Outside the collapse so contact routes stay reachable when it's hidden. */}
      <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {PROFILE_LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              {...(l.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-[var(--metro-ink-dim)] underline hover:text-[var(--metro-ink)]"
            >
              {l.label}
              {l.external ? " ↗" : ""}
            </a>
          </li>
        ))}
      </ul>

      {open && (
        <>
          <ul className="mt-3 space-y-1">
            {LINES.map((line) => (
              <li key={line.code}>
                <button
                  className="flex w-full items-center gap-3 rounded px-1 py-1.5 text-left text-base hover:bg-[var(--metro-bg)]"
                  onClick={() => frameLine(line.code)}
                >
                  <span
                    aria-hidden="true"
                    className="board-type inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border-[3px] text-sm font-bold"
                    style={{ borderColor: line.color, color: "var(--metro-ink)" }}
                  >
                    {line.code}
                  </span>
                  <span>
                    {line.name}
                    {line.dashed && (
                      <em className="ml-2 not-italic text-[var(--metro-ink-dim)]">
                        · future
                      </em>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t pt-2 text-xs leading-relaxed text-[var(--metro-ink-dim)]" style={{ borderColor: "var(--metro-border)" }}>
            <span className="font-semibold">Solid ring</span> = shipped ·{" "}
            <span className="font-semibold">dashed ring</span> = planned
          </div>
        </>
      )}
    </aside>
  );
}
