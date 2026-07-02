import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMIT = 30;
const TIME_WINDOW = 60 * 1000;

const ipMap = new Map();

export function middleware(req: NextRequest) {
  const ip = req.ip || "unknown";

  const now = Date.now();
  const entry = ipMap.get(ip) || { count: 0, start: now };

  if (now - entry.start < TIME_WINDOW) {
    entry.count++;
    if (entry.count > RATE_LIMIT) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }
  } else {
    entry.count = 1;
    entry.start = now;
  }

  ipMap.set(ip, entry);
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/parse-resume", "/api/scrape-scholar", "/api/suggest-projects"],
};
