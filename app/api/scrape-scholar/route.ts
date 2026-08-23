import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("scholar.google.com")) {
      return NextResponse.json({ error: "Invalid Google Scholar URL" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch Scholar profile" }, { status: 500 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Dynamic Extraction
    const name = $("#gsc_prf_in").text().trim() || "Unknown Researcher";
    const affiliation = $(".gsc_prf_il").first().text().trim() || "Independent Researcher";

    // Extract Stat Table Values (Index 0 = Citations, Index 2 = h-index)
    const statsTable = $("#gsc_rsb_st td.gsc_rsb_std");
    const citations = parseInt($(statsTable[0]).text().replace(/,/g, "")) || 0;
    const hIndex = parseInt($(statsTable[2]).text().replace(/,/g, "")) || 0;

    // Extract Research Interests from Google Scholar DOM
    const interests: string[] = [];
    $("#gsc_prf_int a").each((_, el) => {
      const interestText = $(el).text().trim();
      if (interestText) interests.push(interestText);
    });

    return NextResponse.json({
      name,
      affiliation,
      citations,
      hIndex,
      interests: interests.length > 0 ? interests : ["Research"],
    });
  } catch (error: any) {
    console.error("Scholar Scraping Error:", error);
    return NextResponse.json({ error: "Failed to scrape profile details" }, { status: 500 });
  }
}