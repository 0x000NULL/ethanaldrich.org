/**
 * Render resume/resume.html to public/resume.pdf using the Chromium that
 * @playwright/test already installs for the e2e suite — no extra dependencies.
 *
 *   node scripts/build-resume.mjs          # writes public/resume.pdf
 *   RESUME_PNG=/tmp/proof.png node ...     # also writes a full-page PNG proof
 *
 * Plain .mjs on purpose: tsconfig.json includes **\/*.ts and **\/*.mts, so a
 * TypeScript version of this script would be pulled into `next build`'s
 * type-check for no benefit.
 */
import { chromium } from "@playwright/test";
import { statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "resume", "resume.html");
const OUT = path.join(ROOT, "public", "resume.pdf");

// Letter at 96 CSS px/in, minus the margins page.pdf() applies.
const CONTENT_W_PX = Math.round((8.5 - 0.55 - 0.55) * 96);
const USABLE_PAGE_PX = (11 - 0.5 - 0.5) * 96;
const MAX_PAGES = 2;

const browser = await chromium.launch();
try {
  // Lay out at the printable column width so the measurement and the PNG proof
  // match what page.pdf() will actually produce.
  const page = await browser.newPage({
    viewport: { width: CONTENT_W_PX, height: Math.round(USABLE_PAGE_PX) },
  });
  await page.goto(pathToFileURL(SRC).href, { waitUntil: "load" });

  // Measure against print layout, not screen layout.
  await page.emulateMedia({ media: "print" });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const estimated = height / USABLE_PAGE_PX;
  console.log(`content height ${height}px → ~${estimated.toFixed(2)} pages`);

  if (process.env.RESUME_PNG) {
    await page.screenshot({ path: process.env.RESUME_PNG, fullPage: true });
    console.log(`proof  ${process.env.RESUME_PNG}`);
  }

  await page.pdf({
    path: OUT,
    format: "Letter",
    printBackground: true,
    // Applied by Chromium to every page, including any spillover page.
    margin: { top: "0.5in", bottom: "0.5in", left: "0.55in", right: "0.55in" },
    displayHeaderFooter: false,
  });

  console.log(`wrote  ${OUT} (${statSync(OUT).size} bytes)`);

  if (estimated > MAX_PAGES) {
    console.error(`resume overflows ${MAX_PAGES} pages — trim resume/resume.html`);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
