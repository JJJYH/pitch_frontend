// store.js

import { configureStore } from '@reduxjs/toolkit';
import customizationReducer from './customizationSlice';
import educationReducer from './educationSlice';
import careerReducer from './careerSlice';
import profileReducer from './profileSlice';
import skillReducer from './skillSlice';
import certReducer from './certSlice';
import langReducer from './langSlice';
import advantageReducer from './advantageSlice';
import activityReducer from './activitySlice';
import selectedRowReducer from './selectedRowSlice';
import jobReqNoReducer from './jobReqNoSlice';
import cvFileReducer from './cvFileSlice';
import postingReducer from './postingSlice';
import userInfoReducer from './userInfoSlice';
import cvReducer from './cvSlice';
import jobPostingNoReducer from './jobPostingNoSlice';
import uploadedFilesReducer from './uploadedFilesSlice';
import jobReqDMReducer from './jobReqDMSlice';
import checkedDeleteReducer from './checkedDeleteSlice';
import adminReducer from './adminSlice';

const toolkitStore = configureStore({
  reducer: {
    customization: customizationReducer,
    education: educationReducer,
    career: careerReducer,
    profile: profileReducer,
    skill: skillReducer,
    cert: certReducer,
    lang: langReducer,
    activity: activityReducer,
    advantage: advantageReducer,
    userInfo: userInfoReducer,
    selectedRow: selectedRowReducer,
    jobReqNo: jobReqNoReducer,
    cvfile: cvFileReducer,
    posting: postingReducer,
    cv_no: cvReducer,
    jobPostingNo: jobPostingNoReducer,
    uploadedFiles: uploadedFilesReducer,
    deleteOpen: jobReqDMReducer,
    checkedDelete: checkedDeleteReducer,
    admin: adminReducer,
  }
});

export default toolkitStore;
