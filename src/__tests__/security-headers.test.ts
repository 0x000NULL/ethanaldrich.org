import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Exercises both branches of the security headers in next.config.ts.
 *
 * These headers are the repo's headline security control, and until now nothing
 * asserted them: the unit suite never imported the config, and e2e runs against
 * `npm run dev`, where the production-only headers are deliberately absent.
 *
 * Pointing e2e at the production server instead is NOT the fix — that is what
 * broke WebKit previously. Chrome exempts localhost from
 * `upgrade-insecure-requests`; WebKit does not, so it rewrites every dev asset
 * to https://localhost and the page renders unstyled with no JS. Asserting the
 * config directly gets the coverage without putting a browser behind that
 * policy.
 */

type HeaderEntry = { key: string; value: string };

async function headersFor(nodeEnv: string): Promise<Map<string, string>> {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", nodeEnv);

  const config = (await import("../../next.config")).default;
  const rules = await config.headers!();

  expect(rules).toHaveLength(1);
  expect(rules[0].source).toBe("/:path*");

  return new Map(
    (rules[0].headers as HeaderEntry[]).map((h) => [h.key.toLowerCase(), h.value])
  );
}

describe("security headers", () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllEnvs());

  describe("in production", () => {
    it("sets the baseline hardening headers", async () => {
      const h = await headersFor("production");

      expect(h.get("x-content-type-options")).toBe("nosniff");
      expect(h.get("x-frame-options")).toBe("DENY");
      expect(h.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
      // Deliberately 0: the legacy auditor introduced its own vulnerabilities.
      expect(h.get("x-xss-protection")).toBe("0");
      expect(h.get("permissions-policy")).toContain("camera=()");
    });

    it("locks the CSP down and never allows eval", async () => {
      const csp = (await headersFor("production")).get(
        "content-security-policy"
      )!;

      for (const directive of [
        "default-src 'self'",
        "frame-ancestors 'none'",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ]) {
        expect(csp).toContain(directive);
      }

      // The animation layer is hand-rolled rAF precisely so this stays true.
      expect(csp).not.toContain("unsafe-eval");
    });

    it("applies transport hardening", async () => {
      const h = await headersFor("production");

      expect(h.get("strict-transport-security")).toContain("max-age=63072000");
      expect(h.get("strict-transport-security")).toContain("includeSubDomains");
      expect(h.get("content-security-policy")).toContain(
        "upgrade-insecure-requests"
      );
    });
  });

  describe("in development", () => {
    it("omits HSTS and upgrade-insecure-requests, which break WebKit on localhost", async () => {
      const h = await headersFor("development");

      expect(h.has("strict-transport-security")).toBe(false);
      expect(h.get("content-security-policy")).not.toContain(
        "upgrade-insecure-requests"
      );
    });

    it("still applies the CSP and the rest of the baseline", async () => {
      const h = await headersFor("development");

      expect(h.get("content-security-policy")).toContain("default-src 'self'");
      expect(h.get("content-security-policy")).not.toContain("unsafe-eval");
      expect(h.get("x-frame-options")).toBe("DENY");
    });
  });
});
