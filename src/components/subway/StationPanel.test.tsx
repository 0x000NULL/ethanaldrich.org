import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, within, waitFor } from "@testing-library/react";
import StationPanel from "./StationPanel";
import { useNavStore } from "@/store/nav-store";

beforeEach(() => {
  useNavStore.setState({ selectedStationCode: null, panelOpen: false });
  // The panel fetches post titles for "Related writing" on mount.
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
});

afterEach(() => vi.unstubAllGlobals());

describe("StationPanel", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<StationPanel />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("renders the selected station's case-study card", () => {
    useNavStore.setState({ selectedStationCode: "C-01", panelOpen: true });
    const { getByRole, getByText } = render(<StationPanel />);
    const dialog = getByRole("dialog");
    expect(within(dialog).getByText("Malco / Budget")).toBeTruthy();
    expect(within(dialog).getByText(/In service/i)).toBeTruthy();
    expect(within(dialog).getByText("Kubernetes")).toBeTruthy(); // stack chip
    expect(getByText(/Résumé \(PDF\)/i)).toBeTruthy(); // link
  });

  it("shows transfers and navigates to the partner station", () => {
    useNavStore.setState({ selectedStationCode: "E-06", panelOpen: true });
    const { getByRole } = render(<StationPanel />);
    fireEvent.click(
      getByRole("button", { name: /Transfer to Security Observability Stack/i })
    );
    expect(useNavStore.getState().selectedStationCode).toBe("P-04");
  });

  it("links related blog posts by title once /api/blog resolves", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { slug: "montr-signage", title: "Building Montr", date: "04-09-2026" },
            ]),
        } as Response)
      )
    );
    useNavStore.setState({ selectedStationCode: "P-07", panelOpen: true });
    const { findByRole } = render(<StationPanel />);
    const link = await findByRole("link", { name: "Building Montr" });
    expect(link.getAttribute("href")).toBe("/blog/montr-signage");
  });

  it("falls back to the slug when the post list is unavailable", async () => {
    useNavStore.setState({ selectedStationCode: "P-07", panelOpen: true });
    const { getByRole } = render(<StationPanel />);
    await waitFor(() => {
      expect(
        getByRole("link", { name: "montr-signage" }).getAttribute("href")
      ).toBe("/blog/montr-signage");
    });
  });

  it("renders a minimal station without optional sections", () => {
    useNavStore.setState({ selectedStationCode: "E-01", panelOpen: true });
    const { getByRole, queryByText } = render(<StationPanel />);
    const dialog = getByRole("dialog");
    expect(within(dialog).getByText("High School")).toBeTruthy();
    expect(queryByText("Stack")).toBeNull();
    expect(queryByText("Transfers")).toBeNull();
    expect(queryByText("Related writing")).toBeNull();
  });

  it("flags express service", () => {
    useNavStore.setState({ selectedStationCode: "C-03", panelOpen: true });
    const { getByText } = render(<StationPanel />);
    expect(getByText("Express")).toBeTruthy();
  });

  it("closes via the close button", () => {
    useNavStore.setState({ selectedStationCode: "C-01", panelOpen: true });
    const { getByRole } = render(<StationPanel />);
    fireEvent.click(getByRole("button", { name: /close station details/i }));
    expect(useNavStore.getState().panelOpen).toBe(false);
  });
});
