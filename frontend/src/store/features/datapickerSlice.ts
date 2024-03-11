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
  startStudy: new Date(),
  finishStudy: new Date()
}

export const datapickerSlice = createSlice({
  name: 'datapicker',
  initialState,
  reducers: {
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
    getStartStudy: (state, action) => {
      state.startStudy = action.payload 
    },
    getFinishStudy: (state, action) => {
      state.finishStudy = action.payload 
    },
  },
})


export const { getNextMonth, getPrevMonth, getStartStudy,
               getFinishStudy } = datapickerSlice.actions

export default datapickerSlice.reducer