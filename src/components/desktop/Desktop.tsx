"use client";

import { useDesktopStore, WindowId } from "@/store/desktop-store";
import DesktopIcon from "./DesktopIcon";
import StatusBar from "./StatusBar";
import Window from "./Window";
import AboutSection from "@/components/sections/AboutSection";
import CareerSection from "@/components/sections/CareerSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import BlogSection from "@/components/sections/BlogSection";
import SnakeGame from "@/components/games/SnakeGame";

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
  games: <SnakeGame />,
};

const windowTitles: Record<WindowId, string> = {
  about: "ABOUT.EXE - Ethan Aldrich",
  career: "CAREER.EXE - Work Experience",
  projects: "PROJECTS.EXE - My Projects",
  skills: "SKILLS.DAT - Technical Skills",
  contact: "CONTACT.COM - Get In Touch",
  blog: "BLOG.TXT - Technical Write-ups",
  games: "GAMES.EXE - Snake",
};

export default function Desktop() {
  const { windows, openWindow, activeWindowId } = useDesktopStore();

  const handleIconClick = (id: WindowId) => {
    openWindow(id);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#000040]">
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
    </div>
  );
}
