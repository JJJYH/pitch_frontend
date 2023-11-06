// cvSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cvSlice = createSlice({
  name: 'cv',
  initialState: { cv_no: 0 },
  reducers: {
    updateCVNO: (state, action) => {
      state.cv_no = action.payload;
    }
  }
});

export const { updateCVNO } = cvSlice.actions;
export default cvSlice.reducer;
