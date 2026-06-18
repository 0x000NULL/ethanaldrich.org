import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { BlogPostMeta } from "@/lib/blog";
import PostList from "./PostList";

function post(slug: string, overrides: Partial<BlogPostMeta> = {}): BlogPostMeta {
  return {
    id: slug,
    slug,
    date: "04-09-2026",
    title: `Title ${slug}`,
    description: "",
    tags: [],
    readingTime: "1 min read",
    ...overrides,
  };
}

describe("PostList", () => {
  it("renders a card per post with a formatted date", () => {
    render(<PostList posts={[post("a"), post("b"), post("c")]} />);

    expect(screen.getByRole("link", { name: /Title a/ })).toHaveAttribute(
      "href",
      "/blog/a"
    );
    expect(screen.getAllByText(/April 9, 2026 · 1 min read/)).toHaveLength(3);
  });

  it("shows the empty state and a back-to-map link when there are no posts", () => {
    render(<PostList posts={[]} />);

    expect(screen.getByText("No departures scheduled yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to the map/ })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("uses a custom empty message when provided", () => {
    render(<PostList posts={[]} emptyMessage="No posts under this tag." />);
    expect(screen.getByText("No posts under this tag.")).toBeInTheDocument();
  });
});
