import { create } from "zustand";
import {
  type ThemeVariant,
  applyTheme,
  getStoredTheme,
  storeTheme,
} from "@/lib/themes";
import { type Viewport, IDENTITY } from "@/lib/subway/viewport";

export type { ThemeVariant };

export type ViewMode = "map" | "strip";

const INTRO_KEY = "aldrich-subway-intro-seen";
const ALERTS_KEY = "aldrich-subway-dismissed-alerts";

interface NavStore {
  // Theme (carried over from the old store; mechanism unchanged).
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  initializeTheme: () => void;

  // Selection / hover.
  selectedStationCode: string | null;
  hoveredStationCode: string | null;
  panelOpen: boolean;
  selectStation: (code: string | null) => void;
  setHoveredStation: (code: string | null) => void;
  closePanel: () => void;

  // View.
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  transform: Viewport;
  setTransform: (vp: Viewport) => void;

  // Motion preference (injected from the media query at mount).
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;

  // Intro splash (once per session).
  introSeen: boolean;
  dismissIntro: () => void;
  initializeIntro: () => void;

  // Service alerts.
  dismissedAlerts: string[];
  dismissAlert: (id: string) => void;
  initializeAlerts: () => void;
}

export const useNavStore = create<NavStore>((set, get) => ({
  theme: "metro",
  setTheme: (theme) => {
    applyTheme(theme);
    storeTheme(theme);
    set({ theme });
  },
  initializeTheme: () => {
    const stored = getStoredTheme();
    applyTheme(stored);
    set({ theme: stored });
  },

  selectedStationCode: null,
  hoveredStationCode: null,
  panelOpen: false,
  selectStation: (code) =>
    set({ selectedStationCode: code, panelOpen: code !== null }),
  setHoveredStation: (code) => set({ hoveredStationCode: code }),
  closePanel: () => set({ panelOpen: false, selectedStationCode: null }),

  viewMode: "map",
  setViewMode: (mode) => set({ viewMode: mode }),
  transform: IDENTITY,
  setTransform: (vp) => set({ transform: vp }),

  reducedMotion: false,
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

  introSeen: false,
  dismissIntro: () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(INTRO_KEY, "true");
    }
    set({ introSeen: true });
  },
  initializeIntro: () => {
    if (typeof window === "undefined") return;
    set({ introSeen: sessionStorage.getItem(INTRO_KEY) === "true" });
  },

  dismissedAlerts: [],
  dismissAlert: (id) => {
    const next = Array.from(new Set([...get().dismissedAlerts, id]));
    if (typeof window !== "undefined") {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(next));
    }
    set({ dismissedAlerts: next });
  },
  initializeAlerts: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(ALERTS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        set({ dismissedAlerts: parsed.filter((x): x is string => typeof x === "string") });
      }
    } catch {
      set({ dismissedAlerts: [] });
    }
  },
}));
