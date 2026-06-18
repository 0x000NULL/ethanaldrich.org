import type { ComponentProps } from "react";

/**
 * Shared MDX renderers, restyled for the paper/ink metro theme. Extracted from the
 * old BlogSection so blog posts and station case studies render consistently.
 */
export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="mb-4 mt-2 text-2xl font-bold text-[var(--metro-ink)]" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mb-3 mt-6 text-xl font-bold text-[var(--metro-ink)]" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mb-2 mt-4 text-lg font-bold text-[var(--metro-ink)]" {...props} />
  ),
  p: (props: ComponentProps<"p">) => <p className="mb-3 leading-relaxed" {...props} />,
  ul: (props: ComponentProps<"ul">) => (
    <ul className="mb-3 ml-5 list-disc space-y-1" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="mb-3 ml-5 list-decimal space-y-1" {...props} />
  ),
  li: (props: ComponentProps<"li">) => <li className="leading-relaxed" {...props} />,
  a: (props: ComponentProps<"a">) => (
    <a
      className="font-medium underline decoration-[var(--metro-ink-dim)] underline-offset-2 hover:decoration-[var(--metro-ink)]"
      {...props}
    />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      className="board-type rounded bg-[var(--metro-bg)] px-1 py-0.5 text-sm"
      style={{ border: "1px solid var(--metro-border)" }}
      {...props}
    />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className="board-type mb-3 overflow-x-auto rounded bg-[var(--metro-bg)] p-3 text-sm"
      style={{ border: "1px solid var(--metro-border)" }}
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="mb-3 border-l-4 pl-4 italic text-[var(--metro-ink-dim)]"
      style={{ borderColor: "var(--metro-border)" }}
      {...props}
    />
  ),
  hr: () => <hr className="my-6" style={{ borderColor: "var(--metro-border)" }} />,
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-bold text-[var(--metro-ink)]" {...props} />
  ),
  em: (props: ComponentProps<"em">) => <em className="italic" {...props} />,
};
