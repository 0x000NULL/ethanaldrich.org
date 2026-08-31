import { test, expect } from "@playwright/test";
import { enterMap } from "./utils";

test.describe("deep links and blog navigation", () => {
  test("?station=CODE opens that station's panel", async ({ page }) => {
    // The deep link selects the station on mount; the panel renders on both the
    // desktop map and the mobile strip view.
    await enterMap(page, "/?station=P-07");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Montr");
  });

  test("the blog index links into a post and back to the map", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: "Writing" })).toBeVisible();

    await page
      .getByRole("link", { name: "Building a Subway-Map Portfolio" })
      .click();
    await expect(page).toHaveURL(/\/blog\/portfolio-website$/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    await page
      .getByRole("link", { name: /back to the map/i })
      .first()
      .click();
    await expect(page).toHaveURL(/localhost:3000\/?(\?.*)?$/);
  });
});
