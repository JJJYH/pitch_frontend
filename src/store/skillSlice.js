// skillSlice.js

import { createSlice } from '@reduxjs/toolkit';

const skillSlice = createSlice({
  name: 'skill',
  initialState: [],
  reducers: {
    addSkill: (state, action) => {
      return [...state, action.payload];
    },
    removeSkill: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateSkill: (state, action) => {
      const { index, value } = action.payload;

      state[index].skill_name = value;
    }
  }
});

export const { addSkill, removeSkill, updateSkill } = skillSlice.actions;
export default skillSlice.reducer;
