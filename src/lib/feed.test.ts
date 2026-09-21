import { describe, it, expect } from "vitest";
import { buildRssFeed, escapeXml } from "./feed";
import { PROFILE } from "@/data/profile";
import type { BlogPostMeta } from "./blog";

function post(over: Partial<BlogPostMeta> = {}): BlogPostMeta {
  return {
    id: "a-post",
    slug: "a-post",
    title: "A Post",
    description: "About things.",
    date: "02-28-2026",
    tags: ["rust"],
    readingTime: "3 min read",
    ...over,
  } as BlogPostMeta;
}

describe("escapeXml", () => {
  it("escapes the five XML entities", () => {
    expect(escapeXml(`Tom & "Jerry" <b> 'x'`)).toBe(
      "Tom &amp; &quot;Jerry&quot; &lt;b&gt; &apos;x&apos;"
    );
  });

  it("escapes ampersands before the entities it introduces", () => {
    // A naive implementation double-escapes to &amp;lt;
    expect(escapeXml("<")).toBe("&lt;");
    expect(escapeXml("&amp;")).toBe("&amp;amp;");
  });
});

describe("buildRssFeed", () => {
  const now = new Date("2026-09-21T00:00:00Z");

  it("emits a well-formed RSS 2.0 channel", () => {
    const xml = buildRssFeed([post()], now);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<channel>");
    expect(xml.trimEnd().endsWith("</rss>")).toBe(true);
  });

  it("points the self link and item links at the real site", () => {
    const xml = buildRssFeed([post()], now);
    expect(xml).toContain(`${PROFILE.site}/feed.xml`);
    expect(xml).toContain(`<link>${PROFILE.site}/blog/a-post</link>`);
    expect(xml).toContain(
      `<guid isPermaLink="true">${PROFILE.site}/blog/a-post</guid>`
    );
  });

  it("formats pubDate as RFC 822, which is what RSS 2.0 requires", () => {
    const xml = buildRssFeed([post({ date: "02-28-2026" })], now);
    expect(xml).toContain("<pubDate>Sat, 28 Feb 2026 00:00:00 GMT</pubDate>");
  });

  it("escapes titles and descriptions", () => {
    const xml = buildRssFeed(
      [post({ title: "Rust & <Node>", description: `He said "hi"` })],
      now
    );
    expect(xml).toContain("<title>Rust &amp; &lt;Node&gt;</title>");
    expect(xml).toContain("&quot;hi&quot;");
    expect(xml).not.toContain("<title>Rust & <Node></title>");
  });

  it("emits one category per tag", () => {
    const xml = buildRssFeed([post({ tags: ["rust", "nodejs"] })], now);
    expect(xml).toContain("<category>rust</category>");
    expect(xml).toContain("<category>nodejs</category>");
  });

  it("produces a valid empty channel when there are no posts", () => {
    const xml = buildRssFeed([], now);
    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });

  it("lists every post given", () => {
    const xml = buildRssFeed(
      [post({ slug: "one" }), post({ slug: "two" }), post({ slug: "three" })],
      now
    );
    expect(xml.match(/<item>/g)).toHaveLength(3);
  });
});
