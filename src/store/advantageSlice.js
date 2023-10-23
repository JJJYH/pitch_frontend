//advantageSlice.js

import { createSlice } from '@reduxjs/toolkit';

const advantageSlice = createSlice({
  name: 'advantage',
  initialState: [{ advantageName: '', advantageDetail: '', consent: '' }],
  reducers: {
    addAdvantage: (state, action) => {
      return [...state, action.payload];
    },
    removeAdvantage: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateAdvantage: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'advantageName') {
        state[index].advantageName = value;
      } else if (name === 'advantageDetail') {
        state[index].advantageDetail = value;
      } else if (name === 'consent') {
        state[index].consent = value;
      }
    }
  }
});

export const { addAdvantage, removeAdvantage, updateAdvantage } = advantageSlice.actions;
export default advantageSlice.reducer;
