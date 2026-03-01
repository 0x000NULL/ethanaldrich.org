import { test, expect } from "@playwright/test";

test.describe("Terminal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Skip boot sequence
    await page.evaluate(() => {
      localStorage.setItem("aldrich-portfolio-visited", "true");
    });
    await page.reload();

    // Wait for desktop to load
    await expect(page.locator("text=ABOUT.EXE")).toBeVisible({ timeout: 10000 });

    // Open terminal with backtick
    await page.keyboard.press("`");

    // Wait for terminal to appear
    await expect(page.locator("text=ALDRICH DOS Terminal")).toBeVisible();
  });

  test("should open terminal with backtick key", async ({ page }) => {
    // Terminal should be visible (already opened in beforeEach)
    await expect(page.locator("text=ALDRICH DOS v4.20")).toBeVisible();
    await expect(page.locator("text=Type \"HELP\" for available commands")).toBeVisible();
  });

  test("should execute DIR command", async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill("DIR");
    await input.press("Enter");

    await expect(page.locator("text=Directory of C:\\ALDRICH")).toBeVisible();
    await expect(page.locator("text=ABOUT")).toBeVisible();
  });

  test("should execute HELP command", async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill("HELP");
    await input.press("Enter");

    await expect(page.locator("text=Available commands:")).toBeVisible();
  });

  test("should run programs that open windows", async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill("RUN ABOUT.EXE");
    await input.press("Enter");

    // Wait for program to load
    await expect(page.locator("text=Loading ABOUT.EXE")).toBeVisible();

    // Terminal should close and window should open
    await expect(page.locator("text=About Me")).toBeVisible({ timeout: 5000 });
  });

  test("should display file contents with TYPE", async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill("TYPE README.TXT");
    await input.press("Enter");

    await expect(page.locator("text=ALDRICH PORTFOLIO SYSTEM")).toBeVisible();
  });

  test("should evaluate expressions with CALC", async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill("CALC 10*5");
    await input.press("Enter");

    await expect(page.locator("text=10*5 = 50")).toBeVisible();
  });

  test("should close terminal with EXIT", async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill("EXIT");
    await input.press("Enter");

    // Terminal should be closed
    await expect(page.locator("text=ALDRICH DOS Terminal")).not.toBeVisible();
  });

  test("should close terminal with Escape", async ({ page }) => {
    await page.keyboard.press("Escape");

    // Terminal should be closed
    await expect(page.locator("text=ALDRICH DOS Terminal")).not.toBeVisible();
  });
});
