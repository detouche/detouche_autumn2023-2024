import { configureStore } from '@reduxjs/toolkit'
import calendarReducer from './features/calendarSlice'
import datapickerReducer from './features/datapickerSlice'
import selectReducer from './features/selectSlice'

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    datapicker: datapickerReducer,
    select: selectReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch