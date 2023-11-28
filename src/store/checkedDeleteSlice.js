import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  checkedDelete: ''
};

const checkedDeleteSlice = createSlice({
  name: 'checkedDelete',
  initialState,
  reducers: {
    setCheckedDelete: (state, action) => {
      state.checkedDelete = action.payload;
    }
  }
});

export const { setCheckedDelete } = checkedDeleteSlice.actions;
export const checkedDeleteSelector = (state) => state.checkedDelete.checkedDelete;
export default checkedDeleteSlice.reducer;
