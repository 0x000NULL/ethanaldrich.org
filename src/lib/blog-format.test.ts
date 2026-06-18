import { describe, it, expect } from "vitest";
import type { BlogPostMeta } from "./blog";
import {
  formatDate,
  toISODate,
  readingTimeLabel,
  getAdjacentPosts,
  getRelatedPosts,
  groupPostsByYear,
  resolvePostRefs,
} from "./blog-format";

function post(overrides: Partial<BlogPostMeta> & { slug: string }): BlogPostMeta {
  return {
    id: overrides.slug,
    slug: overrides.slug,
    date: "01-01-2026",
    title: overrides.slug,
    description: "",
    tags: [],
    readingTime: "1 min read",
    ...overrides,
  };
}

describe("formatDate", () => {
  it("formats a valid MM-DD-YYYY date with the exact day (no TZ drift)", () => {
    expect(formatDate("01-15-2026")).toBe("January 15, 2026");
    expect(formatDate("12-01-2025")).toBe("December 1, 2025");
  });

  it("returns the input unchanged when unparseable", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
    expect(formatDate("")).toBe("");
    expect(formatDate("2026-01-15")).toBe("2026-01-15");
  });

  it("returns the input when the month is out of range", () => {
    expect(formatDate("13-01-2026")).toBe("13-01-2026");
    expect(formatDate("00-01-2026")).toBe("00-01-2026");
  });
});

describe("toISODate", () => {
  it("rearranges MM-DD-YYYY into ISO YYYY-MM-DD", () => {
    expect(toISODate("01-15-2026")).toBe("2026-01-15");
  });

  it("returns the input unchanged when unparseable", () => {
    expect(toISODate("nope")).toBe("nope");
  });
});

describe("readingTimeLabel", () => {
  it("floors at one minute for empty or tiny content", () => {
    expect(readingTimeLabel("")).toBe("1 min read");
    expect(readingTimeLabel("   ")).toBe("1 min read");
    expect(readingTimeLabel("a few words here")).toBe("1 min read");
  });

  it("computes ~200 wpm", () => {
    expect(readingTimeLabel(Array(400).fill("w").join(" "))).toBe("2 min read");
    expect(readingTimeLabel(Array(1000).fill("w").join(" "))).toBe("5 min read");
  });
});

describe("getAdjacentPosts", () => {
  // date-descending order, as getBlogPosts returns
  const posts = [
    post({ slug: "c", date: "03-01-2026" }),
    post({ slug: "b", date: "02-01-2026" }),
    post({ slug: "a", date: "01-01-2026" }),
  ];

  it("returns both neighbours in the middle", () => {
    const { older, newer } = getAdjacentPosts(posts, "b");
    expect(older?.slug).toBe("a");
    expect(newer?.slug).toBe("c");
  });

  it("has no newer at the head and no older at the tail", () => {
    expect(getAdjacentPosts(posts, "c").newer).toBeUndefined();
    expect(getAdjacentPosts(posts, "c").older?.slug).toBe("b");
    expect(getAdjacentPosts(posts, "a").older).toBeUndefined();
    expect(getAdjacentPosts(posts, "a").newer?.slug).toBe("b");
  });

  it("returns empty when the slug is unknown", () => {
    expect(getAdjacentPosts(posts, "zzz")).toEqual({});
  });

  it("returns empty neighbours for a single-post list", () => {
    const one = [post({ slug: "only" })];
    expect(getAdjacentPosts(one, "only")).toEqual({ newer: undefined, older: undefined });
  });
});

describe("getRelatedPosts", () => {
  it("ranks by shared-tag count when tags exist", () => {
    const current = post({ slug: "cur", tags: ["k8s", "rust"] });
    const candidates = [
      post({ slug: "none", tags: ["cars"], date: "01-02-2026" }),
      post({ slug: "both", tags: ["k8s", "rust"], date: "01-01-2020" }),
      post({ slug: "one", tags: ["rust"], date: "01-03-2026" }),
      current,
    ];
    const related = getRelatedPosts(candidates, current);
    expect(related.map((p) => p.slug)).toEqual(["both", "one", "none"]);
  });

  it("excludes the current post and respects the limit", () => {
    const current = post({ slug: "cur", tags: ["x"] });
    const candidates = [
      current,
      post({ slug: "a", tags: ["x"] }),
      post({ slug: "b", tags: ["x"] }),
      post({ slug: "c", tags: ["x"] }),
    ];
    const related = getRelatedPosts(candidates, current, 2);
    expect(related).toHaveLength(2);
    expect(related.find((p) => p.slug === "cur")).toBeUndefined();
  });

  it("falls back to date proximity when there are no shared tags", () => {
    const current = post({ slug: "cur", tags: [], date: "06-01-2026" });
    const candidates = [
      current,
      post({ slug: "far", tags: [], date: "01-01-2020" }),
      post({ slug: "near", tags: [], date: "06-10-2026" }),
    ];
    const related = getRelatedPosts(candidates, current, 1);
    expect(related.map((p) => p.slug)).toEqual(["near"]);
  });

  it("tolerates posts with no tags field and unparseable dates", () => {
    // tags omitted entirely (exercises the `?? []` guards) and dates unparseable
    // (exercises parseDateMs's no-match path).
    const noTags = (slug: string, date: string): BlogPostMeta =>
      ({
        id: slug,
        slug,
        date,
        title: slug,
        description: "",
        readingTime: "1 min read",
      }) as unknown as BlogPostMeta;

    const current = noTags("cur", "garbage");
    const related = getRelatedPosts(
      [current, noTags("a", "also-bad")],
      current,
      1
    );
    expect(related.map((p) => p.slug)).toEqual(["a"]);
  });
});

describe("groupPostsByYear", () => {
  it("groups by year, years descending, within-year order preserved", () => {
    const posts = [
      post({ slug: "a", date: "03-01-2026" }),
      post({ slug: "b", date: "01-01-2026" }),
      post({ slug: "c", date: "05-01-2025" }),
    ];
    const groups = groupPostsByYear(posts);
    expect(groups.map((g) => g.year)).toEqual(["2026", "2025"]);
    expect(groups[0].posts.map((p) => p.slug)).toEqual(["a", "b"]);
    expect(groups[1].posts.map((p) => p.slug)).toEqual(["c"]);
  });

  it("returns an empty array for no posts", () => {
    expect(groupPostsByYear([])).toEqual([]);
  });

  it("buckets unparseable dates under 'Undated'", () => {
    const groups = groupPostsByYear([post({ slug: "x", date: "garbage" })]);
    expect(groups[0].year).toBe("Undated");
  });
});

describe("resolvePostRefs", () => {
  const posts = [post({ slug: "a" }), post({ slug: "b" }), post({ slug: "c" })];

  it("resolves slugs to posts in the given order", () => {
    expect(resolvePostRefs(posts, ["c", "a"]).map((p) => p.slug)).toEqual(["c", "a"]);
  });

  it("drops unknown slugs", () => {
    expect(resolvePostRefs(posts, ["a", "missing", "b"]).map((p) => p.slug)).toEqual([
      "a",
      "b",
    ]);
  });

  it("returns empty for no slugs", () => {
    expect(resolvePostRefs(posts, [])).toEqual([]);
  });
});
