import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import SubwayMap from "./SubwayMap";
import { useNavStore } from "@/store/nav-store";
import { IDENTITY } from "@/lib/subway/viewport";
import { LINES, STATIONS, TRANSFERS } from "@/data/subway";

beforeEach(() => {
  useNavStore.setState({
    selectedStationCode: null,
    hoveredStationCode: null,
    panelOpen: false,
    transform: IDENTITY,
  });
});

describe("SubwayMap", () => {
  it("renders an accessible image with a viewBox", () => {
    const { container } = render(<SubwayMap />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("viewBox")).toBeTruthy();
    expect(svg.getAttribute("aria-label")).toContain("subway");
  });

  it("renders every line, station, and transfer", () => {
    const { container } = render(<SubwayMap />);
    for (const line of LINES) {
      expect(container.querySelector(`g[data-line="${line.code}"]`)).toBeTruthy();
    }
    for (const station of STATIONS) {
      expect(
        container.querySelector(`[data-station-code="${station.code}"]`)
      ).toBeTruthy();
    }
    for (const t of TRANSFERS) {
      expect(
        container.querySelector(`[data-transfer="${t.a}-${t.b}"]`)
      ).toBeTruthy();
    }
  });

  it("selecting a station updates the store and opens the panel", () => {
    const { container } = render(<SubwayMap />);
    const fimil = container.querySelector('[data-station-code="P-09"]')!;
    fireEvent.click(fimil);
    expect(useNavStore.getState().selectedStationCode).toBe("P-09");
    expect(useNavStore.getState().panelOpen).toBe(true);
  });

  it("dims lines that do not serve the hovered station", () => {
    useNavStore.setState({ hoveredStationCode: "E-05" });
    const { container } = render(<SubwayMap />);
    // Hovering an Education station dims the unrelated Career line.
    const careerLine = container.querySelector('g[data-line="C"]') as SVGGElement;
    expect(careerLine.style.opacity).not.toBe("1");
  });
});
