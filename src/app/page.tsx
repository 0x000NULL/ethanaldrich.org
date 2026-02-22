"use client";

import { useState, useEffect, useMemo } from "react";
import { useDesktopStore } from "@/store/desktop-store";
import PostScreen from "@/components/boot/PostScreen";
import Desktop from "@/components/desktop/Desktop";
import CmosSetup from "@/components/boot/CmosSetup";

export default function Home() {
  const { appState, setAppState, setSkipBoot } = useDesktopStore();
  const [mounted, setMounted] = useState(false);

  // Check mount state once on client - this is a valid hydration pattern
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Check if returning visitor - run once on mount
    const hasVisited = localStorage.getItem("aldrich-portfolio-visited");
    if (hasVisited) {
      setSkipBoot(true);
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

  // Show loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-[#0000AA] flex items-center justify-center">
        <div className="text-[#AAAAAA] blink">Loading...</div>
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
    </main>
  );
}
