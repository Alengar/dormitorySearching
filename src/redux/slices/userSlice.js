import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = "";
      state.user = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { login, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
