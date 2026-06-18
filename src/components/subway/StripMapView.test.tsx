import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavStore } from "@/store/nav-store";
import { LINES, getStationsForLine } from "@/data/subway";
import StripMapView from "./StripMapView";

beforeEach(() => {
  useNavStore.setState({ selectedStationCode: null });
});

describe("StripMapView", () => {
  it("renders a region per non-empty line", () => {
    render(<StripMapView />);
    for (const line of LINES) {
      if (getStationsForLine(line.code).length === 0) continue;
      expect(
        screen.getByRole("region", { name: `${line.name} line` })
      ).toBeInTheDocument();
    }
  });

  it("selects a station when tapped", () => {
    render(<StripMapView />);
    const first = getStationsForLine("P")[0]; // P-01 Proxmox Homelab
    fireEvent.click(screen.getByRole("button", { name: new RegExp(first.name) }));
    expect(useNavStore.getState().selectedStationCode).toBe(first.code);
  });

  it("shows transfer chips for interchange stations", () => {
    render(<StripMapView />);
    expect(screen.getAllByText(/Transfer to/i).length).toBeGreaterThan(0);
  });

  it("marks the selected station with aria-current", () => {
    const target = getStationsForLine("E")[0]; // E-01 High School
    useNavStore.setState({ selectedStationCode: target.code });
    render(<StripMapView />);
    expect(
      screen.getByRole("button", { name: new RegExp(target.name) })
    ).toHaveAttribute("aria-current", "true");
  });
});
