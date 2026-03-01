interface SectionHeaderProps {
  title: string;
  width?: number;
}

export function SectionHeader({ title, width = 60 }: SectionHeaderProps) {
  const innerWidth = width - 2;
  const padding = Math.max(0, innerWidth - title.length);
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;

  return (
    <div className="text-[#000000] text-lg mb-4 whitespace-pre font-mono">
      {"\u2554"}
      {"\u2550".repeat(innerWidth)}
      {"\u2557"}
      <br />
      {"\u2551"}
      {" ".repeat(leftPad)}
      {title}
      {" ".repeat(rightPad)}
      {"\u2551"}
      <br />
      {"\u255A"}
      {"\u2550".repeat(innerWidth)}
      {"\u255D"}
    </div>
  );
}
