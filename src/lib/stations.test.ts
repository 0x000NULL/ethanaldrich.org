// @vitest-environment node
import { describe, it, expect } from "vitest";
import { getStationBody, getStationsWithBodies } from "./stations";
import { STATIONS } from "@/data/subway";

describe("station case studies", () => {
  it("reads a body for a station that has one", () => {
    const body = getStationBody("C-01");
    expect(body).not.toBeNull();
    expect(body!.content.length).toBeGreaterThan(200);
    expect(body!.title).toBe("Case study");
  });

  it("strips frontmatter from the returned content", () => {
    const body = getStationBody("P-04")!;
    expect(body.content.startsWith("---")).toBe(false);
    expect(body.content).not.toContain("title: Case study");
  });

  it("returns null for a station with no case study", () => {
    expect(getStationBody("E-02")).toBeNull();
  });

  it("refuses path traversal in the station code", () => {
    // Sanitising strips the dots and slashes, so these cannot escape STATION_DIR.
    expect(getStationBody("../../package")).toBeNull();
    expect(getStationBody("..%2F..%2Fpackage")).toBeNull();
    expect(getStationBody("")).toBeNull();
    expect(getStationBody("///")).toBeNull();
  });

  /**
   * `hasBody` drove nothing for the whole life of the subway rebuild, so four
   * stations advertised case studies that did not exist. This keeps the flag and
   * the filesystem honest in both directions.
   */
  it("keeps hasBody in sync with the files on disk", () => {
    const onDisk = new Set(getStationsWithBodies());
    const flagged = new Set(
      STATIONS.filter((s) => s.hasBody).map((s) => s.code)
    );
    expect([...flagged].sort()).toEqual([...onDisk].sort());
  });

  it("finds every case study file", () => {
    expect(getStationsWithBodies().length).toBeGreaterThanOrEqual(6);
  });
});
