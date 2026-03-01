"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SPEED = 150;
const SWIPE_THRESHOLD = 30;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile({ checkTouch: true });

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snake-high-score");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Generate new food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((currentSnake) => {
      const head = currentSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case "UP":
          newHead.y -= 1;
          break;
        case "DOWN":
          newHead.y += 1;
          break;
        case "LEFT":
          newHead.x -= 1;
          break;
        case "RIGHT":
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (
        currentSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        setGameOver(true);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("snake-high-score", newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, highScore, generateFood]);

  // Game loop
  useEffect(() => {
    if (isPlaying && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, isPaused, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (directionRef.current !== "DOWN") {
            directionRef.current = "UP";
            setDirection("UP");
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (directionRef.current !== "UP") {
            directionRef.current = "DOWN";
            setDirection("DOWN");
          }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (directionRef.current !== "RIGHT") {
            directionRef.current = "LEFT";
            setDirection("LEFT");
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (directionRef.current !== "LEFT") {
            directionRef.current = "RIGHT";
            setDirection("RIGHT");
          }
          break;
        case "p":
        case "P":
        case " ":
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  // Change direction helper (used by keyboard and touch controls)
  const changeDirection = (newDir: Direction) => {
    if (!isPlaying) return;

    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (directionRef.current !== opposites[newDir]) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  };

  // Touch handlers for swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isPlaying) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Check if swipe was significant enough
    if (Math.abs(deltaX) < SWIPE_THRESHOLD && Math.abs(deltaY) < SWIPE_THRESHOLD) {
      touchStartRef.current = null;
      return;
    }

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      changeDirection(deltaX > 0 ? "RIGHT" : "LEFT");
    } else {
      // Vertical swipe
      changeDirection(deltaY > 0 ? "DOWN" : "UP");
    }

    touchStartRef.current = null;
  };

  // D-pad button component
  const DPadButton = ({
    dir,
    label,
    className,
  }: {
    dir: Direction;
    label: string;
    className?: string;
  }) => (
    <button
      onClick={() => changeDirection(dir)}
      className={`w-14 h-14 chrome-raised flex items-center justify-center text-black font-bold text-xl active:chrome-sunken touch-manipulation select-none ${className || ""}`}
      aria-label={`Move ${dir.toLowerCase()}`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="text-[#000000] text-lg mb-4 text-center">
        ╔══════════════════════════════════════════════════════════╗
        <br />
        ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SNAKE.EXE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
        <br />
        ╚══════════════════════════════════════════════════════════╝
      </div>

      {/* Score display */}
      <div className="flex justify-between text-sm mb-2">
        <span>
          <span className="text-[#000000]">Score: </span>
          <span className="text-[var(--bios-success)]">{score}</span>
        </span>
        <span>
          <span className="text-[#000000]">High Score: </span>
          <span className="text-white">{highScore}</span>
        </span>
      </div>

      {/* Game grid */}
      <div
        className="border-2 border-[#AAAAAA] mx-auto touch-none"
        style={{
          width: GRID_SIZE * CELL_SIZE + 4,
          height: GRID_SIZE * CELL_SIZE + 4,
          background: "#000020",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={index === 0 ? "bg-[var(--bios-success)]" : "bg-[var(--bios-success)] opacity-80"}
              style={{
                position: "absolute",
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
              }}
            />
          ))}

          {/* Food */}
          <div
            className="bg-[var(--bios-error)]"
            style={{
              position: "absolute",
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
            }}
          />

          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[var(--bios-error)] text-lg mb-2">GAME OVER</div>
                <div className="text-sm mb-4">Score: {score}</div>
                <button
                  onClick={startGame}
                  className="px-4 py-1 border border-[var(--bios-success)] text-[var(--bios-success)] hover:bg-[var(--bios-success)] hover:text-black"
                >
                  [ PLAY AGAIN ]
                </button>
              </div>
            </div>
          )}

          {/* Start screen */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[var(--bios-success)] text-lg mb-4">SNAKE</div>
                <button
                  onClick={startGame}
                  className="px-4 py-1 border border-[var(--bios-success)] text-[var(--bios-success)] hover:bg-[var(--bios-success)] hover:text-black"
                >
                  [ START ]
                </button>
              </div>
            </div>
          )}

          {/* Paused overlay */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[#000000] text-lg mb-2">PAUSED</div>
                <div className="text-sm">Press P or Space to continue</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Controls */}
      {!isMobile && (
        <div className="text-[#606060] text-xs text-center space-y-1">
          <div>Arrow Keys or WASD to move</div>
          <div>P or Space to pause</div>
        </div>
      )}

      {/* Mobile D-Pad Controls */}
      {isMobile && isPlaying && !gameOver && (
        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="text-[#606060] text-xs mb-2">Swipe on grid or use D-pad</div>
          <div className="grid grid-cols-3 gap-1">
            {/* Top row - Up */}
            <div />
            <DPadButton dir="UP" label="▲" />
            <div />

            {/* Middle row - Left, Pause, Right */}
            <DPadButton dir="LEFT" label="◀" />
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="w-14 h-14 chrome-raised flex items-center justify-center text-black font-bold text-xs active:chrome-sunken touch-manipulation select-none"
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? "▶" : "❚❚"}
            </button>
            <DPadButton dir="RIGHT" label="▶" />

            {/* Bottom row - Down */}
            <div />
            <DPadButton dir="DOWN" label="▼" />
            <div />
          </div>
        </div>
      )}

      {/* Mobile hint when not playing */}
      {isMobile && (!isPlaying || gameOver) && (
        <div className="text-[#606060] text-xs text-center mt-2">
          Swipe on grid or use D-pad to control
        </div>
      )}
    </div>
  );
}
