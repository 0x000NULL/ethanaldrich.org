"use client";

import { useState, useEffect, useRef } from "react";
import { useDesktopStore, WindowId } from "@/store/desktop-store";

interface TerminalProps {
  onClose: () => void;
}

interface FileEntry {
  name: string;
  ext: string;
  size: string;
  date: string;
  type: "file" | "dir";
}

const FILES: FileEntry[] = [
  { name: ".", ext: "", size: "<DIR>", date: "02-28-2026", type: "dir" },
  { name: "..", ext: "", size: "<DIR>", date: "02-28-2026", type: "dir" },
  { name: "ABOUT", ext: "EXE", size: "4,096", date: "02-28-2026", type: "file" },
  { name: "CAREER", ext: "EXE", size: "8,192", date: "02-28-2026", type: "file" },
  { name: "PROJECTS", ext: "EXE", size: "16,384", date: "02-28-2026", type: "file" },
  { name: "SKILLS", ext: "DAT", size: "32,768", date: "02-28-2026", type: "file" },
  { name: "CONTACT", ext: "COM", size: "2,048", date: "02-28-2026", type: "file" },
  { name: "BLOG", ext: "TXT", size: "65,536", date: "02-28-2026", type: "file" },
  { name: "GAMES", ext: "EXE", size: "12,288", date: "02-28-2026", type: "file" },
  { name: "README", ext: "TXT", size: "1,024", date: "02-28-2026", type: "file" },
  { name: "AUTOEXEC", ext: "BAT", size: "512", date: "02-28-2026", type: "file" },
  { name: "CONFIG", ext: "SYS", size: "256", date: "02-28-2026", type: "file" },
];

// Map program names to window IDs
const PROGRAM_MAP: Record<string, WindowId> = {
  "ABOUT": "about",
  "ABOUT.EXE": "about",
  "CAREER": "career",
  "CAREER.EXE": "career",
  "PROJECTS": "projects",
  "PROJECTS.EXE": "projects",
  "SKILLS": "skills",
  "SKILLS.DAT": "skills",
  "CONTACT": "contact",
  "CONTACT.COM": "contact",
  "BLOG": "blog",
  "BLOG.TXT": "blog",
  "GAMES": "games",
  "GAMES.EXE": "games",
};

// File contents for TYPE command
const FILE_CONTENTS: Record<string, string[]> = {
  "README.TXT": [
    "╔════════════════════════════════════════╗",
    "║     ALDRICH PORTFOLIO SYSTEM v1.0      ║",
    "╚════════════════════════════════════════╝",
    "",
    "Welcome to my portfolio system!",
    "",
    "QUICK START:",
    "  RUN ABOUT.EXE    - Learn about me",
    "  RUN CAREER.EXE   - View my experience",
    "  RUN PROJECTS.EXE - See my projects",
    "  RUN GAMES.EXE    - Play some games!",
    "",
    "Type HELP for all available commands.",
    "",
    "- Ethan Aldrich",
  ],
  "AUTOEXEC.BAT": [
    "@ECHO OFF",
    "SET PATH=C:\\ALDRICH;C:\\DOS",
    "SET PROMPT=$P$G",
    "SET TEMP=C:\\TEMP",
    "ECHO.",
    "ECHO Loading ALDRICH Portfolio System...",
    "ECHO.",
    "MODE CON COLS=80 LINES=25",
  ],
  "CONFIG.SYS": [
    "DEVICE=C:\\DOS\\HIMEM.SYS",
    "DEVICE=C:\\DOS\\EMM386.EXE NOEMS",
    "DOS=HIGH,UMB",
    "FILES=40",
    "BUFFERS=30",
    "STACKS=9,256",
    "LASTDRIVE=Z",
  ],
};

const HELP_TEXT = `
Available commands:
  DIR         - Display directory contents
  CLS         - Clear the screen
  VER         - Display DOS version
  DATE        - Display current date
  TIME        - Display current time
  HELP        - Display this help message
  EXIT        - Close terminal

  RUN [prog]  - Run a program (e.g., RUN ABOUT.EXE)
  TYPE [file] - Display file contents
  CD [dir]    - Change directory
  CALC [expr] - Calculator (e.g., CALC 2+2)
  SHUTDOWN    - Shutdown the system

Type a command and press Enter.
`;

