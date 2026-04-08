interface ScoreDisplayProps {
  score: number;
  highScore: number;
}

export function ScoreDisplay({ score, highScore }: ScoreDisplayProps) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span>
        <span className="text-bios">Score: </span>
        <span className="text-[var(--bios-success)]">{score}</span>
      </span>
      <span>
        <span className="text-bios">High Score: </span>
        <span className="text-white">{highScore}</span>
      </span>
    </div>
  );
}
