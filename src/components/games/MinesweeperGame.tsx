"use client";

import { useState, useEffect, useCallback } from "react";

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

type GameState = "idle" | "playing" | "won" | "lost";

const GRID_SIZE = 9;
const MINE_COUNT = 10;

const NUMBER_COLORS: Record<number, string> = {
  1: "text-blue-600",
  2: "text-green-600",
  3: "text-red-600",
  4: "text-blue-900",
  5: "text-red-900",
  6: "text-cyan-600",
  7: "text-black",
  8: "text-gray-500",
};

function createEmptyGrid(): Cell[][] {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
    );
}

function placeMines(grid: Cell[][], firstClickX: number, firstClickY: number): Cell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  let minesPlaced = 0;

  while (minesPlaced < MINE_COUNT) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);

    // Don't place mine on first click or already mined cell
    if ((x === firstClickX && y === firstClickY) || newGrid[y][x].isMine) {
      continue;
    }

    newGrid[y][x].isMine = true;
    minesPlaced++;
  }

  // Calculate adjacent mine counts
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (newGrid[y][x].isMine) continue;

      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE) {
            if (newGrid[ny][nx].isMine) count++;
          }
        }
      }
      newGrid[y][x].adjacentMines = count;
    }
  }

  return newGrid;
}

function revealCells(grid: Cell[][], startX: number, startY: number): Cell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const stack: [number, number][] = [[startX, startY]];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;

    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) continue;
    if (newGrid[y][x].isRevealed || newGrid[y][x].isFlagged) continue;

    newGrid[y][x].isRevealed = true;

    // If cell has no adjacent mines, reveal neighbors
    if (newGrid[y][x].adjacentMines === 0 && !newGrid[y][x].isMine) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx !== 0 || dy !== 0) {
            stack.push([x + dx, y + dy]);
          }
        }
      }
    }
  }

  return newGrid;
}

function checkWin(grid: Cell[][]): boolean {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = grid[y][x];
      // All non-mine cells must be revealed
      if (!cell.isMine && !cell.isRevealed) return false;
    }
  }
  return true;
}

export default function MinesweeperGame() {
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [flagMode, setFlagMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [flagCount, setFlagCount] = useState(0);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setTimer((t) => Math.min(t + 1, 999));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setGameState("idle");
    setTimer(0);
    setFlagCount(0);
    setFlagMode(false);
  }, []);

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (gameState === "won" || gameState === "lost") return;

      const cell = grid[y][x];
      if (cell.isRevealed) return;

      // Flag mode (mobile) or flagged cell
      if (flagMode) {
        if (cell.isFlagged) {
          setFlagCount((c) => c - 1);
        } else {
          setFlagCount((c) => c + 1);
        }
        setGrid((g) => {
          const newGrid = g.map((row) => row.map((c) => ({ ...c })));
          newGrid[y][x].isFlagged = !newGrid[y][x].isFlagged;
          return newGrid;
        });
        return;
      }

      if (cell.isFlagged) return;

      // First click - place mines
      if (gameState === "idle") {
        const newGrid = placeMines(grid, x, y);
        const revealedGrid = revealCells(newGrid, x, y);
        setGrid(revealedGrid);
        setGameState("playing");
        return;
      }

      // Regular click during play
      if (cell.isMine) {
        // Game over - reveal all mines
        setGrid((g) => {
          const newGrid = g.map((row) =>
            row.map((c) => ({
              ...c,
              isRevealed: c.isMine ? true : c.isRevealed,
            }))
          );
          newGrid[y][x].isRevealed = true;
          return newGrid;
        });
        setGameState("lost");
        return;
      }

      const newGrid = revealCells(grid, x, y);
      setGrid(newGrid);

      if (checkWin(newGrid)) {
        setGameState("won");
      }
    },
    [grid, gameState, flagMode]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent, x: number, y: number) => {
      e.preventDefault();
      if (gameState === "won" || gameState === "lost") return;

      const cell = grid[y][x];
      if (cell.isRevealed) return;

      if (cell.isFlagged) {
        setFlagCount((c) => c - 1);
      } else {
        setFlagCount((c) => c + 1);
      }

      setGrid((g) => {
        const newGrid = g.map((row) => row.map((c) => ({ ...c })));
        newGrid[y][x].isFlagged = !newGrid[y][x].isFlagged;
        return newGrid;
      });
    },
    [grid, gameState]
  );

  const getSmiley = () => {
    if (gameState === "won") return "😎";
    if (gameState === "lost") return "😵";
    return "🙂";
  };

  const formatNumber = (n: number) => String(n).padStart(3, "0");

  return (
    <div className="flex flex-col items-center p-4">
      {/* Header */}
      <div className="chrome-sunken p-2 mb-4 flex items-center gap-4">
        {/* Mine counter */}
        <div className="bg-black text-red-500 font-mono text-xl px-2 py-1 min-w-[50px] text-center">
          {formatNumber(MINE_COUNT - flagCount)}
        </div>

        {/* Reset button */}
        <button
          onClick={resetGame}
          className="chrome-raised w-10 h-10 flex items-center justify-center text-2xl hover:brightness-95 active:chrome-sunken"
        >
          {getSmiley()}
        </button>

        {/* Timer */}
        <div className="bg-black text-red-500 font-mono text-xl px-2 py-1 min-w-[50px] text-center">
          {formatNumber(timer)}
        </div>
      </div>

      {/* Grid */}
      <div className="chrome-sunken p-1">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 24px)`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <button
                key={`${x}-${y}`}
                onClick={() => handleCellClick(x, y)}
                onContextMenu={(e) => handleRightClick(e, x, y)}
                className={`w-6 h-6 text-xs font-bold flex items-center justify-center border-0 ${
                  cell.isRevealed
                    ? "chrome-sunken bg-[#C0C0C0]"
                    : "chrome-raised hover:brightness-95"
                }`}
                disabled={gameState === "won" || gameState === "lost"}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <span className="text-black">💣</span>
                  ) : cell.adjacentMines > 0 ? (
                    <span className={NUMBER_COLORS[cell.adjacentMines]}>
                      {cell.adjacentMines}
                    </span>
                  ) : null
                ) : cell.isFlagged ? (
                  <span>🚩</span>
                ) : null}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Mobile flag toggle */}
      <button
        onClick={() => setFlagMode((f) => !f)}
        className={`mt-4 px-4 py-2 text-sm ${
          flagMode ? "chrome-sunken bg-[#A0A0A0]" : "chrome-raised"
        }`}
      >
        {flagMode ? "🚩 Flag Mode ON" : "👆 Click Mode"}
      </button>

      {/* Game state message */}
      {gameState === "won" && (
        <div className="mt-4 text-bios-success font-bold">
          YOU WIN! Time: {timer}s
        </div>
      )}
      {gameState === "lost" && (
        <div className="mt-4 text-red-500 font-bold">GAME OVER!</div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-xs text-[#606060] text-center">
        <div>Left click: Reveal | Right click: Flag</div>
        <div>Mobile: Use flag mode toggle</div>
      </div>
    </div>
  );
}
