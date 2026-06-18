import { describe, it, expect } from "vitest";
import {
  GRID,
  toPx,
  OCT_VECTORS,
  octolinearDir,
  isOctolinear,
  snapToOctolinear,
  routeBetween,
  validateGridPolyline,
  buildLinePath,
  measurePolyline,
  poseAtDistance,
  poseAt,
  bbox,
  detectLabelCollisions,
  easeInOutCubic,
} from "./geometry";

describe("toPx", () => {
  it("scales grid units by GRID", () => {
    expect(toPx({ gx: 2, gy: 3 })).toEqual({ x: 2 * GRID, y: 3 * GRID });
  });
});

describe("octolinearDir", () => {
  it("returns null for a zero-length step", () => {
    expect(octolinearDir({ gx: 1, gy: 1 }, { gx: 1, gy: 1 })).toBeNull();
  });

  it("identifies the four cardinal directions", () => {
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: 3, gy: 0 })).toBe("E");
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: -3, gy: 0 })).toBe("W");
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: 0, gy: -2 })).toBe("N");
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: 0, gy: 2 })).toBe("S");
  });

  it("identifies the four diagonals", () => {
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: 2, gy: 2 })).toBe("SE");
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: 2, gy: -2 })).toBe("NE");
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: -2, gy: 2 })).toBe("SW");
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: -2, gy: -2 })).toBe("NW");
  });

  it("returns null for a non-octolinear step", () => {
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: 4, gy: 2 })).toBeNull();
    expect(octolinearDir({ gx: 0, gy: 0 }, { gx: 1, gy: -6 })).toBeNull();
  });

  it("has a consistent unit vector table", () => {
    expect(OCT_VECTORS.E).toEqual({ gx: 1, gy: 0 });
    expect(Object.keys(OCT_VECTORS)).toHaveLength(8);
  });
});

describe("isOctolinear", () => {
  it("mirrors octolinearDir nullity", () => {
    expect(isOctolinear({ gx: 0, gy: 0 }, { gx: 5, gy: 5 })).toBe(true);
    expect(isOctolinear({ gx: 0, gy: 0 }, { gx: 5, gy: 1 })).toBe(false);
  });
});

describe("snapToOctolinear", () => {
  it("keeps a coincident point", () => {
    expect(snapToOctolinear({ gx: 2, gy: 2 }, { gx: 2, gy: 2 })).toEqual({ gx: 2, gy: 2 });
  });

  it("snaps a shallow delta to horizontal", () => {
    const r = snapToOctolinear({ gx: 0, gy: 0 }, { gx: 6, gy: 1 });
    expect(r).toEqual({ gx: 6, gy: 0 });
    expect(isOctolinear({ gx: 0, gy: 0 }, r)).toBe(true);
  });

  it("snaps a steep delta to vertical", () => {
    const r = snapToOctolinear({ gx: 0, gy: 0 }, { gx: 1, gy: 6 });
    expect(r).toEqual({ gx: 0, gy: 6 });
  });

  it("snaps a balanced delta to a diagonal", () => {
    const r = snapToOctolinear({ gx: 0, gy: 0 }, { gx: 3, gy: 4 });
    expect(r).toEqual({ gx: 4, gy: 4 });
    expect(isOctolinear({ gx: 0, gy: 0 }, r)).toBe(true);
  });
});

describe("routeBetween", () => {
  it("returns no corner when already octolinear", () => {
    expect(routeBetween({ gx: 0, gy: 0 }, { gx: 4, gy: 0 })).toEqual([]);
    expect(routeBetween({ gx: 0, gy: 0 }, { gx: 3, gy: 3 })).toEqual([]);
  });

  it("inserts a diag-first corner that yields two octolinear hops", () => {
    const a = { gx: 13, gy: 10 };
    const b = { gx: 17, gy: 8 };
    const [corner] = routeBetween(a, b, "diag-first");
    expect(corner).toEqual({ gx: 15, gy: 8 });
    expect(isOctolinear(a, corner)).toBe(true);
    expect(isOctolinear(corner, b)).toBe(true);
  });

  it("inserts an ortho-first corner that yields two octolinear hops (x-dominant)", () => {
    const a = { gx: 0, gy: 0 };
    const b = { gx: 6, gy: 2 };
    const [corner] = routeBetween(a, b, "ortho-first");
    expect(corner).toEqual({ gx: 4, gy: 0 });
    expect(isOctolinear(a, corner)).toBe(true);
    expect(isOctolinear(corner, b)).toBe(true);
  });

  it("inserts an ortho-first corner (y-dominant)", () => {
    const a = { gx: 0, gy: 0 };
    const b = { gx: 2, gy: 6 };
    const [corner] = routeBetween(a, b, "ortho-first");
    expect(corner).toEqual({ gx: 0, gy: 4 });
    expect(isOctolinear(a, corner)).toBe(true);
    expect(isOctolinear(corner, b)).toBe(true);
  });
});

