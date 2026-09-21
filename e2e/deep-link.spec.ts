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

  /**
   * Regression: the splash and the station panel are both focus-trapped, and
   * every trap listened on `document`. Deep-linking into a fresh session mounts
   * both, so a single Escape dismissed the splash AND the panel the deep link
   * had just opened — the visitor pressed Escape once to get past the splash
   * and lost the thing they had followed the link for.
   */
  test("Escape past the intro splash leaves the deep-linked panel open", async ({
    page,
  }) => {
    await page.goto("/?station=P-07");

    // Fresh session: the splash is up, with the panel already open behind it.
    const enter = page.getByRole("button", { name: /tap to enter/i });
    await expect(enter).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(enter).toBeHidden();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Montr");

    // A second Escape is now the panel's, and closes it.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
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
