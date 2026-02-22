"use client";

import { useState, useEffect } from "react";
import { useDesktopStore, ThemeVariant } from "@/store/desktop-store";

interface CmosSetupProps {
  onExit: () => void;
}

type MenuSection =
  | "main"
  | "standard"
  | "advanced"
  | "boot"
  | "load-defaults"
  | "save-exit";

interface MenuItem {
  id: MenuSection;
  label: string;
}

const mainMenuItems: MenuItem[] = [
  { id: "standard", label: "Standard CMOS Features" },
  { id: "advanced", label: "Advanced Settings" },
  { id: "boot", label: "Boot Priority" },
  { id: "load-defaults", label: "Load Optimized Defaults" },
  { id: "save-exit", label: "Save & Exit Setup" },
];

const personalStats = [
  { label: "Coffee Consumed", value: "∞ cups" },
  { label: "Lines of Code", value: "Over 9000" },
  { label: "Tabs vs Spaces", value: "Tabs (obviously)" },
  { label: "Favorite OS", value: "Linux (btw)" },
  { label: "Sleep Mode", value: "Disabled" },
  { label: "Patience Level", value: "Depends on WiFi speed" },
  { label: "Bug Count", value: "They're features now" },
  { label: "Stack Overflow Visits", value: "Daily" },
];

const themeOptions: { id: ThemeVariant; label: string; preview: string }[] = [
  { id: "blue", label: "Classic Blue", preview: "#0000AA" },
  { id: "green", label: "Green Phosphor", preview: "#003300" },
  { id: "amber", label: "Amber CRT", preview: "#331100" },
];

export default function CmosSetup({ onExit }: CmosSetupProps) {
  const [currentSection, setCurrentSection] = useState<MenuSection>("main");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, setTheme } = useDesktopStore();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowDown":
          if (currentSection === "main") {
            setSelectedIndex((prev) =>
              Math.min(mainMenuItems.length - 1, prev + 1)
            );
          } else if (currentSection === "advanced") {
            setSelectedIndex((prev) =>
              Math.min(themeOptions.length - 1, prev + 1)
            );
          }
          break;
        case "Enter":
          if (currentSection === "main") {
            const item = mainMenuItems[selectedIndex];
            if (item.id === "save-exit") {
              onExit();
            } else if (item.id === "load-defaults") {
              setTheme("blue");
              setSelectedIndex(0);
            } else {
              setCurrentSection(item.id);
              setSelectedIndex(0);
            }
          } else if (currentSection === "advanced") {
            setTheme(themeOptions[selectedIndex].id);
          }
          break;
        case "Escape":
          if (currentSection !== "main") {
            setCurrentSection("main");
            setSelectedIndex(0);
          } else {
            onExit();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection, selectedIndex, onExit, setTheme]);

  const renderMainMenu = () => (
    <div className="flex">
      {/* Menu */}
      <div className="w-1/2 border-r border-[#AAAAAA] pr-4">
        {mainMenuItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedIndex(index);
              if (item.id === "save-exit") {
                onExit();
              } else if (item.id === "load-defaults") {
                setTheme("blue");
              } else {
                setCurrentSection(item.id);
              }
            }}
            className={`py-1 px-2 cursor-pointer ${
              selectedIndex === index
                ? "bg-[#AAAAAA] text-[#0000AA]"
                : "hover:bg-[#000080]"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="w-1/2 pl-4 text-sm">
        <div className="text-[#000000] mb-2">Item Help</div>
        <p className="text-[#AAAAAA]">
          {selectedIndex === 0 &&
            "View system specifications and personal stats."}
          {selectedIndex === 1 &&
            "Configure advanced options including theme settings."}
          {selectedIndex === 2 && "Set the boot priority order for sections."}
          {selectedIndex === 3 &&
            "Reset all settings to their default values."}
          {selectedIndex === 4 && "Save changes and exit to desktop."}
        </p>
      </div>
    </div>
  );

  const renderStandardCmos = () => (
    <div>
      <div className="text-[#228B22] mb-4">► System Specifications</div>
      <table className="w-full text-sm">
        <tbody>
          {personalStats.map((stat, index) => (
            <tr key={index}>
              <td className="text-[#000000] pr-4 py-1">{stat.label}:</td>
              <td className="text-white py-1">{stat.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-[#606060] text-xs">Press ESC to return</div>
    </div>
  );

  const renderAdvanced = () => (
    <div>
      <div className="text-[#228B22] mb-4">► Theme Configuration</div>
      <div className="space-y-2">
        {themeOptions.map((option, index) => (
          <div
            key={option.id}
            onClick={() => {
              setSelectedIndex(index);
              setTheme(option.id);
            }}
            className={`flex items-center gap-4 py-1 px-2 cursor-pointer ${
              selectedIndex === index
                ? "bg-[#AAAAAA] text-[#0000AA]"
                : "hover:bg-[#000080]"
            }`}
          >
            <div
              className="w-6 h-4 border border-[#AAAAAA]"
              style={{ background: option.preview }}
            />
            <span>{option.label}</span>
            {theme === option.id && (
              <span className="text-[#228B22] ml-auto">[ACTIVE]</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-[#606060] text-xs">
        Press Enter to select | ESC to return
      </div>
    </div>
  );

  const renderBootPriority = () => (
    <div>
      <div className="text-[#228B22] mb-4">► Boot Priority Order</div>
      <div className="text-sm space-y-1">
        <div>1. [ABOUT.EXE] — Personal Information</div>
        <div>2. [CAREER.EXE] — Work Experience</div>
        <div>3. [PROJECTS.EXE] — Project Portfolio</div>
        <div>4. [SKILLS.DAT] — Technical Skills</div>
        <div>5. [CONTACT.COM] — Contact Information</div>
        <div>6. [BLOG.TXT] — Technical Blog</div>
      </div>
      <div className="mt-4 text-[#606060] text-xs">
        Feature coming soon! Press ESC to return
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0000AA] text-[#AAAAAA] p-4 font-mono overflow-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-[#000000] text-lg">
          ╔══════════════════════════════════════════════════════════╗
        </div>
        <div className="text-[#000000] text-lg">
          ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ALDRICH
          BIOS SETUP UTILITY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        </div>
        <div className="text-[#000000] text-lg">
          ╚══════════════════════════════════════════════════════════╝
        </div>
      </div>

      {/* Breadcrumb */}
      {currentSection !== "main" && (
        <div className="mb-4 text-sm">
          <span
            className="text-[#228B22] cursor-pointer hover:underline"
            onClick={() => {
              setCurrentSection("main");
              setSelectedIndex(0);
            }}
          >
            Main Menu
          </span>
          <span className="text-[#606060]"> → </span>
          <span className="text-white">
            {mainMenuItems.find((m) => m.id === currentSection)?.label ||
              currentSection}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="border border-[#AAAAAA] p-4 min-h-[300px]">
        {currentSection === "main" && renderMainMenu()}
        {currentSection === "standard" && renderStandardCmos()}
        {currentSection === "advanced" && renderAdvanced()}
        {currentSection === "boot" && renderBootPriority()}
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-sm text-[#606060]">
        <div>↑↓ Navigate | Enter Select | ESC Exit</div>
        <div>ALDRICH BIOS v4.20</div>
      </div>

      {/* Exit button for mouse users */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 px-3 py-1 text-sm border border-[#AAAAAA] hover:bg-[#AAAAAA] hover:text-[#0000AA] transition-colors"
      >
        Exit to Desktop
      </button>
    </div>
  );
}
