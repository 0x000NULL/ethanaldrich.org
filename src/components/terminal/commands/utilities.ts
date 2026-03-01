import { Parser } from "expr-eval";
import { CommandHandler } from "./types";

const parser = new Parser();

export const calcCommand: CommandHandler = (args) => {
  if (!args) {
    return {
      output: [
        "",
        "Usage: CALC [expression]",
        "Example: CALC 2+2, CALC 10*5, CALC sqrt(16)",
        "",
      ],
    };
  }

  try {
    const result = parser.evaluate(args);
    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return { output: ["", `${args} = ${result}`, ""] };
    }
    throw new Error("Invalid result");
  } catch {
    return { output: ["", "Syntax error in expression", ""] };
  }
};

export const verCommand: CommandHandler = () => ({
  output: [
    "",
    "ALDRICH DOS Version 4.20",
    "(C) Copyright Aldrich Systems, Inc. 2026",
    "",
  ],
});

export const dateCommand: CommandHandler = () => ({
  output: [
    "",
    `Current date is ${new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    })}`,
    "",
  ],
});

export const timeCommand: CommandHandler = () => ({
  output: ["", `Current time is ${new Date().toLocaleTimeString("en-US")}`, ""],
});

export const helpCommand: CommandHandler = () => ({
  output: [
    "",
    "Available commands:",
    "  DIR         - Display directory contents",
    "  CLS         - Clear the screen",
    "  VER         - Display DOS version",
    "  DATE        - Display current date",
    "  TIME        - Display current time",
    "  HELP        - Display this help message",
    "  EXIT        - Close terminal",
    "",
    "  RUN [prog]  - Run a program (e.g., RUN ABOUT.EXE)",
    "  TYPE [file] - Display file contents",
    "  CD [dir]    - Change directory",
    "  CALC [expr] - Calculator (e.g., CALC 2+2, CALC sqrt(16))",
    "  SHUTDOWN    - Shutdown the system",
    "",
    "Type a command and press Enter.",
    "",
  ],
});
