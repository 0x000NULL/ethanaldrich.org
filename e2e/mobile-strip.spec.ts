import { test, expect } from "@playwright/test";
import { enterMap, isMobileProject } from "./utils";

// The vertical strip map is the small-screen experience.
test.describe("mobile strip map", () => {
  test("lists lines and opens a station sheet on tap", async ({ page }, testInfo) => {
    test.skip(
      !isMobileProject(testInfo.project.name),
      "only runs on mobile viewports"
    );
    await enterMap(page);

    await expect(page.getByText("Tap a station for the story.")).toBeVisible();
    await expect(
      page.getByRole("region", { name: /Projects line/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /Proxmox Homelab/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("surfaces transfer chips", async ({ page }, testInfo) => {
    test.skip(
      !isMobileProject(testInfo.project.name),
      "only runs on mobile viewports"
    );
    await enterMap(page);
    await expect(page.getByText(/Transfer to/i).first()).toBeVisible();
  });
});
