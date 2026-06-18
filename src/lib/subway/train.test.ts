import { describe, it, expect } from "vitest";
import {
  advanceTrain,
  makeTrainState,
  trainPose,
  type TrainContext,
  type TrainState,
} from "./train";

// A straight 300px polyline with stations at 0, 100, 200, 300.
const POINTS = [
  { x: 0, y: 0 },
  { x: 300, y: 0 },
];
const ctx: TrainContext = {
  total: 300,
  stationDistances: [0, 100, 200, 300],
  speed: 1, // 1 px/ms
  dwellMs: 500,
};

describe("makeTrainState", () => {
  it("defaults to the start, moving forward", () => {
    expect(makeTrainState()).toEqual({ distance: 0, direction: 1, dwell: 0 });
  });
});

describe("advanceTrain", () => {
  it("is a no-op for non-positive dt or empty polyline", () => {
    const s = makeTrainState(50);
    expect(advanceTrain(s, ctx, 0)).toBe(s);
    expect(advanceTrain(s, { ...ctx, total: 0 }, 16)).toBe(s);
  });

  it("moves forward by speed*dt when between stations", () => {
    const s: TrainState = { distance: 110, direction: 1, dwell: 0 };
    expect(advanceTrain(s, ctx, 10)).toEqual({ distance: 120, direction: 1, dwell: 0 });
  });

  it("snaps to the next station and starts dwelling on arrival", () => {
    const s: TrainState = { distance: 95, direction: 1, dwell: 0 };
    expect(advanceTrain(s, ctx, 10)).toEqual({ distance: 100, direction: 1, dwell: 500 });
  });

  it("counts down dwell without moving", () => {
    const s: TrainState = { distance: 100, direction: 1, dwell: 500 };
    expect(advanceTrain(s, ctx, 200)).toEqual({ distance: 100, direction: 1, dwell: 300 });
  });

  it("resumes moving after dwell, consuming leftover time", () => {
    const s: TrainState = { distance: 100, direction: 1, dwell: 30 };
    // 50ms tick: 30ms finishes dwell, 20ms of travel remains.
    expect(advanceTrain(s, ctx, 50)).toEqual({ distance: 120, direction: 1, dwell: 0 });
  });

  it("reverses at the far end", () => {
    const s: TrainState = { distance: 295, direction: 1, dwell: 0 };
    // station at 300 is reached first → snap + dwell, then next tick reverses.
    const atEnd = advanceTrain(s, ctx, 10);
    expect(atEnd).toEqual({ distance: 300, direction: 1, dwell: 500 });
    const moving: TrainState = { distance: 300, direction: 1, dwell: 0 };
    expect(advanceTrain(moving, ctx, 10)).toEqual({ distance: 300, direction: -1, dwell: 500 });
  });

  it("reverses at the near end", () => {
    const s: TrainState = { distance: 0, direction: -1, dwell: 0 };
    expect(advanceTrain(s, ctx, 10)).toEqual({ distance: 0, direction: 1, dwell: 500 });
  });

  it("moves backward between stations", () => {
    const s: TrainState = { distance: 150, direction: -1, dwell: 0 };
    expect(advanceTrain(s, ctx, 10)).toEqual({ distance: 140, direction: -1, dwell: 0 });
  });

  it("snaps to the previous station when travelling backward", () => {
    const s: TrainState = { distance: 105, direction: -1, dwell: 0 };
    expect(advanceTrain(s, ctx, 10)).toEqual({ distance: 100, direction: -1, dwell: 500 });
  });
});

describe("trainPose", () => {
  it("returns the forward heading", () => {
    const pose = trainPose(POINTS, { distance: 150, direction: 1, dwell: 0 });
    expect(pose).toMatchObject({ x: 150, y: 0 });
    expect(pose.heading).toBeCloseTo(0);
  });

  it("flips the heading 180° when reversed", () => {
    const pose = trainPose(POINTS, { distance: 150, direction: -1, dwell: 0 });
    expect(Math.abs(pose.heading)).toBeCloseTo(Math.PI);
  });
});
