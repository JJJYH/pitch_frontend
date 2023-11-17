// postingSlice.js

import { createSlice } from '@reduxjs/toolkit';

const postingSlice = createSlice({
  name: 'posting',
  initialState: {
    postingNo: 0,
    reqNo: 0,
    type: '',
    list: [],
    title: ''
  },
  reducers: {
    setPostingList: (state, action) => {
      state.list = [...action.payload.list];
    },
    setPosting: (state, action) => {
      state.postingNo = action.payload.postingNo;
      state.reqNo = action.payload.reqNo;
      state.type = action.payload.type;
      state.title = action.payload.title;
    }
  }
});

export const { setPostingList, setPosting } = postingSlice.actions;
export default postingSlice.reducer;
