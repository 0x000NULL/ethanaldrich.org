import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useKonamiCode } from "./useKonamiCode";

const KONAMI_CODE_KEYS = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

function pressKey(code: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { code }));
}

function pressKonamiCode() {
  KONAMI_CODE_KEYS.forEach(pressKey);
}

describe("useKonamiCode", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockClear();
    vi.mocked(localStorage.removeItem).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("should start with isUnlocked false when not stored", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const { result } = renderHook(() => useKonamiCode());

      expect(result.current.isUnlocked).toBe(false);
    });

    it("should start with isUnlocked true when stored", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("true");

      const { result } = renderHook(() => useKonamiCode());

      // Need to wait for effect to run
      act(() => {
        vi.runAllTimers();
      });

      expect(result.current.isUnlocked).toBe(true);
    });

    it("should start with showOverlay false", () => {
      const { result } = renderHook(() => useKonamiCode());

      expect(result.current.showOverlay).toBe(false);
    });

    it("should check localStorage on mount", () => {
      renderHook(() => useKonamiCode());

      expect(localStorage.getItem).toHaveBeenCalledWith(
        "aldrich-turbo-unlocked"
      );
    });
  });

  describe("Konami code detection", () => {
    it("should detect correct Konami code sequence", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        pressKonamiCode();
      });

      expect(result.current.isUnlocked).toBe(true);
    });

    it("should not trigger on partial sequence", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        // Only press first 5 keys
        KONAMI_CODE_KEYS.slice(0, 5).forEach(pressKey);
      });

      expect(result.current.isUnlocked).toBe(false);
    });

    it("should not trigger on incorrect sequence", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        // Press wrong keys
        ["KeyA", "KeyB", "KeyC", "KeyD"].forEach(pressKey);
      });

      expect(result.current.isUnlocked).toBe(false);
    });

    it("should reset sequence after 10+ keys without match", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        // Press 15 wrong keys
        for (let i = 0; i < 15; i++) {
          pressKey("KeyX");
        }
        // Then press correct sequence
        pressKonamiCode();
      });

      expect(result.current.isUnlocked).toBe(true);
    });

    it("should work with keys in the middle of other keys", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        // Press some random keys first
        pressKey("KeyX");
        pressKey("KeyY");
        // Then press Konami code
        pressKonamiCode();
      });

      expect(result.current.isUnlocked).toBe(true);
    });
  });

  describe("overlay behavior", () => {
    it("should show overlay when code entered", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        pressKonamiCode();
      });

      expect(result.current.showOverlay).toBe(true);
    });

    it("should hide overlay after 3 seconds", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        pressKonamiCode();
      });

      expect(result.current.showOverlay).toBe(true);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.showOverlay).toBe(false);
    });

    it("should allow manual hiding with hideOverlay", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        pressKonamiCode();
      });

      expect(result.current.showOverlay).toBe(true);

      act(() => {
        result.current.hideOverlay();
      });

      expect(result.current.showOverlay).toBe(false);
    });
  });

  describe("localStorage persistence", () => {
    it("should save unlock state to localStorage", () => {
      renderHook(() => useKonamiCode());

      act(() => {
        pressKonamiCode();
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "aldrich-turbo-unlocked",
        "true"
      );
    });
  });

  describe("resetUnlock", () => {
    it("should reset unlock state", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        pressKonamiCode();
      });

      expect(result.current.isUnlocked).toBe(true);

      act(() => {
        result.current.resetUnlock();
      });

      expect(result.current.isUnlocked).toBe(false);
    });

    it("should remove from localStorage", () => {
      const { result } = renderHook(() => useKonamiCode());

      act(() => {
        pressKonamiCode();
      });

      act(() => {
        result.current.resetUnlock();
      });

      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "aldrich-turbo-unlocked"
      );
    });
  });

  describe("onActivate callback", () => {
    it("should call onActivate when code entered", () => {
      const onActivate = vi.fn();
      renderHook(() => useKonamiCode(onActivate));

      act(() => {
        pressKonamiCode();
      });

      expect(onActivate).toHaveBeenCalledTimes(1);
    });

    it("should not call onActivate on partial sequence", () => {
      const onActivate = vi.fn();
      renderHook(() => useKonamiCode(onActivate));

      act(() => {
        KONAMI_CODE_KEYS.slice(0, 5).forEach(pressKey);
      });

      expect(onActivate).not.toHaveBeenCalled();
    });
  });

  describe("cleanup", () => {
    it("should remove event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useKonamiCode());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
