import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const STATS_FILE = path.join(process.cwd(), "data", "stats.json");
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 100;

interface Stats {
  visitors: number;
  lastVisit: string;
  pageViews: number;
}

function getStats(): Stats {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to read stats file:", error);
    }
  }
  return {
    visitors: 0,
    lastVisit: new Date().toISOString(),
    pageViews: 0,
  };
}

function saveStats(stats: Stats): boolean {
  const dir = path.dirname(STATS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  return true;
}

async function saveStatsWithRetry(stats: Stats): Promise<boolean> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return saveStats(stats);
    } catch (error) {
      lastError = error as Error;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1))
        );
      }
    }
  }

  console.error("Failed to save stats after retries:", lastError);
  return false;
}

// GET - Return current stats
export async function GET() {
  const stats = getStats();
  return NextResponse.json(stats);
}

// POST - Increment visitor count
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed, remaining, resetIn } = checkRateLimit(ip, {
    maxRequests: 5,
    windowMs: 60000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetIn / 1000)),
          "Retry-After": String(Math.ceil(resetIn / 1000)),
        },
      }
    );
  }

  const stats = getStats();
  stats.visitors += 1;
  stats.pageViews += 1;
  stats.lastVisit = new Date().toISOString();

  const saved = await saveStatsWithRetry(stats);

  if (!saved) {
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }

  return NextResponse.json(stats, {
    headers: {
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}
