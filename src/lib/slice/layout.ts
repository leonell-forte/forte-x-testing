import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSidePanel: false,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setShowSidePanel: (state, action) => {
      state.showSidePanel = action.payload;
    },
  },
});

export const { setShowSidePanel } = layoutSlice.actions;
export default layoutSlice.reducer;
