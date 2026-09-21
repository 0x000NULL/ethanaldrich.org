// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { mdxOptions } from "./mdxOptions";

/**
 * Every MDX file in the repo must actually compile.
 *
 * The build only renders what it publishes, so a draft post with broken MDX -
 * an unclosed expression, a stray brace, a bad comment - sits undetected until
 * the day `draft` is flipped off, which is exactly when nobody wants to find
 * it. Station case studies have the same exposure: they are compiled at request
 * time on /station/[code] behind a try/catch that silently degrades to a <pre>.
 */

const DIRS = [
  path.join(process.cwd(), "src", "content", "blog"),
  path.join(process.cwd(), "src", "content", "stations"),
];

function mdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => path.join(dir, f));
}

const files = DIRS.flatMap(mdxFiles);

describe("MDX content compiles", () => {
  it("finds content to check", () => {
    // Guards against the globs silently matching nothing.
    expect(files.length).toBeGreaterThan(5);
  });

  it.each(files.map((f) => [path.basename(path.dirname(f)) + "/" + path.basename(f), f]))(
    "%s",
    async (_name, file) => {
      const { content } = matter(fs.readFileSync(file, "utf8"));
      await expect(serialize(content, { mdxOptions })).resolves.toBeTruthy();
    },
    30_000
  );
});

/**
 * In-page anchors must point at a heading that exists.
 *
 * The yacht post carries a hand-written table of contents. Rename or renumber a
 * heading and every one of those links quietly becomes a no-op - the page still
 * renders, nothing errors, and the only symptom is a reader clicking and not
 * moving. IDs are read from the compiled output rather than re-derived, so this
 * checks what rehype-slug actually produced.
 */
describe("in-page anchors resolve", () => {
  it.each(files.map((f) => [path.basename(path.dirname(f)) + "/" + path.basename(f), f]))(
    "%s",
    async (_name, file) => {
      const raw = fs.readFileSync(file, "utf8");
      const { content } = matter(raw);

      const anchors = [...content.matchAll(/\]\(#([^)\s]+)\)/g)].map((m) => m[1]);
      if (anchors.length === 0) return;

      // compiledSource is JavaScript, not JSON, so ids appear as `id: "slug"`.
      const { compiledSource } = await serialize(content, { mdxOptions });
      const ids = new Set(
        [...compiledSource.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1])
      );
      // Guard against the regex silently matching nothing and passing vacuously.
      expect(ids.size).toBeGreaterThan(0);

      const broken = anchors.filter((a) => !ids.has(a));
      expect(broken).toEqual([]);
    },
    30_000
  );
});
