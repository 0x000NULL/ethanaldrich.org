import { CommandHandler } from "./types";

export interface FileEntry {
  name: string;
  ext: string;
  size: string;
  date: string;
  type: "file" | "dir";
}

export const FILES: FileEntry[] = [
  { name: ".", ext: "", size: "<DIR>", date: "02-28-2026", type: "dir" },
  { name: "..", ext: "", size: "<DIR>", date: "02-28-2026", type: "dir" },
  {
    name: "ABOUT",
    ext: "EXE",
    size: "4,096",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "CAREER",
    ext: "EXE",
    size: "8,192",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "PROJECTS",
    ext: "EXE",
    size: "16,384",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "SKILLS",
    ext: "DAT",
    size: "32,768",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "CONTACT",
    ext: "COM",
    size: "2,048",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "BLOG",
    ext: "TXT",
    size: "65,536",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "GAMES",
    ext: "EXE",
    size: "12,288",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "README",
    ext: "TXT",
    size: "1,024",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "AUTOEXEC",
    ext: "BAT",
    size: "512",
    date: "02-28-2026",
    type: "file",
  },
  {
    name: "CONFIG",
    ext: "SYS",
    size: "256",
    date: "02-28-2026",
    type: "file",
  },
];

export const FILE_CONTENTS: Record<string, string[]> = {
  "README.TXT": [
    "\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557",
    "\u2551     ALDRICH PORTFOLIO SYSTEM v1.0      \u2551",
    "\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D",
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

export const dirCommand: CommandHandler = () => {
  const output: string[] = [
    "",
    " Volume in drive C is ALDRICH_SYS",
    " Volume Serial Number is 1337-CAFE",
    "",
    " Directory of C:\\ALDRICH",
    "",
  ];

  FILES.forEach((file) => {
    const name =
      file.type === "dir"
        ? file.name.padEnd(12)
        : `${file.name.padEnd(8)}.${file.ext}`;
    const size = file.size.padStart(12);
    output.push(`${file.date}  ${size}  ${name}`);
  });

  const fileCount = FILES.filter((f) => f.type === "file").length;
  const dirCount = FILES.filter((f) => f.type === "dir").length;
  output.push("");
  output.push(`        ${fileCount} File(s)        142,104 bytes`);
  output.push(`        ${dirCount} Dir(s)    524,288,000 bytes free`);
  output.push("");

  return { output };
};

export const typeCommand: CommandHandler = (args) => {
  if (!args) {
    return {
      output: ["", "Usage: TYPE [filename]", "Example: TYPE README.TXT", ""],
    };
  }

  const content = FILE_CONTENTS[args];
  if (content) {
    return { output: ["", ...content, ""] };
  }
  return { output: ["", `File not found: ${args}`, ""] };
};

export const cdCommand: CommandHandler = (args) => {
  if (!args || args === "." || args === "\\") {
    return { output: ["", "C:\\ALDRICH", ""] };
  }
  if (args === "..") {
    return { output: ["", "C:\\", ""] };
  }
  return { output: ["", "The system cannot find the path specified.", ""] };
};
