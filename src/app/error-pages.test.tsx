import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import NotFound from "./not-found";
import ErrorPage from "./error";
import GlobalError from "./global-error";

/**
 * Two sources of expected console noise, both artifacts of the test rather than
 * defects, and both of which made a fully passing run read like a failing one:
 *
 *  1. error.tsx logs the error it is handed; exercising it is the point.
 *  2. global-error.tsx renders <html>/<body>, which React correctly objects to
 *     when Testing Library mounts it inside a <div>. In the real app it is the
 *     document root, so the nesting is only wrong here.
 *
 * Anything else still prints, so a genuine warning is not swallowed.
 */
const EXPECTED = [
  /^Application error:/,
  /cannot (?:appear as a child of|be a child of)/,
  /In HTML, <(?:html|body)>/,
  /validateDOMNesting/,
];

let spy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  const real = console.error;
  spy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    const text = String(args[0] ?? "");
    if (EXPECTED.some((p) => p.test(text))) return;
    real(...args);
  });
});

afterAll(() => spy.mockRestore());

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
