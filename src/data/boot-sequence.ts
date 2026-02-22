export interface BootLine {
  text: string;
  delay: number; // Delay before this line appears (ms)
  type: "normal" | "header" | "memory" | "detection" | "status" | "prompt";
  highlightText?: string; // Optional highlighted portion
}

export const bootSequence: BootLine[] = [
  {
    text: "AMIBIOS (C) 2025 Ethan Aldrich Systems, Inc.",
    delay: 0,
    type: "header",
  },
  {
    text: "ALDRICH BIOS v4.20 — Personal Portfolio BIOS",
    delay: 100,
    type: "header",
  },
  {
    text: "",
    delay: 200,
    type: "normal",
  },
  {
    text: "Main Processor: Intel Core i7-Brain @ 3.2 GHz (Overclocked with Coffee)",
    delay: 300,
    type: "normal",
  },
  {
    text: "Memory Test:   ",
    delay: 400,
    type: "memory",
  },
  {
    text: "",
    delay: 1500,
    type: "normal",
  },
  {
    text: "Detecting Primary Master... ",
    delay: 200,
    type: "detection",
    highlightText: "[PROJECTS]         — Homelab, Cars, Racecar Build",
  },
  {
    text: "Detecting Primary Slave...  ",
    delay: 400,
    type: "detection",
    highlightText: "[EXPERIENCE]       — CTO @ Malco Enterprises",
  },
  {
    text: "Detecting Secondary Master... ",
    delay: 400,
    type: "detection",
    highlightText: "[SKILLS]           — SQL Server, Power BI, Linux...",
  },
  {
    text: "Detecting Secondary Slave... ",
    delay: 400,
    type: "detection",
    highlightText: "[BLOG]             — Technical Write-ups & Notes",
  },
  {
    text: "",
    delay: 300,
    type: "normal",
  },
  {
    text: "Initializing Contact Subsystem...              ",
    delay: 200,
    type: "status",
    highlightText: "OK",
  },
  {
    text: "Loading About Module...                        ",
    delay: 200,
    type: "status",
    highlightText: "OK",
  },
  {
    text: "Checking Keyboard.............................. ",
    delay: 200,
    type: "status",
    highlightText: "Detected",
  },
  {
    text: "Checking Mouse................................. ",
    delay: 200,
    type: "status",
    highlightText: "Detected",
  },
  {
    text: "",
    delay: 300,
    type: "normal",
  },
  {
    text: "All systems nominal.",
    delay: 200,
    type: "normal",
  },
  {
    text: "",
    delay: 300,
    type: "normal",
  },
  {
    text: "Press DEL to enter SETUP, or any key to continue...",
    delay: 100,
    type: "prompt",
  },
];

export const MEMORY_TARGET = 1048576; // 1024 MB in KB
export const MEMORY_STEP = 16384; // How much to increment per frame
export const MEMORY_INTERVAL = 20; // ms between increments

export const AUTO_BOOT_DELAY = 8000; // Auto-proceed after 8 seconds of inactivity
