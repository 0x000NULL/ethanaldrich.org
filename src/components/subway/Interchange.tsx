"use client";

import { toPx } from "@/lib/subway/geometry";
import { STATION_MAP } from "@/data/subway";
import type { Transfer } from "@/data/subway/types";
import { ROUNDEL_R } from "./Station";

interface InterchangeProps {
  transfer: Transfer;
}

/**
 * The white "peanut" connector linking two transfer stations. Drawn beneath the
 * roundels (in StationLayer) so the roundels sit on top. The marquee transfer
 * (Security+ ↔ Security Observability Stack) is rendered heavier.
 */
export default function Interchange({ transfer }: InterchangeProps) {
  const a = STATION_MAP[transfer.a];
  const b = STATION_MAP[transfer.b];
  if (!a || !b) return null;

  const pa = toPx(a.grid);
  const pb = toPx(b.grid);
  const width = transfer.marquee ? (ROUNDEL_R + 5) * 2 : (ROUNDEL_R + 2) * 2;

  return (
    <g
      data-transfer={`${transfer.a}-${transfer.b}`}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      {/* ink outline */}
      <line
        x1={pa.x}
        y1={pa.y}
        x2={pb.x}
        y2={pb.y}
        stroke="var(--metro-ink)"
        strokeWidth={width + 3}
        strokeLinecap="round"
      />
      {/* white fill */}
      <line
        x1={pa.x}
        y1={pa.y}
        x2={pb.x}
        y2={pb.y}
        stroke="var(--metro-roundel)"
        strokeWidth={width}
        strokeLinecap="round"
      />
    </g>
  );
}
