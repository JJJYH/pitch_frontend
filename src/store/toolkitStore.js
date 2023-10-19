// store.js

import { configureStore } from '@reduxjs/toolkit';
import customizationReducer from './customizationSlice';
import educationReducer from './educationSlice';

const toolkitStore = configureStore({
  reducer: {
    customization: customizationReducer,
    education: educationReducer
  }
});

export default toolkitStore;
