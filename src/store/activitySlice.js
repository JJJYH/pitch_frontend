// activitySlice.js
import { createSlice } from '@reduxjs/toolkit';

const activitySlice = createSlice({
  name: 'activity',
  initialState: [],
  reducers: {
    addActivity: (state, action) => {
      return [...state, action.payload];
    },
    removeActivity: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateActivity: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'activityType') {
        state[index].activityType = value;
      } else if (name === 'organization') {
        state[index].organization = value;
      } else if (name === 'startDate') {
        state[index].startDate = value;
      } else if (name === 'endDate') {
        state[index].endDate = value;
      } else if (name === 'activityDetail') {
        state[index].activityDetail = value;
      }
    }
  }
});

export const { addActivity, removeActivity, updateActivity } = activitySlice.actions;
export default activitySlice.reducer;
