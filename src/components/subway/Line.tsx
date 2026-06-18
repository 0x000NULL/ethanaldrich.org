"use client";

import { buildLinePath } from "@/lib/subway/geometry";
import { resolveLinePolylines } from "@/data/subway";
import type { Line as LineT } from "@/data/subway/types";

const STROKE = 7;
const CORNER_RADIUS = 10;

interface LineProps {
  line: LineT;
  dimmed?: boolean;
}

/** Renders a line's trunk and any branches as octolinear SVG paths. */
export default function Line({ line, dimmed = false }: LineProps) {
  const polylines = resolveLinePolylines(line);
  return (
    <g
      data-line={line.code}
      aria-hidden="true"
      style={{
        opacity: dimmed ? 0.18 : 1,
        transition: "opacity 150ms",
        pointerEvents: "none",
      }}
    >
      {polylines.map((poly, i) => (
        <path
          key={i}
          d={buildLinePath(poly.points, CORNER_RADIUS)}
          fill="none"
          stroke={line.color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={poly.dashed ? "2 9" : undefined}
        />
      ))}
    </g>
  );
}