export default function Terminal({ onClose }: TerminalProps) {
  const { openWindow, setAppState, setTerminalOpen } = useDesktopStore();
  const [history, setHistory] = useState<string[]>([
    "ALDRICH DOS v4.20",
    "Copyright (C) 2026 Aldrich Systems, Inc.",
    "",
    'Type "HELP" for available commands.',
    "",
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toUpperCase();
    const parts = command.split(/\s+/);
    const baseCommand = parts[0];
    const args = parts.slice(1).join(" ");
    const newHistory = [...history, `C:\\ALDRICH>${cmd}`];

    switch (baseCommand) {
      case "DIR":
        newHistory.push("");
        newHistory.push(" Volume in drive C is ALDRICH_SYS");
        newHistory.push(" Volume Serial Number is 1337-CAFE");
        newHistory.push("");
        newHistory.push(" Directory of C:\\ALDRICH");
        newHistory.push("");

        FILES.forEach((file) => {
          const name = file.type === "dir"
            ? file.name.padEnd(12)
            : `${file.name.padEnd(8)}.${file.ext}`;
          const size = file.size.padStart(12);
          newHistory.push(`${file.date}  ${size}  ${name}`);
        });

        newHistory.push("");
        const fileCount = FILES.filter((f) => f.type === "file").length;
        const dirCount = FILES.filter((f) => f.type === "dir").length;
        newHistory.push(`        ${fileCount} File(s)        142,104 bytes`);
        newHistory.push(`        ${dirCount} Dir(s)    524,288,000 bytes free`);
        newHistory.push("");
        break;

      case "CLS":
        setHistory([]);
        setInput("");
        return;

      case "VER":
        newHistory.push("");
        newHistory.push("ALDRICH DOS Version 4.20");
        newHistory.push("(C) Copyright Aldrich Systems, Inc. 2026");
        newHistory.push("");
        break;

      case "DATE":
        newHistory.push("");
        newHistory.push(`Current date is ${new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })}`);
        newHistory.push("");
        break;

      case "TIME":
        newHistory.push("");
        newHistory.push(`Current time is ${new Date().toLocaleTimeString("en-US")}`);
        newHistory.push("");
        break;

      case "HELP":
      case "?":
        newHistory.push(...HELP_TEXT.split("\n"));
        break;

      case "EXIT":
        onClose();
        return;

      case "RUN": {
        if (!args) {
          newHistory.push("");
          newHistory.push("Usage: RUN [program]");
          newHistory.push("Example: RUN ABOUT.EXE");
          newHistory.push("");
          break;
        }
        const windowId = PROGRAM_MAP[args];
        if (windowId) {
          newHistory.push("");
          newHistory.push(`Loading ${args}...`);
          newHistory.push("");
          setHistory(newHistory);
          setInput("");
          // Small delay for effect, then open window and close terminal
          setTimeout(() => {
            openWindow(windowId);
            setTerminalOpen(false);
          }, 300);
          return;
        } else {
          newHistory.push("");
          newHistory.push(`Bad command or file name: ${args}`);
          newHistory.push("");
        }
        break;
      }

      case "TYPE": {
        if (!args) {
          newHistory.push("");
          newHistory.push("Usage: TYPE [filename]");
          newHistory.push("Example: TYPE README.TXT");
          newHistory.push("");
          break;
        }
        const content = FILE_CONTENTS[args];
        if (content) {
          newHistory.push("");
          content.forEach((line) => newHistory.push(line));
          newHistory.push("");
        } else {
          newHistory.push("");
          newHistory.push(`File not found: ${args}`);
          newHistory.push("");
        }
        break;
      }

      case "CD": {
        newHistory.push("");
        if (!args || args === "." || args === "\\") {
          newHistory.push("C:\\ALDRICH");
        } else if (args === "..") {
          newHistory.push("C:\\");
        } else {
          newHistory.push(`The system cannot find the path specified.`);
        }
        newHistory.push("");
        break;
      }

      case "CALC": {
        if (!args) {
          newHistory.push("");
          newHistory.push("Usage: CALC [expression]");
          newHistory.push("Example: CALC 2+2, CALC 10*5, CALC 100/4");
          newHistory.push("");
          break;
        }
        try {
          // Only allow safe characters: numbers, operators, parentheses, spaces, decimal
          const safeExpr = args.replace(/[^0-9+\-*/().%\s]/g, "");
          if (safeExpr !== args) {
            throw new Error("Invalid characters");
          }
          // Evaluate using Function constructor (safer than eval)
          const result = new Function(`return (${safeExpr})`)();
          if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
            newHistory.push("");
            newHistory.push(`${args} = ${result}`);
            newHistory.push("");
          } else {
            throw new Error("Invalid result");
          }
        } catch (error: unknown) {
          if (process.env.NODE_ENV === "development") {
            console.error("CALC error:", error);
          }
          newHistory.push("");
          newHistory.push("Syntax error in expression");
          newHistory.push("");
        }
        break;
      }

      case "SHUTDOWN": {
        newHistory.push("");
        newHistory.push("Shutting down...");
        newHistory.push("");
        setHistory(newHistory);
        setInput("");
        setTimeout(() => {
          setTerminalOpen(false);
          setAppState("shutdown");
        }, 500);
        return;
      }

      case "":
        break;

      default:
        newHistory.push("");
        newHistory.push(`Bad command or file name: ${cmd}`);
        newHistory.push("");
    }

    setHistory(newHistory);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="bg-[var(--bios-bg)] text-white px-4 py-1 flex justify-between items-center">
        <span>ALDRICH DOS Terminal</span>
        <button
          onClick={onClose}
          className="px-2 hover:bg-white hover:text-[var(--bios-bg)] text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
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
