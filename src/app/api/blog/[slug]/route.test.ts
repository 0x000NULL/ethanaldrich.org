import { describe, it, expect } from "vitest";
import { GET } from "./route";

function req() {
  return new Request("http://localhost/api/blog/x");
}

describe("GET /api/blog/[slug]", () => {
  it("serializes and returns a known post", async () => {
    const res = await GET(req(), {
      params: Promise.resolve({ slug: "homelab-setup" }),
    });
    expect(res.status).toBe(200);
    const post = await res.json();
    expect(post.slug).toBe("homelab-setup");
    expect(post.mdxSource).toBeTruthy();
  });

  it("rejects an invalid slug", async () => {
    const res = await GET(req(), {
      params: Promise.resolve({ slug: "../etc/passwd" }),
    });
    expect(res.status).toBe(400);
  });

  it("404s for a missing post", async () => {
    const res = await GET(req(), {
      params: Promise.resolve({ slug: "does-not-exist" }),
    });
    expect(res.status).toBe(404);
  });

  it("highlights fenced code via the shared mdxOptions pipeline", async () => {
    // montr-signage contains a ```rust fence; rehype-pretty-code wraps it in a
    // figure marker, proving the API path runs the same plugins as the page.
    const res = await GET(req(), {
      params: Promise.resolve({ slug: "montr-signage" }),
    });
    expect(res.status).toBe(200);
    const post = await res.json();
    expect(post.mdxSource.compiledSource).toContain("rehype-pretty-code");
  });
});
