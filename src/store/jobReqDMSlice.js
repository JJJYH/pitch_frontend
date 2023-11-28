import { createSlice } from '@reduxjs/toolkit';

const jobReqDMSlice = createSlice({
  name: 'deleteOpen',
  initialState: {
    isOpen: false
  },
  reducers: {
    setDeleteOpen: (state, action) => {
      state.isOpen = action.payload;
    }
  }
});

export const { setDeleteOpen } = jobReqDMSlice.actions;
export default jobReqDMSlice.reducer;
