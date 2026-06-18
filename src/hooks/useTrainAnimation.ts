"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildTrainRuntimes,
  type TrainRuntime,
} from "@/lib/subway/selectors";
import {
  advanceTrain,
  trainPose,
  type TrainState,
} from "@/lib/subway/train";
import type { Pose } from "@/lib/subway/geometry";

export interface TrainView {
  runtime: TrainRuntime;
  state: TrainState;
  pose: Pose;
}

/**
 * Drives the train fleet. The stepping math is the pure `advanceTrain` reducer; this
 * hook only feeds it `performance.now()` deltas via rAF (the setup mock passes a timer
 * id, not a timestamp, so we must read the clock ourselves). reducedMotion freezes the
 * fleet at its initial dwell.
 */
export function useTrainAnimation(reducedMotion: boolean): TrainView[] {
  const runtimes = useMemo<TrainRuntime[]>(() => buildTrainRuntimes(), []);
  const [states, setStates] = useState<TrainState[]>(() =>
    runtimes.map((r) => r.initial)
  );

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(now - last, 64);
      last = now;
      setStates((prev) =>
        prev.map((s, i) => advanceTrain(s, runtimes[i].ctx, dt))
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, runtimes]);

  return runtimes.map((runtime, i) => ({
    runtime,
    state: states[i],
    pose: trainPose(runtime.points, states[i], runtime.metrics),
  }));
}
