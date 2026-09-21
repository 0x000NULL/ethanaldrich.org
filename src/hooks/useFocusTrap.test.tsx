import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useFocusTrap } from "./useFocusTrap";

function Trap({ active, onClose }: { active: boolean; onClose: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(active, onClose);
  return (
    <div ref={ref} data-testid="trap">
      <button>first</button>
      <button>last</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("focuses the first element when activated", () => {
    const { getByText } = render(<Trap active onClose={() => {}} />);
    expect(document.activeElement).toBe(getByText("first"));
  });

  it("calls onClose on Escape", () => {
    const onClose = vi.fn();
    render(<Trap active onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("wraps Tab focus from last to first", () => {
    const { getByText } = render(<Trap active onClose={() => {}} />);
    getByText("last").focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(getByText("first"));
  });

  it("wraps Shift+Tab from first to last", () => {
    const { getByText } = render(<Trap active onClose={() => {}} />);
    getByText("first").focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(getByText("last"));
  });

  it("does nothing when inactive", () => {
    const onClose = vi.fn();
    render(<Trap active={false} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("lets Tab pass through from a middle element (no wrap)", () => {
    function Three() {
      const ref = useFocusTrap<HTMLDivElement>(true, () => {});
      return (
        <div ref={ref}>
          <button>a</button>
          <button>b</button>
          <button>c</button>
        </div>
      );
    }
    const { getByText } = render(<Three />);
    getByText("b").focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(getByText("b"));
  });

  it("tolerates a container with no focusable children", () => {
    function Empty() {
      const ref = useFocusTrap<HTMLDivElement>(true, () => {});
      return <div ref={ref} />;
    }
    expect(() => {
      render(<Empty />);
      fireEvent.keyDown(document, { key: "Tab" });
    }).not.toThrow();
  });

  /**
   * Regression: every trap listens on `document`, so before the trap stack a
   * single Escape fired every active onClose. That was reachable in production
   * via `/?station=CODE` on a fresh session, which mounts StationPanel while
   * IntroSplash is still unseen — one Escape dismissed the splash *and* the
   * panel the deep link had just opened.
   */
  describe("nested traps", () => {
    it("routes Escape only to the innermost trap", () => {
      const outer = vi.fn();
      const inner = vi.fn();
      render(
        <>
          <Trap active onClose={outer} />
          <Trap active onClose={inner} />
        </>
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(inner).toHaveBeenCalledTimes(1);
      expect(outer).not.toHaveBeenCalled();
    });

    it("hands Escape back to the outer trap once the inner one unmounts", () => {
      const outer = vi.fn();
      const inner = vi.fn();
      function Pair({ innerOpen }: { innerOpen: boolean }) {
        return (
          <>
            <Trap active onClose={outer} />
            {innerOpen && <Trap active onClose={inner} />}
          </>
        );
      }

      const { rerender } = render(<Pair innerOpen />);
      rerender(<Pair innerOpen={false} />);

      fireEvent.keyDown(document, { key: "Escape" });

      expect(outer).toHaveBeenCalledTimes(1);
      expect(inner).not.toHaveBeenCalled();
    });

    it("does not let an inactive trap swallow Escape", () => {
      const onClose = vi.fn();
      render(
        <>
          <Trap active={false} onClose={() => {}} />
          <Trap active onClose={onClose} />
        </>
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
