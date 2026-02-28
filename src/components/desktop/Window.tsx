"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WindowId, useDesktopStore } from "@/store/desktop-store";

interface WindowProps {
  id: WindowId;
  title: string;
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
}

export default function Window({
  id,
  title,
  children,
  minWidth = 400,
  minHeight = 300,
}: WindowProps) {
  const { windows, closeWindow, focusWindow, moveWindow, minimizeWindow, maximizeWindow } = useDesktopStore();
  const windowState = windows.find((w) => w.id === id);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render if not open or if minimized
  if (!windowState?.isOpen || windowState?.isMinimized) return null;

  const handleClose = () => {
    closeWindow(id);
  };

  const handleFocus = () => {
    focusWindow(id);
  };

  const handleMinimize = () => {
    minimizeWindow(id);
  };

  const handleMaximize = () => {
    maximizeWindow(id);
  };

  // Mobile: full screen windows
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-[#C0C0C0]"
        onClick={handleFocus}
      >
        {/* Title bar */}
        <div className="chrome-raised h-12 flex items-center justify-between px-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 chrome-raised" />
            <span className="text-sm font-bold text-black truncate max-w-[200px]">{title}</span>
          </div>
          <button
            onClick={handleClose}
            className="w-11 h-11 chrome-raised flex items-center justify-center text-black font-bold text-lg hover:bg-[#808080] active:chrome-sunken touch-manipulation"
            aria-label="Close window"
          >
            ×
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 chrome-sunken m-1 overflow-auto bg-bios text-black p-4">
          {children}
        </div>
      </div>
    );
  }

  // Desktop: draggable windows
  return (
    <>
      {/* Constraints container */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />

      <motion.div
        drag={!windowState.isMaximized}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        initial={{ x: windowState.position.x, y: windowState.position.y }}
        animate={windowState.isMaximized ? { x: 0, y: 0 } : { x: windowState.position.x, y: windowState.position.y }}
        onDragEnd={(_, info) => {
          if (!windowState.isMaximized) {
            moveWindow(id, {
              x: windowState.position.x + info.offset.x,
              y: windowState.position.y + info.offset.y,
            });
          }
        }}
        onClick={handleFocus}
        style={{
          zIndex: windowState.zIndex,
          minWidth: windowState.isMaximized ? undefined : minWidth,
          minHeight: windowState.isMaximized ? undefined : minHeight,
          width: windowState.isMaximized ? "100vw" : undefined,
          height: windowState.isMaximized ? "calc(100vh - 64px)" : undefined,
        }}
        className={`fixed chrome-raised flex flex-col shadow-lg ${windowState.isMaximized ? "inset-0" : ""}`}
      >
        {/* Title bar - drag handle */}
        <div
          className="h-8 flex items-center justify-between px-2 cursor-move select-none shrink-0"
          style={{
            background: "linear-gradient(90deg, var(--titlebar-start), var(--titlebar-end))",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 chrome-raised" />
            <span className="text-sm font-bold text-white">{title}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMinimize();
              }}
              className="w-6 h-6 chrome-raised flex items-center justify-center text-black font-bold text-sm hover:bg-[#d0d0d0] active:chrome-sunken"
              aria-label="Minimize window"
            >
              _
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
              className="w-6 h-6 chrome-raised flex items-center justify-center text-black font-bold text-xs hover:bg-[#d0d0d0] active:chrome-sunken"
              aria-label={windowState.isMaximized ? "Restore window" : "Maximize window"}
            >
              {windowState.isMaximized ? "◱" : "□"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="w-6 h-6 chrome-raised flex items-center justify-center text-black font-bold text-sm hover:bg-[#d0d0d0] active:chrome-sunken"
              aria-label="Close window"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content area */}
        <div
          className="flex-1 chrome-sunken m-1 overflow-auto bg-bios text-black p-4"
          style={windowState.isMaximized
            ? { maxHeight: "calc(100vh - 100px)", maxWidth: "100%" }
            : { maxHeight: "calc(100vh - 200px)", maxWidth: "calc(100vw - 100px)" }
          }
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
