import { test, expect } from "@playwright/test";
import { enterMap, isMobileProject } from "./utils";

// The sr-only A11yMapOutline is the keyboard interface for the desktop map.
test.describe("keyboard accessibility (desktop)", () => {
  test("arrows walk a line, Enter opens a station, Escape closes it", async ({
    page,
  }, testInfo) => {
    test.skip(
      isMobileProject(testInfo.project.name),
      "the strip view is the accessible interface on mobile"
    );
    await enterMap(page);

    // Focus the first station on the Education line.
    await page.getByRole("button", { name: /High School/ }).focus();

    // Arrow down roves to the next station on the same line (A+).
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("button", { name: /E-02 A\+/ })).toBeFocused();

    // Enter opens the station panel.
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Escape closes it again.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
