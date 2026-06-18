import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavStore } from "@/store/nav-store";
import IntroSplash from "./IntroSplash";

beforeEach(() => {
  sessionStorage.clear();
  useNavStore.setState({ introSeen: false, reducedMotion: false });
});

describe("IntroSplash", () => {
  it("shows the splash with a pulse hint and dismisses on tap", () => {
    render(<IntroSplash />);

    expect(
      screen.getByRole("dialog", { name: /aldrich transit/i })
    ).toBeInTheDocument();
    expect(screen.getByText("▸").className).toContain("animate-pulse");

    fireEvent.click(screen.getByRole("button", { name: /tap to enter/i }));
    expect(useNavStore.getState().introSeen).toBe(true);
  });

  it("renders nothing once the intro has been seen", () => {
    useNavStore.setState({ introSeen: true });
    const { container } = render(<IntroSplash />);
    expect(container).toBeEmptyDOMElement();
  });

  it("drops the pulse hint under reduced motion", () => {
    useNavStore.setState({ reducedMotion: true });
    render(<IntroSplash />);
    expect(screen.getByText("▸").className).not.toContain("animate-pulse");
  });
});
