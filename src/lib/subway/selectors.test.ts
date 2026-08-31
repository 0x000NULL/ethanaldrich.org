import { describe, it, expect, beforeEach } from "vitest";
import {
  getLinePolylines,
  lineBounds,
  linesServingStation,
  transfersForStation,
  focusedLineCodes,
  _clearSelectorCache,
} from "./selectors";

beforeEach(() => _clearSelectorCache());

describe("getLinePolylines", () => {
  it("resolves and memoizes a line's polylines", () => {
    const first = getLinePolylines("E");
    const second = getLinePolylines("E");
    expect(first).toBe(second); // same cached reference
    expect(first[0].kind).toBe("trunk");
  });

  it("returns empty for an unknown line", () => {
    // @ts-expect-error exercising the defensive path
    expect(getLinePolylines("ZZ")).toEqual([]);
  });
});

describe("lineBounds", () => {
  it("has positive extent for the Projects line", () => {
    const b = lineBounds("P");
    expect(b.maxX).toBeGreaterThan(b.minX);
  });
});

describe("linesServingStation", () => {
  it("returns the owning line", () => {
    expect(linesServingStation("P-07")).toContain("P");
    expect(linesServingStation("nope")).toEqual([]);
  });
});

describe("transfersForStation", () => {
  it("finds the marquee partner from either side", () => {
    const fromEducation = transfersForStation("E-06");
    expect(fromEducation.some((t) => t.partnerCode === "P-04" && t.marquee)).toBe(
      true
    );
    const fromProjects = transfersForStation("P-04");
    expect(fromProjects.some((t) => t.partnerCode === "E-06" && t.marquee)).toBe(
      true
    );
  });

  it("returns the partner name and lines", () => {
    const t = transfersForStation("E-06")[0];
    expect(t.partnerCode).toBe("P-04");
    expect(t.lineCodes).toContain("P");
  });

  it("returns none for a station without transfers", () => {
    expect(transfersForStation("E-01")).toEqual([]);
  });
});

describe("focusedLineCodes", () => {
  it("returns all lines when nothing is focused", () => {
    const all = focusedLineCodes(null);
    expect(all.size).toBeGreaterThanOrEqual(4);
  });

  it("includes the station's line plus transfer-partner lines", () => {
    const focus = focusedLineCodes("E-06");
    expect(focus.has("E")).toBe(true);
    expect(focus.has("P")).toBe(true); // via the Security+ marquee transfer
    expect(focus.has("C")).toBe(false);
  });
});
