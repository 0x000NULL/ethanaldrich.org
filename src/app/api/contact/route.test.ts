import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

function post(ip: string, body: unknown, raw = false) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "x-forwarded-for": ip, "content-type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

const valid = { name: "Ada", email: "ada@example.com", message: "hello" };

beforeEach(() => {
  delete process.env.RESEND_API_KEY;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/contact", () => {
  it("rejects malformed JSON", async () => {
    const res = await POST(post("contact-json", "{bad", true));
    expect(res.status).toBe(400);
  });

  it("requires all fields", async () => {
    const res = await POST(post("contact-missing", { name: "x" }));
    expect(res.status).toBe(400);
  });

  it("rejects an invalid email", async () => {
    const res = await POST(post("contact-email", { ...valid, email: "nope" }));
    expect(res.status).toBe(400);
  });

  it("rejects over-long fields", async () => {
    const res = await POST(
      post("contact-long", { ...valid, message: "x".repeat(6000) })
    );
    expect(res.status).toBe(400);
  });

  it("503s when the email service is not configured", async () => {
    const res = await POST(post("contact-nokey", valid));
    expect(res.status).toBe(503);
  });

  it("sends via Resend and returns ok", async () => {
    process.env.RESEND_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true } as Response))
    );
    const res = await POST(post("contact-ok", valid));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("502s when Resend fails", async () => {
    process.env.RESEND_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          text: () => Promise.resolve("forbidden"),
        } as Response)
      )
    );
    const res = await POST(post("contact-fail", valid));
    expect(res.status).toBe(502);
  });

  it("429s after exceeding the hourly limit", async () => {
    const ip = "contact-rl";
    let last = 0;
    for (let i = 0; i < 4; i++) {
      last = (await POST(post(ip, valid))).status;
    }
    expect(last).toBe(429);
  });
});
