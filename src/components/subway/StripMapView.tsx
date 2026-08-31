"use client";

import { LINES, getStationsForLine } from "@/data/subway";
import { transfersForStation } from "@/lib/subway/selectors";
import { useNavStore } from "@/store/nav-store";
import type { StationStatus } from "@/data/subway/types";

const STATUS_LABEL: Record<StationStatus, string> = {
  operational: "In service",
  "in-progress": "In progress",
  planned: "Planned",
};

/**
 * Mobile strip-map: a vertical, scrollable list of each line and its stations with
 * transfer chips. Replaces the pan/zoom SVG on small screens. Tapping a station
 * opens the same StationPanel sheet as desktop. This view is itself the accessible
 * interface on mobile, so the sr-only A11yMapOutline isn't rendered alongside it.
 */
export default function StripMapView() {
  const selectStation = useNavStore((s) => s.selectStation);
  const selected = useNavStore((s) => s.selectedStationCode);

  return (
    <div className="h-full w-full overflow-y-auto bg-[var(--metro-bg)] px-4 pb-24 pt-6 text-[var(--metro-ink)]">
      <h1 className="text-2xl font-bold">Aldrich Transit</h1>
      <p className="mt-1 text-sm text-[var(--metro-ink-dim)]">
        Tap a station for the story.
      </p>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm text-[var(--metro-ink-dim)] underline"
      >
        Résumé (PDF) ↗
      </a>

      {LINES.map((line) => {
        const stations = getStationsForLine(line.code);
        if (stations.length === 0) return null;
        return (
          <section key={line.code} aria-label={`${line.name} line`} className="mt-8">
            <header className="flex items-center gap-3">
              <span
                className="board-type inline-flex h-9 w-9 items-center justify-center rounded-full border-[3px] text-sm font-bold"
                style={{ borderColor: line.color, background: "var(--metro-roundel)" }}
              >
                {line.code}
              </span>
              <h2 className="text-lg font-bold">
                {line.name}
                {line.dashed && (
                  <span className="ml-2 text-sm font-normal text-[var(--metro-ink-dim)]">
                    · future
                  </span>
                )}
              </h2>
            </header>

            <ol
              className="relative ml-[18px] mt-3 border-l-2 pl-6"
              style={{ borderColor: line.color }}
            >
              {stations.map((station) => {
                const transfers = transfersForStation(station.code);
                const isSelected = selected === station.code;
                return (
                  <li key={station.code} className="relative mb-4">
                    <span
                      aria-hidden="true"
                      className="absolute top-2 h-3 w-3 rounded-full border-2"
                      style={{
                        left: "calc(-1.5rem - 7px)",
                        background:
                          station.status === "operational"
                            ? line.color
                            : "var(--metro-roundel)",
                        borderColor: line.color,
                      }}
                    />
                    <button
                      onClick={() => selectStation(station.code)}
                      aria-current={isSelected ? "true" : undefined}
                      className="touch-target block w-full rounded-lg px-2 py-1 text-left hover:bg-[var(--metro-panel)]"
                    >
                      <span className="font-bold">{station.name}</span>
                      <span className="board-type mt-0.5 block text-xs uppercase tracking-wide text-[var(--metro-ink-dim)]">
                        {station.code} · {STATUS_LABEL[station.status]}
                        {station.dates ? ` · ${station.dates}` : ""}
                      </span>
                      {transfers.length > 0 && (
                        <span className="mt-1 block text-xs text-[var(--metro-ink-dim)]">
                          ⇄ Transfer to{" "}
                          {transfers
                            .map(
                              (t) => `${t.partnerName} (${t.lineCodes.join(", ")})`
                            )
                            .join("; ")}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
