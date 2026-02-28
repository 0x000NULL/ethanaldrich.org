"use client";

import { useState, useEffect } from "react";
import { useDesktopStore } from "@/store/desktop-store";

export default function StatusBar() {
  const { windows, restoreWindow } = useDesktopStore();
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [showCursor, setShowCursor] = useState(true);

  // Get minimized windows
  const minimizedWindows = windows.filter((w) => w.isOpen && w.isMinimized);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="chrome-raised h-8 flex items-center justify-between px-4 text-sm text-black shrink-0">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <span
            className={`inline-block w-2 h-2 bg-[#228B22] ${
              showCursor ? "opacity-100" : "opacity-30"
            }`}
          />
          <span>Ready</span>
        </span>
        <span className="text-[#808080]">|</span>
        <span className="hidden sm:inline">640K conventional memory free</span>

        {/* Minimized windows */}
        {minimizedWindows.length > 0 && (
          <>
            <span className="text-[#808080]">|</span>
            <div className="flex items-center gap-1">
              {minimizedWindows.map((win) => (
                <button
                  key={win.id}
                  onClick={() => restoreWindow(win.id)}
                  className="chrome-sunken px-2 py-0.5 text-xs hover:bg-[#d0d0d0] active:chrome-raised truncate max-w-[100px]"
                  title={`Restore ${win.title}`}
                >
                  {win.title.split(" - ")[0]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">{date}</span>
        <span className="hidden sm:inline text-[#808080]">|</span>
        <span className="font-mono">{time}</span>
      </div>
    </div>
  );
}
