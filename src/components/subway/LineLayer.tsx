"use client";

import { LINES } from "@/data/subway";
import type { LineCode } from "@/data/subway/types";
import Line from "./Line";

interface LineLayerProps {
  /** Lines to render at full opacity; all others dim. */
  focus: Set<LineCode>;
}

export default function LineLayer({ focus }: LineLayerProps) {
  return (
    <g data-layer="lines">
      {LINES.map((line) => (
        <Line key={line.code} line={line} dimmed={!focus.has(line.code)} />
      ))}
    </g>
  );
}
