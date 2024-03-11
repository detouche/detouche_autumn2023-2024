import { configureStore } from '@reduxjs/toolkit'
import calendarReducer from './features/calendarSlice'
import datapickerReducer from './features/datapickerSlice'

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    datapicker: datapickerReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch