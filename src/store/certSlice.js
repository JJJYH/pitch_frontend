//certSlice.js

import { createSlice } from '@reduxjs/toolkit';

const certSlice = createSlice({
  name: 'cert',
  initialState: [],
  reducers: {
    addCert: (state, action) => {
      return [...state, action.payload];
    },
    removeCert: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateCert: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'cert_name') {
        state[index].cert_name = value;
      } else if (name === 'publisher') {
        state[index].publisher = value;
      } else if (name === 'acquisition_date') {
        state[index].acquisition_date = value;
      }
    }
  }
});

export const { addCert, removeCert, updateCert } = certSlice.actions;
export default certSlice.reducer;
