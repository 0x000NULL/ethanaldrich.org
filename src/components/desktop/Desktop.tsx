"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDesktopStore, WindowId } from "@/store/desktop-store";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useKonamiCode } from "@/lib/useKonamiCode";
import { throttle } from "@/lib/throttle";
import DesktopIcon from "./DesktopIcon";
import StatusBar from "./StatusBar";
import Window from "./Window";
import MobileTaskBar from "./MobileTaskBar";
import Terminal from "@/components/terminal/Terminal";
import KonamiOverlay from "@/components/effects/KonamiOverlay";
import StarfieldScreensaver from "@/components/effects/StarfieldScreensaver";
import AboutSection from "@/components/sections/AboutSection";
import CareerSection from "@/components/sections/CareerSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import BlogSection from "@/components/sections/BlogSection";
import GameSelector from "@/components/games/GameSelector";

const SCREENSAVER_TIMEOUT = 60000; // 60 seconds

interface WindowConfig {
  id: WindowId;
  label: string;
  filename: string;
  iconSrc: string;
  title: string;
  component: React.ReactNode;
}

const windowConfigs: WindowConfig[] = [
  {
    id: "about",
    label: "ABOUT.EXE",
    filename: "About Me",
    iconSrc: "/icons/about.svg",
    title: "ABOUT.EXE - Ethan Aldrich",
    component: <AboutSection />,
  },
  {
    id: "career",
    label: "CAREER.EXE",
    filename: "Experience",
    iconSrc: "/icons/career.svg",
    title: "CAREER.EXE - Work Experience",
    component: <CareerSection />,
  },
  {
    id: "projects",
    label: "PROJECTS.EXE",
    filename: "Projects",
    iconSrc: "/icons/projects.svg",
    title: "PROJECTS.EXE - My Projects",
    component: <ProjectsSection />,
  },
  {
    id: "skills",
    label: "SKILLS.DAT",
    filename: "Skills",
    iconSrc: "/icons/skills.svg",
    title: "SKILLS.DAT - Technical Skills",
    component: <SkillsSection />,
  },
  {
    id: "contact",
    label: "CONTACT.COM",
    filename: "Contact",
    iconSrc: "/icons/contact.svg",
    title: "CONTACT.COM - Get In Touch",
    component: <ContactSection />,
  },
  {
    id: "blog",
    label: "BLOG.TXT",
    filename: "Blog",
    iconSrc: "/icons/blog.svg",
    title: "BLOG.TXT - Technical Write-ups",
    component: <BlogSection />,
  },
  {
    id: "games",
    label: "GAMES.EXE",
    filename: "Games",
    iconSrc: "/icons/games.svg",
    title: "GAMES.EXE - Games Collection",
    component: <GameSelector />,
  },
];

// Build lookup maps from unified config
const windowTitles = Object.fromEntries(
  windowConfigs.map((w) => [w.id, w.title])
) as Record<WindowId, string>;

const windowContents = Object.fromEntries(
  windowConfigs.map((w) => [w.id, w.component])
) as Record<WindowId, React.ReactNode>;

export default function Desktop() {
  const {
    windows,
    openWindow,
    activeWindowId,
    terminalOpen,
    setTerminalOpen,
    setTurboUnlocked,
    initializeEasterEggs,
    setAppState,
  } = useDesktopStore();
  const isMobile = useIsMobile();
  const [screensaverActive, setScreensaverActive] = useState(false);
  // eslint-disable-next-line react-hooks/purity -- useRef initial value is only computed once
  const lastActivityRef = useRef(Date.now());
  const screensaverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset activity timer
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (screensaverActive) {
      setScreensaverActive(false);
    }
  }, [screensaverActive]);

  // Initialize easter egg state on mount
  useEffect(() => {
    initializeEasterEggs();
  }, [initializeEasterEggs]);

  // Konami code hook
  const { showOverlay, hideOverlay } = useKonamiCode(() => {
    setTurboUnlocked(true);
  });

  // Throttled activity handler for mousemove (100ms throttle)
  const throttledHandleActivity = useMemo(
    () =>
      throttle(() => {
        // eslint-disable-next-line react-hooks/purity -- event callback, not called during render
        lastActivityRef.current = Date.now();
      }, 100),
    []
  );

  // Non-throttled activity handler for discrete events
  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Screensaver timer
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      if (
        now - lastActivityRef.current >= SCREENSAVER_TIMEOUT &&
        !screensaverActive &&
        !terminalOpen
      ) {
        setScreensaverActive(true);
      }
    };

    // Check every 5 seconds
    screensaverTimerRef.current = setInterval(checkInactivity, 5000);

    // Listen for activity - throttle mousemove, immediate for others
    window.addEventListener("mousemove", throttledHandleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      if (screensaverTimerRef.current) {
        clearInterval(screensaverTimerRef.current);
      }
      window.removeEventListener("mousemove", throttledHandleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [screensaverActive, terminalOpen, throttledHandleActivity, handleActivity]);

  // Terminal shortcut (backtick key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && !terminalOpen) {
        e.preventDefault();
        setTerminalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [terminalOpen, setTerminalOpen]);

  const handleIconClick = useCallback((id: WindowId) => {
    openWindow(id);
  }, [openWindow]);

  const hasOpenWindows = windows.some((w) => w.isOpen);

  return (
    <div className="fixed inset-0 flex flex-col bg-desktop">
      {/* Header */}
      <div className="chrome-raised h-8 flex items-center px-4 shrink-0">
        <span className="text-sm font-bold text-black">
          ALDRICH OS v1.0 — Personal Desktop
        </span>
      </div>

      {/* Desktop area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Icon grid */}
        <div className="absolute inset-4 flex flex-wrap content-start gap-2">
          {windowConfigs.map((config) => (
            <DesktopIcon
              key={config.id}
              label={config.label}
              iconSrc={config.iconSrc}
              onClick={() => handleIconClick(config.id)}
              isActive={activeWindowId === config.id}
            />
          ))}
          {/* Shutdown icon - special handling */}
          <DesktopIcon
            label="SHUTDOWN.EXE"
            iconSrc="/icons/shutdown.svg"
            onClick={() => setAppState("shutdown")}
            isActive={false}
          />
        </div>

        {/* Windows */}
        {windows.map((window) => (
          <Window
            key={window.id}
            id={window.id}
            title={windowTitles[window.id]}
          >
            {windowContents[window.id]}
          </Window>
        ))}
      </div>

      {/* Status bar */}
      <StatusBar />

      {/* Mobile task bar */}
      {isMobile && hasOpenWindows && <MobileTaskBar />}

      {/* Terminal overlay */}
      {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}

      {/* Konami code overlay */}
      <KonamiOverlay show={showOverlay} onClose={hideOverlay} />

      {/* Screensaver */}
      {screensaverActive && (
        <StarfieldScreensaver onDismiss={resetActivity} />
      )}
    </div>
  );
}
