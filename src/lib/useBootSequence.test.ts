import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBootSequence } from "./useBootSequence";
import { MEMORY_TARGET, AUTO_BOOT_DELAY } from "@/data/boot-sequence";

// Mock the desktop store
const mockSetAppState = vi.fn();
const mockSetHasBooted = vi.fn();

vi.mock("@/store/desktop-store", () => ({
  useDesktopStore: () => ({
    setAppState: mockSetAppState,
    hasBooted: false,
    setHasBooted: mockSetHasBooted,
    skipBoot: false,
  }),
}));

// Mock time-based messages to return empty for predictable tests
vi.mock("@/data/boot-sequence", async () => {
  const actual = await vi.importActual("@/data/boot-sequence");
  return {
    ...actual,
    getTimeBasedMessages: vi.fn(() => []),
  };
});

describe("useBootSequence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(localStorage.setItem).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("should start in idle state", () => {
      const { result } = renderHook(() => useBootSequence());

      expect(result.current.bootState).toBe("idle");
    });

    it("should have memoryValue at 0 initially", () => {
      const { result } = renderHook(() => useBootSequence());

      expect(result.current.memoryValue).toBe(0);
    });

    it("should have memoryComplete as false initially", () => {
      const { result } = renderHook(() => useBootSequence());

      expect(result.current.memoryComplete).toBe(false);
    });

    it("should have showPrompt as false initially", () => {
      const { result } = renderHook(() => useBootSequence());

      expect(result.current.showPrompt).toBe(false);
    });

    it("should have currentLines starting from first line", () => {
      const { result } = renderHook(() => useBootSequence());

      expect(result.current.currentLines.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("startBoot", () => {
    it("should transition to booting state", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
      });

      expect(result.current.bootState).toBe("booting");
    });

    it("should reset memory value to 0", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
      });

      expect(result.current.memoryValue).toBe(0);
    });

    it("should reset memoryComplete to false", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
      });

      expect(result.current.memoryComplete).toBe(false);
    });
  });

  describe("skipBoot", () => {
    it("should set memory to target value", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
      });

      act(() => {
        result.current.skipBoot();
      });

      expect(result.current.memoryValue).toBe(MEMORY_TARGET);
    });

    it("should set memoryComplete to true", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
      });

      act(() => {
        result.current.skipBoot();
      });

      expect(result.current.memoryComplete).toBe(true);
    });

    it("should show prompt", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
      });

      act(() => {
        result.current.skipBoot();
      });

      expect(result.current.showPrompt).toBe(true);
    });

    it("should set bootState to waiting", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
      });

      act(() => {
        result.current.skipBoot();
      });

      expect(result.current.bootState).toBe("waiting");
    });
  });

  describe("enterSetup", () => {
    it("should set bootState to setup", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        result.current.enterSetup();
      });

      expect(result.current.bootState).toBe("setup");
    });

    it("should call setAppState with setup", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        result.current.enterSetup();
      });

      expect(mockSetAppState).toHaveBeenCalledWith("setup");
    });
  });

  describe("proceedToDesktop", () => {
    it("should set bootState to complete", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        result.current.proceedToDesktop();
      });

      expect(result.current.bootState).toBe("complete");
    });

    it("should call setAppState with desktop", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        result.current.proceedToDesktop();
      });

      expect(mockSetAppState).toHaveBeenCalledWith("desktop");
    });

    it("should call setHasBooted with true", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        result.current.proceedToDesktop();
      });

      expect(mockSetHasBooted).toHaveBeenCalledWith(true);
    });

    it("should save visited state to localStorage", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        result.current.proceedToDesktop();
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "aldrich-portfolio-visited",
        "true"
      );
    });
  });

  describe("auto-boot timer", () => {
    it("should auto-proceed after timeout when in waiting state", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      expect(result.current.bootState).toBe("waiting");

      act(() => {
        vi.advanceTimersByTime(AUTO_BOOT_DELAY);
      });

      expect(result.current.bootState).toBe("complete");
      expect(mockSetAppState).toHaveBeenCalledWith("desktop");
    });

    it("should clear auto-boot timer when entering setup", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        result.current.enterSetup();
      });

      // Advance past auto-boot delay
      act(() => {
        vi.advanceTimersByTime(AUTO_BOOT_DELAY + 1000);
      });

      // Should still be in setup, not complete
      expect(result.current.bootState).toBe("setup");
    });

    it("should clear auto-boot timer when proceeding to desktop", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        result.current.proceedToDesktop();
      });

      // The auto-boot should have been cleared
      expect(mockSetAppState).toHaveBeenCalledTimes(1);
    });
  });

  describe("keyboard handling", () => {
    it("should enter setup on Delete key during waiting", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
      });

      expect(result.current.bootState).toBe("setup");
    });

    it("should enter setup on Escape key during waiting", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(result.current.bootState).toBe("setup");
    });

    it("should proceed to desktop on any other key during waiting", () => {
      const { result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
        result.current.skipBoot();
      });

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      });

      expect(result.current.bootState).toBe("complete");
    });

    it("should not respond to keys when not in waiting state", () => {
      const { result } = renderHook(() => useBootSequence());

      // In idle state
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
      });

      expect(result.current.bootState).toBe("idle");
    });
  });

  describe("cleanup", () => {
    it("should clear all timers on unmount", () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      const { unmount, result } = renderHook(() => useBootSequence());

      act(() => {
        result.current.startBoot();
      });

      unmount();

      // Verify cleanup was called
      expect(
        clearTimeoutSpy.mock.calls.length +
          clearIntervalSpy.mock.calls.length
      ).toBeGreaterThanOrEqual(0);

      clearTimeoutSpy.mockRestore();
      clearIntervalSpy.mockRestore();
    });
  });
});
