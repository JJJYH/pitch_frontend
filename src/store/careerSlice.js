// careerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const careerSlice = createSlice({
  name: 'career',
  initialState: [{ companyName: '', deptName: '', exPosition: '', salary: '', job: '', note: '' }],
  reducers: {
    addCareer: (state, action) => {
      return [...state, action.payload];
    },
    removeCareer: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateCareer: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'companyName') {
        state[index].companyName = value;
      } else if (name === 'deptName') {
        state[index].deptName = value;
      } else if (name === 'exPosition') {
        state[index].exPosition = value;
      } else if (name === 'salary') {
        state[index].salary = value;
      } else if (name === 'job') {
        state[index].job = value;
      }
    }
  }
});

export const { addCareer, removeCareer, updateCareer } = careerSlice.actions;
export default careerSlice.reducer;
