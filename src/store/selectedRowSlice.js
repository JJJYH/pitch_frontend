import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRow: ''
};

const selectedRowSlice = createSlice({
  name: 'selectedRow',
  initialState,
  reducers: {
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
    resetSelectedRow: (state) => {
      state.selectedRow = initialState.selectedRow;
    }
  }
});

export const { setSelectedRow, resetSelectedRow } = selectedRowSlice.actions;
export const selectedRowSelector = (state) => state.selectedRow.selectedRow;
export default selectedRowSlice.reducer;
