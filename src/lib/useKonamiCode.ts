"use client";

import { useState, useEffect, useCallback } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

const STORAGE_KEY = "aldrich-turbo-unlocked";

export function useKonamiCode(onActivate?: () => void) {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Check if already unlocked on mount
  useEffect(() => {
    const unlocked = localStorage.getItem(STORAGE_KEY) === "true";
    setIsUnlocked(unlocked);
  }, []);

  const checkSequence = useCallback(
    (sequence: string[]) => {
      // Check if the sequence matches the Konami code
      if (sequence.length !== KONAMI_CODE.length) return false;

      return sequence.every((key, index) => key === KONAMI_CODE[index]);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Get the key code (handles both Arrow keys and letter keys)
      const key = e.code;

      setInputSequence((prev) => {
        const newSequence = [...prev, key].slice(-KONAMI_CODE.length);

        // Check if we've entered the Konami code
        if (checkSequence(newSequence)) {
          // Activate turbo mode!
          setIsUnlocked(true);
          setShowOverlay(true);
          localStorage.setItem(STORAGE_KEY, "true");
          onActivate?.();

          // Hide overlay after animation
          setTimeout(() => {
            setShowOverlay(false);
          }, 3000);

          return [];
        }

        return newSequence;
      });
    },
    [checkSequence, onActivate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const resetUnlock = useCallback(() => {
    setIsUnlocked(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    isUnlocked,
    showOverlay,
    resetUnlock,
    hideOverlay: () => setShowOverlay(false),
  };
}
