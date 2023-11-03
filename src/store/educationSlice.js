// educationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const educationSlice = createSlice({
  name: 'education',
  initialState: [{ edu_no: '', edu_type: '', enter_date: '', graduate_date: '', major: '', graduate_type: '', total_score: '', score: '' }],
  reducers: {
    addEducation: (state, action) => {
      return [...state, action.payload];
    },
    removeEducation: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateEducation: (state, action) => {
      console.log('UpdateEducation Action!!!');
      const { index, name, value } = action.payload;
      if (name === 'edu_type') {
        state[index].edu_type = value;
      } else if (name === 'enter_date') {
        state[index].enter_date = value;
      } else if (name === 'graduate_date') {
        state[index].graduate_date = value;
      } else if (name === 'major') {
        state[index].major = value;
      } else if (name === 'graduate_type') {
        state[index].graduate_type = value;
      } else if (name === 'total_score') {
        state[index].total_score = value;
      } else if (name === 'score') {
        state[index].score = value;
      }
    }
  }
});

export const { addEducation, removeEducation, updateEducation } = educationSlice.actions;
export default educationSlice.reducer;
