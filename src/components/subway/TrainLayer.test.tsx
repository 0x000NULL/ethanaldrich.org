import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import TrainLayer from "./TrainLayer";
import { useNavStore } from "@/store/nav-store";
import { TRAINS } from "@/data/subway";

beforeEach(() => {
  useNavStore.setState({ reducedMotion: true });
});

describe("TrainLayer", () => {
  it("renders a lozenge per train with a now-serving tooltip", () => {
    const { container } = render(
      <svg>
        <TrainLayer />
      </svg>
    );
    const trains = container.querySelectorAll("[data-train]");
    expect(trains.length).toBe(TRAINS.length);
    expect(container.querySelector("title")?.textContent).toMatch(/Now serving/i);
  });

  it("marks express trains with a stripe", () => {
    const { container } = render(
      <svg>
        <TrainLayer />
      </svg>
    );
    // The Career train is express → its group has an extra rect (stripe).
    const fimil = container.querySelector('[data-train="t-fimil"]')!;
    expect(fimil.querySelectorAll("rect").length).toBeGreaterThanOrEqual(2);
  });
});
