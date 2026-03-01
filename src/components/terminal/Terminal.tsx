"use client";

import { useState, useEffect } from "react";
import { useDesktopStore } from "@/store/desktop-store";
import { commands, CommandContext } from "./commands";
import { useTerminalInput } from "./hooks/useTerminalInput";

interface TerminalProps {
  onClose: () => void;
}

const INITIAL_HISTORY = [
  "ALDRICH DOS v4.20",
  "Copyright (C) 2026 Aldrich Systems, Inc.",
  "",
  'Type "HELP" for available commands.',
  "",
];

export default function Terminal({ onClose }: TerminalProps) {
  const { openWindow, setAppState, setTerminalOpen } = useDesktopStore();
  const [history, setHistory] = useState<string[]>(INITIAL_HISTORY);

  const { input, setInput, inputRef, outputRef, scrollToBottom, focusInput } =
    useTerminalInput({ onEscape: onClose });

  // Scroll to bottom when history changes
  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const context: CommandContext = {
    openWindow,
    setAppState,
    setTerminalOpen,
  };

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toUpperCase();
    const parts = command.split(/\s+/);
    const baseCommand = parts[0];
    const args = parts.slice(1).join(" ");

    // Handle empty command
    if (!baseCommand) {
      setHistory((prev) => [...prev, `C:\\ALDRICH>${cmd}`]);
      setInput("");
      return;
    }

    const handler = commands[baseCommand];

    if (!handler) {
      setHistory((prev) => [
        ...prev,
        `C:\\ALDRICH>${cmd}`,
        "",
        `Bad command or file name: ${cmd}`,
        "",
      ]);
      setInput("");
      return;
    }

    const result = handler(args, context);

    // Handle clear screen
    if (result.shouldClear) {
      setHistory([]);
      setInput("");
      return;
    }

    // Handle close
    if (result.shouldClose) {
      onClose();
      return;
    }

    // Update history with output
    setHistory((prev) => [...prev, `C:\\ALDRICH>${cmd}`, ...result.output]);
    setInput("");

    // Handle delayed action
    if (result.delayedAction) {
      setTimeout(result.delayedAction, 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col font-mono"
      onClick={focusInput}
    >
      {/* Terminal header */}
      <div className="bg-[var(--bios-bg)] text-white px-4 py-1 flex justify-between items-center">
        <span>ALDRICH DOS Terminal</span>
        <button
          onClick={onClose}
          className="px-2 hover:bg-white hover:text-[var(--bios-bg)] text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          aria-label="Close terminal"
        >
          [X]
        </button>
      </div>

      {/* Terminal output */}
      <div
        ref={outputRef}
        className="flex-1 bg-black text-[var(--bios-text)] p-4 overflow-auto text-sm leading-relaxed"
      >
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex">
          <span className="text-[var(--bios-text)]">C:\ALDRICH&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-[var(--bios-text)] outline-none ml-1 caret-[var(--bios-text)] focus-visible:ring-1 focus-visible:ring-[var(--bios-text)]"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <span className="animate-pulse text-[var(--bios-text)]">_</span>
        </form>
      </div>

      {/* Footer hint */}
      <div className="bg-[var(--bios-bg)] text-[var(--bios-text)] px-4 py-1 text-xs">
        Press ESC to close | Type HELP for commands
      </div>
    </div>
  );
}
