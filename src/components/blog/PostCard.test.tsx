import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { BlogPostMeta } from "@/lib/blog";
import PostCard from "./PostCard";

function post(overrides: Partial<BlogPostMeta> = {}): BlogPostMeta {
  return {
    id: "montr-signage",
    slug: "montr-signage",
    date: "04-09-2026",
    title: "Building Montr",
    description: "Distributed signage in Rust and Node.",
    tags: ["rust", "nodejs"],
    readingTime: "8 min read",
    ...overrides,
  };
}

describe("PostCard", () => {
  it("links the title to the post and shows date · reading time", () => {
    render(<PostCard post={post()} formattedDate="April 9, 2026" />);

    const title = screen.getByRole("link", { name: /Building Montr/ });
    expect(title).toHaveAttribute("href", "/blog/montr-signage");
    expect(screen.getByText(/April 9, 2026 · 8 min read/)).toBeInTheDocument();
    expect(
      screen.getByText("Distributed signage in Rust and Node.")
    ).toBeInTheDocument();
  });

  it("renders tag chips that link to the tag pages", () => {
    render(<PostCard post={post()} formattedDate="April 9, 2026" />);

    const rustTag = screen.getByRole("link", { name: "#rust" });
    expect(rustTag).toHaveAttribute("href", "/blog/tag/rust");
    expect(screen.getByRole("link", { name: "#nodejs" })).toHaveAttribute(
      "href",
      "/blog/tag/nodejs"
    );
  });

  it("omits the description and tag chips when absent", () => {
    render(
      <PostCard
        post={post({ description: "", tags: [] })}
        formattedDate="April 9, 2026"
      />
    );

    expect(screen.queryByText(/Distributed signage/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^#/ })).not.toBeInTheDocument();
  });
});
