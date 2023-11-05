//advantageSlice.js

import { createSlice } from '@reduxjs/toolkit';

const advantageSlice = createSlice({
  name: 'advantage',
  initialState: [],
  reducers: {
    addAdvantage: (state, action) => {
      // 체크된 항목의 이름과 초기 advantage_type 값을 포함한 객체 생성
      const new_advantage = action.payload;
      return [...state, new_advantage];
    },
    removeAdvantage: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateAdvantage: (state, action) => {
      const { name, value } = action.payload;
      const indexMilitary = state.findIndex((item) => item.advantage_type === '병역');
      const indexObstacle = state.findIndex((item) => item.advantage_type === '장애');

      // 병역 항목의 advantage_detail 업데이트
      if (indexMilitary !== -1 && name === 'military_detail') {
        state[indexMilitary].advantage_detail = value;
      } else if (name === 'military_consent') {
        state[indexMilitary].consent = value;
      }

      // 장애 항목의 advantage_detail 업데이트
      if (indexObstacle !== -1 && name === 'obstacle_detail') {
        state[indexObstacle].advantage_detail = value;
      } else if (name === 'obstacle_consent') {
        state[indexObstacle].consent = value;
      }
    }
  }
});

export const { addAdvantage, removeAdvantage, updateAdvantage } = advantageSlice.actions;
export default advantageSlice.reducer;
