import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  PROFILE,
  PROFILE_LINKS,
  PROFILE_SAME_AS,
  PROFILE_EMPLOYERS,
  METAPHOR,
} from "./profile";

describe("PROFILE", () => {
  it("keeps location and its split form in agreement", () => {
    expect(PROFILE.location).toBe(`${PROFILE.city}, ${PROFILE.region}`);
  });

  it("names the role inside the blurb it leads with", () => {
    expect(PROFILE.blurb).toContain(PROFILE.role);
  });

  it("has an absolute, slash-free site origin", () => {
    expect(PROFILE.site).toMatch(/^https:\/\//);
    expect(PROFILE.site.endsWith("/")).toBe(false);
  });

  it("keeps the blurb free of the metaphor, which lives separately", () => {
    expect(PROFILE.blurb.toLowerCase()).not.toContain("subway");
    expect(METAPHOR.toLowerCase()).toContain("subway");
  });
});

describe("PROFILE_LINKS", () => {
  /**
   * `external` means "opens in a new tab, so it needs target/rel", not
   * "off-site" - the resume PDF is a local path that still opens away from the
   * app. What must hold is that every http(s) destination carries it, and that
   * in-app routes rendered with next/link do not.
   */
  it("marks every http(s) destination external", () => {
    for (const link of PROFILE_LINKS) {
      if (/^https?:/.test(link.href)) expect(link.external).toBe(true);
    }
  });

  it("leaves in-app routes internal so they use the client router", () => {
    for (const link of PROFILE_LINKS) {
      if (link.href.startsWith("/") && !link.href.endsWith(".pdf")) {
        expect(link.external ?? false).toBe(false);
      }
    }
  });

  it("links the email to the profile address", () => {
    const email = PROFILE_LINKS.find((l) => l.href.startsWith("mailto:"));
    expect(email?.href).toBe(`mailto:${PROFILE.email}`);
  });

  it("lists only profiles Ethan controls in sameAs", () => {
    const hrefs = PROFILE_LINKS.map((l) => l.href);
    for (const same of PROFILE_SAME_AS) expect(hrefs).toContain(same);
  });
});

describe("PROFILE_EMPLOYERS", () => {
  it("gives every employer both a formal and a short name", () => {
    expect(PROFILE_EMPLOYERS.length).toBeGreaterThan(0);
    for (const e of PROFILE_EMPLOYERS) {
      expect(e.name).toBeTruthy();
      expect(e.short).toBeTruthy();
    }
  });
});

/**
 * The origin used to be written out in five places (layout's metadataBase,
 * canonical and og:url, the sitemap, robots) plus every page's own metadata, so
 * a domain change meant finding all of them. PROFILE.site owns it now.
 */
describe("the site origin is written exactly once", () => {
  function walk(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return walk(full);
      return /\.(ts|tsx)$/.test(e.name) ? [full] : [];
    });
  }

  it("appears only in profile.ts across src/", () => {
    const offenders = walk(path.join(process.cwd(), "src"))
      .filter((f) => !/\.test\.(ts|tsx)$/.test(f))
      .filter((f) => fs.readFileSync(f, "utf8").includes(PROFILE.site))
      .map((f) => path.relative(process.cwd(), f));

    expect(offenders).toEqual([path.join("src", "data", "profile.ts")]);
  });
});