describe("validateGridPolyline", () => {
  it("reports no violations for a clean polyline", () => {
    expect(
      validateGridPolyline([
        { gx: 0, gy: 0 },
        { gx: 2, gy: 0 },
        { gx: 4, gy: 2 },
      ])
    ).toEqual([]);
  });

  it("reports the index of an illegal hop", () => {
    const v = validateGridPolyline([
      { gx: 0, gy: 0 },
      { gx: 4, gy: 1 },
    ]);
    expect(v).toHaveLength(1);
    expect(v[0].index).toBe(0);
  });
});

describe("buildLinePath", () => {
  it("returns empty for no points", () => {
    expect(buildLinePath([])).toBe("");
  });

  it("emits a lone move for a single point", () => {
    expect(buildLinePath([{ x: 10, y: 20 }])).toBe("M 10 20");
  });

  it("emits M/L for a straight polyline", () => {
    expect(
      buildLinePath([
        { x: 0, y: 0 },
        { x: 40, y: 0 },
        { x: 40, y: 40 },
      ])
    ).toBe("M 0 0 L 40 0 L 40 40");
  });

  it("emits quadratic corners when a radius is given", () => {
    const d = buildLinePath(
      [
        { x: 0, y: 0 },
        { x: 40, y: 0 },
        { x: 40, y: 40 },
      ],
      8
    );
    expect(d).toContain("Q 40 0");
    expect(d.startsWith("M 0 0")).toBe(true);
  });
});

describe("measurePolyline", () => {
  it("computes cumulative and total length", () => {
    const m = measurePolyline([
      { x: 0, y: 0 },
      { x: 3, y: 4 },
      { x: 3, y: 4 },
    ]);
    expect(m.total).toBe(5);
    expect(m.cumulative).toEqual([0, 5, 5]);
  });
});

describe("poseAtDistance / poseAt", () => {
  const line = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
  ];

  it("handles empty and single-point inputs", () => {
    expect(poseAtDistance([], 5)).toEqual({ x: 0, y: 0, heading: 0 });
    expect(poseAtDistance([{ x: 7, y: 9 }], 5)).toEqual({ x: 7, y: 9, heading: 0 });
  });

  it("clamps to the start and end", () => {
    expect(poseAtDistance(line, -10)).toMatchObject({ x: 0, y: 0 });
    expect(poseAtDistance(line, 9999)).toMatchObject({ x: 100, y: 100 });
  });

  it("interpolates within the first segment with east heading", () => {
    const p = poseAtDistance(line, 50);
    expect(p).toMatchObject({ x: 50, y: 0 });
    expect(p.heading).toBeCloseTo(0);
  });

  it("interpolates within the second segment with south heading", () => {
    const p = poseAtDistance(line, 150);
    expect(p).toMatchObject({ x: 100, y: 50 });
    expect(p.heading).toBeCloseTo(Math.PI / 2);
  });

  it("poseAt maps t∈[0,1] onto total length", () => {
    const p = poseAt(line, 0.5);
    expect(p.x).toBeCloseTo(100);
    expect(p.y).toBeCloseTo(0);
  });
});

describe("bbox", () => {
  it("returns zeros for no points", () => {
    expect(bbox([])).toEqual({ minX: 0, minY: 0, maxX: 0, maxY: 0 });
  });

  it("computes the bounding box", () => {
    expect(
      bbox([
        { x: 10, y: 5 },
        { x: -4, y: 20 },
        { x: 3, y: -7 },
      ])
    ).toEqual({ minX: -4, minY: -7, maxX: 10, maxY: 20 });
  });
});

describe("detectLabelCollisions", () => {
  it("finds overlapping roundels", () => {
    const c = detectLabelCollisions([
      { id: "a", point: { x: 0, y: 0 } },
      { id: "b", point: { x: 5, y: 0 } },
      { id: "c", point: { x: 200, y: 200 } },
    ]);
    expect(c).toHaveLength(1);
    expect(c[0]).toMatchObject({ a: "a", b: "b" });
  });

  it("returns none when all are spaced out", () => {
    expect(
      detectLabelCollisions([
        { id: "a", point: { x: 0, y: 0 } },
        { id: "b", point: { x: 80, y: 0 } },
      ])
    ).toEqual([]);
  });
});

describe("easeInOutCubic", () => {
  it("pins the endpoints and midpoint", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });

  it("clamps out-of-range input", () => {
    expect(easeInOutCubic(-1)).toBe(0);
    expect(easeInOutCubic(2)).toBe(1);
  });
});
