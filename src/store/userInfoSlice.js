import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        user_id: '',
        user_name: '',
        user_email: '',
        isUser: true,
        role: ''
    },
    reducers: {
        setUser: (state, action) => {
            state.user_id = action.payload.user_id;
            state.user_email = action.payload.user_email;
            state.user_name = action.payload.user_name;
            state.role = action.payload.role;
            if (action.payload.role !== null) {
                state.isUser = false;
            } else {
                state.isUser = true;
            }
        },
        logoutUser: (state, action) => {
            state.user_id = '';
            state.user_email = '';
            state.user_name = '';
            state.role = '';
            state.isUser = true;
        }
    }

})

export const { setUser, logoutUser } = userInfoSlice.actions;
export default userInfoSlice.reducer;