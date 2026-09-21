import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Guards against referencing a CSS custom property that nothing defines.
 *
 * `error.tsx` shipped `border-[var(--line-s)]` for months. No such token exists
 * — the lines are e/c/p/w — so `border-color` fell back to the inherited value
 * and the error page's warning roundel rendered in the wrong colour. The file
 * was at "100% coverage" the whole time, because coverage measures which lines
 * ran, not whether what they produced was right.
 */

const SRC = path.join(process.cwd(), "src");
const GLOBALS = path.join(SRC, "app", "globals.css");
const THEMES = path.join(SRC, "lib", "themes.ts");

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(ts|tsx|css)$/.test(entry.name) ? [full] : [];
  });
}

function definedTokens(): Set<string> {
  const tokens = new Set<string>();

  // Declarations in globals.css: `--foo: value;`
  const css = fs.readFileSync(GLOBALS, "utf8");
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/gi)) tokens.add(m[1]);

  // themes.ts writes its keys to :root at runtime as `--<key>`.
  const themes = fs.readFileSync(THEMES, "utf8");
  for (const m of themes.matchAll(/"(metro-[a-z-]+)"\s*:/gi)) {
    tokens.add(`--${m[1]}`);
  }

  return tokens;
}

describe("CSS custom properties", () => {
  const defined = definedTokens();

  it("defines the palette both globals.css and themes.ts rely on", () => {
    // Sanity check on the extractor itself, so a regex that silently matches
    // nothing can't make the real assertion below vacuously pass.
    expect(defined.has("--metro-bg")).toBe(true);
    expect(defined.has("--line-e")).toBe(true);
    expect(defined.size).toBeGreaterThan(10);
  });

  it("never references a var(--token) that nothing defines", () => {
    const missing = new Map<string, string[]>();

    for (const file of walk(SRC)) {
      if (/\.test\.(ts|tsx)$/.test(file)) continue;
      const source = fs.readFileSync(file, "utf8");
      for (const m of source.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
        const token = m[1];
        if (defined.has(token)) continue;
        // A var() with its own fallback, e.g. var(--x, #fff), is intentional.
        const rest = source.slice(m.index! + m[0].length);
        if (/^\s*,/.test(rest)) continue;
        const rel = path.relative(process.cwd(), file);
        missing.set(token, [...(missing.get(token) ?? []), rel]);
      }
    }

    expect(Object.fromEntries(missing)).toEqual({});
  });
});
