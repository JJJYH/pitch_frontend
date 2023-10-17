// store.js

import { configureStore } from '@reduxjs/toolkit';
import customizationReducer from './customizationSlice';

const store = configureStore({
  reducer: {
    customization: customizationReducer
  }
});

export default store;
