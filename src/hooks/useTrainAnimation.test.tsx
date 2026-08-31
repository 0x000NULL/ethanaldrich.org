import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTrainAnimation } from "./useTrainAnimation";
import { buildTrainRuntimes } from "@/lib/subway/selectors";
import { TRAINS } from "@/data/subway";

describe("buildTrainRuntimes", () => {
  it("builds one runtime per train with geometry and context", () => {
    const runtimes = buildTrainRuntimes();
    expect(runtimes).toHaveLength(TRAINS.length);
    for (const r of runtimes) {
      expect(r.points.length).toBeGreaterThan(1);
      expect(r.ctx.total).toBeGreaterThan(0);
      expect(r.ctx.stationDistances.length).toBeGreaterThan(0);
      expect(r.color).toMatch(/^#|var/);
    }
  });

  it("gives express trains a higher speed", () => {
    const [express] = buildTrainRuntimes([
      { id: "x", lineCode: "C", fromCode: "C-01", toCode: "C-03", express: true, nowServing: "x" },
    ]);
    const [local] = buildTrainRuntimes([
      { id: "y", lineCode: "C", fromCode: "C-01", toCode: "C-03", nowServing: "y" },
    ]);
    expect(express.ctx.speed).toBeGreaterThan(local.ctx.speed);
  });

  it("derives a backward direction when toCode precedes fromCode", () => {
    const [r] = buildTrainRuntimes([
      { id: "rev", lineCode: "P", fromCode: "P-07", toCode: "P-01", nowServing: "rev" },
    ]);
    expect(r.initial.direction).toBe(-1);
  });

  it("falls back to the start for an unknown station code", () => {
    const [r] = buildTrainRuntimes([
      { id: "bad", lineCode: "P", fromCode: "NOPE", toCode: "ALSO-NOPE", nowServing: "bad" },
    ]);
    expect(r.initial.distance).toBe(0);
  });
});

describe("useTrainAnimation", () => {
  it("returns a pose per train", () => {
    const { result } = renderHook(() => useTrainAnimation(true));
    expect(result.current).toHaveLength(TRAINS.length);
    expect(result.current[0].pose).toHaveProperty("x");
    expect(result.current[0].pose).toHaveProperty("heading");
  });

  it("freezes at the initial state under reduced motion", () => {
    const { result } = renderHook(() => useTrainAnimation(true));
    const first = result.current[0].state;
    expect(first).toEqual(result.current[0].runtime.initial);
  });

  it("advances the fleet when motion is allowed", () => {
    let raf: FrameRequestCallback | null = null;
    const realRaf = global.requestAnimationFrame;
    // Capture one frame callback and invoke it with a later timestamp.
    global.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      raf = cb;
      return 1 as unknown as number;
    }) as typeof requestAnimationFrame;

    const { result } = renderHook(() => useTrainAnimation(false));
    const before = result.current.map((v) => v.state.distance);
    act(() => {
      raf?.(performance.now() + 1000);
    });
    const after = result.current.map((v) => v.state.distance);
    // At least one train moved or began dwelling (state changed).
    expect(after.some((d, i) => d !== before[i])).toBe(true);

    global.requestAnimationFrame = realRaf;
  });
});
