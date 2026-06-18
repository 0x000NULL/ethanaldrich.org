import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  applyTheme,
  getStoredTheme,
  storeTheme,
  themes,
  ThemeVariant,
} from "./themes";

describe("themes", () => {
  describe("theme definitions", () => {
    it("has the single metro variant", () => {
      expect(Object.keys(themes)).toEqual(["metro"]);
    });

    it("defines all metro color tokens as hex", () => {
      const requiredColors = [
        "metro-bg",
        "metro-ink",
        "metro-ink-dim",
        "metro-panel",
        "metro-border",
        "metro-roundel",
        "metro-accent",
      ];
      for (const colorKey of requiredColors) {
        expect(themes.metro).toHaveProperty(colorKey);
        expect(themes.metro[colorKey as keyof typeof themes.metro]).toMatch(
          /^#[0-9A-Fa-f]{6}$/
        );
      }
    });
  });

  describe("applyTheme", () => {
    let mockSetProperty: ReturnType<typeof vi.fn>;
    let mockSetAttribute: ReturnType<typeof vi.fn>;
    let originalDocumentElement: HTMLElement;

    beforeEach(() => {
      mockSetProperty = vi.fn();
      mockSetAttribute = vi.fn();
      originalDocumentElement = document.documentElement;

      Object.defineProperty(document, "documentElement", {
        value: { style: { setProperty: mockSetProperty } },
        writable: true,
      });

      vi.spyOn(document, "querySelector").mockImplementation((selector) => {
        if (selector === 'meta[name="theme-color"]') {
          return { setAttribute: mockSetAttribute } as unknown as Element;
        }
        return null;
      });
    });

    afterEach(() => {
      Object.defineProperty(document, "documentElement", {
        value: originalDocumentElement,
        writable: true,
      });
      vi.restoreAllMocks();
    });

    it("sets the metro CSS variables on :root", () => {
      applyTheme("metro");
      expect(mockSetProperty).toHaveBeenCalledWith("--metro-bg", "#F7F4EC");
      expect(mockSetProperty).toHaveBeenCalledWith("--metro-ink", "#1A1A1A");
    });

    it("mirrors the background to the theme-color meta tag", () => {
      applyTheme("metro");
      expect(mockSetAttribute).toHaveBeenCalledWith("content", "#F7F4EC");
    });

    it("does not throw when the meta tag is missing", () => {
      vi.spyOn(document, "querySelector").mockReturnValue(null);
      expect(() => applyTheme("metro")).not.toThrow();
    });
  });

  describe("getStoredTheme", () => {
    beforeEach(() => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
    });

    it("returns the stored theme", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("metro");
      expect(getStoredTheme()).toBe("metro");
      expect(localStorage.getItem).toHaveBeenCalledWith("aldrich-theme");
    });

    it("falls back to metro for missing or invalid values", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      expect(getStoredTheme()).toBe("metro");
      vi.mocked(localStorage.getItem).mockReturnValue("blue");
      expect(getStoredTheme()).toBe("metro");
    });
  });

  describe("storeTheme", () => {
    it("saves the theme to localStorage", () => {
      const variant: ThemeVariant = "metro";
      storeTheme(variant);
      expect(localStorage.setItem).toHaveBeenCalledWith("aldrich-theme", "metro");
    });
  });
});
