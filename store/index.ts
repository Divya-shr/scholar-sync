import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./resumeSlice";
import scholarReducer from "./scholarSlice";
import suggestionReducer from "./suggestionSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    scholar: scholarReducer,
    suggestions: suggestionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
