// postingSlice.js

import { createSlice } from '@reduxjs/toolkit';

const postingSlice = createSlice({
  name: 'posting',
  initialState: {
    postingNo: 0,
    reqNo: 0,
    type: '',
    list: [],
    title: '',
    qualification: '',
    preferred: '',
    isLoading: false
  },
  reducers: {
    setPostingList: (state, action) => {
      state.list = [...action.payload.list];
    },
    setPosting: (state, action) => {
      state.postingNo = action.payload.postingNo;
      state.reqNo = action.payload.reqNo;
      state.type = action.payload.type;
      state.qualification = action.payload.qualification;
      state.preferred = action.payload.preferred;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    }
  }
});

export const { setPostingList, setPosting, setLoading } = postingSlice.actions;
export default postingSlice.reducer;
