// skillSlice.js

import { createSlice } from '@reduxjs/toolkit';

const skillSlice = createSlice({
  name: 'skill',
  initialState: [
    {
      skillName: 'React',
      skillDomain: '개발'
    },
    {
      skillName: 'Angular',
      skillDomain: '개발'
    },
    {
      skillName: 'jQuery',
      skillDomain: '개발'
    },
    {
      skillName: 'Polymer',
      skillDomain: '개발'
    },
    {
      skillName: 'Vue.js',
      skillDomain: '개발'
    }
  ],
  reducers: {
    addSkill: (state, action) => {
      return [...state, action.payload];
    },
    removeSkill: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateSkill: (state, action) => {
      const { index, value } = action.payload;
      state[index].skillName = value;
    }
  }
});

export const { addSkill, removeSkill, updateSkill } = skillSlice.actions;
export default skillSlice.reducer;
