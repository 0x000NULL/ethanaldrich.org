import { useEffect, useRef } from "react";
import { Direction, SWIPE_THRESHOLD } from "../types";

interface UseGameControlsOptions {
  isPlaying: boolean;
  onDirectionChange: (dir: Direction) => void;
  onPauseToggle: () => void;
}

export function useGameControls({
  isPlaying,
  onDirectionChange,
  onPauseToggle,
}: UseGameControlsOptions) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP",
        w: "UP",
        W: "UP",
        ArrowDown: "DOWN",
        s: "DOWN",
        S: "DOWN",
        ArrowLeft: "LEFT",
        a: "LEFT",
        A: "LEFT",
        ArrowRight: "RIGHT",
        d: "RIGHT",
        D: "RIGHT",
      };

      if (keyMap[e.key]) {
        onDirectionChange(keyMap[e.key]);
      } else if (e.key === "p" || e.key === "P" || e.key === " ") {
        onPauseToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, onDirectionChange, onPauseToggle]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isPlaying) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD &&
      Math.abs(deltaY) < SWIPE_THRESHOLD
    ) {
      touchStartRef.current = null;
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      onDirectionChange(deltaX > 0 ? "RIGHT" : "LEFT");
    } else {
      onDirectionChange(deltaY > 0 ? "DOWN" : "UP");
    }

    touchStartRef.current = null;
  };

  return { handleTouchStart, handleTouchEnd };
}
