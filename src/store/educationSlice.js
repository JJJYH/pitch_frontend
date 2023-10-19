// educationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const educationSlice = createSlice({
  name: 'education',
  initialState: [{ eduType: 'document', enterDay: '', graduateDay: '', major: '', graduateType: '', totalScore: '', score: '' }],
  reducers: {
    addEducation: (state, action) => {
      return [...state, action.payload];
    },
    removeEducation: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateEducation: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'eduType') {
        state[index].eduType = value;
      } else if (name === 'enterDay') {
        state[index].enterDay = value;
      } else if (name === 'graduateDay') {
        state[index].graduateDay = value;
      } else if (name === 'major') {
        state[index].major = value;
      } else if (name === 'graduateType') {
        state[index].graduateType = value;
      } else if (name === 'totalScore') {
        state[index].totalScore = value;
      } else if (name === 'score') {
        state[index].score = value;
      }
    }
  }
});

export const { addEducation, removeEducation, updateEducation } = educationSlice.actions;
export default educationSlice.reducer;
