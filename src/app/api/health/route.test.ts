import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("reports ok with an uptime", async () => {
    const res = GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(typeof body.uptime).toBe("number");
    expect(body.uptime).toBeGreaterThanOrEqual(0);
  });

  it("is never cached, so the probe sees the live process", () => {
    expect(GET().headers.get("Cache-Control")).toBe("no-store");
  });
});
