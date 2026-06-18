"use client";

import { useNavStore } from "@/store/nav-store";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const ROUNDELS: [string, string][] = [
  ["E", "var(--line-e)"],
  ["C", "var(--line-c)"],
  ["P", "var(--line-p)"],
  ["W", "var(--line-w)"],
];

/**
 * Suica-style "tap to enter" splash, shown once per session before the map. Focus is
 * trapped while open; the Enter button, a click, or Escape all dismiss it. The pulse
 * hint is dropped under reduced motion.
 */
export default function IntroSplash() {
  const introSeen = useNavStore((s) => s.introSeen);
  const dismissIntro = useNavStore((s) => s.dismissIntro);
  const reducedMotion = useNavStore((s) => s.reducedMotion);
  const ref = useFocusTrap<HTMLDivElement>(!introSeen, dismissIntro);

  if (introSeen) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Aldrich Transit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--metro-ink)]/85 p-6 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-sm rounded-2xl border bg-[var(--metro-panel)] p-8 text-center text-[var(--metro-ink)] shadow-2xl"
        style={{ borderColor: "var(--metro-border)" }}
      >
        <div className="mb-6 flex justify-center gap-2">
          {ROUNDELS.map(([letter, color]) => (
            <span
              key={letter}
              className="board-type inline-flex h-10 w-10 items-center justify-center rounded-full border-4 text-sm font-bold"
              style={{ borderColor: color, background: "var(--metro-roundel)" }}
            >
              {letter}
            </span>
          ))}
        </div>

        <h1 className="text-2xl font-bold">Aldrich Transit</h1>
        <p className="mt-2 text-sm text-[var(--metro-ink-dim)]">
          My career, projects, and learning as a subway map. Tap a station for the
          story.
        </p>

        <button
          autoFocus
          onClick={dismissIntro}
          className="touch-target mt-6 inline-flex w-full items-center justify-center rounded-lg border-2 border-[var(--metro-ink)] px-6 py-3 text-lg font-bold hover:bg-[var(--metro-ink)] hover:text-[var(--metro-bg)]"
        >
          Tap to enter
          <span className={reducedMotion ? "ml-2" : "ml-2 animate-pulse"} aria-hidden="true">
            ▸
          </span>
        </button>
      </div>
    </div>
  );
}
