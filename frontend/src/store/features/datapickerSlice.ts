import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface DatapickerState {
  currentDate: Date;
  date: Date;
  startStudy: Date;
  finishStudy: Date;
}

const initialState: DatapickerState = {
  currentDate: new Date(Date.now()),
  date: new Date(Date.now()),
  startStudy: new Date(1970, 2, 18),
  finishStudy: new Date(1970, 2, 18)
}

export const datapickerSlice = createSlice({
  name: 'datapicker',
  initialState,
  reducers: {
    getMonth: (state, action) => {
      const monthDate = action.payload
      state.date = monthDate
    },
    getNextMonth: (state) => {
      const date = state.date
      const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      state.date = nextMonthDate
    },
    getNextYear: (state) => {
      const date = state.date
      const nextYearDate = new Date(date.getFullYear() + 1, date.getMonth(), 1);
      state.date = nextYearDate
    },
    getPrevMonth: (state) => {
      const date = state.date
      const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      state.date = prevMonthDate
    },
    getPrevYear: (state) => {
      const date = state.date
      const prevYearDate = new Date(date.getFullYear() - 1, date.getMonth(), 1);
      state.date = prevYearDate
    },
    getStartStudy: (state, action) => {
      state.startStudy = action.payload
    },
    getFinishStudy: (state, action) => {
      state.finishStudy = action.payload 
    },
  },
})


export const { getNextMonth, getPrevMonth, getStartStudy,
               getFinishStudy, getNextYear, getPrevYear, getMonth } = datapickerSlice.actions

export default datapickerSlice.reducer