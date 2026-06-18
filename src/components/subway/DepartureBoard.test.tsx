import { describe, it, expect, vi, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import DepartureBoard from "./DepartureBoard";

afterEach(() => vi.unstubAllGlobals());

describe("DepartureBoard", () => {
  it("renders the latest posts from /api/blog", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { slug: "montr-signage", title: "Building Montr", date: "04-09-2026" },
              { slug: "yacht-av-network", title: "Yacht AV", date: "02-28-2026" },
            ]),
        } as Response)
      )
    );
    const { findByText } = render(<DepartureBoard />);
    expect(await findByText("Building Montr")).toBeTruthy();
    const link = (await findByText("Building Montr")).closest("a");
    expect(link?.getAttribute("href")).toBe("/blog/montr-signage");
  });

  it("renders nothing when the fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
    const { container } = render(<DepartureBoard />);
    await waitFor(() => expect(container.querySelector("aside")).toBeNull());
  });
});
