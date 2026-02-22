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
  const { windows, closeWindow, focusWindow, moveWindow } = useDesktopStore();
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

  if (!windowState?.isOpen) return null;

  const handleClose = () => {
    closeWindow(id);
  };

  const handleFocus = () => {
    focusWindow(id);
  };

  // Mobile: full screen windows
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-[#C0C0C0]"
        onClick={handleFocus}
      >
        {/* Title bar */}
        <div className="chrome-raised h-8 flex items-center justify-between px-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 chrome-raised" />
            <span className="text-sm font-bold text-black">{title}</span>
          </div>
          <button
            onClick={handleClose}
            className="w-6 h-6 chrome-raised flex items-center justify-center text-black font-bold text-sm hover:bg-[#808080] active:chrome-sunken"
            aria-label="Close window"
          >
            ×
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 chrome-sunken m-1 overflow-auto bg-[#0000AA] text-black p-4">
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
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        initial={{ x: windowState.position.x, y: windowState.position.y }}
        onDragEnd={(_, info) => {
          moveWindow(id, {
            x: windowState.position.x + info.offset.x,
            y: windowState.position.y + info.offset.y,
          });
        }}
        onClick={handleFocus}
        style={{
          zIndex: windowState.zIndex,
          minWidth,
          minHeight,
        }}
        className="fixed chrome-raised flex flex-col shadow-lg"
      >
        {/* Title bar - drag handle */}
        <div
          className="h-8 flex items-center justify-between px-2 cursor-move select-none shrink-0"
          style={{
            background: "linear-gradient(90deg, #000080, #1084d0)",
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
          className="flex-1 chrome-sunken m-1 overflow-auto bg-[#0000AA] text-black p-4"
          style={{ maxHeight: "calc(100vh - 200px)", maxWidth: "calc(100vw - 100px)" }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
