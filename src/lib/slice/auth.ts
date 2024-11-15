import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
};

export const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { setEmail } = authSlice.actions;

export default authSlice.reducer;
