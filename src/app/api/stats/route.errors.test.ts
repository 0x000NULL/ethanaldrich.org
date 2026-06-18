import { describe, it, expect, vi } from "vitest";

// Force every fs operation to fail so the error/retry branches are exercised.
vi.mock("fs", () => {
  const fail = () => {
    throw new Error("disk full");
  };
  const api = {
    existsSync: () => true,
    readFileSync: fail,
    writeFileSync: fail,
    mkdirSync: () => undefined,
  };
  return { ...api, default: api };
});

import { NextRequest } from "next/server";
import { GET, POST } from "./route";

describe("/api/stats error paths", () => {
  it("GET falls back to defaults when the stats file cannot be read", async () => {
    const res = await GET();
    const stats = await res.json();
    expect(stats.visitors).toBe(0);
    expect(stats.pageViews).toBe(0);
  });

  it("POST returns 500 when saving fails after retries", async () => {
    const req = new NextRequest("http://localhost/api/stats", {
      method: "POST",
      headers: { "x-forwarded-for": "stats-error-ip" },
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
