"use client";

import { useEffect } from "react";
import { useBootSequence } from "@/lib/useBootSequence";
import { MEMORY_TARGET } from "@/data/boot-sequence";

interface PostScreenProps {
  onComplete: () => void;
  onEnterSetup: () => void;
}

export default function PostScreen({ onComplete, onEnterSetup }: PostScreenProps) {
  const {
    bootState,
    currentLines,
    memoryValue,
    memoryComplete,
    showPrompt,
    startBoot,
    skipBoot,
    proceedToDesktop,
    enterSetup,
  } = useBootSequence();

  // Start boot on mount
  useEffect(() => {
    startBoot();
  }, [startBoot]);

  // Notify parent when boot completes
  useEffect(() => {
    if (bootState === "complete") {
      onComplete();
    } else if (bootState === "setup") {
      onEnterSetup();
    }
  }, [bootState, onComplete, onEnterSetup]);

  const handleClick = () => {
    if (bootState === "booting") {
      skipBoot();
    } else if (bootState === "waiting") {
      proceedToDesktop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (bootState === "waiting") {
      if (e.key === "Delete") {
        enterSetup();
      } else {
        proceedToDesktop();
      }
    }
  };

  const formatMemory = (kb: number) => {
    return kb.toString().padStart(7, " ") + " KB OK";
  };

  return (
    <div
      className="fixed inset-0 bg-[#0000AA] text-[#AAAAAA] p-4 font-mono overflow-hidden cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Boot screen - click or press any key to continue"
    >
      {/* Skip button */}
      {bootState === "booting" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            skipBoot();
          }}
          className="absolute top-4 right-4 px-3 py-1 text-sm border border-[#AAAAAA] hover:bg-[#AAAAAA] hover:text-[#0000AA] transition-colors"
        >
          Skip (ESC)
        </button>
      )}

      {/* BIOS content */}
      <div className="max-w-4xl mx-auto">
        {currentLines.map((line, index) => (
          <div key={index} className="leading-6">
            {line.type === "header" && (
              <span className="text-white font-bold">{line.text}</span>
            )}

            {line.type === "normal" && <span>{line.text}</span>}

            {line.type === "memory" && (
              <span>
                {line.text}
                <span className="text-white">
                  {memoryComplete
                    ? formatMemory(MEMORY_TARGET)
                    : formatMemory(memoryValue)}
                </span>
              </span>
            )}

            {line.type === "detection" && (
              <span>
                {line.text}
                {line.highlightText && (
                  <span className="text-[#000000]">{line.highlightText}</span>
                )}
              </span>
            )}

            {line.type === "status" && (
              <span>
                {line.text}
                {line.highlightText && (
                  <span className="text-[#228B22]">{line.highlightText}</span>
                )}
              </span>
            )}

            {line.type === "prompt" && showPrompt && (
              <span className="blink">{line.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* Accessibility hint */}
      <div className="sr-only" role="status" aria-live="polite">
        {bootState === "waiting"
          ? "Boot complete. Press any key to continue or Delete to enter setup."
          : "Loading..."}
      </div>
    </div>
  );
}
