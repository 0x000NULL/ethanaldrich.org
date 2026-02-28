import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STATS_FILE = path.join(process.cwd(), "data", "stats.json");

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
  } catch {
    // Return default if file doesn't exist or is invalid
  }
  return {
    visitors: 0,
    lastVisit: new Date().toISOString(),
    pageViews: 0,
  };
}

function saveStats(stats: Stats): void {
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
}

// GET - Return current stats
export async function GET() {
  const stats = getStats();
  return NextResponse.json(stats);
}

// POST - Increment visitor count
export async function POST() {
  const stats = getStats();
  stats.visitors += 1;
  stats.pageViews += 1;
  stats.lastVisit = new Date().toISOString();
  saveStats(stats);
  return NextResponse.json(stats);
}
