// @vitest-environment node
import { describe, it, expect } from "vitest";
import { useNavStore } from "./nav-store";

// Exercises the SSR / no-storage guard branches of the store actions.
describe("nav-store SSR guards", () => {
  const s = useNavStore.getState();

  it("initialize actions no-op without a window", () => {
    expect(() => s.initializeIntro()).not.toThrow();
    expect(() => s.initializeAlerts()).not.toThrow();
    expect(() => s.initializeTheme()).not.toThrow();
  });

  it("dismiss actions still update state without storage", () => {
    s.dismissIntro();
    s.dismissAlert("a-network");
    expect(useNavStore.getState().introSeen).toBe(true);
    expect(useNavStore.getState().dismissedAlerts).toContain("a-network");
  });

  it("setTheme applies without throwing", () => {
    expect(() => s.setTheme("metro")).not.toThrow();
  });
});
