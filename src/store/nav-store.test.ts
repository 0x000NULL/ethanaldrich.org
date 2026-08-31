import { describe, it, expect, beforeEach, vi } from "vitest";
import { useNavStore } from "./nav-store";
import { IDENTITY } from "@/lib/subway/viewport";

const initial = useNavStore.getState();

beforeEach(() => {
  useNavStore.setState({
    theme: "metro",
    selectedStationCode: null,
    hoveredStationCode: null,
    panelOpen: false,
    viewMode: "map",
    transform: IDENTITY,
    reducedMotion: false,
    introSeen: false,
    dismissedAlerts: [],
  });
});

describe("selection", () => {
  it("selecting a station opens the panel", () => {
    initial.selectStation("P-07");
    const s = useNavStore.getState();
    expect(s.selectedStationCode).toBe("P-07");
    expect(s.panelOpen).toBe(true);
  });

  it("selecting null closes the panel", () => {
    initial.selectStation("P-07");
    initial.selectStation(null);
    expect(useNavStore.getState().panelOpen).toBe(false);
  });

  it("closePanel clears selection", () => {
    initial.selectStation("C-01");
    initial.closePanel();
    const s = useNavStore.getState();
    expect(s.panelOpen).toBe(false);
    expect(s.selectedStationCode).toBeNull();
  });

  it("tracks hover independently", () => {
    initial.setHoveredStation("E-05");
    expect(useNavStore.getState().hoveredStationCode).toBe("E-05");
  });
});

describe("view", () => {
  it("switches view mode", () => {
    initial.setViewMode("strip");
    expect(useNavStore.getState().viewMode).toBe("strip");
  });

  it("stores the transform", () => {
    initial.setTransform({ x: 10, y: 20, k: 2 });
    expect(useNavStore.getState().transform).toEqual({ x: 10, y: 20, k: 2 });
  });

  it("records reduced-motion preference", () => {
    initial.setReducedMotion(true);
    expect(useNavStore.getState().reducedMotion).toBe(true);
  });
});

describe("intro splash", () => {
  it("dismissing persists to sessionStorage", () => {
    initial.dismissIntro();
    expect(useNavStore.getState().introSeen).toBe(true);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      "aldrich-subway-intro-seen",
      "true"
    );
  });

  it("initializes from sessionStorage", () => {
    vi.mocked(sessionStorage.getItem).mockReturnValue("true");
    initial.initializeIntro();
    expect(useNavStore.getState().introSeen).toBe(true);
  });
});

describe("service alerts", () => {
  it("dismissing an alert persists and dedupes", () => {
    initial.dismissAlert("a-network");
    initial.dismissAlert("a-network");
    expect(useNavStore.getState().dismissedAlerts).toEqual(["a-network"]);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "aldrich-subway-dismissed-alerts",
      JSON.stringify(["a-network"])
    );
  });

  it("initializes from localStorage", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(["a-certs"]));
    initial.initializeAlerts();
    expect(useNavStore.getState().dismissedAlerts).toEqual(["a-certs"]);
  });

  it("recovers from malformed storage", () => {
    vi.mocked(localStorage.getItem).mockReturnValue("{not json");
    initial.initializeAlerts();
    expect(useNavStore.getState().dismissedAlerts).toEqual([]);
  });
});

describe("theme", () => {
  it("setTheme persists and applies", () => {
    initial.setTheme("metro");
    expect(useNavStore.getState().theme).toBe("metro");
    expect(localStorage.setItem).toHaveBeenCalledWith("aldrich-theme", "metro");
  });

  it("initializeTheme reads the stored theme", () => {
    vi.mocked(localStorage.getItem).mockReturnValue("metro");
    initial.initializeTheme();
    expect(useNavStore.getState().theme).toBe("metro");
  });
});
