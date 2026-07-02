import { setSuggestions } from "../suggestionSlice";

export const fetchSuggestions = (resumeData: any, scholarData: any) => async (dispatch: any) => {
  const res = await fetch("/api/suggest-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeData, scholarData }),
  });

  const { projects } = await res.json();
  dispatch(setSuggestions(projects));
};
