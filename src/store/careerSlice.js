// careerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const careerSlice = createSlice({
  name: 'career',
  initialState: [],
  reducers: {
    addCareer: (state, action) => {
      return [...state, action.payload];
    },
    removeCareer: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateCareer: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'company_name') {
        state[index].company_name = value;
      } else if (name === 'cv_dept_name') {
        state[index].cv_dept_name = value;
      } else if (name === 'position') {
        state[index].position = value;
      } else if (name === 'salary') {
        state[index].salary = value;
      } else if (name === 'job') {
        state[index].job = value;
      } else if (name === 'join_date') {
        state[index].join_date = value;
      } else if (name === 'quit_date') {
        state[index].quit_date = value;
      } else if (name === 'note') {
        state[index].note = value;
      }
    }
  }
});

export const { addCareer, removeCareer, updateCareer } = careerSlice.actions;
export default careerSlice.reducer;
