import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

/**
 * Single source of truth for the MDX processing pipeline, imported by BOTH render
 * paths — `compileMDX` in src/app/blog/[slug]/page.tsx and `serialize` in
 * src/app/api/blog/[slug]/route.ts — so highlighted output can never drift.
 *
 * Highlighting is build-time (Shiki via rehype-pretty-code): it emits inline
 * `style="color:…"` token spans, so it needs no runtime JS and is compatible with
 * the CSP (`style-src 'unsafe-inline'`, no `'unsafe-eval'`). `keepBackground:false`
 * lets the metro `pre` frame (border + paper bg) from mdxComponents show through.
 */
const remarkPlugins: PluggableList = [remarkGfm];

const rehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypePrettyCode, { theme: "github-light", keepBackground: false }],
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
];

export const mdxOptions = { remarkPlugins, rehypePlugins };
