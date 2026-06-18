import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import NotFound from "./not-found";
import ErrorPage from "./error";
import GlobalError from "./global-error";

describe("not-found", () => {
  it("renders the station-not-found message with a link home", () => {
    const { getByText, getByRole } = render(<NotFound />);
    expect(getByText(/Station not found/i)).toBeTruthy();
    expect(getByRole("link", { name: /Return to the map/i })).toBeTruthy();
  });
});

describe("error", () => {
  it("renders a disruption notice and retries", () => {
    const reset = vi.fn();
    const { getByText, getByRole } = render(
      <ErrorPage error={Object.assign(new Error("boom"), { digest: "abc123" })} reset={reset} />
    );
    expect(getByText(/Service disruption/i)).toBeTruthy();
    expect(getByText(/ref: abc123/i)).toBeTruthy();
    fireEvent.click(getByRole("button", { name: /Retry/i }));
    expect(reset).toHaveBeenCalled();
  });
});

describe("global-error", () => {
  it("renders the out-of-service screen and restarts", () => {
    const reset = vi.fn();
    const { getByText, getByRole } = render(
      <GlobalError error={new Error("fatal")} reset={reset} />
    );
    expect(getByText(/out of service/i)).toBeTruthy();
    fireEvent.click(getByRole("button", { name: /Restart/i }));
    expect(reset).toHaveBeenCalled();
  });

  it("includes the digest ref when present", () => {
    const { getByText } = render(
      <GlobalError
        error={Object.assign(new Error("fatal"), { digest: "deadbeef" })}
        reset={vi.fn()}
      />
    );
    expect(getByText(/ref: deadbeef/i)).toBeTruthy();
  });
});
