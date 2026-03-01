"use client";

interface ProgressBarProps {
  /** Value from 0-100 (percent) or 0-10 (level) */
  value: number;
  /** Scale type: 'percent' (0-100) or 'level' (0-10) */
  scale?: "percent" | "level";
  /** Total bar width in characters */
  width?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Custom filled character */
  filledChar?: string;
  /** Custom empty character */
  emptyChar?: string;
}

export function ProgressBar({
  value,
  scale = "percent",
  width = 20,
  showLabel = true,
  filledChar = "\u2588",
  emptyChar = "\u2591",
}: ProgressBarProps) {
  const normalizedValue = scale === "level" ? value * 10 : value;
  const clampedValue = Math.max(0, Math.min(100, normalizedValue));
  const filledCount = Math.round((clampedValue / 100) * width);
  const emptyCount = width - filledCount;

  return (
    <span className="font-mono">
      <span className="text-bios-success">
        [{filledChar.repeat(filledCount)}
      </span>
      <span className="text-[#606060]">{emptyChar.repeat(emptyCount)}</span>
      <span className="text-bios-success">]</span>
      {showLabel && (
        <span className="text-[#000000] ml-2">{clampedValue}%</span>
      )}
    </span>
  );
}
