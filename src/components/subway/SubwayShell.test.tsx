import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useNavStore } from "@/store/nav-store";

const INTRO_KEY = "aldrich-subway-intro-seen";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true } as Response))
  );
  useNavStore.setState({ selectedStationCode: null, panelOpen: false });
  // Skip the splash by default so map assertions aren't covered by the overlay.
  sessionStorage.setItem(INTRO_KEY, "true");
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  sessionStorage.clear();
});

describe("SubwayShell", () => {
  it("mounts past the hydration gate and renders the map + legend + outline", async () => {
    const { default: SubwayShell } = await import("./SubwayShell");
    const { container, findByRole } = render(<SubwayShell />);

    // The map (role=img) and the a11y nav both appear after mount.
    expect(await findByRole("img")).toBeTruthy();
    expect(container.querySelector("nav")).toBeTruthy();
    expect(container.querySelector("aside")).toBeTruthy();
  });

  it("tracks a visit once per session", async () => {
    const { default: SubwayShell } = await import("./SubwayShell");
    render(<SubwayShell />);
    expect(fetch).toHaveBeenCalledWith("/api/stats", { method: "POST" });
  });

  it("opens the station named in a ?station= deep link", async () => {
    window.history.replaceState(null, "", "/?station=P-07");
    const { default: SubwayShell } = await import("./SubwayShell");
    render(<SubwayShell />);
    await waitFor(() =>
      expect(useNavStore.getState().selectedStationCode).toBe("P-07")
    );
  });

  it("shows the intro splash when it has not been seen", async () => {
    sessionStorage.removeItem(INTRO_KEY);
    const { default: SubwayShell } = await import("./SubwayShell");
    const { findByRole } = render(<SubwayShell />);
    expect(await findByRole("dialog", { name: /aldrich transit/i })).toBeTruthy();
  });

  it("renders the strip map instead of the SVG on small screens", async () => {
    const original = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { value: 375, configurable: true });
    try {
      const { default: SubwayShell } = await import("./SubwayShell");
      const { findByText, queryByRole } = render(<SubwayShell />);
      expect(await findByText("Tap a station for the story.")).toBeTruthy();
      expect(queryByRole("img")).toBeNull();
      await waitFor(() =>
        expect(useNavStore.getState().viewMode).toBe("strip")
      );
    } finally {
      Object.defineProperty(window, "innerWidth", {
        value: original,
        configurable: true,
      });
    }
  });
});
