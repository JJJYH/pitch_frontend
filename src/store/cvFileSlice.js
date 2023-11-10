import { createSlice } from "@reduxjs/toolkit";

// cvFileSlice.js
const cvFileSlice = createSlice({
  name: 'cvFile',
  initialState: [{
    cv_file_no : '',
    cv_no : '',
    file_name: '',
    file_type: '',
    file_size: '',
    upload_date: '',
    path : '',
    type : ''
  }],
  reducers: {
    addFiles :(state, action)=> {
      
    },

  },
});

export const { setFiles, addFiles,removeFile } = cvFileSlice.actions;

export default cvFileSlice.reducer;
