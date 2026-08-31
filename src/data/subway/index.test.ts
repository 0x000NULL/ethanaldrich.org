import { describe, it, expect } from "vitest";
import {
  getNetwork,
  getStation,
  getLine,
  getStationsForLine,
  resolveLinePolylines,
  getTrunkPolyline,
  getNetworkBounds,
  validateConfig,
  assertValidConfig,
  STATIONS,
  LINES,
  TRANSFERS,
} from "./index";
import { isOctolinear } from "@/lib/subway/geometry";

describe("network config", () => {
  it("assembles the full network", () => {
    const net = getNetwork();
    expect(net.lines).toBe(LINES);
    expect(net.stations).toBe(STATIONS);
    expect(net.lines.length).toBeGreaterThanOrEqual(4);
  });

  it("looks up stations and lines by code", () => {
    expect(getStation("P-07")?.name).toBe("Montr Signage");
    expect(getStation("nope")).toBeUndefined();
    expect(getLine("E")?.name).toBe("Education Line");
    expect(getLine("X")).toBeUndefined();
  });

  it("returns only stations physically on a line (junctions excluded)", () => {
    const w = getStationsForLine("W").map((s) => s.code);
    expect(w).toEqual(["W-01", "W-02", "W-03"]);
    // P-01 is the W junction but belongs to P, not W.
    expect(w).not.toContain("P-01");
  });
});

describe("THE PR0 GATE — config is valid", () => {
  it("validateConfig reports zero issues", () => {
    const issues = validateConfig();
    // Surface details if this ever regresses.
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
  });

  it("assertValidConfig does not throw", () => {
    expect(() => assertValidConfig()).not.toThrow();
  });
});

describe("octolinearity (independent re-check)", () => {
  it("every trunk and branch hop is 0/45/90°", () => {
    for (const line of LINES) {
      for (const poly of resolveLinePolylines(line)) {
        for (let i = 0; i < poly.grid.length - 1; i++) {
          expect(
            isOctolinear(poly.grid[i], poly.grid[i + 1]),
            `${line.code} ${poly.kind} hop ${i}`
          ).toBe(true);
        }
      }
    }
  });
});

describe("interchange topology", () => {
  it("the marquee transfer connects Education and Projects", () => {
    const marquee = TRANSFERS.find((t) => t.marquee);
    expect(marquee).toMatchObject({ a: "E-06", b: "P-04" });
    expect(getStation("E-06")?.lineCodes).toContain("E");
    expect(getStation("P-04")?.lineCodes).toContain("P");
  });

  it("Security+ and CySA+ transfer Education into Projects (E∩P)", () => {
    const codes = TRANSFERS.map((t) => `${t.a}/${t.b}`);
    expect(codes).toContain("E-06/P-04");
    expect(codes).toContain("E-07/P-05");
  });
});

describe("line geometry resolution", () => {
  it("inserts the Career via-corner between C-00 and C-01", () => {
    const trunk = getTrunkPolyline("C");
    // C-00, corner (11,12), C-01, C-03 → 4 vertices, 3 stations indexed.
    expect(trunk.grid).toHaveLength(4);
    expect(trunk.grid[1]).toEqual({ gx: 11, gy: 12 });
    expect(trunk.stationVertex["C-00"]).toBe(0);
    expect(trunk.stationVertex["C-01"]).toBe(2);
    expect(trunk.stationVertex["C-03"]).toBe(3);
  });

  it("renders the Education MSCSIA branch", () => {
    const polys = resolveLinePolylines(getLine("E")!);
    const branch = polys.find((p) => p.kind === "branch");
    expect(branch).toBeDefined();
    expect(branch!.dashed).toBe(true);
    expect(branch!.stationVertex["E-13"]).toBeGreaterThanOrEqual(0);
  });

  it("the Weekend spur begins at the P-01 junction", () => {
    const trunk = getTrunkPolyline("W");
    expect(trunk.stationVertex["P-01"]).toBe(0);
    expect(Object.keys(trunk.stationVertex)).toContain("W-03");
  });

  it("throws on an unknown station code in a sequence", () => {
    expect(() =>
      resolveLinePolylines({
        code: "E",
        name: "x",
        nameJa: "x",
        color: "#000",
        stationCodes: ["DOES-NOT-EXIST"],
      })
    ).toThrow(/Unknown station/);
  });
});

describe("getNetworkBounds", () => {
  it("spans all stations with positive area", () => {
    const b = getNetworkBounds();
    expect(b.maxX).toBeGreaterThan(b.minX);
    expect(b.maxY).toBeGreaterThan(b.minY);
  });
});
