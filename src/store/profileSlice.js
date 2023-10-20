// profileSlice.js

import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: [
    {
      profileName: '김철수',
      phoneNumber: '010-1234-5678',
      email: 'example@google.com',
      position: 'ERP 개발자',
      birth: '1996.05.05',
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
      if (name === 'profileName') {
        state[index].profileName = value;
      } else if (name === 'phoneNumber') {
        state[index].phoneNumber = value;
      } else if (name === 'email') {
        state[index].email = value;
      } else if (name === 'position') {
        state[index].position = value;
      } else if (name === 'birth') {
        state[index].birth = value;
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
