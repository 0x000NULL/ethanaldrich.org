"use client";

import { useNavStore } from "@/store/nav-store";
import { IDENTITY } from "@/lib/subway/viewport";

/** Resets pan/zoom so the whole network fits (the viewBox already frames it). */
export default function RecenterButton() {
  const setTransform = useNavStore((s) => s.setTransform);
  return (
    <button
      onClick={() => setTransform(IDENTITY)}
      aria-label="Recenter map"
      title="Recenter map"
      className="board-type pointer-events-auto absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--metro-ink)] bg-[var(--metro-panel)] text-lg font-bold shadow-sm hover:bg-[var(--metro-bg)]"
    >
      ⊙
    </button>
  );
}
