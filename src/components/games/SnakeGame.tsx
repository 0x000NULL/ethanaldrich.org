"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import {
  useSnakeGame,
  useGameLoop,
  useGameControls,
  GameGrid,
  GameOverlay,
  ScoreDisplay,
  DPadControls,
} from "./snake";
import { SectionHeader } from "@/components/ui";

export default function SnakeGame() {
  const isMobile = useIsMobile({ checkTouch: true });

  const {
    snake,
    food,
    gameOver,
    score,
    highScore,
    isPlaying,
    isPaused,
    moveSnake,
    changeDirection,
    startGame,
    togglePause,
  } = useSnakeGame();

  useGameLoop({
    isPlaying,
    isPaused,
    gameOver,
    onTick: moveSnake,
  });

  const { handleTouchStart, handleTouchEnd } = useGameControls({
    isPlaying,
    onDirectionChange: changeDirection,
    onPauseToggle: togglePause,
  });

  const getOverlayType = () => {
    if (gameOver) return "gameover";
    if (!isPlaying) return "start";
    if (isPaused) return "paused";
    return null;
  };

  const overlayType = getOverlayType();

  return (
    <div className="space-y-4">
      <SectionHeader title="SNAKE.EXE" />

      <ScoreDisplay score={score} highScore={highScore} />

      <GameGrid
        snake={snake}
        food={food}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {overlayType && (
          <GameOverlay
            type={overlayType}
            score={score}
            onAction={startGame}
          />
        )}
      </GameGrid>

      {/* Desktop Controls */}
      {!isMobile && (
        <div className="text-[#606060] text-xs text-center space-y-1">
          <div>Arrow Keys or WASD to move</div>
          <div>P or Space to pause</div>
        </div>
      )}

      {/* Mobile D-Pad Controls */}
      {isMobile && isPlaying && !gameOver && (
        <DPadControls
          onDirectionChange={changeDirection}
          onPauseToggle={togglePause}
          isPaused={isPaused}
        />
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
