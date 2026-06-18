"use client";

import { useNavStore } from "@/store/nav-store";
import { getStation, LINE_MAP } from "@/data/subway";
import { transfersForStation } from "@/lib/subway/selectors";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { LineCode, StationStatus } from "@/data/subway/types";

const STATUS_LABEL: Record<StationStatus, string> = {
  operational: "In service",
  "in-progress": "In progress",
  planned: "Planned",
};

function LineChip({ code }: { code: LineCode }) {
  const line = LINE_MAP[code];
  if (!line) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className="board-type inline-flex h-5 w-5 items-center justify-center rounded-full border-[3px] text-[10px] font-bold"
        style={{ borderColor: line.color }}
      >
        {code}
      </span>
      {line.name}
    </span>
  );
}

export default function StationPanel() {
  const panelOpen = useNavStore((s) => s.panelOpen);
  const code = useNavStore((s) => s.selectedStationCode);
  const closePanel = useNavStore((s) => s.closePanel);
  const selectStation = useNavStore((s) => s.selectStation);
  const ref = useFocusTrap<HTMLDivElement>(panelOpen, closePanel);

  const station = code ? getStation(code) : undefined;
  if (!panelOpen || !station) return null;

  const transfers = transfersForStation(station.code);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="station-panel-title"
      className="absolute right-0 top-0 z-20 flex h-full w-full max-w-md flex-col overflow-y-auto border-l bg-[var(--metro-panel)] p-5 text-[var(--metro-ink)] shadow-xl"
      style={{ borderColor: "var(--metro-border)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="board-type inline-flex h-12 w-12 items-center justify-center rounded-full border-[5px] text-sm font-bold"
            style={{ borderColor: LINE_MAP[station.lineCodes[0]]?.color }}
          >
            {station.code}
          </span>
          <div>
            <h2 id="station-panel-title" className="text-xl font-bold leading-tight">
              {station.name}
            </h2>
            <p className="text-sm text-[var(--metro-ink-dim)]">{station.nameJa}</p>
          </div>
        </div>
        <button
          onClick={closePanel}
          aria-label="Close station details"
          className="rounded p-1 text-2xl leading-none text-[var(--metro-ink-dim)] hover:text-[var(--metro-ink)]"
        >
          ×
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {station.lineCodes.map((c) => (
          <LineChip key={c} code={c} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span
          className="rounded-full px-2 py-0.5 font-semibold"
          style={{ background: "var(--metro-bg)", border: "1px solid var(--metro-border)" }}
        >
          {STATUS_LABEL[station.status]}
        </span>
        {station.dates && (
          <span className="text-[var(--metro-ink-dim)]">{station.dates}</span>
        )}
        {station.express && (
          <span className="font-semibold" style={{ color: "var(--line-c)" }}>
            Express
          </span>
        )}
      </div>

      <p className="mt-4 station-prose">{station.summary}</p>

      {station.stack && station.stack.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--metro-ink-dim)]">
            Stack
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {station.stack.map((t) => (
              <span
                key={t}
                className="board-type rounded px-2 py-0.5 text-xs"
                style={{ background: "var(--metro-bg)", border: "1px solid var(--metro-border)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {transfers.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--metro-ink-dim)]">
            Transfers
          </h3>
          <ul className="space-y-1">
            {transfers.map((t) => (
              <li key={t.partnerCode}>
                <button
                  onClick={() => selectStation(t.partnerCode)}
                  className="text-sm underline hover:no-underline"
                >
                  Transfer to {t.partnerName} ({t.lineCodes.join(" · ")})
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {station.links && station.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {station.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold underline hover:no-underline"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}

      {station.relatedPosts && station.relatedPosts.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--metro-ink-dim)]">
            Related writing
          </h3>
          <ul className="space-y-1">
            {station.relatedPosts.map((slug) => (
              <li key={slug}>
                <a href={`/blog/${slug}`} className="text-sm underline hover:no-underline">
                  /blog/{slug}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
