"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDesktopStore, WindowId } from "@/store/desktop-store";
import { useKonamiCode } from "@/lib/useKonamiCode";
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

interface IconConfig {
  id: WindowId;
  label: string;
  filename: string;
  iconSrc: string;
}

const icons: IconConfig[] = [
  { id: "about", label: "ABOUT.EXE", filename: "About Me", iconSrc: "/icons/about.svg" },
  { id: "career", label: "CAREER.EXE", filename: "Experience", iconSrc: "/icons/career.svg" },
  { id: "projects", label: "PROJECTS.EXE", filename: "Projects", iconSrc: "/icons/projects.svg" },
  { id: "skills", label: "SKILLS.DAT", filename: "Skills", iconSrc: "/icons/skills.svg" },
  { id: "contact", label: "CONTACT.COM", filename: "Contact", iconSrc: "/icons/contact.svg" },
  { id: "blog", label: "BLOG.TXT", filename: "Blog", iconSrc: "/icons/blog.svg" },
  { id: "games", label: "GAMES.EXE", filename: "Games", iconSrc: "/icons/games.svg" },
];

const windowContents: Record<WindowId, React.ReactNode> = {
  about: <AboutSection />,
  career: <CareerSection />,
  projects: <ProjectsSection />,
  skills: <SkillsSection />,
  contact: <ContactSection />,
  blog: <BlogSection />,
  games: <GameSelector />,
};

const windowTitles: Record<WindowId, string> = {
  about: "ABOUT.EXE - Ethan Aldrich",
  career: "CAREER.EXE - Work Experience",
  projects: "PROJECTS.EXE - My Projects",
  skills: "SKILLS.DAT - Technical Skills",
  contact: "CONTACT.COM - Get In Touch",
  blog: "BLOG.TXT - Technical Write-ups",
  games: "GAMES.EXE - Games Collection",
};

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
  const [isMobile, setIsMobile] = useState(false);
  const [screensaverActive, setScreensaverActive] = useState(false);
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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Screensaver timer
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current >= SCREENSAVER_TIMEOUT && !screensaverActive && !terminalOpen) {
        setScreensaverActive(true);
      }
    };

    // Check every 5 seconds
    screensaverTimerRef.current = setInterval(checkInactivity, 5000);

    // Listen for activity
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      if (screensaverTimerRef.current) {
        clearInterval(screensaverTimerRef.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [screensaverActive, terminalOpen]);

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

  const handleIconClick = (id: WindowId) => {
    openWindow(id);
  };

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
          {icons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              label={icon.label}
              iconSrc={icon.iconSrc}
              onClick={() => handleIconClick(icon.id)}
              isActive={activeWindowId === icon.id}
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
