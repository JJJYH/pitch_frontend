import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobReqNo: ''
};

const jobReqNoSlice = createSlice({
  name: 'jobReqNo',
  initialState,
  reducers: {
    setJobReqNo: (state, action) => {
      state.jobReqNo = action.payload;
    }
  }
});

export const { setJobReqNo } = jobReqNoSlice.actions;
export const jobReqNoSelector = (state) => state.jobReqNo.jobReqNo;
export default jobReqNoSlice.reducer;
