import { describe, it, expect, beforeEach } from "vitest";
import {
  getLinePolylines,
  lineBounds,
  linesServingStation,
  transfersForStation,
  focusedLineCodes,
  adjacentStations,
  _clearSelectorCache,
} from "./selectors";
import { LINE_MAP, STATIONS } from "@/data/subway";

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

describe("adjacentStations", () => {
  it("walks a line in timetable order", () => {
    const mid = adjacentStations("E-02");
    expect(mid.lineCode).toBe("E");
    expect(mid.lineName).toBe("Education Line");
    expect(mid.prev?.code).toBe("E-01");
    expect(mid.next?.code).toBe("E-03");
    // Names come along so the page can label the links.
    expect(mid.prev?.name).toBeTruthy();
  });

  it("reports no prev at the start of a line and no next at the end", () => {
    const first = adjacentStations("E-01");
    expect(first.prev).toBeNull();
    expect(first.next?.code).toBe("E-02");

    const line = LINE_MAP["E"]!;
    const lastCode = line.stationCodes[line.stationCodes.length - 1];
    const last = adjacentStations(lastCode);
    expect(last.next).toBeNull();
    expect(last.prev).not.toBeNull();
  });

  it("skips the numbering gaps rather than guessing codes", () => {
    // The Career line is C-00, C-01, C-03 — there is no C-02.
    const c01 = adjacentStations("C-01");
    expect(c01.prev?.code).toBe("C-00");
    expect(c01.next?.code).toBe("C-03");
  });

  it("gives a branch station no neighbours instead of inventing them", () => {
    // E-13 hangs off E-12 on a dashed branch, so it is not on the trunk.
    const branch = adjacentStations("E-13");
    expect(branch.prev).toBeNull();
    expect(branch.next).toBeNull();
  });

  it("returns an empty result for an unknown code", () => {
    expect(adjacentStations("NOPE")).toEqual({
      lineCode: null,
      lineName: null,
      prev: null,
      next: null,
    });
  });

  it("covers every station without throwing", () => {
    for (const s of STATIONS) {
      expect(() => adjacentStations(s.code)).not.toThrow();
    }
  });
});
