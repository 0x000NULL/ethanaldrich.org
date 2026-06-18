import { describe, it, expect } from "vitest";
import {
  clamp,
  IDENTITY,
  fitToBounds,
  screenToUser,
  userToScreen,
  zoomAt,
  centerOn,
  zoomToLine,
  zoomToStation,
  clampViewport,
  MIN_K,
  MAX_K,
} from "./viewport";

const BOUNDS = { minX: 0, minY: 0, maxX: 100, maxY: 100 };

describe("clamp", () => {
  it("bounds a value", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe("fitToBounds", () => {
  it("centers content in the viewport", () => {
    const vp = fitToBounds(BOUNDS, 800, 600);
    const center = userToScreen(vp, 50, 50);
    expect(center.x).toBeCloseTo(400);
    expect(center.y).toBeCloseTo(300);
  });

  it("respects the zoom clamp", () => {
    const vp = fitToBounds({ minX: 0, minY: 0, maxX: 1, maxY: 1 }, 800, 600);
    expect(vp.k).toBeLessThanOrEqual(MAX_K);
  });

  it("identity is the unit transform", () => {
    expect(IDENTITY).toEqual({ x: 0, y: 0, k: 1 });
  });
});

describe("screenToUser / userToScreen round-trip", () => {
  it("inverts cleanly", () => {
    const vp = { x: 30, y: -20, k: 2 };
    const u = screenToUser(vp, 130, 80);
    expect(u).toEqual({ x: 50, y: 50 });
    const s = userToScreen(vp, u.x, u.y);
    expect(s).toEqual({ x: 130, y: 80 });
  });
});

describe("zoomAt", () => {
  it("keeps the cursor point fixed on screen", () => {
    const vp = { x: 0, y: 0, k: 1 };
    const next = zoomAt(vp, 200, 150, 2);
    const before = screenToUser(vp, 200, 150);
    const after = screenToUser(next, 200, 150);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
    expect(next.k).toBe(2);
  });

  it("clamps zoom to the configured range", () => {
    expect(zoomAt({ x: 0, y: 0, k: MAX_K }, 0, 0, 4).k).toBe(MAX_K);
    expect(zoomAt({ x: 0, y: 0, k: MIN_K }, 0, 0, 0.1).k).toBe(MIN_K);
  });
});

describe("centerOn / zoomToStation / zoomToLine", () => {
  it("centerOn puts the point at the viewport center", () => {
    const vp = centerOn({ x: 10, y: 20 }, 800, 600, 2);
    const c = userToScreen(vp, 10, 20);
    expect(c).toEqual({ x: 400, y: 300 });
  });

  it("zoomToStation centers at a comfortable zoom", () => {
    const vp = zoomToStation({ x: 0, y: 0 }, 800, 600);
    expect(vp.k).toBeGreaterThan(1);
    expect(userToScreen(vp, 0, 0)).toEqual({ x: 400, y: 300 });
  });

  it("zoomToLine frames the line bounds", () => {
    const vp = zoomToLine(BOUNDS, 800, 600);
    expect(userToScreen(vp, 50, 50).x).toBeCloseTo(400);
  });
});

describe("clampViewport", () => {
  it("keeps content overlapping the viewport", () => {
    const wild = { x: 100000, y: 100000, k: 1 };
    const clamped = clampViewport(wild, BOUNDS, 800, 600);
    expect(clamped.x).toBeLessThan(wild.x);
    expect(clamped.k).toBeGreaterThanOrEqual(MIN_K);
    expect(clamped.k).toBeLessThanOrEqual(MAX_K);
  });

  it("leaves an in-range viewport essentially untouched", () => {
    const vp = fitToBounds(BOUNDS, 800, 600);
    const clamped = clampViewport(vp, BOUNDS, 800, 600);
    expect(clamped.k).toBeCloseTo(vp.k);
  });
});
