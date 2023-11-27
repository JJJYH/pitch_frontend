// cvSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cvSlice = createSlice({
  name: 'cv',
  initialState: { cv_no: 0 },
  reducers: {
    updateCVNO: (state, action) => {
      console.log('cv_no 변경 진행', action.payload);
      state.cv_no = action.payload;
    }
  }
});

export const { updateCVNO } = cvSlice.actions;
export default cvSlice.reducer;
