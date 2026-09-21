import { NextResponse } from "next/server";

/**
 * Liveness endpoint for the App Platform health check.
 *
 * Without one, DigitalOcean falls back to a TCP probe on the port: a process
 * that binds 3000 and then 500s on every request still looks healthy, and a
 * broken build gets rolled out anyway.
 *
 * Deliberately trivial. A health check that touches the filesystem or compiles
 * MDX can fail for reasons unrelated to whether the process is serving, and a
 * flapping check causes more outages than it catches.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok", uptime: Math.round(process.uptime()) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
