import { WindowId } from "@/store/desktop-store";

export interface CommandContext {
  openWindow: (id: WindowId) => void;
  setAppState: (state: "shutdown") => void;
  setTerminalOpen: (open: boolean) => void;
}

export interface CommandResult {
  output: string[];
  shouldClear?: boolean;
  shouldClose?: boolean;
  delayedAction?: () => void;
}

export type CommandHandler = (
  args: string,
  context: CommandContext
) => CommandResult;

export interface CommandRegistry {
  [key: string]: CommandHandler;
}
