import { WindowId } from "@/store/desktop-store";
import { CommandHandler } from "./types";

export const PROGRAM_MAP: Record<string, WindowId> = {
  ABOUT: "about",
  "ABOUT.EXE": "about",
  CAREER: "career",
  "CAREER.EXE": "career",
  PROJECTS: "projects",
  "PROJECTS.EXE": "projects",
  SKILLS: "skills",
  "SKILLS.DAT": "skills",
  CONTACT: "contact",
  "CONTACT.COM": "contact",
  BLOG: "blog",
  "BLOG.TXT": "blog",
  GAMES: "games",
  "GAMES.EXE": "games",
};

export const runCommand: CommandHandler = (args, context) => {
  if (!args) {
    return {
      output: ["", "Usage: RUN [program]", "Example: RUN ABOUT.EXE", ""],
    };
  }

  const windowId = PROGRAM_MAP[args];
  if (windowId) {
    return {
      output: ["", `Loading ${args}...`, ""],
      delayedAction: () => {
        context.openWindow(windowId);
        context.setTerminalOpen(false);
      },
    };
  }

  return { output: ["", `Bad command or file name: ${args}`, ""] };
};
