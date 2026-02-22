"use client";

import Image from "next/image";

interface DesktopIconProps {
  label: string;
  iconSrc: string;
  onClick: () => void;
  isActive?: boolean;
}

export default function DesktopIcon({
  label,
  iconSrc,
  onClick,
  isActive = false,
}: DesktopIconProps) {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-1 p-2 w-20
        hover:bg-[#000080]/50 focus:bg-[#000080]/50
        ${isActive ? "bg-[#000080]/50" : ""}
        transition-colors cursor-pointer
      `}
      aria-label={`Open ${label}`}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <Image
          src={iconSrc}
          alt={label}
          width={32}
          height={32}
          className="pixelated"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <span className="text-xs text-center text-white break-words leading-tight">
        {label}
      </span>
    </button>
  );
}
