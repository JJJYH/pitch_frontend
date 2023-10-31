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
import cvFileReducer from './cvFileSlice';
import userInfoReducer from './userInfoSlice';
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
    cvfile: cvFileReducer
  }
});

export default toolkitStore;
