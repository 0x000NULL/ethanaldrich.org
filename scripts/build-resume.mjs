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

// Page geometry lives in resume.html's @page rule, NOT here. Chromium lets an
// in-document @page margin override the margin passed to page.pdf(), so the
// two must agree or the PDF silently ignores this file. Keep in sync with
// "@page { margin: PAGE_MARGIN_Y PAGE_MARGIN_X }".
const PAGE_MARGIN_X = 0.65; // in
const PAGE_MARGIN_Y = 0.55; // in
const CONTENT_W_PX = Math.round((8.5 - PAGE_MARGIN_X * 2) * 96);
const USABLE_PAGE_PX = (11 - PAGE_MARGIN_Y * 2) * 96;
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
    // Mirrors resume.html's @page rule so both agree; @page is the one that
    // actually wins in Chromium.
    margin: {
      top: `${PAGE_MARGIN_Y}in`,
      bottom: `${PAGE_MARGIN_Y}in`,
      left: `${PAGE_MARGIN_X}in`,
      right: `${PAGE_MARGIN_X}in`,
    },
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
