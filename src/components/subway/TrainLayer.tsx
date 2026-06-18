"use client";

import { useNavStore } from "@/store/nav-store";
import { useTrainAnimation } from "@/hooks/useTrainAnimation";
import Train from "./Train";

/**
 * Owns the animation loop so only this subtree re-renders per frame (the lines and
 * stations stay static). Honors the reduced-motion preference.
 */
export default function TrainLayer() {
  const reducedMotion = useNavStore((s) => s.reducedMotion);
  const views = useTrainAnimation(reducedMotion);

  return (
    <g data-layer="trains">
      {views.map((view) => (
        <Train key={view.runtime.train.id} view={view} />
      ))}
    </g>
  );
}
