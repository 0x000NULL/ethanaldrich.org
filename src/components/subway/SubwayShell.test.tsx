import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useNavStore } from "@/store/nav-store";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true } as Response))
  );
  useNavStore.setState({ selectedStationCode: null, panelOpen: false });
  window.history.replaceState(null, "", "/");
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
    window.history.replaceState(null, "", "/?station=P-09");
    const { default: SubwayShell } = await import("./SubwayShell");
    render(<SubwayShell />);
    await waitFor(() =>
      expect(useNavStore.getState().selectedStationCode).toBe("P-09")
    );
  });
});
