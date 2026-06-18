/**
 * Pure octolinear geometry for the subway map.
 *
 * Everything here is a pure function over plain coordinates — NO DOM access and,
 * critically, NO `SVGPathElement.getPointAtLength()` (jsdom does not implement it).
 * Train motion and the rendered `<path d>` are both derived from the SAME authored
 * polyline, so the visuals and the animation math can never drift.
 */

/** Integer authoring grid coordinate (gy increases downward, matching SVG). */
export interface GridPoint {
  gx: number;
  gy: number;
}

/** SVG user-space point in pixels. */
export interface Point {
  x: number;
  y: number;
}

/** Pixels per grid unit. */
export const GRID = 52;

export function toPx(g: GridPoint): Point {
  return { x: g.gx * GRID, y: g.gy * GRID };
}

/** The eight octolinear directions. */
export type OctDir = "E" | "NE" | "N" | "NW" | "W" | "SW" | "S" | "SE";

/** Unit grid step for each direction. */
export const OCT_VECTORS: Record<OctDir, GridPoint> = {
  E: { gx: 1, gy: 0 },
  NE: { gx: 1, gy: -1 },
  N: { gx: 0, gy: -1 },
  NW: { gx: -1, gy: -1 },
  W: { gx: -1, gy: 0 },
  SW: { gx: -1, gy: 1 },
  S: { gx: 0, gy: 1 },
  SE: { gx: 1, gy: 1 },
};

/**
 * Returns the octolinear direction of a→b, or null if the step is zero-length or
 * not exactly horizontal / vertical / 45°. This single predicate is the geometric
 * equivalent of the colorblind-safe "letter code": every segment is provably 0/45/90.
 */
