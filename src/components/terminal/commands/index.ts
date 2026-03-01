import { CommandRegistry } from "./types";
import { dirCommand, typeCommand, cdCommand } from "./filesystem";
import {
  calcCommand,
  verCommand,
  dateCommand,
  timeCommand,
  helpCommand,
} from "./utilities";
import { runCommand } from "./launcher";
import { clsCommand, exitCommand, shutdownCommand } from "./control";

export const commands: CommandRegistry = {
  DIR: dirCommand,
  TYPE: typeCommand,
  CD: cdCommand,
  CALC: calcCommand,
  VER: verCommand,
  DATE: dateCommand,
  TIME: timeCommand,
  HELP: helpCommand,
  "?": helpCommand,
  RUN: runCommand,
  CLS: clsCommand,
  EXIT: exitCommand,
  SHUTDOWN: shutdownCommand,
};

export * from "./types";
