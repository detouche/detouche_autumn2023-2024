import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SelectState {
  groupSelect: string[];
}

const initialState: SelectState = {
  groupSelect: []
}

export const selectSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    updateGroupSelect: (state, action) => {
        const payload = action.payload
        let selectedElements = payload.selectedData
        const element = payload.data
        const doesExist = selectedElements.includes(element)
        let newSelectedElements
        if(doesExist === false) {
            newSelectedElements = [...selectedElements, element]
        } else {
            newSelectedElements = selectedElements.filter((i: any) => i !== element)
        }
        return { 
            groupSelect: newSelectedElements
        }
    },
    clearGroupSelect: (state) => {
      state.groupSelect = []        
    }
  },
})


export const { updateGroupSelect, clearGroupSelect } = selectSlice.actions

export default selectSlice.reducer