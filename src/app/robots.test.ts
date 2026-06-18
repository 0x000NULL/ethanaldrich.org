import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows crawling but blocks api/_next, with a sitemap", () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rules?.allow).toBe("/");
    expect(rules?.disallow).toContain("/api/");
    expect(r.sitemap).toContain("/sitemap.xml");
  });
});
