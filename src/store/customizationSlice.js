// customizationSlice.js

import { createSlice } from '@reduxjs/toolkit';
import config from 'config';


const initialState = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
  isMain: true,
};

const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    menuOpen: (state, action) => {
      state.isOpen = [action.payload];
    },
    setMenu: (state, action) => {
      state.opened = action.payload;
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload;
    },
    setBorderRadius: (state, action) => {
      state.borderRadius = action.payload;
    },
    setMain: (state, action) => {
      state.isMain = action.payload;
    }
  },
});

//export const { actions, reducer } = customizationSlice;


export const { menuOpen, setMenu, setFontFamily, setBorderRadius, setMain } = customizationSlice.actions;
export default customizationSlice.reducer;
