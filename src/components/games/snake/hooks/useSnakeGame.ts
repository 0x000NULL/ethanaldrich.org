import { useState, useCallback, useRef } from "react";
import { Direction, Position, GRID_SIZE, OPPOSITES } from "../types";

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  // Use lazy initialization to read high score from localStorage
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("snake-high-score");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);

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

  // Change direction
  const changeDirection = useCallback(
    (newDir: Direction) => {
      if (!isPlaying) return;

      if (directionRef.current !== OPPOSITES[newDir]) {
        directionRef.current = newDir;
        setDirection(newDir);
      }
    },
    [isPlaying]
  );

  // Start game
  const startGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  }, [generateFood]);

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  return {
    snake,
    food,
    direction,
    gameOver,
    score,
    highScore,
    isPlaying,
    isPaused,
    moveSnake,
    changeDirection,
    startGame,
    togglePause,
  };
}
