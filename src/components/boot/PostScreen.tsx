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
      className="fixed inset-0 bg-bios text-bios p-4 font-mono overflow-hidden cursor-pointer"
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
          className="absolute top-4 right-4 px-3 py-1 text-sm border border-bios hover:bg-bios-highlight hover:text-bios transition-colors"
          style={{
            borderColor: "var(--bios-text)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bios-text)";
            e.currentTarget.style.color = "var(--bios-bg)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--bios-text)";
          }}
        >
          Skip (ESC)
        </button>
      )}

      {/* BIOS content */}
      <div className="max-w-4xl mx-auto">
        {currentLines.map((line, index) => (
          <div key={index} className="leading-6">
            {line.type === "header" && (
              <span className="text-bios-highlight font-bold">{line.text}</span>
            )}

            {line.type === "normal" && <span>{line.text}</span>}

            {line.type === "memory" && (
              <span>
                {line.text}
                <span className="text-bios-highlight">
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
                  <span style={{ color: "var(--bios-accent)" }}>{line.highlightText}</span>
                )}
              </span>
            )}

            {line.type === "status" && (
              <span>
                {line.text}
                {line.highlightText && (
                  <span className="text-bios-success">{line.highlightText}</span>
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
