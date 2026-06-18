import { type Point, type Pose, poseAtDistance, type PolylineMetrics } from "./geometry";

/**
 * Pure train simulation. A train rides the trunk polyline as a distance value,
 * dwelling briefly at each station vertex and reversing at the ends. Stepping is a
 * pure reducer driven by an explicit `dtMs`, so tests never touch rAF or the DOM.
 */
export interface TrainState {
  /** Distance in px along the polyline. */
  distance: number;
  /** Travel direction along the polyline. */
  direction: 1 | -1;
  /** Milliseconds remaining dwelling at a station (0 = moving). */
  dwell: number;
}

export interface TrainContext {
  total: number;
  /** Sorted ascending distances of station vertices along the polyline. */
  stationDistances: number[];
  /** Speed in px per ms. */
  speed: number;
  /** Dwell duration at each station, ms. */
  dwellMs: number;
}

export function makeTrainState(
  startDistance = 0,
  direction: 1 | -1 = 1
): TrainState {
  return { distance: startDistance, direction, dwell: 0 };
}

/** Next station distance strictly beyond `from` in travel `direction`, or null. */
function nextStation(
  ctx: TrainContext,
  from: number,
  direction: 1 | -1,
  eps: number
): number | null {
  if (direction === 1) {
    for (const d of ctx.stationDistances) if (d > from + eps) return d;
    return null;
  }
  for (let i = ctx.stationDistances.length - 1; i >= 0; i--) {
    const d = ctx.stationDistances[i];
    if (d < from - eps) return d;
  }
  return null;
}

const EPS = 0.001;

/** Advance a train by `dtMs`. Pure: same inputs → same output. */
export function advanceTrain(
  state: TrainState,
  ctx: TrainContext,
  dtMs: number
): TrainState {
  if (dtMs <= 0 || ctx.total <= 0) return state;

  // Dwelling at a station.
  if (state.dwell > 0) {
    const dwell = state.dwell - dtMs;
    if (dwell > 0) return { ...state, dwell };
    // Dwell finished; continue moving this tick with the leftover time.
    return advanceTrain({ ...state, dwell: 0 }, ctx, -dwell);
  }

  const { distance, direction } = state;
  const step = ctx.speed * dtMs;
  const target = nextStation(ctx, distance, direction, EPS);
  const proposed = distance + direction * step;

  // Arriving at the next station this tick → snap and dwell.
  if (target !== null && (direction === 1 ? proposed >= target : proposed <= target)) {
    return { distance: target, direction, dwell: ctx.dwellMs };
  }

  // Reverse at the ends.
  if (proposed >= ctx.total) {
    return { distance: ctx.total, direction: -1, dwell: ctx.dwellMs };
  }
  if (proposed <= 0) {
    return { distance: 0, direction: 1, dwell: ctx.dwellMs };
  }

  return { distance: proposed, direction, dwell: 0 };
}

/** Pose for rendering: position + heading, flipped 180° when travelling backward. */
export function trainPose(
  points: Point[],
  state: TrainState,
  metrics?: PolylineMetrics
): Pose {
  const pose = poseAtDistance(points, state.distance, metrics);
  if (state.direction === -1) {
    return { ...pose, heading: pose.heading + Math.PI };
  }
  return pose;
}
