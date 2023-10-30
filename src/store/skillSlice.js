// skillSlice.js

import { createSlice } from '@reduxjs/toolkit';

const skillSlice = createSlice({
  name: 'skill',
  initialState: [
    {
      skill_name: 'React',
      skill_domain: '개발'
    },
    {
      skill_name: 'Angular',
      skill_domain: '개발'
    },
    {
      skill_name: 'jQuery',
      skill_domain: '개발'
    },
    {
      skill_name: 'Polymer',
      skill_domain: '개발'
    },
    {
      skill_name: 'Vue.js',
      skill_domain: '개발'
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
      state[index].skill_name = value;
    }
  }
});

export const { addSkill, removeSkill, updateSkill } = skillSlice.actions;
export default skillSlice.reducer;
