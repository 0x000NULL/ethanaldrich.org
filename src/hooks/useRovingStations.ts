"use client";

import { useCallback, useRef, useState } from "react";

export interface RovingGroup {
  lineCode: string;
  codes: string[];
}

/**
 * Pure keyboard math: given an arrow/Home/End key, the current index, and the
 * group length, return the next index (wrapping). Returns the same index for keys
 * that don't move focus. Extracted so it can be unit-tested without the DOM.
 */
export function rove(key: string, idx: number, len: number): number {
  if (len <= 0) return 0;
  switch (key) {
    case "ArrowDown":
    case "ArrowRight":
      return (idx + 1) % len;
    case "ArrowUp":
    case "ArrowLeft":
      return (idx - 1 + len) % len;
    case "Home":
      return 0;
    case "End":
      return len - 1;
    default:
      return idx;
  }
}

const NAV_KEYS = new Set([
  "ArrowDown",
  "ArrowRight",
  "ArrowUp",
  "ArrowLeft",
  "Home",
  "End",
]);

/**
 * Roving tabindex across per-line station lists: arrow keys walk one line, Tab
 * jumps between lines (each group keeps exactly one tabbable button).
 */
export function useRovingStations(groups: RovingGroup[]) {
  const [activeIndices, setActiveIndices] = useState<number[]>(() =>
    groups.map(() => 0)
  );
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const register = useCallback(
    (code: string) => (el: HTMLButtonElement | null) => {
      btnRefs.current[code] = el;
    },
    []
  );

  const tabIndexFor = useCallback(
    (groupIdx: number, stationIdx: number): 0 | -1 =>
      (activeIndices[groupIdx] ?? 0) === stationIdx ? 0 : -1,
    [activeIndices]
  );

  const onKeyDown = useCallback(
    (groupIdx: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!NAV_KEYS.has(e.key)) return;
      e.preventDefault();
      const group = groups[groupIdx];
      if (!group) return;
      const current = activeIndices[groupIdx] ?? 0;
      const next = rove(e.key, current, group.codes.length);
      if (next === current) return;
      setActiveIndices((prev) => {
        const copy = [...prev];
        copy[groupIdx] = next;
        return copy;
      });
      btnRefs.current[group.codes[next]]?.focus();
    },
    [groups, activeIndices]
  );

  return { tabIndexFor, onKeyDown, register };
}
