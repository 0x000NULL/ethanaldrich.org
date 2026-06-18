import { describe, it, expect, beforeEach } from "vitest";
import { useRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useSubwayPanZoom } from "./useSubwayPanZoom";
import { useNavStore } from "@/store/nav-store";
import { IDENTITY } from "@/lib/subway/viewport";

const VB = { x: 0, y: 0, w: 1000, h: 600 };

function Harness() {
  const ref = useRef<SVGSVGElement>(null);
  const h = useSubwayPanZoom(ref, VB);
  return (
    <svg
      ref={ref}
      data-testid="svg"
      onWheel={h.onWheel}
      onPointerDown={h.onPointerDown}
      onPointerMove={h.onPointerMove}
      onPointerUp={h.onPointerUp}
    />
  );
}

function mountWithSize() {
  const { getByTestId } = render(<Harness />);
  const svg = getByTestId("svg") as unknown as SVGSVGElement;
  svg.getBoundingClientRect = () =>
    ({ width: 1000, height: 600, left: 0, top: 0, right: 1000, bottom: 600, x: 0, y: 0 }) as DOMRect;
  return svg;
}

beforeEach(() => {
  useNavStore.setState({ transform: IDENTITY });
});

describe("useSubwayPanZoom", () => {
  it("zooms in on wheel-up, keeping the cursor point fixed", () => {
    const svg = mountWithSize();
    fireEvent.wheel(svg, { deltaY: -100, clientX: 500, clientY: 300 });
    expect(useNavStore.getState().transform.k).toBeGreaterThan(1);
  });

  it("zooms out on wheel-down", () => {
    const svg = mountWithSize();
    fireEvent.wheel(svg, { deltaY: 100, clientX: 500, clientY: 300 });
    expect(useNavStore.getState().transform.k).toBeLessThan(1);
  });

  it("pans on pointer drag", () => {
    const svg = mountWithSize();
    fireEvent.pointerDown(svg, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(svg, { clientX: 220, clientY: 160, pointerId: 1 });
    fireEvent.pointerUp(svg, { clientX: 220, clientY: 160, pointerId: 1 });
    const t = useNavStore.getState().transform;
    expect(t.x).toBeCloseTo(120);
    expect(t.y).toBeCloseTo(60);
  });

  it("no-ops without a measured size", () => {
    const { getByTestId } = render(<Harness />);
    const svg = getByTestId("svg");
    fireEvent.wheel(svg, { deltaY: -100, clientX: 5, clientY: 5 });
    expect(useNavStore.getState().transform).toEqual(IDENTITY);
  });

  it("ignores a pointer move with no active drag", () => {
    const svg = mountWithSize();
    fireEvent.pointerMove(svg, { clientX: 50, clientY: 50, pointerId: 9 });
    expect(useNavStore.getState().transform).toEqual(IDENTITY);
  });

  it("ignores a drag once the size is removed mid-gesture", () => {
    const svg = mountWithSize();
    fireEvent.pointerDown(svg, { clientX: 10, clientY: 10, pointerId: 2 });
    svg.getBoundingClientRect = () =>
      ({ width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0, x: 0, y: 0 }) as DOMRect;
    fireEvent.pointerMove(svg, { clientX: 80, clientY: 80, pointerId: 2 });
    expect(useNavStore.getState().transform).toEqual(IDENTITY);
  });
});
