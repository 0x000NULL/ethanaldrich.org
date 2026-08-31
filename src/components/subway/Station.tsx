"use client";

import { toPx } from "@/lib/subway/geometry";
import { LINE_MAP } from "@/data/subway";
import type { LineCode, Station as StationT } from "@/data/subway/types";

export const ROUNDEL_R = 11;

type LabelSide = "above" | "below" | "right";
export type LabelBand = "near" | "far";

function labelSide(lineCode: LineCode): LabelSide {
  switch (lineCode) {
    case "E":
      return "above";
    case "W":
      return "right";
    default:
      return "below";
  }
}

/** Two-line label geometry, staggered into near/far rows to avoid collisions. */
function labelLayout(side: LabelSide, band: LabelBand, r: number) {
  const far = band === "far";
  // SUB_GAP clears the 13u name. The far offsets below must clear a whole
  // two-line block (name + gap + sub) so a far label never lands on a
  // neighbouring station's near label — which is what used to collide on the
  // Projects line around "Security Observability Stack".
  const SUB_GAP = 15;
  if (side === "above") {
    const nameY = far ? -(r + 46) : -(r + 11);
    return { x: 0, nameY, subY: nameY - SUB_GAP, anchor: "middle" as const };
  }
  if (side === "below") {
    const nameY = far ? r + 56 : r + 16;
    return { x: 0, nameY, subY: nameY + SUB_GAP, anchor: "middle" as const };
  }
  return { x: r + 9, nameY: -3, subY: 12, anchor: "start" as const };
}

function isDashedRing(station: StationT): boolean {
  return station.status === "planned";
}

interface StationProps {
  station: StationT;
  band?: LabelBand;
  dimmed?: boolean;
  active?: boolean;
  onSelect?: (code: string) => void;
  onHover?: (code: string | null) => void;
}

export default function Station({
  station,
  band = "near",
  dimmed = false,
  active = false,
  onSelect,
  onHover,
}: StationProps) {
  const { x, y } = toPx(station.grid);
  const lineCode = station.lineCodes[0];
  const color = LINE_MAP[lineCode]?.color ?? "var(--metro-ink)";
  const side = station.labelSide ?? labelSide(lineCode);
  const r = active ? ROUNDEL_R + 2 : ROUNDEL_R;
  const label = labelLayout(side, band, r);

  return (
    <g
      data-station-code={station.code}
      data-status={station.status}
      data-line={lineCode}
      transform={`translate(${x} ${y})`}
      role="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={() => onSelect?.(station.code)}
      onPointerEnter={() => onHover?.(station.code)}
      onPointerLeave={() => onHover?.(null)}
      style={{ cursor: onSelect ? "pointer" : "default", opacity: dimmed ? 0.28 : 1 }}
    >
      {station.terminus && (
        <rect
          x={-r - 3}
          y={-3}
          width={2 * r + 6}
          height={6}
          rx={3}
          fill={color}
          opacity={0.35}
        />
      )}

      <circle
        r={r}
        fill="var(--metro-roundel)"
        stroke={color}
        strokeWidth={active ? 5 : 4}
        strokeDasharray={isDashedRing(station) ? "5 3" : undefined}
      />

      {/* Line letter inside the ring carries identity for colorblind users. */}
      <text
        className="board-type"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={700}
        fill="var(--metro-ink)"
      >
        {lineCode}
      </text>

      <text
        x={label.x}
        y={label.nameY}
        textAnchor={label.anchor}
        fontSize={13}
        fontWeight={600}
        fill="var(--metro-ink)"
      >
        {station.name}
      </text>
      <text
        x={label.x}
        y={label.subY}
        textAnchor={label.anchor}
        fontSize={10}
        fontWeight={400}
        fill="var(--metro-ink-dim)"
      >
        {station.code}　{station.nameJa}
      </text>
    </g>
  );
}
