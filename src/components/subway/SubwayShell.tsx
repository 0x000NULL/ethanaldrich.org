"use client";

import { useEffect, useState } from "react";
import { useNavStore } from "@/store/nav-store";
import { getStation } from "@/data/subway";
import { useIsMobile } from "@/hooks/useIsMobile";
import SubwayMap from "./SubwayMap";
import StripMapView from "./StripMapView";
import StationIndex from "./StationIndex";
import StationPanel from "./StationPanel";
import RecenterButton from "./RecenterButton";
import ServiceAlertBanner from "./ServiceAlertBanner";
import DepartureBoard from "./DepartureBoard";
import A11yMapOutline from "./A11yMapOutline";
import IntroSplash from "./IntroSplash";

/**
 * Top-level client shell. Owns the hydration gate, one-time initialization
 * (theme, intro, alerts, motion preference), and URL <-> selection sync for
 * shareable /?station=CODE deep links.
 */
export default function SubwayShell() {
  const [mounted, setMounted] = useState(false);
  const initializeTheme = useNavStore((s) => s.initializeTheme);
  const initializeIntro = useNavStore((s) => s.initializeIntro);
  const initializeAlerts = useNavStore((s) => s.initializeAlerts);
  const setReducedMotion = useNavStore((s) => s.setReducedMotion);
  const selectStation = useNavStore((s) => s.selectStation);
  const setHoveredStation = useNavStore((s) => s.setHoveredStation);
  const selectedStationCode = useNavStore((s) => s.selectedStationCode);
  const setViewMode = useNavStore((s) => s.setViewMode);
  const isMobile = useIsMobile();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    initializeTheme();
    initializeIntro();
    initializeAlerts();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    // Deep link: open the station named in ?station=CODE.
    const param = new URLSearchParams(window.location.search).get("station");
    if (param && getStation(param)) selectStation(param);

    // Track visitor stats once per session (carried over from the old app).
    const hasTracked = sessionStorage.getItem("aldrich-stats-tracked");
    if (!hasTracked) {
      fetch("/api/stats", { method: "POST" }).catch((error: unknown) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to track stats:", error);
        }
      });
      sessionStorage.setItem("aldrich-stats-tracked", "true");
    }

    return () => mq.removeEventListener("change", onChange);
  }, [
    initializeTheme,
    initializeIntro,
    initializeAlerts,
    setReducedMotion,
    selectStation,
  ]);

  // Keep the URL in sync with the selected station (shareable deep links).
  useEffect(() => {
    if (!mounted) return;
    const url = new URL(window.location.href);
    if (selectedStationCode) {
      url.searchParams.set("station", selectedStationCode);
    } else {
      url.searchParams.delete("station");
    }
    window.history.replaceState(null, "", url.toString());
  }, [mounted, selectedStationCode]);

  // Mobile gets the vertical strip map; desktop gets the pan/zoom SVG.
  useEffect(() => {
    setViewMode(isMobile ? "strip" : "map");
  }, [isMobile, setViewMode]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--metro-bg)]">
        <div className="text-[var(--metro-ink-dim)]">Loading map…</div>
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[var(--metro-bg)]">
      {isMobile ? (
        <StripMapView />
      ) : (
        <>
          <SubwayMap />
          <StationIndex />
          <DepartureBoard />
          <RecenterButton />
          <A11yMapOutline onSelect={selectStation} onHover={setHoveredStation} />
        </>
      )}
      <ServiceAlertBanner />
      <StationPanel />
      <IntroSplash />
    </main>
  );
}
