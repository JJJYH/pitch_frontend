// cvFileSlice.js

import { createSlice } from '@reduxjs/toolkit';

const cvFileSlice = createSlice({
  name: 'cvFile',
  initialState: {
    selectedFiles: []
  },
  reducers: {
    addCVFile: (state, action) => {
      state.selectedFiles.push(action.payload);
    },
    removeCVFile: (state, action) => {
      state.selectedFiles = state.selectedFiles.filter((file) => file !== action.payload);
    },
    clearCVFile: (state, action) => {
      state.selectedFiles = [];
    }
  }
});

export const { addCVFile, removeCVFile, clearCVFile } = cvFileSlice.actions;
export default cvFileSlice.reducer;
