import { createSlice } from "@reduxjs/toolkit";

export interface IAlert {
  status: "success" | "error" | "";

  message: string;

  title: string;
}

const initialState: IAlert = {
  status: "",

  message: "",

  title: "",
};

export const alertSlice = createSlice({
  name: "alert",

  initialState,

  reducers: {
    setToast: (state, action: { payload: IAlert }) => {
      state.message = action.payload.message;

      state.status = action.payload.status;

      state.title = action.payload.title;
    },
  },
});

export const { setToast } = alertSlice.actions;

export default alertSlice.reducer;
