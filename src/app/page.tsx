"use client";

import { useState, useEffect, useMemo } from "react";
import { useDesktopStore } from "@/store/desktop-store";
import PostScreen from "@/components/boot/PostScreen";
import Desktop from "@/components/desktop/Desktop";
import CmosSetup from "@/components/boot/CmosSetup";
import ShutdownScreen from "@/components/effects/ShutdownScreen";

export default function Home() {
  const { appState, setAppState, setSkipBoot, initializeTheme } = useDesktopStore();
  const [mounted, setMounted] = useState(false);

  // Check mount state once on client - this is a valid hydration pattern
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Initialize theme from localStorage
    initializeTheme();

    // Check if returning visitor - run once on mount
    const hasVisited = localStorage.getItem("aldrich-portfolio-visited");
    if (hasVisited) {
      setSkipBoot(true);
    }

    // Track visitor stats (once per session)
    const hasTracked = sessionStorage.getItem("aldrich-stats-tracked");
    if (!hasTracked) {
      fetch("/api/stats", { method: "POST" }).catch((error: unknown) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to track stats:", error);
        }
      });
      sessionStorage.setItem("aldrich-stats-tracked", "true");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBootComplete = useMemo(
    () => () => setAppState("desktop"),
    [setAppState]
  );

  const handleEnterSetup = useMemo(
    () => () => setAppState("setup"),
    [setAppState]
  );

  const handleExitSetup = useMemo(
    () => () => setAppState("desktop"),
    [setAppState]
  );

  const handleRestart = useMemo(
    () => () => setAppState("booting"),
    [setAppState]
  );

  // Show loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-bios flex items-center justify-center">
        <div className="text-bios blink">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {appState === "booting" && (
        <PostScreen
          onComplete={handleBootComplete}
          onEnterSetup={handleEnterSetup}
        />
      )}

      {appState === "setup" && <CmosSetup onExit={handleExitSetup} />}

      {appState === "desktop" && <Desktop />}

      {appState === "shutdown" && <ShutdownScreen onRestart={handleRestart} />}
    </main>
  );
}
