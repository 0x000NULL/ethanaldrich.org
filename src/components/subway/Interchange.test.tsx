import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Interchange from "./Interchange";

describe("Interchange", () => {
  it("renders a peanut for a valid transfer", () => {
    const { container } = render(
      <svg>
        <Interchange transfer={{ a: "E-06", b: "P-04", marquee: true }} />
      </svg>
    );
    const g = container.querySelector('[data-transfer="E-06-P-04"]')!;
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
