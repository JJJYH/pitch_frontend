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
      if (name === 'activity_type') {
        state[index].activity_type = value;
      } else if (name === 'organization') {
        state[index].organization = value;
      } else if (name === 'start_date') {
        state[index].start_date = value;
      } else if (name === 'end_date') {
        state[index].end_date = value;
      } else if (name === 'activity_detail') {
        state[index].activity_detail = value;
      }
    }
  }
});

export const { addActivity, removeActivity, updateActivity } = activitySlice.actions;
export default activitySlice.reducer;
