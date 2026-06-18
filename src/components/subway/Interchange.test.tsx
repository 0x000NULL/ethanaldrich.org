import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Interchange from "./Interchange";

describe("Interchange", () => {
  it("renders a peanut for a valid transfer", () => {
    const { container } = render(
      <svg>
        <Interchange transfer={{ a: "C-02", b: "P-09", marquee: true }} />
      </svg>
    );
    const g = container.querySelector('[data-transfer="C-02-P-09"]')!;
    expect(g).toBeTruthy();
    expect(g.querySelectorAll("line").length).toBe(2); // outline + fill
  });

  it("renders nothing when a station is unknown", () => {
    const { container } = render(
      <svg>
        <Interchange transfer={{ a: "NOPE", b: "ALSO-NOPE" }} />
      </svg>
    );
    expect(container.querySelector("[data-transfer]")).toBeNull();
  });
});
