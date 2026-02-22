"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  bootSequence,
  MEMORY_TARGET,
  MEMORY_STEP,
  MEMORY_INTERVAL,
  AUTO_BOOT_DELAY,
  type BootLine,
} from "@/data/boot-sequence";
import { useDesktopStore } from "@/store/desktop-store";

export type BootState = "idle" | "booting" | "waiting" | "complete" | "setup";

interface UseBootSequenceReturn {
  bootState: BootState;
  currentLines: BootLine[];
  memoryValue: number;
  memoryComplete: boolean;
  showPrompt: boolean;
  startBoot: () => void;
  skipBoot: () => void;
  enterSetup: () => void;
  proceedToDesktop: () => void;
}

export function useBootSequence(): UseBootSequenceReturn {
  const [bootState, setBootState] = useState<BootState>("idle");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [memoryValue, setMemoryValue] = useState(0);
  const [memoryComplete, setMemoryComplete] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const { setAppState, hasBooted, setHasBooted, skipBoot: shouldSkip } =
    useDesktopStore();

  const autoBootTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lineTimerRef = useRef<NodeJS.Timeout | null>(null);
  const memoryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentLines = bootSequence.slice(0, currentLineIndex + 1);

  // Define callbacks first to avoid order issues
  const enterSetup = useCallback(() => {
    if (autoBootTimerRef.current) clearTimeout(autoBootTimerRef.current);
    setBootState("setup");
    setAppState("setup");
  }, [setAppState]);

  const proceedToDesktop = useCallback(() => {
    if (autoBootTimerRef.current) clearTimeout(autoBootTimerRef.current);
    setBootState("complete");
    setAppState("desktop");
    setHasBooted(true);

    // Store in localStorage for returning visitors
    if (typeof window !== "undefined") {
      localStorage.setItem("aldrich-portfolio-visited", "true");
    }
  }, [setAppState, setHasBooted]);

  const skipBoot = useCallback(() => {
    if (autoBootTimerRef.current) clearTimeout(autoBootTimerRef.current);
    if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);

    setMemoryValue(MEMORY_TARGET);
    setMemoryComplete(true);
    setCurrentLineIndex(bootSequence.length - 1);
    setShowPrompt(true);
    setBootState("waiting");
  }, []);

  const startBoot = useCallback(() => {
    // Check if user has visited before and should skip
    if (shouldSkip || hasBooted) {
      // Fast boot - show everything quickly
      setMemoryValue(MEMORY_TARGET);
      setMemoryComplete(true);
      setCurrentLineIndex(bootSequence.length - 1);
      setShowPrompt(true);
      setBootState("waiting");
      return;
    }

    setBootState("booting");
    setCurrentLineIndex(0);
    setMemoryValue(0);
    setMemoryComplete(false);
    setShowPrompt(false);
  }, [shouldSkip, hasBooted]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (autoBootTimerRef.current) clearTimeout(autoBootTimerRef.current);
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
      if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
    };
  }, []);

  // Memory counting animation
  useEffect(() => {
    if (bootState !== "booting") return;

    const currentLine = bootSequence[currentLineIndex];
    if (currentLine?.type === "memory" && !memoryComplete) {
      memoryTimerRef.current = setInterval(() => {
        setMemoryValue((prev) => {
          const next = prev + MEMORY_STEP;
          if (next >= MEMORY_TARGET) {
            if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
            setMemoryComplete(true);
            return MEMORY_TARGET;
          }
          return next;
        });
      }, MEMORY_INTERVAL);
    }

    return () => {
      if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
    };
  }, [bootState, currentLineIndex, memoryComplete]);

  // Progress through boot sequence
  useEffect(() => {
    if (bootState !== "booting") return;
    if (currentLineIndex >= bootSequence.length - 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBootState("waiting");
      setShowPrompt(true);
      return;
    }

    // Wait for memory test to complete before proceeding
    const currentLine = bootSequence[currentLineIndex];
    if (currentLine?.type === "memory" && !memoryComplete) {
      return;
    }

    const nextLine = bootSequence[currentLineIndex + 1];
    if (!nextLine) return;

    lineTimerRef.current = setTimeout(() => {
      setCurrentLineIndex((prev) => prev + 1);
    }, nextLine.delay);

    return () => {
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    };
  }, [bootState, currentLineIndex, memoryComplete]);

  // Auto-boot timer
  useEffect(() => {
    if (bootState === "waiting") {
      autoBootTimerRef.current = setTimeout(() => {
        proceedToDesktop();
      }, AUTO_BOOT_DELAY);
    }

    return () => {
      if (autoBootTimerRef.current) clearTimeout(autoBootTimerRef.current);
    };
  }, [bootState, proceedToDesktop]);

  // Keyboard handler
  useEffect(() => {
    if (bootState !== "waiting") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (autoBootTimerRef.current) clearTimeout(autoBootTimerRef.current);

      if (e.key === "Delete" || e.key === "Escape") {
        enterSetup();
      } else {
        proceedToDesktop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bootState, enterSetup, proceedToDesktop]);

  return {
    bootState,
    currentLines,
    memoryValue,
    memoryComplete,
    showPrompt,
    startBoot,
    skipBoot,
    enterSetup,
    proceedToDesktop,
  };
}
