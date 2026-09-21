"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * A stack of the currently-active traps, innermost last.
 *
 * Every trap listens on `document`, so without this a single Escape reaches all
 * of them. That is reachable today: `/?station=CODE` on a fresh session opens
 * StationPanel while IntroSplash is still unseen, so both mount trapped and one
 * Escape dismissed the splash AND the panel the deep link had just opened.
 * Only the topmost trap acts.
 */
const trapStack: symbol[] = [];

/**
 * Trap focus within a container while `active`. Escape calls `onClose`; Tab cycles;
 * focus moves into the container on open and returns to the prior element on close.
 * Nested traps stack: only the innermost responds to Escape and Tab.
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  onClose: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const token = Symbol("focus-trap");
    trapStack.push(token);
    const isTopmost = () => trapStack[trapStack.length - 1] === token;

    const items = (): HTMLElement[] =>
      node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];

    items()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isTopmost()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = items();
      if (focusables.length === 0) return;
      const idx = focusables.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && idx <= 0) {
        e.preventDefault();
        focusables[focusables.length - 1].focus();
      } else if (!e.shiftKey && idx === focusables.length - 1) {
        e.preventDefault();
        focusables[0].focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const i = trapStack.indexOf(token);
      if (i !== -1) trapStack.splice(i, 1);
      previouslyFocused?.focus?.();
    };
  }, [active, onClose]);

  return ref;
}
