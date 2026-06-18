"use client";

import { useMemo } from "react";
import { STATIONS, TRANSFERS, LINES, getStationsForLine } from "@/data/subway";
import type { LineCode } from "@/data/subway/types";
import Station, { type LabelBand } from "./Station";
import Interchange from "./Interchange";

interface StationLayerProps {
  focus: Set<LineCode>;
  selectedCode?: string | null;
  onSelect?: (code: string) => void;
  onHover?: (code: string | null) => void;
}

/** Peanut connectors first (underneath), then the roundels on top. */
export default function StationLayer({
  focus,
  selectedCode,
  onSelect,
  onHover,
}: StationLayerProps) {
  // Stagger labels into two rows along each line (near/far) to avoid collisions.
  const bandByCode = useMemo(() => {
    const map: Record<string, LabelBand> = {};
    for (const line of LINES) {
      getStationsForLine(line.code).forEach((s, i) => {
        if (!(s.code in map)) map[s.code] = i % 2 === 0 ? "near" : "far";
      });
    }
    return map;
  }, []);

  return (
    <g data-layer="stations">
      {TRANSFERS.map((t) => (
        <Interchange key={`${t.a}-${t.b}`} transfer={t} />
      ))}
      {STATIONS.map((station) => {
        const onLine = station.lineCodes.some((c) => focus.has(c));
        return (
          <Station
            key={station.code}
            station={station}
            band={station.labelBand ?? bandByCode[station.code] ?? "near"}
            dimmed={!onLine}
            active={selectedCode === station.code}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
    </g>
  );
}
