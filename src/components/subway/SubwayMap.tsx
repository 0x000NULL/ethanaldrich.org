"use client";

import { useMemo, useRef } from "react";
import { focusedLineCodes, getViewBox } from "@/lib/subway/selectors";
import { useNavStore } from "@/store/nav-store";
import { useSubwayPanZoom } from "@/hooks/useSubwayPanZoom";
import LineLayer from "./LineLayer";
import TrainLayer from "./TrainLayer";
import StationLayer from "./StationLayer";

/**
 * The visual map. role="img" — it is a presentation; the real keyboard/AT interface
 * is the parallel A11yMapOutline. The viewBox is config-derived (deterministic, so
 * SSR and client first paint match); the inner <g> carries the pan/zoom transform.
 */
export default function SubwayMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const vb = useMemo(() => getViewBox(), []);
  const transform = useNavStore((s) => s.transform);
  const hovered = useNavStore((s) => s.hoveredStationCode);
  const selected = useNavStore((s) => s.selectedStationCode);
  const selectStation = useNavStore((s) => s.selectStation);
  const setHoveredStation = useNavStore((s) => s.setHoveredStation);

  const panZoom = useSubwayPanZoom(svgRef, vb);
  const focus = useMemo(
    () => focusedLineCodes(hovered ?? selected),
    [hovered, selected]
  );

  return (
    <svg
      ref={svgRef}
      className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Ethan Aldrich's career, projects, and learning rendered as a Tokyo-Metro subway map. Use the station index below to explore."
      style={{ background: "var(--metro-bg)" }}
      onWheel={panZoom.onWheel}
      onPointerDown={panZoom.onPointerDown}
      onPointerMove={panZoom.onPointerMove}
      onPointerUp={panZoom.onPointerUp}
      onClickCapture={panZoom.onClickCapture}
    >
      <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
        <LineLayer focus={focus} />
        <TrainLayer />
        <StationLayer
          focus={focus}
          selectedCode={selected}
          onSelect={selectStation}
          onHover={setHoveredStation}
        />
      </g>
    </svg>
  );
}
