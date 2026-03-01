import { Direction } from "../types";

interface DPadControlsProps {
  onDirectionChange: (dir: Direction) => void;
  onPauseToggle: () => void;
  isPaused: boolean;
}

function DPadButton({
  dir,
  label,
  onClick,
}: {
  dir: Direction;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 chrome-raised flex items-center justify-center text-black font-bold text-xl active:chrome-sunken touch-manipulation select-none"
      aria-label={`Move ${dir.toLowerCase()}`}
    >
      {label}
    </button>
  );
}

export function DPadControls({
  onDirectionChange,
  onPauseToggle,
  isPaused,
}: DPadControlsProps) {
  return (
    <div className="flex flex-col items-center gap-1 mt-4">
      <div className="text-[#606060] text-xs mb-2">
        Swipe on grid or use D-pad
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div />
        <DPadButton
          dir="UP"
          label="\u25B2"
          onClick={() => onDirectionChange("UP")}
        />
        <div />
        <DPadButton
          dir="LEFT"
          label="\u25C0"
          onClick={() => onDirectionChange("LEFT")}
        />
        <button
          onClick={onPauseToggle}
          className="w-14 h-14 chrome-raised flex items-center justify-center text-black font-bold text-xs active:chrome-sunken touch-manipulation select-none"
          aria-label={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? "\u25B6" : "\u275A\u275A"}
        </button>
        <DPadButton
          dir="RIGHT"
          label="\u25B6"
          onClick={() => onDirectionChange("RIGHT")}
        />
        <div />
        <DPadButton
          dir="DOWN"
          label="\u25BC"
          onClick={() => onDirectionChange("DOWN")}
        />
        <div />
      </div>
    </div>
  );
}
