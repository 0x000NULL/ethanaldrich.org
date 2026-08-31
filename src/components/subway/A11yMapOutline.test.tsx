import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import A11yMapOutline from "./A11yMapOutline";
import { LINES, getStationsForLine } from "@/data/subway";

describe("A11yMapOutline", () => {
  it("renders a labelled section per line with every station as a button", () => {
    const { getByRole } = render(
      <A11yMapOutline onSelect={() => {}} onHover={() => {}} />
    );
    const nav = getByRole("navigation", { name: /station index/i });
    for (const line of LINES) {
      const section = within(nav).getByRole("region", {
        name: new RegExp(`${line.name} stations`, "i"),
      });
      const buttons = within(section).getAllByRole("button");
      expect(buttons).toHaveLength(getStationsForLine(line.code).length);
    }
  });

  it("announces transfers in the accessible label", () => {
    const { getByRole } = render(
      <A11yMapOutline onSelect={() => {}} onHover={() => {}} />
    );
    const transferStop = getByRole("button", { name: /E-06 Security\+/i });
    expect(transferStop.textContent).toMatch(
      /Transfer to Security Observability Stack/i
    );
  });

  it("calls onSelect when a station is activated", () => {
    const onSelect = vi.fn();
    const { getByRole } = render(
      <A11yMapOutline onSelect={onSelect} onHover={() => {}} />
    );
    fireEvent.click(getByRole("button", { name: /P-07 Montr Signage/i }));
    expect(onSelect).toHaveBeenCalledWith("P-07");
  });

  it("mirrors focus to the map via onHover", () => {
    const onHover = vi.fn();
    const { getByRole } = render(
      <A11yMapOutline onSelect={() => {}} onHover={onHover} />
    );
    const btn = getByRole("button", { name: /E-01 High School/i });
    fireEvent.focus(btn);
    fireEvent.blur(btn);
    expect(onHover).toHaveBeenCalledWith("E-01");
    expect(onHover).toHaveBeenCalledWith(null);
  });

  it("moves focus with arrow keys (roving tabindex)", () => {
    const { getByRole } = render(
      <A11yMapOutline onSelect={() => {}} onHover={() => {}} />
    );
    const first = getByRole("button", { name: /E-01 High School/i });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    const second = getByRole("button", { name: /E-02 A\+/i });
    expect(document.activeElement).toBe(second);
  });
});
