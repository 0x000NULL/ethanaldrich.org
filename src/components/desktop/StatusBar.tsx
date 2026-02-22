"use client";

import { useState, useEffect } from "react";

export default function StatusBar() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [showCursor, setShowCursor] = useState(true);

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
        <span>640K conventional memory free</span>
      </div>
      <div className="flex items-center gap-4">
        <span>{date}</span>
        <span className="text-[#808080]">|</span>
        <span className="font-mono">{time}</span>
      </div>
    </div>
  );
}
