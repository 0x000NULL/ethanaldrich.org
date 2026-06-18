import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/blog", () => {
  it("returns the list of blog post metadata", async () => {
    const res = await GET();
    const posts = await res.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty("slug");
    expect(posts[0]).toHaveProperty("title");
  });
});
