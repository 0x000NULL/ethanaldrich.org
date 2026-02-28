"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 60;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 36;
const BRICK_HEIGHT = 15;
const BRICK_PADDING = 2;
const BRICK_TOP_OFFSET = 40;

const BRICK_COLORS = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF"];

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  alive: boolean;
}

type GameState = "idle" | "playing" | "won" | "lost";

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const gameRef = useRef({
    paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 50,
    ballDX: 3,
    ballDY: -3,
    bricks: [] as Brick[],
    animationId: 0,
  });

  const initBricks = useCallback(() => {
    const bricks: Brick[] = [];
    const totalBrickWidth = BRICK_COLS * BRICK_WIDTH + (BRICK_COLS - 1) * BRICK_PADDING;
    const startX = (CANVAS_WIDTH - totalBrickWidth) / 2;

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: startX + col * (BRICK_WIDTH + BRICK_PADDING),
          y: BRICK_TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_PADDING),
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: BRICK_COLORS[row],
          alive: true,
        });
      }
    }
    return bricks;
  }, []);

  const resetBall = useCallback(() => {
    const game = gameRef.current;
    game.ballX = CANVAS_WIDTH / 2;
    game.ballY = CANVAS_HEIGHT - 50;
    game.ballDX = 3 * (Math.random() > 0.5 ? 1 : -1);
    game.ballDY = -3;
  }, []);

  const startGame = useCallback(() => {
    gameRef.current.bricks = initBricks();
    gameRef.current.paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
    resetBall();
    setScore(0);
    setLives(3);
    setGameState("playing");
  }, [initBricks, resetBall]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const game = gameRef.current;

    // Clear
    ctx.fillStyle = "#000033";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw border
    ctx.strokeStyle = "#404040";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CANVAS_WIDTH - 2, CANVAS_HEIGHT - 2);

    // Draw bricks
    game.bricks.forEach((brick) => {
      if (!brick.alive) return;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      // 3D effect
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(brick.x, brick.y, brick.width, 2);
      ctx.fillRect(brick.x, brick.y, 2, brick.height);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(brick.x, brick.y + brick.height - 2, brick.width, 2);
      ctx.fillRect(brick.x + brick.width - 2, brick.y, 2, brick.height);
    });

    // Draw paddle
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(game.paddleX, CANVAS_HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
    // 3D effect
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(game.paddleX, CANVAS_HEIGHT - 20, PADDLE_WIDTH, 2);
    ctx.fillRect(game.paddleX, CANVAS_HEIGHT - 20, 2, PADDLE_HEIGHT);
    ctx.fillStyle = "#808080";
    ctx.fillRect(game.paddleX, CANVAS_HEIGHT - 12, PADDLE_WIDTH, 2);
    ctx.fillRect(game.paddleX + PADDLE_WIDTH - 2, CANVAS_HEIGHT - 20, 2, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(game.ballX, game.ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const update = useCallback(() => {
    const game = gameRef.current;

    // Move ball
    game.ballX += game.ballDX;
    game.ballY += game.ballDY;

    // Wall collision
    if (game.ballX - BALL_RADIUS <= 0 || game.ballX + BALL_RADIUS >= CANVAS_WIDTH) {
      game.ballDX = -game.ballDX;
    }
    if (game.ballY - BALL_RADIUS <= 0) {
      game.ballDY = -game.ballDY;
    }

    // Paddle collision
    if (
      game.ballY + BALL_RADIUS >= CANVAS_HEIGHT - 20 &&
      game.ballY - BALL_RADIUS <= CANVAS_HEIGHT - 10 &&
      game.ballX >= game.paddleX &&
      game.ballX <= game.paddleX + PADDLE_WIDTH
    ) {
      // Angle based on where ball hits paddle
      const hitPos = (game.ballX - game.paddleX) / PADDLE_WIDTH;
      const angle = (hitPos - 0.5) * Math.PI * 0.7; // -70 to +70 degrees
      const speed = Math.sqrt(game.ballDX ** 2 + game.ballDY ** 2);
      game.ballDX = Math.sin(angle) * speed;
      game.ballDY = -Math.abs(Math.cos(angle) * speed);
    }

    // Ball out of bounds
    if (game.ballY > CANVAS_HEIGHT) {
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setGameState("lost");
        } else {
          resetBall();
        }
        return newLives;
      });
    }

    // Brick collision
    let bricksRemaining = 0;
    game.bricks.forEach((brick) => {
      if (!brick.alive) return;
      bricksRemaining++;

      if (
        game.ballX + BALL_RADIUS > brick.x &&
        game.ballX - BALL_RADIUS < brick.x + brick.width &&
        game.ballY + BALL_RADIUS > brick.y &&
        game.ballY - BALL_RADIUS < brick.y + brick.height
      ) {
        brick.alive = false;
        bricksRemaining--;
        game.ballDY = -game.ballDY;
        setScore((s) => s + 10);

        if (bricksRemaining === 0) {
          setGameState("won");
        }
      }
    });
  }, [resetBall]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      update();
      draw();
      gameRef.current.animationId = requestAnimationFrame(gameLoop);
    };

    gameRef.current.animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(gameRef.current.animationId);
    };
  }, [gameState, update, draw]);

  // Draw initial state
  useEffect(() => {
    if (gameState === "idle") {
      gameRef.current.bricks = initBricks();
      draw();
    }
  }, [gameState, initBricks, draw]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      const game = gameRef.current;
      const moveSpeed = 20;

      if (e.key === "ArrowLeft") {
        game.paddleX = Math.max(0, game.paddleX - moveSpeed);
      } else if (e.key === "ArrowRight") {
        game.paddleX = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, game.paddleX + moveSpeed);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Mouse/touch controls
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (gameState !== "playing") return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      gameRef.current.paddleX = Math.max(
        0,
        Math.min(CANVAS_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2)
      );
    },
    [gameState]
  );

  return (
    <div className="flex flex-col items-center p-4">
      {/* Header */}
      <div className="chrome-sunken p-2 mb-4 flex items-center gap-8 text-sm">
        <div>
          <span className="text-[#606060]">SCORE:</span>{" "}
          <span className="text-bios-success font-mono">{String(score).padStart(5, "0")}</span>
        </div>
        <div>
          <span className="text-[#606060]">LIVES:</span>{" "}
          <span className="text-red-500 font-mono">{"❤".repeat(lives)}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="chrome-sunken p-1">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerMove={handlePointerMove}
          className="cursor-none"
        />
      </div>

      {/* Controls */}
      {gameState === "idle" && (
        <button
          onClick={startGame}
          className="mt-4 chrome-raised px-6 py-2 text-bios-success hover:brightness-95"
        >
          START GAME
        </button>
      )}

      {gameState === "won" && (
        <div className="mt-4 text-center">
          <div className="text-bios-success font-bold text-lg mb-2">
            YOU WIN! Score: {score}
          </div>
          <button
            onClick={startGame}
            className="chrome-raised px-6 py-2 hover:brightness-95"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {gameState === "lost" && (
        <div className="mt-4 text-center">
          <div className="text-red-500 font-bold text-lg mb-2">
            GAME OVER! Score: {score}
          </div>
          <button
            onClick={startGame}
            className="chrome-raised px-6 py-2 hover:brightness-95"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-xs text-[#606060] text-center">
        <div>Arrow keys or mouse to move paddle</div>
        <div>Break all bricks to win!</div>
      </div>
    </div>
  );
}
