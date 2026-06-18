import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import StationIndex from "./StationIndex";
import { LINES } from "@/data/subway";
import { useNavStore } from "@/store/nav-store";
import { IDENTITY } from "@/lib/subway/viewport";

beforeEach(() => {
  useNavStore.setState({ transform: IDENTITY });
});

describe("StationIndex", () => {
  it("lists every line in the legend", () => {
    const { getByText } = render(<StationIndex />);
    for (const line of LINES) {
      expect(getByText(line.name)).toBeTruthy();
    }
  });

  it("collapses and expands", () => {
    const { getByRole, queryByText } = render(<StationIndex />);
    fireEvent.click(getByRole("button", { name: /hide/i }));
    expect(queryByText("Education Line")).toBeNull();
    fireEvent.click(getByRole("button", { name: /lines/i }));
    expect(queryByText("Education Line")).toBeTruthy();
  });

  it("frames a line (changes the transform) when clicked", () => {
    const { getByText } = render(<StationIndex />);
    fireEvent.click(getByText("Projects Line"));
    expect(useNavStore.getState().transform).not.toEqual(IDENTITY);
  });
});
