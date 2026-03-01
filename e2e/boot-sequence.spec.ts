import { test, expect } from "@playwright/test";

test.describe("Boot Sequence", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("should display boot sequence on first visit", async ({ page }) => {
    await page.goto("/");

    // Should show BIOS header
    await expect(page.locator("text=AMIBIOS")).toBeVisible();
    await expect(page.locator("text=ALDRICH BIOS")).toBeVisible();
  });

  test("should show memory test animation", async ({ page }) => {
    await page.goto("/");

    // Memory test should be visible
    await expect(page.locator("text=Memory Test")).toBeVisible();
  });

  test("should show prompt after boot completes", async ({ page }) => {
    await page.goto("/");

    // Wait for boot to complete (or skip it)
    await page.click("text=SKIP", { timeout: 10000 }).catch(() => {
      // If no skip button, wait for prompt
    });

    // Should eventually show the prompt
    await expect(
      page.locator("text=Press DEL to enter SETUP")
    ).toBeVisible({ timeout: 15000 });
  });

  test("should proceed to desktop on any key", async ({ page }) => {
    await page.goto("/");

    // Wait for boot prompt
    await expect(
      page.locator("text=Press DEL to enter SETUP")
    ).toBeVisible({ timeout: 15000 });

    // Press Enter to proceed
    await page.keyboard.press("Enter");

    // Should show desktop with icons
    await expect(page.locator("text=ABOUT.EXE")).toBeVisible({ timeout: 5000 });
  });

  test("should enter CMOS setup on Delete key", async ({ page }) => {
    await page.goto("/");

    // Wait for boot prompt
    await expect(
      page.locator("text=Press DEL to enter SETUP")
    ).toBeVisible({ timeout: 15000 });

    // Press Delete to enter setup
    await page.keyboard.press("Delete");

    // Should show CMOS setup screen
    await expect(
      page.locator("text=CMOS SETUP UTILITY")
    ).toBeVisible({ timeout: 5000 });
  });
});
