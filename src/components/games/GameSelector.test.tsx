import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GameSelector from "./GameSelector";

// Mock the game components to avoid complex rendering
vi.mock("./SnakeGame", () => ({
  default: () => <div data-testid="snake-game">Snake Game</div>,
}));

vi.mock("./MinesweeperGame", () => ({
  default: () => <div data-testid="minesweeper-game">Minesweeper Game</div>,
}));

vi.mock("./BreakoutGame", () => ({
  default: () => <div data-testid="breakout-game">Breakout Game</div>,
}));

describe("GameSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render game menu initially", () => {
      render(<GameSelector />);

      expect(screen.getByText(/GAMES COLLECTION/)).toBeInTheDocument();
      expect(screen.getByText("Select a game to play")).toBeInTheDocument();
    });

    it("should display all game options", () => {
      render(<GameSelector />);

      expect(screen.getByText("SNAKE.EXE")).toBeInTheDocument();
      expect(screen.getByText("MINESWEEP.EXE")).toBeInTheDocument();
      expect(screen.getByText("BREAKOUT.EXE")).toBeInTheDocument();
    });

    it("should display game descriptions", () => {
      render(<GameSelector />);

      expect(screen.getByText(/eat and grow/)).toBeInTheDocument();
      expect(screen.getByText(/Find the mines/)).toBeInTheDocument();
      expect(screen.getByText(/Break all the bricks/)).toBeInTheDocument();
    });
  });

  describe("game selection", () => {
    it("should show Snake game when selected", () => {
      render(<GameSelector />);

      fireEvent.click(screen.getByText("SNAKE.EXE"));

      expect(screen.getByTestId("snake-game")).toBeInTheDocument();
      expect(screen.getByText("← Back to Games Menu")).toBeInTheDocument();
    });

    it("should show Minesweeper game when selected", () => {
      render(<GameSelector />);

      fireEvent.click(screen.getByText("MINESWEEP.EXE"));

      expect(screen.getByTestId("minesweeper-game")).toBeInTheDocument();
      expect(screen.getByText("← Back to Games Menu")).toBeInTheDocument();
    });

    it("should show Breakout game when selected", () => {
      render(<GameSelector />);

      fireEvent.click(screen.getByText("BREAKOUT.EXE"));

      expect(screen.getByTestId("breakout-game")).toBeInTheDocument();
      expect(screen.getByText("← Back to Games Menu")).toBeInTheDocument();
    });

    it("should return to menu when Back clicked", () => {
      render(<GameSelector />);

      // Select a game
      fireEvent.click(screen.getByText("SNAKE.EXE"));
      expect(screen.getByText("← Back to Games Menu")).toBeInTheDocument();

      // Go back
      fireEvent.click(screen.getByText("← Back to Games Menu"));

      // Menu should be visible again
      expect(screen.getByText("Select a game to play")).toBeInTheDocument();
    });
  });
});
