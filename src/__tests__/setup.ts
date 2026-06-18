import "@testing-library/jest-dom";
import { vi } from "vitest";

// Browser-only mocks are skipped under the `node` test environment (SSR tests).
const hasWindow = typeof window !== "undefined";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

if (hasWindow) {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock requestAnimationFrame for game tests
global.requestAnimationFrame = vi.fn((cb) =>
  setTimeout(cb, 16)
) as unknown as typeof requestAnimationFrame;
global.cancelAnimationFrame = vi.fn((id) =>
  clearTimeout(id)
) as unknown as typeof cancelAnimationFrame;

// Defensive SVG geometry stub. jsdom implements neither SVGGeometryElement nor
// getPointAtLength/getTotalLength. The subway train math is pure (it never calls
// these), but a stray call from a future code path or third-party helper would
// otherwise throw an opaque error. Patch the always-present SVGElement prototype so
// subclasses inherit it; guard so a real implementation is never clobbered.
if (typeof SVGElement !== "undefined") {
  const proto = SVGElement.prototype as unknown as Record<string, unknown>;
  if (!proto.getTotalLength) proto.getTotalLength = vi.fn(() => 0);
  if (!proto.getPointAtLength) {
    proto.getPointAtLength = vi.fn(() => ({ x: 0, y: 0 }));
  }
}

// Mock ResizeObserver / IntersectionObserver as real classes so `new X()` works
// (next/link constructs an IntersectionObserver via `new`).
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
global.IntersectionObserver =
  IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Reset all mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
  if (hasWindow) {
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
  }
});
