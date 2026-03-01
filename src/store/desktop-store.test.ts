import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDesktopStore, WindowId } from "./desktop-store";

// Mock the theme functions
vi.mock("@/lib/themes", () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => "blue"),
  storeTheme: vi.fn(),
}));

describe("desktop-store", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useDesktopStore.setState({
      appState: "booting",
      theme: "blue",
      hasBooted: false,
      skipBoot: false,
      turboUnlocked: false,
      terminalOpen: false,
      windows: [
        { id: "about", title: "ABOUT.EXE", isOpen: false, isMinimized: false, isMaximized: false, position: { x: 50, y: 50 }, zIndex: 0 },
        { id: "career", title: "CAREER.EXE", isOpen: false, isMinimized: false, isMaximized: false, position: { x: 80, y: 80 }, zIndex: 0 },
        { id: "projects", title: "PROJECTS.EXE", isOpen: false, isMinimized: false, isMaximized: false, position: { x: 110, y: 110 }, zIndex: 0 },
        { id: "skills", title: "SKILLS.DAT", isOpen: false, isMinimized: false, isMaximized: false, position: { x: 140, y: 140 }, zIndex: 0 },
        { id: "contact", title: "CONTACT.COM", isOpen: false, isMinimized: false, isMaximized: false, position: { x: 170, y: 170 }, zIndex: 0 },
        { id: "blog", title: "BLOG.TXT", isOpen: false, isMinimized: false, isMaximized: false, position: { x: 200, y: 200 }, zIndex: 0 },
        { id: "games", title: "GAMES.EXE", isOpen: false, isMinimized: false, isMaximized: false, position: { x: 230, y: 230 }, zIndex: 0 },
      ],
      activeWindowId: null,
      maxZIndex: 0,
    });
  });

  describe("appState", () => {
    it("should initialize with booting state", () => {
      const state = useDesktopStore.getState();
      expect(state.appState).toBe("booting");
    });

    it("should transition to desktop state", () => {
      useDesktopStore.getState().setAppState("desktop");
      expect(useDesktopStore.getState().appState).toBe("desktop");
    });

    it("should transition to setup state", () => {
      useDesktopStore.getState().setAppState("setup");
      expect(useDesktopStore.getState().appState).toBe("setup");
    });

    it("should transition to shutdown state", () => {
      useDesktopStore.getState().setAppState("shutdown");
      expect(useDesktopStore.getState().appState).toBe("shutdown");
    });
  });

  describe("theme management", () => {
    it("should initialize with blue theme by default", () => {
      const state = useDesktopStore.getState();
      expect(state.theme).toBe("blue");
    });

    it("should set theme and persist it", async () => {
      const { applyTheme, storeTheme } = await import("@/lib/themes");

      useDesktopStore.getState().setTheme("green");

      expect(useDesktopStore.getState().theme).toBe("green");
      expect(applyTheme).toHaveBeenCalledWith("green");
      expect(storeTheme).toHaveBeenCalledWith("green");
    });

    it("should handle all theme variants", () => {
      const variants = ["blue", "green", "amber", "turbo"] as const;

      for (const variant of variants) {
        useDesktopStore.getState().setTheme(variant);
        expect(useDesktopStore.getState().theme).toBe(variant);
      }
    });

    it("should initialize theme from localStorage", async () => {
      const { getStoredTheme, applyTheme } = await import("@/lib/themes");
      vi.mocked(getStoredTheme).mockReturnValue("amber");

      useDesktopStore.getState().initializeTheme();

      expect(getStoredTheme).toHaveBeenCalled();
      expect(applyTheme).toHaveBeenCalledWith("amber");
      expect(useDesktopStore.getState().theme).toBe("amber");
    });
  });

  describe("boot state", () => {
    it("should initialize hasBooted as false", () => {
      expect(useDesktopStore.getState().hasBooted).toBe(false);
    });

    it("should set hasBooted to true", () => {
      useDesktopStore.getState().setHasBooted(true);
      expect(useDesktopStore.getState().hasBooted).toBe(true);
    });

    it("should initialize skipBoot as false", () => {
      expect(useDesktopStore.getState().skipBoot).toBe(false);
    });

    it("should set skipBoot", () => {
      useDesktopStore.getState().setSkipBoot(true);
      expect(useDesktopStore.getState().skipBoot).toBe(true);
    });
  });

  describe("easter eggs", () => {
    it("should initialize turboUnlocked as false", () => {
      expect(useDesktopStore.getState().turboUnlocked).toBe(false);
    });

    it("should set turboUnlocked", () => {
      useDesktopStore.getState().setTurboUnlocked(true);
      expect(useDesktopStore.getState().turboUnlocked).toBe(true);
    });

    it("should initialize terminalOpen as false", () => {
      expect(useDesktopStore.getState().terminalOpen).toBe(false);
    });

    it("should toggle terminalOpen", () => {
      useDesktopStore.getState().setTerminalOpen(true);
      expect(useDesktopStore.getState().terminalOpen).toBe(true);

      useDesktopStore.getState().setTerminalOpen(false);
      expect(useDesktopStore.getState().terminalOpen).toBe(false);
    });

    it("should initialize easter eggs from localStorage", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("true");

      useDesktopStore.getState().initializeEasterEggs();

      expect(localStorage.getItem).toHaveBeenCalledWith("aldrich-turbo-unlocked");
      expect(useDesktopStore.getState().turboUnlocked).toBe(true);
    });

    it("should not set turboUnlocked when localStorage returns false", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("false");

      useDesktopStore.getState().initializeEasterEggs();

      expect(useDesktopStore.getState().turboUnlocked).toBe(false);
    });
  });

  describe("window management", () => {
    describe("openWindow", () => {
      it("should open a window and set it as active", () => {
        useDesktopStore.getState().openWindow("about");

        const state = useDesktopStore.getState();
        const aboutWindow = state.windows.find((w) => w.id === "about");

        expect(aboutWindow?.isOpen).toBe(true);
        expect(state.activeWindowId).toBe("about");
      });

      it("should increment z-index when opening a window", () => {
        useDesktopStore.getState().openWindow("about");
        const firstZIndex = useDesktopStore.getState().maxZIndex;

        useDesktopStore.getState().openWindow("career");
        const secondZIndex = useDesktopStore.getState().maxZIndex;

        expect(secondZIndex).toBe(firstZIndex + 1);
      });

      it("should set new window z-index to maxZIndex + 1", () => {
        useDesktopStore.getState().openWindow("about");

        const state = useDesktopStore.getState();
        const aboutWindow = state.windows.find((w) => w.id === "about");

        expect(aboutWindow?.zIndex).toBe(1);
      });
    });

    describe("closeWindow", () => {
      it("should close a window", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().closeWindow("about");

        const aboutWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "about");
        expect(aboutWindow?.isOpen).toBe(false);
      });

      it("should update active window when closing active window", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");
        useDesktopStore.getState().closeWindow("career");

        expect(useDesktopStore.getState().activeWindowId).toBe("about");
      });

      it("should set activeWindowId to null when closing last window", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().closeWindow("about");

        expect(useDesktopStore.getState().activeWindowId).toBe(null);
      });

      it("should focus highest z-index window after closing", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");
        useDesktopStore.getState().openWindow("projects");

        // Projects has highest z-index, close it
        useDesktopStore.getState().closeWindow("projects");

        // Career should now be active (was opened second)
        expect(useDesktopStore.getState().activeWindowId).toBe("career");
      });
    });

    describe("focusWindow", () => {
      it("should bring window to front", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");

        // About has lower z-index now
        useDesktopStore.getState().focusWindow("about");

        const state = useDesktopStore.getState();
        const aboutWindow = state.windows.find((w) => w.id === "about");
        const careerWindow = state.windows.find((w) => w.id === "career");

        expect(aboutWindow!.zIndex).toBeGreaterThan(careerWindow!.zIndex);
        expect(state.activeWindowId).toBe("about");
      });

      it("should increment maxZIndex", () => {
        useDesktopStore.getState().openWindow("about");
        const initialMaxZIndex = useDesktopStore.getState().maxZIndex;

        useDesktopStore.getState().focusWindow("about");

        expect(useDesktopStore.getState().maxZIndex).toBe(initialMaxZIndex + 1);
      });
    });

    describe("moveWindow", () => {
      it("should update window position", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().moveWindow("about", { x: 100, y: 200 });

        const aboutWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "about");

        expect(aboutWindow?.position).toEqual({ x: 100, y: 200 });
      });

      it("should not affect other windows", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");

        const originalCareerPos = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "career")?.position;

        useDesktopStore.getState().moveWindow("about", { x: 100, y: 200 });

        const careerWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "career");

        expect(careerWindow?.position).toEqual(originalCareerPos);
      });
    });

    describe("closeAllWindows", () => {
      it("should close all windows", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");
        useDesktopStore.getState().openWindow("projects");

        useDesktopStore.getState().closeAllWindows();

        const state = useDesktopStore.getState();
        const openWindows = state.windows.filter((w) => w.isOpen);

        expect(openWindows.length).toBe(0);
      });

      it("should clear activeWindowId", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().closeAllWindows();

        expect(useDesktopStore.getState().activeWindowId).toBe(null);
      });

      it("should reset minimized and maximized states", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().minimizeWindow("about");
        useDesktopStore.getState().openWindow("career");
        useDesktopStore.getState().maximizeWindow("career");

        useDesktopStore.getState().closeAllWindows();

        const state = useDesktopStore.getState();
        const aboutWindow = state.windows.find((w) => w.id === "about");
        const careerWindow = state.windows.find((w) => w.id === "career");

        expect(aboutWindow?.isMinimized).toBe(false);
        expect(careerWindow?.isMaximized).toBe(false);
      });
    });

    describe("minimizeWindow", () => {
      it("should minimize a window", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().minimizeWindow("about");

        const aboutWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "about");

        expect(aboutWindow?.isMinimized).toBe(true);
      });

      it("should focus next available window when minimizing active window", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");

        useDesktopStore.getState().minimizeWindow("career");

        expect(useDesktopStore.getState().activeWindowId).toBe("about");
      });

      it("should set activeWindowId to null when minimizing last window", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().minimizeWindow("about");

        expect(useDesktopStore.getState().activeWindowId).toBe(null);
      });

      it("should not change active window when minimizing non-active window", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");

        // Career is active, minimize about
        useDesktopStore.getState().minimizeWindow("about");

        expect(useDesktopStore.getState().activeWindowId).toBe("career");
      });
    });

    describe("maximizeWindow", () => {
      it("should toggle maximized state", () => {
        useDesktopStore.getState().openWindow("about");

        useDesktopStore.getState().maximizeWindow("about");
        let aboutWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "about");
        expect(aboutWindow?.isMaximized).toBe(true);

        useDesktopStore.getState().maximizeWindow("about");
        aboutWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "about");
        expect(aboutWindow?.isMaximized).toBe(false);
      });

      it("should save position when maximizing", () => {
        useDesktopStore.getState().openWindow("about");
        const originalPosition = { x: 50, y: 50 };

        useDesktopStore.getState().maximizeWindow("about");

        const aboutWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "about");
        expect(aboutWindow?.savedPosition).toEqual(originalPosition);
      });

      it("should restore position when un-maximizing", () => {
        useDesktopStore.getState().openWindow("about");
        const originalPosition = { ...useDesktopStore.getState().windows.find((w) => w.id === "about")!.position };

        useDesktopStore.getState().maximizeWindow("about");
        useDesktopStore.getState().maximizeWindow("about");

        const aboutWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "about");
        expect(aboutWindow?.position).toEqual(originalPosition);
      });

      it("should set window as active and increment z-index", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");
        const initialMaxZIndex = useDesktopStore.getState().maxZIndex;

        useDesktopStore.getState().maximizeWindow("about");

        const state = useDesktopStore.getState();
        expect(state.activeWindowId).toBe("about");
        expect(state.maxZIndex).toBe(initialMaxZIndex + 1);
      });
    });

    describe("restoreWindow", () => {
      it("should restore a minimized window", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().minimizeWindow("about");
        useDesktopStore.getState().restoreWindow("about");

        const aboutWindow = useDesktopStore
          .getState()
          .windows.find((w) => w.id === "about");

        expect(aboutWindow?.isMinimized).toBe(false);
      });

      it("should set restored window as active", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().openWindow("career");
        useDesktopStore.getState().minimizeWindow("about");

        useDesktopStore.getState().restoreWindow("about");

        expect(useDesktopStore.getState().activeWindowId).toBe("about");
      });

      it("should increment z-index when restoring", () => {
        useDesktopStore.getState().openWindow("about");
        useDesktopStore.getState().minimizeWindow("about");
        const initialMaxZIndex = useDesktopStore.getState().maxZIndex;

        useDesktopStore.getState().restoreWindow("about");

        const state = useDesktopStore.getState();
        const aboutWindow = state.windows.find((w) => w.id === "about");

        expect(state.maxZIndex).toBe(initialMaxZIndex + 1);
        expect(aboutWindow?.zIndex).toBe(initialMaxZIndex + 1);
      });
    });
  });

  describe("z-index ordering", () => {
    it("should maintain correct z-index ordering across operations", () => {
      // Open windows in order
      useDesktopStore.getState().openWindow("about");
      useDesktopStore.getState().openWindow("career");
      useDesktopStore.getState().openWindow("projects");

      // Focus about (should move to top)
      useDesktopStore.getState().focusWindow("about");

      const state = useDesktopStore.getState();
      const windows = state.windows;

      const aboutZ = windows.find((w) => w.id === "about")!.zIndex;
      const careerZ = windows.find((w) => w.id === "career")!.zIndex;
      const projectsZ = windows.find((w) => w.id === "projects")!.zIndex;

      expect(aboutZ).toBeGreaterThan(projectsZ);
      expect(aboutZ).toBeGreaterThan(careerZ);
    });
  });
});
