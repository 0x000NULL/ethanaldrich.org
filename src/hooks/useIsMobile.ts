"use client";

import { useState, useEffect } from "react";

interface UseIsMobileOptions {
  breakpoint?: number;
  checkTouch?: boolean;
}

function measure(breakpoint: number, checkTouch: boolean): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoint || (checkTouch && "ontouchstart" in window);
}

export function useIsMobile(options: UseIsMobileOptions = {}): boolean {
  const { breakpoint = 1024, checkTouch = false } = options;

  // Seeded synchronously rather than defaulting to false. Starting false meant a
  // phone rendered the entire desktop tree first — SVG map, legend, departure
  // board, recenter button, plus a start-and-cancel of the train rAF loop — and
  // then threw it away once the effect ran. SSR still yields false, which is
  // correct: the server has no viewport, and SubwayShell renders the static
  // outline until mount, so the first client render still matches the server.
  const [isMobile, setIsMobile] = useState(() => measure(breakpoint, checkTouch));

  useEffect(() => {
    const checkMobile = () => setIsMobile(measure(breakpoint, checkTouch));

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint, checkTouch]);

  return isMobile;
}
