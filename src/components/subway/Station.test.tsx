import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Station from "./Station";
import { getStation } from "@/data/subway";
import type { Station as StationT } from "@/data/subway/types";

function renderStation(station: StationT, props = {}) {
  return render(
    <svg>
      <Station station={station} {...props} />
    </svg>
  );
}

describe("Station", () => {
  it("renders the roundel, line letter, name, and code", () => {
    const { container, getByText } = renderStation(getStation("P-01")!);
    const g = container.querySelector('[data-station-code="P-01"]')!;
    expect(g.getAttribute("data-status")).toBe("operational");
    expect(g.getAttribute("data-line")).toBe("P");
    expect(getByText("Proxmox Homelab")).toBeTruthy();
  });

  it("fires select and hover handlers", () => {
    const onSelect = vi.fn();
    const onHover = vi.fn();
    const { container } = renderStation(getStation("P-09")!, { onSelect, onHover });
    const g = container.querySelector('[data-station-code="P-09"]')!;
    fireEvent.click(g);
    fireEvent.pointerEnter(g);
    fireEvent.pointerLeave(g);
    expect(onSelect).toHaveBeenCalledWith("P-09");
    expect(onHover).toHaveBeenCalledWith("P-09");
    expect(onHover).toHaveBeenCalledWith(null);
  });

  it("does not crash without handlers", () => {
    const { container } = renderStation(getStation("E-01")!);
    const g = container.querySelector('[data-station-code="E-01"]')!;
    expect(() => fireEvent.click(g)).not.toThrow();
  });

  it("draws a terminus cap", () => {
    const { container } = renderStation(getStation("E-12")!);
    expect(container.querySelector("rect")).toBeTruthy();
  });

  it("dashes the ring for planned stations", () => {
    const { container } = renderStation(getStation("E-06")!); // Security+ (planned)
    const circle = container.querySelector("circle")!;
    expect(circle.getAttribute("stroke-dasharray")).toBeTruthy();
  });

  it("renders in-progress stations like normal stops (white fill, solid ring)", () => {
    const { container } = renderStation(getStation("E-05")!); // Network+ (in-progress)
    const circle = container.querySelector("circle")!;
    expect(circle.getAttribute("fill")).toBe("var(--metro-roundel)");
    expect(circle.getAttribute("stroke-dasharray")).toBeNull(); // solid, not dashed
  });

  it("renders a right-side label for the Weekend line", () => {
    const { getByText } = renderStation(getStation("W-01")!);
    expect(getByText("Honda Beat K24")).toBeTruthy();
  });

  it("enlarges the active station", () => {
    const { container } = renderStation(getStation("P-09")!, { active: true });
    const circle = container.querySelector("circle")!;
    expect(Number(circle.getAttribute("r"))).toBeGreaterThan(11);
  });

  it("dims when requested", () => {
    const { container } = renderStation(getStation("P-09")!, { dimmed: true });
    const g = container.querySelector('[data-station-code="P-09"]') as SVGGElement;
    expect(Number(g.style.opacity)).toBeLessThan(1);
  });
});
