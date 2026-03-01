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
    it("should have four theme variants", () => {
      expect(Object.keys(themes)).toEqual(["blue", "green", "amber", "turbo"]);
    });

    it("should have all required color properties for each theme", () => {
      const requiredColors = [
        "bios-bg",
        "bios-text",
        "bios-highlight",
        "bios-accent",
        "bios-success",
        "bios-error",
        "desktop-bg",
        "chrome-base",
        "chrome-shadow",
        "chrome-highlight",
        "chrome-dark",
        "titlebar-start",
        "titlebar-end",
      ];

      for (const variant of Object.keys(themes) as ThemeVariant[]) {
        for (const colorKey of requiredColors) {
          expect(themes[variant]).toHaveProperty(colorKey);
          expect(themes[variant][colorKey as keyof typeof themes.blue]).toMatch(
            /^#[0-9A-Fa-f]{6}$/
          );
        }
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

      // Mock document.documentElement.style.setProperty
      Object.defineProperty(document, "documentElement", {
        value: {
          style: {
            setProperty: mockSetProperty,
          },
        },
        writable: true,
      });

      // Mock document.querySelector for meta tag
      vi.spyOn(document, "querySelector").mockImplementation((selector) => {
        if (selector === 'meta[name="theme-color"]') {
          return {
            setAttribute: mockSetAttribute,
          } as unknown as Element;
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

    it("should set CSS variables on document root", () => {
      applyTheme("blue");

      expect(mockSetProperty).toHaveBeenCalledWith("--bios-bg", "#0000AA");
      expect(mockSetProperty).toHaveBeenCalledWith("--bios-text", "#AAAAAA");
      expect(mockSetProperty).toHaveBeenCalledWith(
        "--bios-highlight",
        "#FFFFFF"
      );
    });

    it("should update theme-color meta tag", () => {
      applyTheme("green");

      expect(mockSetAttribute).toHaveBeenCalledWith("content", "#002200");
    });

    it("should handle all theme variants", () => {
      const variants: ThemeVariant[] = ["blue", "green", "amber", "turbo"];

      for (const variant of variants) {
        mockSetProperty.mockClear();
        applyTheme(variant);

        expect(mockSetProperty).toHaveBeenCalledWith(
          "--bios-bg",
          themes[variant]["bios-bg"]
        );
      }
    });

    it("should not throw when meta tag is not found", () => {
      vi.spyOn(document, "querySelector").mockReturnValue(null);

      expect(() => applyTheme("blue")).not.toThrow();
    });
  });

  describe("getStoredTheme", () => {
    beforeEach(() => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
    });

    it("should return stored theme from localStorage", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("green");

      const result = getStoredTheme();

      expect(result).toBe("green");
      expect(localStorage.getItem).toHaveBeenCalledWith("aldrich-theme");
    });

    it("should return blue as default when no stored theme", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const result = getStoredTheme();

      expect(result).toBe("blue");
    });

    it("should return blue for invalid stored values", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("invalid-theme");

      const result = getStoredTheme();

      expect(result).toBe("blue");
    });

    it("should accept all valid theme variants", () => {
      const variants: ThemeVariant[] = ["blue", "green", "amber", "turbo"];

      for (const variant of variants) {
        vi.mocked(localStorage.getItem).mockReturnValue(variant);
        expect(getStoredTheme()).toBe(variant);
      }
    });
  });

  describe("storeTheme", () => {
    it("should save theme to localStorage", () => {
      storeTheme("amber");

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "aldrich-theme",
        "amber"
      );
    });

    it("should store all valid theme variants", () => {
      const variants: ThemeVariant[] = ["blue", "green", "amber", "turbo"];

      for (const variant of variants) {
        storeTheme(variant);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "aldrich-theme",
          variant
        );
      }
    });
  });
});
