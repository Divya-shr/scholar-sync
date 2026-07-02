import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectSuggestion {
  title: string;
  description: string;
  tags: string[];
  matchScore: number;
  relevantSkills: string[];
  researchAreas: string[];
}

interface SuggestionState {
  projects: ProjectSuggestion[];
}

const initialState: SuggestionState = {
  projects: [],
};

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    setSuggestions(state, action: PayloadAction<ProjectSuggestion[]>) {
      state.projects = action.payload;
    },
    clearSuggestions(state) {
      state.projects = [];
    },
  },
});

export const { setSuggestions, clearSuggestions } = suggestionSlice.actions;
export default suggestionSlice.reducer;
