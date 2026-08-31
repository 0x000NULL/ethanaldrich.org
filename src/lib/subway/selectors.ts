import {
  bbox,
  measurePolyline,
  type BBox,
  type Point,
  type PolylineMetrics,
} from "./geometry";
import { fitToBounds, type Viewport } from "./viewport";
import {
  makeTrainState,
  type TrainContext,
  type TrainState,
} from "./train";
import {
  LINES,
  STATION_MAP,
  LINE_MAP,
  TRAINS,
  TRANSFERS,
  getStation,
  getNetworkBounds,
  getTrunkPolyline,
  resolveLinePolylines,
  type ResolvedPolyline,
} from "@/data/subway";
import type { LineCode, Train } from "@/data/subway/types";

/**
 * Asymmetric padding (viewBox units) around the network bounds. Extra room on the
 * left and bottom keeps map content clear of the legend (top-left) and departure
 * board (bottom-left); modest top room clears the alert banner.
 */
// The left pad reserves room for the StationIndex legend, which floats over the
// map. It is proportional to content width: the E line now starts at gx=-1, so
// 320 no longer cleared the panel once the wider map scaled down to fit.
export const VIEWBOX_PAD = { top: 110, right: 80, bottom: 150, left: 480 };

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Deterministic viewBox derived from config — identical on server and client. */
export function getViewBox(): ViewBox {
  const b = getNetworkBounds();
  return {
    x: b.minX - VIEWBOX_PAD.left,
    y: b.minY - VIEWBOX_PAD.top,
    w: b.maxX - b.minX + VIEWBOX_PAD.left + VIEWBOX_PAD.right,
    h: b.maxY - b.minY + VIEWBOX_PAD.top + VIEWBOX_PAD.bottom,
  };
}

/** Memoized resolution of each line's polylines (trunk + branches). */
const polyCache = new Map<LineCode, ResolvedPolyline[]>();

export function getLinePolylines(code: LineCode): ResolvedPolyline[] {
  const cached = polyCache.get(code);
  if (cached) return cached;
  const line = LINES.find((l) => l.code === code);
  const resolved = line ? resolveLinePolylines(line) : [];
  polyCache.set(code, resolved);
  return resolved;
}

/** Bounding box of a single line (all its trunk + branch points). */
export function lineBounds(code: LineCode): BBox {
  const pts: Point[] = [];
  for (const poly of getLinePolylines(code)) pts.push(...poly.points);
  return bbox(pts);
}

/**
 * The pan/zoom transform that frames `target` within a viewBox whose origin is
 * (vb.x, vb.y). fitToBounds assumes a 0-origin screen, so we shift by the origin.
 */
export function transformForBounds(target: BBox, vb: ViewBox): Viewport {
  const fit = fitToBounds(target, vb.w, vb.h);
  return { k: fit.k, x: fit.x + vb.x, y: fit.y + vb.y };
}

/** Line codes that physically serve a station. */
export function linesServingStation(code: string): LineCode[] {
  return getStation(code)?.lineCodes ?? [];
}

export interface TransferInfo {
  partnerCode: string;
  partnerName: string;
  lineCodes: LineCode[];
  marquee: boolean;
}

/** Transfers (peanuts) available from a station, with the partner's details. */
export function transfersForStation(code: string): TransferInfo[] {
  const out: TransferInfo[] = [];
  for (const t of TRANSFERS) {
    let partner: string | null = null;
    if (t.a === code) partner = t.b;
    else if (t.b === code) partner = t.a;
    if (!partner) continue;
    const station = STATION_MAP[partner];
    if (!station) continue;
    out.push({
      partnerCode: partner,
      partnerName: station.name,
      lineCodes: station.lineCodes,
      marquee: Boolean(t.marquee),
    });
  }
  return out;
}

/**
 * When a station is hovered/selected, dim every line that does NOT serve it (and
 * its transfer partners). Returns the set of line codes to render at full opacity;
 * an empty focus (no hover) returns all lines.
 */
export function focusedLineCodes(focusCode: string | null): Set<LineCode> {
  if (!focusCode) return new Set(LINES.map((l) => l.code));
  const set = new Set<LineCode>(linesServingStation(focusCode));
  for (const t of transfersForStation(focusCode)) {
    for (const lc of t.lineCodes) set.add(lc);
  }
  return set;
}

/** Reset memoized caches (test helper). */
export function _clearSelectorCache(): void {
  polyCache.clear();
}

// ───────────────────────── Train runtimes ─────────────────────────

export interface TrainRuntime {
  train: Train;
  color: string;
  points: Point[];
  metrics: PolylineMetrics;
  ctx: TrainContext;
  initial: TrainState;
}

const BASE_SPEED = 0.05; // px per ms
const DWELL_MS = 900;

/** Precompute everything a train needs to ride its line's trunk polyline. */
export function buildTrainRuntimes(trains: Train[] = TRAINS): TrainRuntime[] {
  return trains.map((train) => {
    const trunk = getTrunkPolyline(train.lineCode);
    const metrics = measurePolyline(trunk.points);
    const stationDistances = Object.values(trunk.stationVertex)
      .map((v) => metrics.cumulative[v])
      .sort((a, b) => a - b);
    const fromD = metrics.cumulative[trunk.stationVertex[train.fromCode] ?? 0] ?? 0;
    const toD = metrics.cumulative[trunk.stationVertex[train.toCode] ?? 0] ?? 0;
    const direction: 1 | -1 = toD >= fromD ? 1 : -1;
    return {
      train,
      color: LINE_MAP[train.lineCode]?.color ?? "var(--metro-ink)",
      points: trunk.points,
      metrics,
      ctx: {
        total: metrics.total,
        stationDistances,
        speed: BASE_SPEED * (train.express ? 1.6 : 1),
        dwellMs: DWELL_MS,
      },
      initial: makeTrainState(fromD, direction),
    };
  });
}
