import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploadedFiles: []
};

const uploadedFilesSlice = createSlice({
  name: 'uploadedFiles',
  initialState,
  reducers: {
    setUploadedFiles: (state, action) => {
      state.uploadedFiles = action.payload;
    },
    resetUploadedFiles: (state) => {
      state.uploadedFiles = initialState.uploadedFiles;
    }
  }
});

export const { setUploadedFiles, resetUploadedFiles } = uploadedFilesSlice.actions;
export const uploadedFilesSelector = (state) => state.uploadedFiles.uploadedFiles;
export default uploadedFilesSlice.reducer;
