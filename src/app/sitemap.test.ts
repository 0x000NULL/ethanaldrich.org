import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes the home page", () => {
    const entries = sitemap();
    expect(entries.some((e) => e.url === "https://ethanaldrich.org")).toBe(true);
  });

  it("includes blog post URLs", () => {
    const entries = sitemap();
    const blog = entries.filter((e) => e.url.includes("/blog/"));
    expect(blog.length).toBeGreaterThan(0);
    expect(blog[0].url).toMatch(/^https:\/\/ethanaldrich\.org\/blog\//);
  });

  it("includes per-station URLs", () => {
    const entries = sitemap();
    expect(entries.some((e) => e.url.endsWith("/station/P-07"))).toBe(true);
  });

  it("includes the resume PDF", () => {
    const entries = sitemap();
    expect(entries.some((e) => e.url.endsWith("/resume.pdf"))).toBe(true);
  });
});
