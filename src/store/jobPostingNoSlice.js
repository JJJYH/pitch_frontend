import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobPostingNo: ''
};

const jobPostingNoSlice = createSlice({
  name: 'jobPostingNo',
  initialState,
  reducers: {
    setJobPostingNo: (state, action) => {
      state.jobPostingNo = action.payload;
    }
  }
});

export const { setJobPostingNo } = jobPostingNoSlice.actions;
export const jobPostingNoSelector = (state) => state.jobPostingNo.jobPostingNo;
export default jobPostingNoSlice.reducer;
