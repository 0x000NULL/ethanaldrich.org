import { describe, it, expect, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./useIsMobile";

const originalWidth = window.innerWidth;

function setWidth(w: number) {
  Object.defineProperty(window, "innerWidth", {
    value: w,
    writable: true,
    configurable: true,
  });
}

afterEach(() => setWidth(originalWidth));

describe("useIsMobile", () => {
  it("is false on a wide viewport", () => {
    setWidth(1200);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("is true below the breakpoint", () => {
    setWidth(400);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("updates on resize", () => {
    setWidth(1200);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    act(() => {
      setWidth(500);
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(true);
  });

  it("honors a custom breakpoint", () => {
    setWidth(900);
    const { result } = renderHook(() => useIsMobile({ breakpoint: 1024 }));
    expect(result.current).toBe(true);
  });

  it("detects touch when checkTouch is enabled", () => {
    setWidth(1400);
    (window as unknown as { ontouchstart?: unknown }).ontouchstart = () => {};
    const { result } = renderHook(() => useIsMobile({ checkTouch: true }));
    expect(result.current).toBe(true);
    delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
  });
});
