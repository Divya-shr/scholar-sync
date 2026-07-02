import { configureStore } from '@reduxjs/toolkit'
import resumeReducer from './slices/resumeSlice'
import scholarReducer from './slices/scholarSlice'
import suggestionsReducer from './slices/suggestionsSlice'

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    scholar: scholarReducer,
    suggestions: suggestionsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
