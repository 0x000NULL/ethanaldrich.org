import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Reads the long-form station case studies that `Station.hasBody` advertises.
 *
 * The flag long predated any content: `src/content/stations/` did not exist and
 * nothing read it, so every station rendered a single summary sentence and the
 * stations claiming a case study were indistinguishable from the ones that were
 * not. The directory is real now, and `stations.test.ts` asserts the flag and
 * the files on disk match in both directions, so they cannot drift apart again.
 *
 * Deliberately mirrors src/lib/blog.ts, including its slug sanitising: commit
 * 423f07f fixed a CWE-22 path traversal there, and a copy of that module without
 * the guard would quietly reintroduce the same bug on a new route.
 */

const STATION_DIR = path.join(process.cwd(), "src/content/stations");

export interface StationBody {
  /** Rendered MDX source, frontmatter stripped. */
  content: string;
  /** Optional heading shown above the body; defaults to "Case study". */
  title?: string;
}

/** Station codes are `E-06`, `P-04` … — letters, digits and a single hyphen. */
function sanitizeCode(code: string): string {
  return code.replace(/[^a-zA-Z0-9-]/g, "");
}

export function getStationBody(code: string): StationBody | null {
  const safe = sanitizeCode(code);
  if (!safe) return null;

  const mdxPath = path.join(STATION_DIR, `${safe}.mdx`);

  // Resolve and re-check: sanitising alone would still allow a crafted relative
  // code to escape if the character class were ever loosened.
  if (!path.resolve(mdxPath).startsWith(path.resolve(STATION_DIR))) return null;
  if (!fs.existsSync(mdxPath)) return null;

  const { data, content } = matter(fs.readFileSync(mdxPath, "utf8"));
  return { content, title: (data.title as string) || undefined };
}

/** Station codes that actually have a case-study file on disk. */
export function getStationsWithBodies(): string[] {
  if (!fs.existsSync(STATION_DIR)) return [];
  return fs
    .readdirSync(STATION_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
