import { test, expect } from "@playwright/test";
import { enterMap, isMobileProject } from "./utils";

// The pan/zoom SVG map is the desktop experience; mobile gets the strip view.
test.describe("subway navigation (desktop)", () => {
  test("opens a station panel when a roundel is clicked", async ({ page }, testInfo) => {
    test.skip(
      isMobileProject(testInfo.project.name),
      "covered by the strip-map spec on mobile"
    );
    await enterMap(page);

    // Click the roundel circle; the click bubbles to the <g>'s handler. force is
    // needed because the station label sits above the roundel, so the <g> bbox
    // centre is empty and the parent <svg> would otherwise intercept.
    await page.locator('[data-station-code="P-09"] circle').click({ force: true });

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Fimil");

    await page.getByRole("button", { name: /close station details/i }).click();
    await expect(dialog).toBeHidden();
  });

  test("shows the legend and the map image", async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), "desktop-only chrome");
    await enterMap(page);

    await expect(page.getByText("Aldrich Transit")).toBeVisible();
    await expect(page.getByRole("img", { name: /subway map/i })).toBeVisible();
  });
});
