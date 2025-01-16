import { createSlice } from "@reduxjs/toolkit";

import { UserRoleType } from "lib/types/users";

interface IAuth {
  email: string;

  role: UserRoleType | "";
}

const initialState: IAuth = {
  email: "",

  role: "",
};

export const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setEmail, setRole } = authSlice.actions;

export default authSlice.reducer;
