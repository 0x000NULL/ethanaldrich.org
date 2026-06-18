import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";

function post(ip: string) {
  return new NextRequest("http://localhost/api/stats", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  });
}

describe("/api/stats", () => {
  it("GET returns a stats object", async () => {
    const res = await GET();
    const stats = await res.json();
    expect(stats).toHaveProperty("visitors");
    expect(stats).toHaveProperty("pageViews");
    expect(stats).toHaveProperty("lastVisit");
  });

  it("POST increments the visitor count", async () => {
    const before = await (await GET()).json();
    const res = await POST(post("stats-test-1"));
    expect(res.status).toBe(200);
    const after = await res.json();
    expect(after.visitors).toBe(before.visitors + 1);
  });

  it("POST rate-limits after 5 requests from one IP", async () => {
    const ip = "stats-test-ratelimit";
    let last = 200;
    for (let i = 0; i < 6; i++) {
      const res = await POST(post(ip));
      last = res.status;
    }
    expect(last).toBe(429);
  });
});
