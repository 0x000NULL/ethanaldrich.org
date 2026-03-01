"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

interface KonamiOverlayProps {
  show: boolean;
  onClose: () => void;
}

export default function KonamiOverlay({ show, onClose }: KonamiOverlayProps) {
  // Track visibility with a ref to avoid setState in effect
  const visibleRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use useSyncExternalStore for visibility state without effect setState
  const visible = useSyncExternalStore(
    (callback) => {
      // Check and update visibility based on show prop
      if (show && !visibleRef.current) {
        visibleRef.current = true;
        callback();
      } else if (!show && visibleRef.current) {
        timeoutRef.current = setTimeout(() => {
          visibleRef.current = false;
          callback();
        }, 500);
      }
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    },
    () => visibleRef.current,
    () => false
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
      role="dialog"
      aria-label="Turbo Mode Activated"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-fuchsia-900 to-cyan-900 animate-pulse" />

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      {/* Content */}
      <div className="relative text-center z-10">
        <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-500 animate-pulse mb-4">
          TURBO MODE
        </div>
        <div className="text-2xl md:text-4xl text-cyan-300 mb-2">
          ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
        </div>
        <div className="text-xl md:text-2xl text-fuchsia-300 mb-4">
          UNLOCKED!
        </div>
        <div className="text-cyan-400 space-y-1 text-sm md:text-base">
          <div>↑ ↑ ↓ ↓ ← → ← → B A</div>
          <div className="text-fuchsia-300">New theme available in CMOS Setup</div>
        </div>

        {/* Decorative pixels */}
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 animate-bounce"
              style={{
                backgroundColor: `hsl(${i * 36}, 100%, 60%)`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
