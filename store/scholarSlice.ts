import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScholarState {
  data: any | null;
}

const initialState: ScholarState = {
  data: null,
};

const scholarSlice = createSlice({
  name: "scholar",
  initialState,
  reducers: {
    setScholarData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    clearScholarData(state) {
      state.data = null;
    },
  },
});

export const { setScholarData, clearScholarData } = scholarSlice.actions;
export default scholarSlice.reducer;