export function octolinearDir(a: GridPoint, b: GridPoint): OctDir | null {
  const dx = b.gx - a.gx;
  const dy = b.gy - a.gy;
  if (dx === 0 && dy === 0) return null;
  if (!(dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) return null;

  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  for (const dir of Object.keys(OCT_VECTORS) as OctDir[]) {
    const v = OCT_VECTORS[dir];
    if (Math.sign(v.gx) === sx && Math.sign(v.gy) === sy) return dir;
  }
  return null;
}

export function isOctolinear(a: GridPoint, b: GridPoint): boolean {
  return octolinearDir(a, b) !== null;
}

/**
 * Snap an arbitrary destination to the nearest octolinear ray from `from`.
 * Authoring helper — always returns a grid point reachable octolinearly.
 */
export function snapToOctolinear(from: GridPoint, to: GridPoint): GridPoint {
  const dx = to.gx - from.gx;
  const dy = to.gy - from.gy;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  if (adx === 0 && ady === 0) return { ...to };

  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  if (adx > ady * 2) return { gx: from.gx + dx, gy: from.gy }; // horizontal
  if (ady > adx * 2) return { gx: from.gx, gy: from.gy + dy }; // vertical
  const d = Math.max(adx, ady);
  return { gx: from.gx + sx * d, gy: from.gy + sy * d }; // 45° diagonal
}

/**
 * Insert a single corner so a→b becomes two octolinear hops (a 45° diagonal plus an
 * orthogonal run — the classic metro "L with chamfer"). Returns [] if already octolinear.
 */
export function routeBetween(
  a: GridPoint,
  b: GridPoint,
  prefer: "diag-first" | "ortho-first" = "diag-first"
): GridPoint[] {
  if (isOctolinear(a, b)) return [];
  const dx = b.gx - a.gx;
  const dy = b.gy - a.gy;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  const diag = Math.min(adx, ady);

  if (prefer === "diag-first") {
    return [{ gx: a.gx + sx * diag, gy: a.gy + sy * diag }];
  }
  const straight = Math.max(adx, ady) - diag;
  if (adx > ady) return [{ gx: a.gx + sx * straight, gy: a.gy }];
  return [{ gx: a.gx, gy: a.gy + sy * straight }];
}

export interface SegmentViolation {
  index: number;
  from: GridPoint;
  to: GridPoint;
}

/** Collect every non-octolinear hop in an ordered grid polyline. */
export function validateGridPolyline(points: GridPoint[]): SegmentViolation[] {
  const out: SegmentViolation[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    if (!isOctolinear(points[i], points[i + 1])) {
      out.push({ index: i, from: points[i], to: points[i + 1] });
    }
  }
  return out;
}

/**
 * Build an SVG path `d` string from a px polyline. With `radius > 0`, corners are
 * rounded purely cosmetically (the train still rides the un-rounded polyline, so
 * there is no measurement mismatch).
 */
export function buildLinePath(points: Point[], radius = 0): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${fmt(points[0].x)} ${fmt(points[0].y)}`;
  if (radius <= 0) {
    return (
      `M ${fmt(points[0].x)} ${fmt(points[0].y)} ` +
      points
        .slice(1)
        .map((p) => `L ${fmt(p.x)} ${fmt(p.y)}`)
        .join(" ")
    );
  }

  let d = `M ${fmt(points[0].x)} ${fmt(points[0].y)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    const inTrim = trimPoint(curr, prev, radius);
    const outTrim = trimPoint(curr, next, radius);
    d += ` L ${fmt(inTrim.x)} ${fmt(inTrim.y)}`;
    d += ` Q ${fmt(curr.x)} ${fmt(curr.y)} ${fmt(outTrim.x)} ${fmt(outTrim.y)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${fmt(last.x)} ${fmt(last.y)}`;
  return d;
}

function trimPoint(corner: Point, toward: Point, radius: number): Point {
  const dx = toward.x - corner.x;
  const dy = toward.y - corner.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return { ...corner };
  const t = Math.min(radius, len / 2) / len;
  return { x: corner.x + dx * t, y: corner.y + dy * t };
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export interface PolylineMetrics {
  /** Cumulative distance from the start to each vertex (length === points.length). */
  cumulative: number[];
  total: number;
}

export function measurePolyline(points: Point[]): PolylineMetrics {
  const cumulative: number[] = [0];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    cumulative.push(total);
  }
  return { cumulative, total };
}

export interface Pose {
  x: number;
  y: number;
  /** Heading in radians (atan2 of the local segment direction). */
  heading: number;
}

/** Pose at an absolute distance along the polyline (clamped to [0, total]). */
export function poseAtDistance(
  points: Point[],
  dist: number,
  metrics?: PolylineMetrics
): Pose {
  if (points.length === 0) return { x: 0, y: 0, heading: 0 };
  if (points.length === 1) return { x: points[0].x, y: points[0].y, heading: 0 };

  const m = metrics ?? measurePolyline(points);
  const d = Math.max(0, Math.min(dist, m.total));

  let seg = 0;
  while (seg < m.cumulative.length - 2 && m.cumulative[seg + 1] < d) seg++;

  const a = points[seg];
  const b = points[seg + 1];
  const segLen = m.cumulative[seg + 1] - m.cumulative[seg];
  const t = segLen === 0 ? 0 : (d - m.cumulative[seg]) / segLen;
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    heading: Math.atan2(b.y - a.y, b.x - a.x),
  };
}

/** Pose at fractional progress t∈[0,1] along the polyline. */
export function poseAt(points: Point[], t: number, metrics?: PolylineMetrics): Pose {
  const m = metrics ?? measurePolyline(points);
  return poseAtDistance(points, t * m.total, m);
}

export interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function bbox(points: Point[]): BBox {
  if (points.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

export interface LabeledPoint {
  id: string;
  point: Point;
}

export interface LabelCollision {
  a: string;
  b: string;
  distance: number;
}

/**
 * Flag any two roundels closer than `minDistance` px (default: most of one grid cell).
 * Stations that are intentionally coincident should never reach this function with the
 * same coordinates; transfer pairs are placed at least one grid apart.
 */
export function detectLabelCollisions(
  items: LabeledPoint[],
  minDistance = GRID * 0.9
): LabelCollision[] {
  const out: LabelCollision[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const d = Math.hypot(
        items[i].point.x - items[j].point.x,
        items[i].point.y - items[j].point.y
      );
      if (d < minDistance) out.push({ a: items[i].id, b: items[j].id, distance: d });
    }
  }
  return out;
}

export function easeInOutCubic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}
