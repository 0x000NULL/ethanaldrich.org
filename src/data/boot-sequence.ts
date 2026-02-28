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

// Time-based boot messages for easter eggs
export interface TimeBasedMessage {
  text: string;
  highlightText?: string;
  type: "status";
}

export function getTimeBasedMessages(): TimeBasedMessage[] {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const month = now.getMonth(); // 0-indexed
  const date = now.getDate();
  const messages: TimeBasedMessage[] = [];

  // Time of day messages
  if (hour >= 6 && hour < 12) {
    // Morning (6 AM - 12 PM)
    messages.push({
      text: "Initializing coffee protocols...              ",
      highlightText: "Brewing",
      type: "status",
    });
  } else if (hour >= 21 || hour < 2) {
    // Night owl (9 PM - 2 AM)
    messages.push({
      text: "Night owl mode detected...                    ",
      highlightText: "Active",
      type: "status",
    });
  } else if (hour >= 2 && hour < 6) {
    // Late night (2 AM - 6 AM)
    messages.push({
      text: "WARNING: Extremely late session detected!     ",
      highlightText: "Sleep?",
      type: "status",
    });
  }

  // Day of week messages
  if (day === 0 || day === 6) {
    // Weekend
    messages.push({
      text: "Loading productivity drivers...               ",
      highlightText: "Optional",
      type: "status",
    });
  } else if (day === 1) {
    // Monday
    messages.push({
      text: "Loading motivation.dll...                     ",
      highlightText: "Failed",
      type: "status",
    });
  } else if (day === 5) {
    // Friday
    messages.push({
      text: "Friday detected...                            ",
      highlightText: "TGIF!",
      type: "status",
    });
  }

  // Special dates
  if (month === 9 && date === 31) {
    // Halloween
    messages.push({
      text: "Spooky mode activated...                      ",
      highlightText: "BOO!",
      type: "status",
    });
  } else if (month === 11 && date >= 24 && date <= 26) {
    // Christmas
    messages.push({
      text: "Holiday cheer module...                       ",
      highlightText: "Loaded",
      type: "status",
    });
  } else if (month === 0 && date === 1) {
    // New Year
    messages.push({
      text: "Happy New Year!...                            ",
      highlightText: `${now.getFullYear()}`,
      type: "status",
    });
  }

  return messages;
}
