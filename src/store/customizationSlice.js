// customizationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const customizationSlice = createSlice({
  name: 'customization',
  initialState: {
    isOpen: [],
    defaultId: 'default',
    fontFamily: '',
    borderRadius: 0,
    opened: true
  },
  reducers: {
    menuOpen: (state, action) => {
      state.isOpen = [action.payload.id];
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload.fontFamily;
    },
    setBorderRadius: (state, action) => {
      state.borderRadius = action.payload.borderRadius;
    }
  }
});

export const { menuOpen, setFontFamily, setBorderRadius } = customizationSlice.actions;
export default customizationSlice.reducer;
