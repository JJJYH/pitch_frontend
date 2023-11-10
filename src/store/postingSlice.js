// postingSlice.js

import { createSlice } from '@reduxjs/toolkit';

const postingSlice = createSlice({
  name: 'posting',
  initialState: {
    postingNo: 0,
    reqNo: 0,
    type: ''
  },
  reducers: {
    setPosting: (state, action) => {
      state.postingNo = action.payload.postingNo;
      state.reqNo = action.payload.reqNo;
      state.type = action.payload.type;
    }
  }
});

export const { setPosting } = postingSlice.actions;
export default postingSlice.reducer;
