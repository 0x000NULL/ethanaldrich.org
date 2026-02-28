"use client";

import { useDesktopStore, WindowId } from "@/store/desktop-store";

const windowLabels: Record<WindowId, string> = {
  about: "ABOUT",
  career: "CAREER",
  projects: "PROJECTS",
  skills: "SKILLS",
  contact: "CONTACT",
  blog: "BLOG",
  games: "GAMES",
};

export default function MobileTaskBar() {
  const { windows, focusWindow, closeWindow, activeWindowId } = useDesktopStore();

  const openWindows = windows.filter((w) => w.isOpen);

  if (openWindows.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] chrome-raised">
      <div className="flex items-center gap-1 p-1 overflow-x-auto">
        {openWindows.map((window) => (
          <div
            key={window.id}
            className={`flex items-center gap-1 shrink-0 ${
              activeWindowId === window.id
                ? "chrome-sunken bg-white/20"
                : "chrome-raised"
            }`}
          >
            <button
              onClick={() => focusWindow(window.id)}
              className="px-3 py-2 text-xs font-bold text-black min-w-[80px] min-h-[44px] touch-manipulation"
              aria-label={`Switch to ${windowLabels[window.id]}`}
            >
              {windowLabels[window.id]}
            </button>
            <button
              onClick={() => closeWindow(window.id)}
              className="px-2 py-2 text-black font-bold hover:bg-[#ff0000] hover:text-white min-w-[44px] min-h-[44px] touch-manipulation flex items-center justify-center"
              aria-label={`Close ${windowLabels[window.id]}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
