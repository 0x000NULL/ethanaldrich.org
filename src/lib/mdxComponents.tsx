import type { ComponentProps } from "react";

/**
 * Shared MDX renderers, restyled for the paper/ink metro theme. Used by both blog
 * posts and station case studies so they render consistently.
 *
 * Code blocks are highlighted at build time by rehype-pretty-code (see
 * src/lib/mdxOptions.ts): the block `<code>` carries data-language/data-theme and
 * its token `<span>`s have inline color styles, so we leave those untouched and the
 * `<pre>` frame below supplies the border/paper background.
 */
export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="mb-4 mt-2 scroll-mt-20 text-2xl font-bold text-[var(--metro-ink)]" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mb-3 mt-6 scroll-mt-20 text-xl font-bold text-[var(--metro-ink)]" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mb-2 mt-4 scroll-mt-20 text-lg font-bold text-[var(--metro-ink)]" {...props} />
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
  code: (props: ComponentProps<"code">) => {
    const rec = props as Record<string, unknown>;
    // Highlighted block code (inside <pre>) is annotated by rehype-pretty-code —
    // render it raw so the token spans keep their colors and no inline pill is added.
    if ("data-theme" in rec || "data-language" in rec) {
      return <code {...props} />;
    }
    return (
      <code
        className="board-type rounded bg-[var(--metro-bg)] px-1 py-0.5 text-sm"
        style={{ border: "1px solid var(--metro-border)" }}
        {...props}
      />
    );
  },
  pre: ({ style, ...props }: ComponentProps<"pre">) => (
    <pre
      className="board-type mb-3 overflow-x-auto rounded bg-[var(--metro-bg)] p-3 text-sm"
      style={{ border: "1px solid var(--metro-border)", ...style }}
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
  table: (props: ComponentProps<"table">) => (
    <div className="mb-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentProps<"th">) => (
    <th
      className="border px-3 py-1.5 text-left font-bold"
      style={{ borderColor: "var(--metro-border)" }}
      {...props}
    />
  ),
  td: (props: ComponentProps<"td">) => (
    <td
      className="border px-3 py-1.5 align-top"
      style={{ borderColor: "var(--metro-border)" }}
      {...props}
    />
  ),
  img: ({ alt, style, className, ...props }: ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`my-4 h-auto max-w-full rounded ${className ?? ""}`}
      style={{ border: "1px solid var(--metro-border)", ...style }}
      alt={alt ?? ""}
      {...props}
    />
  ),
  hr: () => <hr className="my-6" style={{ borderColor: "var(--metro-border)" }} />,
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-bold text-[var(--metro-ink)]" {...props} />
  ),
  em: (props: ComponentProps<"em">) => <em className="italic" {...props} />,
};
