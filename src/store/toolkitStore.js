// store.js

import { configureStore } from '@reduxjs/toolkit';
import customizationReducer from './customizationSlice';
import educationReducer from './educationSlice';
import careerReducer from './careerSlice';
import profileReducer from './profileSlice';
import skillReducer from './skillSlice';
import userInfoReducer from './userInfoSlice';
const toolkitStore = configureStore({
  reducer: {
    customization: customizationReducer,
    education: educationReducer,
    career: careerReducer,
    profile: profileReducer,
    skill: skillReducer,
    userInfo: userInfoReducer
  }
});

export default toolkitStore;
