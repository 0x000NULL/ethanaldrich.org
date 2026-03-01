import { http, HttpResponse } from "msw";

export const handlers = [
  // Blog list endpoint
  http.get("/api/blog", () => {
    return HttpResponse.json([
      {
        id: "test-post-1",
        title: "Test Post 1",
        slug: "test-post-1",
        date: "02-28-2026",
        description: "A test post for testing",
        filename: "TEST1",
        extension: "MDX",
        size: 1024,
      },
      {
        id: "test-post-2",
        title: "Test Post 2",
        slug: "test-post-2",
        date: "02-27-2026",
        description: "Another test post",
        filename: "TEST2",
        extension: "MDX",
        size: 2048,
      },
    ]);
  }),

  // Single blog post endpoint
  http.get("/api/blog/:slug", ({ params }) => {
    const { slug } = params;

    if (slug === "not-found") {
      return HttpResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return HttpResponse.json({
      id: slug,
      title: "Test Post",
      slug: slug,
      date: "02-28-2026",
      description: "A test post",
      filename: "TEST",
      extension: "MDX",
      size: 1024,
      content: "# Test Content\n\nThis is test content.",
      mdxSource: {
        compiledSource: "/* compiled mdx */",
        scope: {},
        frontmatter: {},
      },
    });
  }),

  // Stats GET endpoint
  http.get("/api/stats", () => {
    return HttpResponse.json({
      visitors: 100,
      pageViews: 500,
      lastVisit: "2026-02-28T00:00:00Z",
    });
  }),

  // Stats POST endpoint
  http.post("/api/stats", () => {
    return HttpResponse.json({
      visitors: 101,
      pageViews: 501,
      lastVisit: new Date().toISOString(),
    });
  }),
];
