// profileSlice.js

import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: [
    {
      user_id: '',
      user_nm: '',
      user_phone: '',
      user_email: '',
      position: '',
      user_birth: '',
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
      } else if (name === 'user_id') {
        state[index].user_id = value;
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
