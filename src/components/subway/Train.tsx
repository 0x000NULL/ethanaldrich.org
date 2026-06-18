"use client";

import type { TrainView } from "@/hooks/useTrainAnimation";

const LEN = 18;
const W = 10;

/** A small colored lozenge gliding along its line, heading-aligned. */
export default function Train({ view }: { view: TrainView }) {
  const { pose, runtime } = view;
  const deg = (pose.heading * 180) / Math.PI;
  const { train, color } = runtime;
  const tip = train.eta ? `${train.nowServing} · ${train.eta}` : train.nowServing;

  return (
    <g
      data-train={train.id}
      transform={`translate(${pose.x} ${pose.y}) rotate(${deg})`}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <title>{`Now serving: ${tip}`}</title>
      <rect
        x={-LEN / 2}
        y={-W / 2}
        width={LEN}
        height={W}
        rx={W / 2}
        fill={color}
        stroke="var(--metro-roundel)"
        strokeWidth={2}
      />
      {train.express && (
        <rect x={-1.5} y={-W / 2} width={3} height={W} fill="var(--metro-roundel)" />
      )}
    </g>
  );
}
