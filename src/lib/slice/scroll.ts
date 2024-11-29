import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scrollValue: 0,
};

export const scrollSlice = createSlice({
  name: "slice",

  initialState,

  reducers: {
    setValue: (state, action) => {
      state.scrollValue = action.payload;
    },
  },
});

export const { setValue } = scrollSlice.actions;

export default scrollSlice.reducer;
