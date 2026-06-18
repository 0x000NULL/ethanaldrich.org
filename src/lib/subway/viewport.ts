import type { BBox, Point } from "./geometry";

/**
 * Pan/zoom transform. A user-space point u maps to screen s by:
 *   s = u * k + {x, y}
 * Hand-rolled (no d3-zoom) and pure so it is fully unit-testable and SSR-safe.
 */
export interface Viewport {
  x: number;
  y: number;
  k: number;
}

export const MIN_K = 0.25;
export const MAX_K = 4;

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export const IDENTITY: Viewport = { x: 0, y: 0, k: 1 };

/** Fit a bounding box into a viewport with uniform scale and centering. */
export function fitToBounds(
  b: BBox,
  vw: number,
  vh: number,
  padding = GRID_PAD
): Viewport {
  const w = Math.max(1, b.maxX - b.minX);
  const h = Math.max(1, b.maxY - b.minY);
  const k = clamp(
    Math.min((vw - padding * 2) / w, (vh - padding * 2) / h),
    MIN_K,
    MAX_K
  );
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;
  return { k, x: vw / 2 - cx * k, y: vh / 2 - cy * k };
}

const GRID_PAD = 48;

/** Convert a screen-space point back to user space. */
export function screenToUser(vp: Viewport, sx: number, sy: number): Point {
  return { x: (sx - vp.x) / vp.k, y: (sy - vp.y) / vp.k };
}

/** Convert a user-space point to screen space. */
export function userToScreen(vp: Viewport, ux: number, uy: number): Point {
  return { x: ux * vp.k + vp.x, y: uy * vp.k + vp.y };
}

/** Zoom by `factor` while keeping the point under (sx, sy) fixed on screen. */
export function zoomAt(
  vp: Viewport,
  sx: number,
  sy: number,
  factor: number,
  minK = MIN_K,
  maxK = MAX_K
): Viewport {
  const k = clamp(vp.k * factor, minK, maxK);
  const u = screenToUser(vp, sx, sy);
  return { k, x: sx - u.x * k, y: sy - u.y * k };
}

/** Center the viewport on a user-space point at zoom `k`. */
export function centerOn(point: Point, vw: number, vh: number, k: number): Viewport {
  return { k, x: vw / 2 - point.x * k, y: vh / 2 - point.y * k };
}

/** Frame a single line's bounds. */
export function zoomToLine(lineBounds: BBox, vw: number, vh: number): Viewport {
  return fitToBounds(lineBounds, vw, vh);
}

/** Zoom to a station, centering it at a comfortable fixed zoom. */
export function zoomToStation(
  point: Point,
  vw: number,
  vh: number,
  k = 1.6
): Viewport {
  return centerOn(point, vw, vh, clamp(k, MIN_K, MAX_K));
}

/**
 * Keep content from drifting entirely off-screen: clamp zoom, then clamp translation
 * so the (scaled) content bbox always overlaps the viewport by at least `margin`.
 */
export function clampViewport(
  vp: Viewport,
  content: BBox,
  vw: number,
  vh: number,
  margin = 80
): Viewport {
  const k = clamp(vp.k, MIN_K, MAX_K);
  const left = content.minX * k;
  const right = content.maxX * k;
  const top = content.minY * k;
  const bottom = content.maxY * k;

  const x = clamp(vp.x, vw - margin - right, margin - left);
  const y = clamp(vp.y, vh - margin - bottom, margin - top);
  return { k, x, y };
}
