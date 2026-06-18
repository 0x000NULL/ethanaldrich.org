"use client";

import { useCallback, useRef, type RefObject } from "react";
import { useNavStore } from "@/store/nav-store";
import { zoomAt } from "@/lib/subway/viewport";
import type { ViewBox } from "@/lib/subway/selectors";

/** Pixels of movement before a press is treated as a pan (not a click). */
const DRAG_THRESHOLD = 4;

/**
 * Drag-to-pan and wheel-to-zoom over the SVG. The pure transform math lives in
 * viewport.ts. Pointer capture is taken ONLY once a real drag begins, so plain
 * clicks still reach the station roundels; a click that follows a drag is
 * suppressed via onClickCapture. Falls back to no-ops without a measured size.
 */
export function useSubwayPanZoom(
  svgRef: RefObject<SVGSVGElement | null>,
  vb: ViewBox
) {
  const transform = useNavStore((s) => s.transform);
  const setTransform = useNavStore((s) => s.setTransform);
  const drag = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
    active: boolean;
    pointerId: number;
  } | null>(null);
  const didPan = useRef(false);

  const pxPerUnit = useCallback(() => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return rect.width / vb.w;
  }, [svgRef, vb.w]);

  const toViewBox = useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current!.getBoundingClientRect();
      const s = rect.width / vb.w;
      return {
        x: vb.x + (clientX - rect.left) / s,
        y: vb.y + (clientY - rect.top) / s,
      };
    },
    [svgRef, vb]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!pxPerUnit()) return;
      const p = toViewBox(e.clientX, e.clientY);
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setTransform(zoomAt(transform, p.x, p.y, factor));
    },
    [pxPerUnit, toViewBox, transform, setTransform]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      drag.current = {
        x: e.clientX,
        y: e.clientY,
        ox: transform.x,
        oy: transform.y,
        active: false,
        pointerId: e.pointerId,
      };
    },
    [transform]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const sdx = e.clientX - d.x;
      const sdy = e.clientY - d.y;
      if (!d.active && Math.hypot(sdx, sdy) < DRAG_THRESHOLD) return;
      if (!d.active) {
        d.active = true;
        (e.currentTarget as Element).setPointerCapture?.(d.pointerId);
      }
      const s = pxPerUnit();
      if (!s) return;
      didPan.current = true;
      setTransform({ k: transform.k, x: d.ox + sdx / s, y: d.oy + sdy / s });
    },
    [pxPerUnit, transform.k, setTransform]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (drag.current?.active) {
      (e.currentTarget as Element).releasePointerCapture?.(drag.current.pointerId);
    }
    drag.current = null;
  }, []);

  // Swallow the click that fires immediately after a pan so it doesn't select a station.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (didPan.current) {
      e.stopPropagation();
      didPan.current = false;
    }
  }, []);

  return { onWheel, onPointerDown, onPointerMove, onPointerUp, onClickCapture };
}
