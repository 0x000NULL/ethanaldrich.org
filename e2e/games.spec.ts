import { test, expect } from "@playwright/test";

test.describe("Games", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Skip boot sequence
    await page.evaluate(() => {
      localStorage.setItem("aldrich-portfolio-visited", "true");
    });
    await page.reload();

    // Wait for desktop to load
    await expect(page.locator("text=ABOUT.EXE")).toBeVisible({ timeout: 10000 });

    // Open Games window
    await page.click("text=GAMES.EXE");

    // Wait for games selector
    await expect(page.locator("text=Select a game to play")).toBeVisible();
  });

  test("should display game selector", async ({ page }) => {
    await expect(page.locator("text=SNAKE.EXE")).toBeVisible();
    await expect(page.locator("text=MINESWEEP.EXE")).toBeVisible();
    await expect(page.locator("text=BREAKOUT.EXE")).toBeVisible();
  });

  test.describe("Snake", () => {
    test("should start a game", async ({ page }) => {
      // Select Snake
      await page.click("text=SNAKE.EXE");

      // Should show game UI
      await expect(page.locator("text=START")).toBeVisible();

      // Start the game
      await page.click("text=START");

      // Score should be visible
      await expect(page.locator("text=Score:")).toBeVisible();
    });

    test("should respond to keyboard controls", async ({ page }) => {
      await page.click("text=SNAKE.EXE");
      await page.click("text=START");

      // Wait a moment for game to start
      await page.waitForTimeout(500);

      // Press arrow keys (shouldn't crash)
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowLeft");

      // Game should still be running
      await expect(page.locator("text=Score:")).toBeVisible();
    });

    test("should pause and resume", async ({ page }) => {
      await page.click("text=SNAKE.EXE");
      await page.click("text=START");

      // Press P to pause
      await page.keyboard.press("p");

      // Should show PAUSED
      await expect(page.locator("text=PAUSED")).toBeVisible();

      // Press P to resume
      await page.keyboard.press("p");

      // PAUSED should be hidden
      await expect(page.locator("text=PAUSED")).not.toBeVisible();
    });
  });

  test.describe("Minesweeper", () => {
    test("should display game grid", async ({ page }) => {
      await page.click("text=MINESWEEP.EXE");

      // Should show mine counter
      await expect(page.locator("text=010")).toBeVisible();

      // Should show timer
      await expect(page.locator("text=000")).toBeVisible();
    });

    test("should reveal cells on click", async ({ page }) => {
      await page.click("text=MINESWEEP.EXE");

      // Click a cell (the grid container)
      const grid = page.locator(".grid").first();
      const cell = grid.locator("button").first();
      await cell.click();

      // Timer should start (no longer 000)
      await page.waitForTimeout(1100);
      await expect(page.locator("text=001")).toBeVisible();
    });
  });

  test.describe("Breakout", () => {
    test("should display game canvas", async ({ page }) => {
      await page.click("text=BREAKOUT.EXE");

      // Should show START button
      await expect(page.locator("text=START")).toBeVisible();

      // Should show canvas
      const canvas = page.locator("canvas");
      await expect(canvas).toBeVisible();
    });

    test("should start game on START click", async ({ page }) => {
      await page.click("text=BREAKOUT.EXE");
      await page.click("text=START");

      // Score should be visible
      await expect(page.locator("text=Score:")).toBeVisible();
      await expect(page.locator("text=Lives:")).toBeVisible();
    });
  });

  test("should navigate back to game menu", async ({ page }) => {
    // Select a game
    await page.click("text=SNAKE.EXE");
    await expect(page.locator("text=← Back to Games Menu")).toBeVisible();

    // Go back
    await page.click("text=← Back to Games Menu");

    // Menu should be visible
    await expect(page.locator("text=Select a game to play")).toBeVisible();
  });
});
