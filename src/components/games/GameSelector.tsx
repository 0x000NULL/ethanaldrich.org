"use client";

import { useState } from "react";
import SnakeGame from "./SnakeGame";
import MinesweeperGame from "./MinesweeperGame";
import BreakoutGame from "./BreakoutGame";

type GameType = "menu" | "snake" | "minesweeper" | "breakout";

interface GameOption {
  id: GameType;
  name: string;
  description: string;
  icon: string;
}

const games: GameOption[] = [
  {
    id: "snake",
    name: "SNAKE.EXE",
    description: "Classic snake game - eat and grow!",
    icon: "🐍",
  },
  {
    id: "minesweeper",
    name: "MINESWEEP.EXE",
    description: "Find the mines without exploding!",
    icon: "💣",
  },
  {
    id: "breakout",
    name: "BREAKOUT.EXE",
    description: "Break all the bricks with your ball!",
    icon: "🧱",
  },
];

export default function GameSelector() {
  const [selectedGame, setSelectedGame] = useState<GameType>("menu");

  if (selectedGame === "snake") {
    return (
      <div>
        <button
          onClick={() => setSelectedGame("menu")}
          className="text-bios-success hover:underline mb-2 text-sm"
        >
          ← Back to Games Menu
        </button>
        <SnakeGame />
      </div>
    );
  }

  if (selectedGame === "minesweeper") {
    return (
      <div>
        <button
          onClick={() => setSelectedGame("menu")}
          className="text-bios-success hover:underline mb-2 text-sm"
        >
          ← Back to Games Menu
        </button>
        <MinesweeperGame />
      </div>
    );
  }

  if (selectedGame === "breakout") {
    return (
      <div>
        <button
          onClick={() => setSelectedGame("menu")}
          className="text-bios-success hover:underline mb-2 text-sm"
        >
          ← Back to Games Menu
        </button>
        <BreakoutGame />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-bios-success mb-4 text-center">
        ╔═══════════════════════════════════════╗
        <br />
        ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GAMES COLLECTION&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        <br />
        ╚═══════════════════════════════════════╝
      </div>

      <div className="space-y-3">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            className="w-full chrome-raised p-3 flex items-center gap-4 hover:brightness-95 text-left"
          >
            <span className="text-2xl">{game.icon}</span>
            <div>
              <div className="text-bios-success font-bold">{game.name}</div>
              <div className="text-[#606060] text-sm">{game.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-xs text-[#606060] text-center">
        Select a game to play
      </div>
    </div>
  );
}
