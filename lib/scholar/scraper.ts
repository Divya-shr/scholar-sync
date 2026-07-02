import puppeteer from "puppeteer";

export async function scrapeScholarProfile(profileUrl: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  try {
    await page.goto(profileUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector("#gsc_prf_in", { timeout: 10000 });

    const data = await page.evaluate(() => {
      const name = document.querySelector("#gsc_prf_in")?.textContent?.trim() || "";
      const affiliation = document.querySelector(".gsc_prf_il")?.textContent?.trim() || "";

      // ✅ Updated: new selector for interests
      const interests = Array.from(document.querySelectorAll("#gsc_prf_int a.gsc_prf_inta"))
        .map(el => el.textContent?.trim() || "")
        .filter(Boolean);

      const citationCells = Array.from(document.querySelectorAll("#gsc_rsb_st tbody tr td:nth-child(2)"));
      const citations = citationCells[0]?.textContent?.replace(/,/g, "") || "0";
      const hIndex = citationCells[1]?.textContent?.replace(/,/g, "") || "0";
      const i10Index = citationCells[2]?.textContent?.replace(/,/g, "") || "0";

      const recentPapers = Array.from(document.querySelectorAll(".gsc_a_at"))
        .slice(0, 5)
        .map(el => el.textContent?.trim() || "");

      return {
        name,
        affiliation,
        interests,
        citations: Number(citations),
        hIndex: Number(hIndex),
        i10Index: Number(i10Index),
        recentPapers
      };
    });

    console.log("✅ Scraped Scholar Data:", data);
    await browser.close();
    return data;

  } catch (err) {
    console.error("❌ Error scraping scholar profile:", err);
    await browser.close();
    return {
      name: "",
      affiliation: "",
      interests: [],
      citations: 0,
      hIndex: 0,
      i10Index: 0,
      recentPapers: []
    };
  }
}
