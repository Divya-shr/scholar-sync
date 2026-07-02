import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResumeState {
  data: any | null;
}

const initialState: ResumeState = {
  data: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResumeData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    clearResumeData(state) {
      state.data = null;
    },
  },
});

export const { setResumeData, clearResumeData } = resumeSlice.actions;
export default resumeSlice.reducer;
