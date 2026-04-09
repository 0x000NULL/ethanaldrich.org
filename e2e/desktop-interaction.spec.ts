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

    // Window should open (matched via title bar)
    await expect(page.locator("text=ABOUT.EXE - Ethan Aldrich")).toBeVisible({ timeout: 5000 });
  });

  test("should close windows", async ({ page }) => {
    // Open a window
    await page.click("text=ABOUT.EXE");
    await expect(page.locator("text=ABOUT.EXE - Ethan Aldrich")).toBeVisible();

    // Close it using the X button (in title bar)
    await page.click('button[aria-label="Close window"]');

    // Window should be closed
    await expect(page.locator("text=ABOUT.EXE - Ethan Aldrich")).not.toBeVisible();
  });

  test("should minimize and restore windows", async ({ page }) => {
    // Open a window
    await page.click("text=ABOUT.EXE");
    await expect(page.locator("text=ABOUT.EXE - Ethan Aldrich")).toBeVisible();

    // Minimize it
    await page.click('button[aria-label="Minimize window"]');

    // Content should be hidden
    await expect(page.locator("text=ABOUT.EXE - Ethan Aldrich")).not.toBeVisible();

    // Restore from status bar (the restore button has a title attr; the icon doesn't)
    await page.locator('button[title^="Restore"]').first().click();

    // Content should be visible again
    await expect(page.locator("text=ABOUT.EXE - Ethan Aldrich")).toBeVisible();
  });

  test("should open multiple windows", async ({ page }) => {
    // Open About
    await page.click("text=ABOUT.EXE");
    await expect(page.locator("text=ABOUT.EXE - Ethan Aldrich")).toBeVisible();

    // Minimize About so the Career icon is clickable
    await page.click('button[aria-label="Minimize window"]');

    // Open Career
    await page.click("text=CAREER.EXE");
    await expect(page.locator("text=Work Experience")).toBeVisible();

    // Restore About from the status bar
    await page.locator('button[title^="Restore"]').first().click();

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
