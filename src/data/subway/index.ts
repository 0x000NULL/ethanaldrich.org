import {
  type GridPoint,
  type Point,
  type BBox,
  toPx,
  bbox,
  validateGridPolyline,
  detectLabelCollisions,
} from "@/lib/subway/geometry";
import { LINES, TRANSFERS } from "./lines";
import { STATIONS } from "./stations";
import { TRAINS } from "./trains";
import { ALERTS } from "./alerts";
import type { Line, LineCode, Station, NetworkConfig } from "./types";

export * from "./types";
export { LINES, TRANSFERS } from "./lines";
export { STATIONS } from "./stations";
export { TRAINS } from "./trains";
export { ALERTS } from "./alerts";

export const STATION_MAP: Record<string, Station> = Object.fromEntries(
  STATIONS.map((s) => [s.code, s])
);

export const LINE_MAP: Record<string, Line> = Object.fromEntries(
  LINES.map((l) => [l.code, l])
);

export function getNetwork(): NetworkConfig {
  return {
    lines: LINES,
    stations: STATIONS,
    transfers: TRANSFERS,
    trains: TRAINS,
    alerts: ALERTS,
  };
}

export function getStation(code: string): Station | undefined {
  return STATION_MAP[code];
}

export function getLine(code: string): Line | undefined {
  return LINE_MAP[code];
}

/** Stations that physically belong to a line (excludes junction-only references). */
export function getStationsForLine(code: LineCode): Station[] {
  return STATIONS.filter((s) => s.lineCodes.includes(code));
}

export interface ResolvedPolyline {
  kind: "trunk" | "branch";
  dashed: boolean;
  grid: GridPoint[];
  points: Point[];
  /** Station code → vertex index in `points` (corners are not stations). */
  stationVertex: Record<string, number>;
}

function resolveSequence(codes: string[], vias?: Line["vias"]): {
  grid: GridPoint[];
  stationVertex: Record<string, number>;
} {
  const grid: GridPoint[] = [];
  const stationVertex: Record<string, number> = {};

  codes.forEach((code, i) => {
    const station = STATION_MAP[code];
    if (!station) throw new Error(`Unknown station code "${code}"`);
    if (i > 0) {
      const prev = codes[i - 1];
      const via = vias?.find((v) => v.from === prev && v.to === code);
      via?.points.forEach((p) => grid.push(p));
    }
    stationVertex[code] = grid.length;
    grid.push(station.grid);
  });

  return { grid, stationVertex };
}

/** Resolve a line into its trunk polyline plus any branch polylines (px + grid). */
export function resolveLinePolylines(line: Line): ResolvedPolyline[] {
  const out: ResolvedPolyline[] = [];

  const trunk = resolveSequence(line.stationCodes, line.vias);
  out.push({
    kind: "trunk",
    dashed: Boolean(line.dashed),
    grid: trunk.grid,
    points: trunk.grid.map(toPx),
    stationVertex: trunk.stationVertex,
  });

  for (const branch of line.branches ?? []) {
    const seq = resolveSequence([branch.fromCode, ...branch.stationCodes]);
    out.push({
      kind: "branch",
      dashed: Boolean(branch.dashed ?? line.dashed),
      grid: seq.grid,
      points: seq.grid.map(toPx),
      stationVertex: seq.stationVertex,
    });
  }

  return out;
}

/** The trunk polyline only — what trains ride. */
export function getTrunkPolyline(code: LineCode): ResolvedPolyline {
  const line = LINE_MAP[code];
  if (!line) throw new Error(`Unknown line "${code}"`);
  return resolveLinePolylines(line)[0];
}

/** Bounding box (px) of every station and every routed corner across the network. */
export function getNetworkBounds(): BBox {
  const all: Point[] = [];
  for (const line of LINES) {
    for (const poly of resolveLinePolylines(line)) all.push(...poly.points);
  }
  return bbox(all);
}

export interface ConfigIssue {
  kind: "octolinear" | "missing-station" | "coincident" | "transfer" | "label";
  detail: string;
}

/** Distance in grid units between two stations. */
function gridDistance(a: GridPoint, b: GridPoint): number {
  return Math.hypot(a.gx - b.gx, a.gy - b.gy);
}

/**
 * Validate the whole network: octolinearity, referential integrity, no coincident
 * stations, sane transfer adjacency, and no overlapping roundels. The PR0 gate.
 */
export function validateConfig(): ConfigIssue[] {
  const issues: ConfigIssue[] = [];

  // 1. Every segment of every line (trunk + branch) is octolinear.
  for (const line of LINES) {
    for (const poly of resolveLinePolylines(line)) {
      for (const v of validateGridPolyline(poly.grid)) {
        issues.push({
          kind: "octolinear",
          detail: `Line ${line.code} ${poly.kind} hop #${v.index}: (${v.from.gx},${v.from.gy})→(${v.to.gx},${v.to.gy}) is not 0/45/90°.`,
        });
      }
    }
  }

  // 2. Referential integrity for transfers, trains, alerts.
  const refs: { label: string; code?: string }[] = [
    ...TRANSFERS.flatMap((t) => [
      { label: `transfer ${t.a}/${t.b}`, code: t.a },
      { label: `transfer ${t.a}/${t.b}`, code: t.b },
    ]),
    ...TRAINS.flatMap((t) => [
      { label: `train ${t.id}`, code: t.fromCode },
      { label: `train ${t.id}`, code: t.toCode },
    ]),
    ...ALERTS.map((a) => ({ label: `alert ${a.id}`, code: a.stationCode })),
  ];
  for (const ref of refs) {
    if (ref.code && !STATION_MAP[ref.code]) {
      issues.push({ kind: "missing-station", detail: `${ref.label} references unknown station "${ref.code}".` });
    }
  }

  // 3. No two distinct stations occupy the same grid coordinate.
  for (let i = 0; i < STATIONS.length; i++) {
    for (let j = i + 1; j < STATIONS.length; j++) {
      if (gridDistance(STATIONS[i].grid, STATIONS[j].grid) === 0) {
        issues.push({
          kind: "coincident",
          detail: `${STATIONS[i].code} and ${STATIONS[j].code} share grid (${STATIONS[i].grid.gx},${STATIONS[i].grid.gy}).`,
        });
      }
    }
  }

  // 4. Transfers connect distinct, nearby stations (a short peanut).
  for (const t of TRANSFERS) {
    const a = STATION_MAP[t.a];
    const b = STATION_MAP[t.b];
    if (!a || !b) continue;
    const d = gridDistance(a.grid, b.grid);
    if (d === 0) {
      issues.push({ kind: "transfer", detail: `Transfer ${t.a}/${t.b} is coincident; peanuts need a gap.` });
    } else if (d > 3) {
      issues.push({ kind: "transfer", detail: `Transfer ${t.a}/${t.b} spans ${d.toFixed(2)} grid units — too far for a peanut.` });
    }
  }

  // 5. No two roundels overlap.
  const collisions = detectLabelCollisions(
    STATIONS.map((s) => ({ id: s.code, point: toPx(s.grid) }))
  );
  for (const c of collisions) {
    issues.push({ kind: "label", detail: `Roundels ${c.a} and ${c.b} overlap (${c.distance.toFixed(1)}px apart).` });
  }

  return issues;
}

/** Throw if the network is invalid (used as a dev/test gate). */
export function assertValidConfig(): void {
  const issues = validateConfig();
  if (issues.length > 0) {
    throw new Error(
      `Subway config invalid (${issues.length}):\n` + issues.map((i) => `  • ${i.detail}`).join("\n")
    );
  }
}
