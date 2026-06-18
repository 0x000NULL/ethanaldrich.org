import { type Page, expect } from "@playwright/test";

/**
 * Load a path and dismiss the once-per-session Suica intro splash so the map (or
 * strip view) underneath is interactive. Not a spec file (no `.spec`), so Playwright
 * won't try to run it as a test.
 */
export async function enterMap(page: Page, path = "/") {
  await page.goto(path);
  const enter = page.getByRole("button", { name: /tap to enter/i });
  await enter.click();
  await expect(enter).toBeHidden();
}

export function isMobileProject(name: string): boolean {
  return name.startsWith("Mobile");
}
