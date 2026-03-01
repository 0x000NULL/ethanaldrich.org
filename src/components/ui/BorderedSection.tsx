import { ReactNode } from "react";

interface BorderedSectionProps {
  children: ReactNode;
  className?: string;
}

export function BorderedSection({
  children,
  className = "",
}: BorderedSectionProps) {
  return (
    <div className={`border border-[#AAAAAA] p-3 ${className}`}>{children}</div>
  );
}
