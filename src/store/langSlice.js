//langSlice.js

import { createSlice } from '@reduxjs/toolkit';

const langSlice = createSlice({
  name: 'lang',
  initialState: [{ examType: '', langName: '', langScore: '' }],
  reducers: {
    addLang: (state, action) => {
      return [...state, action.payload];
    },
    removeLang: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateLang: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'examType') {
        state[index].examType = value;
      } else if (name === 'langName') {
        state[index].langName = value;
      } else if (name === 'langScore') {
        state[index].langScore = value;
      }
    }
  }
});

export const { addLang, removeLang, updateLang } = langSlice.actions;
export default langSlice.reducer;
