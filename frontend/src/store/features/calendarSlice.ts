import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CalendarState {
  calendarType: string;
  date: Date;
}

const initialState: CalendarState = {
  calendarType: "month",
  date: new Date(Date.now()),
}

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    switchCalendarType: (state, action) => {
        state.calendarType = action.payload
    },
    getNextMonth: (state) => {
        const date = state.date
        const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        state.date = nextMonthDate
    },
    getPrevMonth: (state) => {
        const date = state.date
        const nextMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        state.date = nextMonthDate
    },
    getNextWeek: (state) => {
        const date = state.date
        const nextWeekDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        state.date = nextWeekDate
    },
    getPrevWeek: (state) => {
        const date = state.date
        const prevWeekDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
        state.date = prevWeekDate
    },
  },
})


export const { switchCalendarType, getNextMonth, getPrevMonth,
                getNextWeek, getPrevWeek} = calendarSlice.actions

export default calendarSlice.reducer