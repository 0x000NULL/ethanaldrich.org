import { useEffect, useRef } from "react";
import { INITIAL_SPEED } from "../types";

interface UseGameLoopOptions {
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  onTick: () => void;
}

export function useGameLoop({
  isPlaying,
  isPaused,
  gameOver,
  onTick,
}: UseGameLoopOptions) {
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const onTickRef = useRef(onTick);

  // Keep callback ref current
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastTimeRef.current >= INITIAL_SPEED) {
        onTickRef.current();
        lastTimeRef.current = timestamp;
      }
      rafRef.current = requestAnimationFrame(gameLoop);
    };

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, isPaused, gameOver]);
}
