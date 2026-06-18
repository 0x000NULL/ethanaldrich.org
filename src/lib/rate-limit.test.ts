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
  it("prefers the first x-forwarded-for entry", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(h)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip then unknown", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
