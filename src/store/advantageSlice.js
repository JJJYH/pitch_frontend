//advantageSlice.js

import { createSlice } from '@reduxjs/toolkit';

const advantageSlice = createSlice({
  name: 'advantage',
  initialState: [],
  reducers: {
    addAdvantage: (state, action) => {
      // 체크된 항목의 이름과 초기 advantageName 값을 포함한 객체 생성
      const newAdvantage = { advantageName: action.payload, advantageDetail: '', consent: '' };
      return [...state, newAdvantage];
    },
    removeAdvantage: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateAdvantage: (state, action) => {
      const { name, value } = action.payload;
      const indexMilitary = state.findIndex((item) => item.advantageName === '병역');
      const indexObstacle = state.findIndex((item) => item.advantageName === '장애');

      // 병역 항목의 advantageDetail 업데이트
      if (indexMilitary !== -1 && name === 'militaryDetail') {
        state[indexMilitary].advantageDetail = value;
      } else if (name === 'militaryConsent') {
        state[indexMilitary].consent = value;
      }

      // 장애 항목의 advantageDetail 업데이트
      if (indexObstacle !== -1 && name === 'obstacleDetail') {
        state[indexObstacle].advantageDetail = value;
      } else if (name === 'obstacleConsent') {
        state[indexObstacle].consent = value;
      }
    }
  }
});

export const { addAdvantage, removeAdvantage, updateAdvantage } = advantageSlice.actions;
export default advantageSlice.reducer;
