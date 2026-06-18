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
});
