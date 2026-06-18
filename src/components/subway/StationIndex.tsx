"use client";

import { useState } from "react";
import { LINES } from "@/data/subway";
import type { LineCode } from "@/data/subway/types";
import { useNavStore } from "@/store/nav-store";
import {
  getViewBox,
  lineBounds,
  transformForBounds,
} from "@/lib/subway/selectors";

/** Visible, collapsible legend: line key + status key. Clicking a line frames it. */
export default function StationIndex() {
  const [open, setOpen] = useState(true);
  const setTransform = useNavStore((s) => s.setTransform);

  const frameLine = (code: LineCode) =>
    setTransform(transformForBounds(lineBounds(code), getViewBox()));

  return (
    <aside
      className="pointer-events-auto absolute left-5 top-5 w-fit max-w-[90vw] rounded-xl border bg-[var(--metro-panel)]/95 p-6 text-[var(--metro-ink)] shadow-lg backdrop-blur"
      style={{ borderColor: "var(--metro-border)" }}
      aria-label="Map legend"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-3xl font-bold tracking-tight">Aldrich Transit</span>
        <button
          className="text-xl text-[var(--metro-ink-dim)] underline"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? "hide" : "lines"}
        </button>
      </div>

      {open && (
        <>
          <ul className="mt-4 space-y-3">
            {LINES.map((line) => (
              <li key={line.code}>
                <button
                  className="flex w-full items-center gap-4 rounded px-2 py-2 text-left text-2xl hover:bg-[var(--metro-bg)]"
                  onClick={() => frameLine(line.code)}
                >
                  <span
                    aria-hidden="true"
                    className="board-type inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border-4 text-xl font-bold"
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

          <div className="mt-4 border-t pt-3 text-xl text-[var(--metro-ink-dim)]" style={{ borderColor: "var(--metro-border)" }}>
            <span className="font-semibold">Solid ring</span> = shipped ·{" "}
            <span className="font-semibold">dashed ring</span> = planned
          </div>
        </>
      )}
    </aside>
  );
}
