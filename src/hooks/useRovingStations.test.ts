import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { rove, useRovingStations, type RovingGroup } from "./useRovingStations";

describe("rove", () => {
  it("wraps forward and backward", () => {
    expect(rove("ArrowDown", 0, 3)).toBe(1);
    expect(rove("ArrowRight", 2, 3)).toBe(0);
    expect(rove("ArrowUp", 0, 3)).toBe(2);
    expect(rove("ArrowLeft", 1, 3)).toBe(0);
  });

  it("jumps to ends", () => {
    expect(rove("Home", 2, 3)).toBe(0);
    expect(rove("End", 0, 3)).toBe(2);
  });

  it("ignores non-nav keys and empty groups", () => {
    expect(rove("Enter", 1, 3)).toBe(1);
    expect(rove("ArrowDown", 0, 0)).toBe(0);
  });
});

describe("useRovingStations", () => {
  const groups: RovingGroup[] = [
    { lineCode: "E", codes: ["E-01", "E-02", "E-03"] },
    { lineCode: "P", codes: ["P-01", "P-02"] },
  ];

  it("starts with the first station tabbable in each group", () => {
    const { result } = renderHook(() => useRovingStations(groups));
    expect(result.current.tabIndexFor(0, 0)).toBe(0);
    expect(result.current.tabIndexFor(0, 1)).toBe(-1);
    expect(result.current.tabIndexFor(1, 0)).toBe(0);
  });

  it("moves the tabbable index on arrow keys", () => {
    const { result } = renderHook(() => useRovingStations(groups));
    const preventDefault = () => {};
    act(() => {
      result.current.onKeyDown(0)({
        key: "ArrowDown",
        preventDefault,
      } as unknown as React.KeyboardEvent<HTMLButtonElement>);
    });
    expect(result.current.tabIndexFor(0, 1)).toBe(0);
    expect(result.current.tabIndexFor(0, 0)).toBe(-1);
  });

  it("ignores non-nav keys", () => {
    const { result } = renderHook(() => useRovingStations(groups));
    act(() => {
      result.current.onKeyDown(0)({
        key: "Enter",
        preventDefault: () => {},
      } as unknown as React.KeyboardEvent<HTMLButtonElement>);
    });
    expect(result.current.tabIndexFor(0, 0)).toBe(0);
  });

  it("register returns a ref setter that does not throw", () => {
    const { result } = renderHook(() => useRovingStations(groups));
    expect(() => result.current.register("E-01")(null)).not.toThrow();
  });
});
