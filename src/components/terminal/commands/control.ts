import { CommandHandler } from "./types";

export const clsCommand: CommandHandler = () => ({
  output: [],
  shouldClear: true,
});

export const exitCommand: CommandHandler = () => ({
  output: [],
  shouldClose: true,
});

export const shutdownCommand: CommandHandler = (_, context) => ({
  output: ["", "Shutting down...", ""],
  delayedAction: () => {
    context.setTerminalOpen(false);
    context.setAppState("shutdown");
  },
});
