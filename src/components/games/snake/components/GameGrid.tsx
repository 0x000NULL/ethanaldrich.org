import { ReactNode } from "react";
import { Position, GRID_SIZE, CELL_SIZE } from "../types";

interface GameGridProps {
  snake: Position[];
  food: Position;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  children?: ReactNode;
}

export function GameGrid({
  snake,
  food,
  onTouchStart,
  onTouchEnd,
  children,
}: GameGridProps) {
  return (
    <div
      className="border-2 border-[#AAAAAA] mx-auto touch-none"
      style={{
        width: GRID_SIZE * CELL_SIZE + 4,
        height: GRID_SIZE * CELL_SIZE + 4,
        background: "#000020",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="relative"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={
              index === 0
                ? "bg-[var(--bios-success)]"
                : "bg-[var(--bios-success)] opacity-80"
            }
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

        {children}
      </div>
    </div>
  );
}
