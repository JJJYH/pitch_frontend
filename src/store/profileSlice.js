// profileSlice.js

import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: [
    {
      user_nm: '김철수',
      user_phone: '010-1234-5678',
      user_email: 'example@google.com',
      position: 'ERP 개발자',
      user_birth: '1996.05.05',
      address: '',
      gender: ''
    }
  ],
  reducers: {
    addProfile: (state, action) => {
      return [...state, action.payload];
    },
    removeProfile: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateProfile: (state, action) => {
      const { index, name, value } = action.payload;
      if (name === 'user_nm') {
        state[index].user_nm = value;
      } else if (name === 'user_phone') {
        state[index].user_phone = value;
      } else if (name === 'user_email') {
        state[index].user_email = value;
      } else if (name === 'position') {
        state[index].position = value;
      } else if (name === 'user_birth') {
        state[index].user_birth = value;
      } else if (name === 'address') {
        state[index].address = value;
      } else if (name === 'gender') {
        state[index].gender = value;
      }
    }
  }
});

export const { addProfile, removeProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
