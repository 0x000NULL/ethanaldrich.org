import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { enterMap } from "./utils";

/**
 * Automated WCAG scanning.
 *
 * The hand-written keyboard specs cover the interaction that matters most here
 * (roving the sr-only outline, Enter/Escape on the panel), but they can't catch
 * the whole class of static violations — contrast, landmark structure,
 * name/role/value. axe does.
 *
 * It is a floor, not a ceiling: axe reliably detects roughly a third of real
 * issues, so a clean run means "no known automated violation", not "accessible".
 */

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

function scan(page: Page) {
  return new AxeBuilder({ page }).withTags(TAGS);
}

test.describe("automated accessibility", () => {
  test("the map has no automatically-detectable violations", async ({
    page,
  }) => {
    await enterMap(page);
    const results = await scan(page).analyze();
    expect(results.violations).toEqual([]);
  });

  /**
   * NOTE: there is deliberately no JS-disabled scan here. axe runs *in* the
   * page, so a context with javaScriptEnabled:false can't execute it and the
   * test can only ever time out. The no-JS view is covered instead by
   * StaticNetworkOutline.test.tsx, which renders it directly.
   */

  test("a station case study has no violations", async ({ page }) => {
    await page.goto("/station/C-01");
    const results = await scan(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test("the blog index and a post have no violations", async ({ page }) => {
    await page.goto("/blog");
    expect((await scan(page).analyze()).violations).toEqual([]);

    await page.goto("/blog/portfolio-website");
    expect((await scan(page).analyze()).violations).toEqual([]);
  });
});
