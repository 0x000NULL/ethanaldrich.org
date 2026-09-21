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

  // Hand over from the server-rendered outline only once the map can actually
  // draw. Until then we render nothing and the outline stays visible, so the
  // homepage never ships a "Loading map…" placeholder as its only content.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.mapReady = "true";
    return () => {
      delete document.documentElement.dataset.mapReady;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden bg-[var(--metro-bg)]">
      {/* Desktop tab order is legend → departure board → recenter → station list,
          so without this a keyboard user tabs through all the chrome every time.
          Focusing a station in that list also mirrors to the visual map. */}
      <a href={isMobile ? "#strip-list" : "#station-list"} className="skip-link">
        Skip to station list
      </a>
      {/* In flow, not floating: the banner reserves its own row so it can never
          cover the legend, the strip-view header, or the top of the map. */}
      <ServiceAlertBanner />
      <div className="relative flex-1 overflow-hidden">
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
        <StationPanel />
      </div>
      <IntroSplash />
    </main>
  );
}
