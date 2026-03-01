export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Position = { x: number; y: number };

export const GRID_SIZE = 20;
export const CELL_SIZE = 15;
export const INITIAL_SPEED = 150;
export const SWIPE_THRESHOLD = 30;

export const OPPOSITES: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};
