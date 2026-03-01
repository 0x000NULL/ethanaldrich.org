interface SectionHelpFooterProps {
  text?: string;
}

export function SectionHelpFooter({
  text = "Press F1 for Help | PgUp/PgDn to scroll | ESC to exit",
}: SectionHelpFooterProps) {
  return <div className="text-[#606060] text-xs text-center mt-4">{text}</div>;
}
