import { setScholarData } from "../scholarSlice";

export const scrapeScholar = (url: string) => async (dispatch: any) => {
  const res = await fetch("/api/scrape-scholar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileUrl: url }),
  });

  const data = await res.json();
  dispatch(setScholarData(data));
};
