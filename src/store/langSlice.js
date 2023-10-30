//langSlice.js

import { createSlice } from '@reduxjs/toolkit';

const langSlice = createSlice({
  name: 'lang',
  initialState: [],
  reducers: {
    addLang: (state, action) => {
      return [...state, action.payload];
    },
    removeLang: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateLang: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'exam_type') {
        state[index].exam_type = value;
      } else if (name === 'language_name') {
        state[index].language_name = value;
      } else if (name === 'language_score') {
        state[index].language_score = value;
      }
    }
  }
});

export const { addLang, removeLang, updateLang } = langSlice.actions;
export default langSlice.reducer;
