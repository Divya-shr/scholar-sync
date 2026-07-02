import { setResumeData } from "../resumeSlice";

export const parseResume = (file: File) => async (dispatch: any) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch("/api/parse-resume", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  dispatch(setResumeData(data));
};
