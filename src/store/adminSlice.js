import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        isBadge: false
    },
    reducers: {
        setBadge: (state, action) => {
            state.isBadge = action.payload
        }
    }

})

export const { setBadge } = adminSlice.actions;
export default adminSlice.reducer;