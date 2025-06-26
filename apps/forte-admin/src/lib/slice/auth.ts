import { createSlice } from "@reduxjs/toolkit";

import type { UserRoleType } from "@/lib/types/users";

interface IAuth {
  email: string;

  role: UserRoleType | "";

  sessionToken: string;
}

const initialState: IAuth = {
  email: "",

  role: "",

  sessionToken: "",
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

    setSessionToken: (state, action) => {
      state.sessionToken = action.payload;
    },
  },
});

export const { setEmail, setRole, setSessionToken } = authSlice.actions;

export default authSlice.reducer;
