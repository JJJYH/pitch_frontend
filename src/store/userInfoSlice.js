import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        user_id: '',
        user_nm: '',
        user_email: '',
        isUser: true,
        role: '',
        isLogin: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user_id = action.payload.user_id;
            state.user_email = action.payload.user_email;
            state.user_nm = action.payload.user_nm;
            state.role = action.payload.role;
            if (action.payload.role !== null) {
                state.isUser = false;
            } else {
                state.isUser = true;
            }
            state.isLogin = true;
        },
        logoutUser: (state, action) => {
            state.user_id = '';
            state.user_email = '';
            state.user_nm = '';
            state.role = '';
            state.isUser = true;
            state.isLogin = false;
        }
    }

})

export const { setUser, logoutUser } = userInfoSlice.actions;
export default userInfoSlice.reducer;