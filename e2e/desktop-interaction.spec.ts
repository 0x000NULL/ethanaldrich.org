import { test, expect } from "@playwright/test";

test.describe("Desktop Interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Skip boot sequence
    await page.evaluate(() => {
      localStorage.setItem("aldrich-portfolio-visited", "true");
    });
    await page.reload();

    // Wait for desktop to load
    await expect(page.locator("text=ABOUT.EXE")).toBeVisible({ timeout: 10000 });
  });

  test("should open windows from icons", async ({ page }) => {
    // Click on About icon
    await page.click("text=ABOUT.EXE");

    // Window should open
    await expect(page.locator("text=About Me")).toBeVisible({ timeout: 5000 });
  });

  test("should close windows", async ({ page }) => {
    // Open a window
    await page.click("text=ABOUT.EXE");
    await expect(page.locator("text=About Me")).toBeVisible();

    // Close it using the X button (in title bar)
    await page.click('button[aria-label="Close window"]');

    // Window should be closed
    await expect(page.locator("text=About Me")).not.toBeVisible();
  });

  test("should minimize and restore windows", async ({ page }) => {
    // Open a window
    await page.click("text=ABOUT.EXE");
    await expect(page.locator("text=About Me")).toBeVisible();

    // Minimize it
    await page.click('button[aria-label="Minimize window"]');

    // Content should be hidden
    await expect(page.locator("text=About Me")).not.toBeVisible();

    // Restore from status bar
    await page.click("text=ABOUT.EXE").first();

    // Content should be visible again
    await expect(page.locator("text=About Me")).toBeVisible();
  });

  test("should open multiple windows", async ({ page }) => {
    // Open About
    await page.click("text=ABOUT.EXE");
    await expect(page.locator("text=About Me")).toBeVisible();

    // Open Career
    await page.click("text=CAREER.EXE");
    await expect(page.locator("text=Career")).toBeVisible();

    // Both should be open
    expect(await page.locator('[data-window="about"]').count()).toBeGreaterThan(0);
    expect(await page.locator('[data-window="career"]').count()).toBeGreaterThan(0);
  });

  test("should show shutdown screen from icon", async ({ page }) => {
    // Click shutdown icon
    await page.click("text=SHUTDOWN");

    // Should show shutdown screen
    await expect(
      page.locator("text=It's now safe to turn off")
    ).toBeVisible({ timeout: 5000 });
  });
});
