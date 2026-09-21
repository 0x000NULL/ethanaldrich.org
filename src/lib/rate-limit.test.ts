import { describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit and counts down remaining", () => {
    const ip = "test-under-limit";
    const first = checkRateLimit(ip, { maxRequests: 3, windowMs: 10000 });
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);
    const second = checkRateLimit(ip, { maxRequests: 3, windowMs: 10000 });
    expect(second.remaining).toBe(1);
  });

  it("blocks once the limit is exceeded", () => {
    const ip = "test-over-limit";
    checkRateLimit(ip, { maxRequests: 1, windowMs: 10000 });
    const blocked = checkRateLimit(ip, { maxRequests: 1, windowMs: 10000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetIn).toBeGreaterThan(0);
  });

  it("uses sensible defaults", () => {
    const r = checkRateLimit("test-defaults");
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(4); // default maxRequests 5
  });
});

describe("getClientIp", () => {
  /**
   * This previously asserted the FIRST entry, which is the spoofable one, so the
   * test encoded the vulnerability rather than catching it. Everything left of
   * the hop our own proxy appended is attacker-controlled.
   */
  it("takes the last x-forwarded-for hop, not the first", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(h)).toBe("5.6.7.8");
  });

  it("cannot be given a fresh rate-limit key by a forged header", () => {
    // A client sending its own X-Forwarded-For only prepends; the proxy still
    // appends what it actually saw, so the key is stable across attempts.
    const real = "203.0.113.7";
    const attempts = ["evil-1", "evil-2", "evil-3"].map((forged) =>
      getClientIp(new Headers({ "x-forwarded-for": `${forged}, ${real}` }))
    );
    expect(new Set(attempts)).toEqual(new Set([real]));
  });

  it("handles a single hop, padding and empty entries", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": "  8.8.8.8  " }))).toBe(
      "8.8.8.8"
    );
    expect(
      getClientIp(new Headers({ "x-forwarded-for": "1.1.1.1, , 2.2.2.2 ," }))
    ).toBe("2.2.2.2");
  });

  it("falls back to x-real-ip then unknown", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(getClientIp(new Headers())).toBe("unknown");
    // An all-empty XFF must not shadow x-real-ip.
    expect(
      getClientIp(new Headers({ "x-forwarded-for": " , ", "x-real-ip": "7.7.7.7" }))
    ).toBe("7.7.7.7");
  });
});
