interface GameOverlayProps {
  type: "start" | "paused" | "gameover";
  score?: number;
  onAction: () => void;
}

export function GameOverlay({ type, score, onAction }: GameOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
      <div className="text-center">
        {type === "gameover" && (
          <>
            <div className="text-[var(--bios-error)] text-lg mb-2">
              GAME OVER
            </div>
            <div className="text-sm mb-4">Score: {score}</div>
            <button
              onClick={onAction}
              className="px-4 py-1 border border-[var(--bios-success)] text-[var(--bios-success)] hover:bg-[var(--bios-success)] hover:text-black"
            >
              [ PLAY AGAIN ]
            </button>
          </>
        )}
        {type === "start" && (
          <>
            <div className="text-[var(--bios-success)] text-lg mb-4">SNAKE</div>
            <button
              onClick={onAction}
              className="px-4 py-1 border border-[var(--bios-success)] text-[var(--bios-success)] hover:bg-[var(--bios-success)] hover:text-black"
            >
              [ START ]
            </button>
          </>
        )}
        {type === "paused" && (
          <>
            <div className="text-[#000000] text-lg mb-2">PAUSED</div>
            <div className="text-sm">Press P or Space to continue</div>
          </>
        )}
      </div>
    </div>
  );
}
