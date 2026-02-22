import { create } from "zustand";

export type WindowId =
  | "about"
  | "career"
  | "projects"
  | "skills"
  | "contact"
  | "blog"
  | "games";

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  position: { x: number; y: number };
  zIndex: number;
}

export type AppState = "booting" | "setup" | "desktop";
export type ThemeVariant = "blue" | "green" | "amber";

interface DesktopStore {
  // App state
  appState: AppState;
  setAppState: (state: AppState) => void;

  // Theme
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;

  // Boot state
  hasBooted: boolean;
  setHasBooted: (booted: boolean) => void;
  skipBoot: boolean;
  setSkipBoot: (skip: boolean) => void;

  // Window management
  windows: WindowState[];
  activeWindowId: WindowId | null;
  maxZIndex: number;

  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, position: { x: number; y: number }) => void;
  closeAllWindows: () => void;
}

const defaultWindows: WindowState[] = [
  { id: "about", title: "ABOUT.EXE", isOpen: false, position: { x: 50, y: 50 }, zIndex: 0 },
  { id: "career", title: "CAREER.EXE", isOpen: false, position: { x: 80, y: 80 }, zIndex: 0 },
  { id: "projects", title: "PROJECTS.EXE", isOpen: false, position: { x: 110, y: 110 }, zIndex: 0 },
  { id: "skills", title: "SKILLS.DAT", isOpen: false, position: { x: 140, y: 140 }, zIndex: 0 },
  { id: "contact", title: "CONTACT.COM", isOpen: false, position: { x: 170, y: 170 }, zIndex: 0 },
  { id: "blog", title: "BLOG.TXT", isOpen: false, position: { x: 200, y: 200 }, zIndex: 0 },
  { id: "games", title: "GAMES.EXE", isOpen: false, position: { x: 230, y: 230 }, zIndex: 0 },
];

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  // App state
  appState: "booting",
  setAppState: (state) => set({ appState: state }),

  // Theme
  theme: "blue",
  setTheme: (theme) => set({ theme }),

  // Boot state
  hasBooted: false,
  setHasBooted: (booted) => set({ hasBooted: booted }),
  skipBoot: false,
  setSkipBoot: (skip) => set({ skipBoot: skip }),

  // Window management
  windows: defaultWindows,
  activeWindowId: null,
  maxZIndex: 0,

  openWindow: (id) => {
    const { windows, maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    set({
      windows: windows.map((w) =>
        w.id === id ? { ...w, isOpen: true, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      maxZIndex: newZIndex,
    });
  },

  closeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const updatedWindows = windows.map((w) =>
      w.id === id ? { ...w, isOpen: false } : w
    );
    const openWindows = updatedWindows.filter((w) => w.isOpen);
    const newActiveId =
      activeWindowId === id
        ? openWindows.length > 0
          ? openWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id
          : null
        : activeWindowId;

    set({
      windows: updatedWindows,
      activeWindowId: newActiveId,
    });
  },

  focusWindow: (id) => {
    const { windows, maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    set({
      windows: windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      maxZIndex: newZIndex,
    });
  },

  moveWindow: (id, position) => {
    const { windows } = get();
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, position } : w)),
    });
  },

  closeAllWindows: () => {
    const { windows } = get();
    set({
      windows: windows.map((w) => ({ ...w, isOpen: false })),
      activeWindowId: null,
    });
  },
}));
