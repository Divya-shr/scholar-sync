export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { scrapeScholarProfile } from "@/lib/scholar/scraper";

export async function POST(req: NextRequest) {
  try {
    const { scrapeScholarProfile } = await import("@/lib/scholar/scraper");
    const { profileUrl } = await req.json();

    if (
      !profileUrl ||
      typeof profileUrl !== "string" ||
      !profileUrl.includes("scholar.google.")
    ) {
      return NextResponse.json(
        { error: "Invalid Scholar URL" },
        { status: 400 }
      );
    }

    const profileData = await scrapeScholarProfile(profileUrl);
    return NextResponse.json(profileData);
  } catch (error) {
    console.error("[ScholarScrapeError]:", error);
    return NextResponse.json(
      { error: "Failed to scrape Google Scholar profile" },
      { status: 500 }
    );
  }
}
