// @vitest-environment node
import { describe, it, expect } from "vitest";
import { applyTheme, getStoredTheme, storeTheme } from "./themes";

// Exercises the `typeof window === "undefined"` guard branches (SSR).
describe("themes SSR guards", () => {
  it("getStoredTheme returns the default without a window", () => {
    expect(getStoredTheme()).toBe("metro");
  });

  it("applyTheme and storeTheme are no-ops without a window", () => {
    expect(() => applyTheme("metro")).not.toThrow();
    expect(() => storeTheme("metro")).not.toThrow();
  });
});
