"use client";

import { useEffect, useState } from "react";

interface ShutdownScreenProps {
  onRestart?: () => void;
}

export default function ShutdownScreen({ onRestart }: ShutdownScreenProps) {
  const [showRestartHint, setShowRestartHint] = useState(false);

  useEffect(() => {
    // Show restart hint after 3 seconds
    const timer = setTimeout(() => {
      setShowRestartHint(true);
    }, 3000);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Any key restarts
      if (onRestart) {
        onRestart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onRestart]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center cursor-pointer"
      style={{ backgroundColor: "#FF6600" }}
      onClick={onRestart}
    >
      <div className="text-center">
        {/* Windows logo style text */}
        <div className="mb-8">
          <span
            className="text-4xl font-bold italic"
            style={{
              color: "#FFFFFF",
              textShadow: "2px 2px 0 #000000",
            }}
          >
            Windows
          </span>
        </div>

        {/* Main message */}
        <div
          className="text-2xl font-bold"
          style={{ color: "#000000" }}
        >
          It&apos;s now safe to turn off
        </div>
        <div
          className="text-2xl font-bold"
          style={{ color: "#000000" }}
        >
          your computer.
        </div>

        {/* Restart hint */}
        {showRestartHint && (
          <div
            className="mt-8 text-sm animate-pulse"
            style={{ color: "#000000" }}
          >
            Click anywhere or press any key to restart...
          </div>
        )}
      </div>
    </div>
  );
}
