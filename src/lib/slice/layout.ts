import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSidePanel: false,

  title: "",
};

export const layoutSlice = createSlice({
  name: "layout",

  initialState,

  reducers: {
    setShowSidePanel: (state, action) => {
      state.showSidePanel = action.payload;
    },

    setTitle: (state, action) => {
      state.title = action.payload;
    },
  },
});

export const { setShowSidePanel, setTitle } = layoutSlice.actions;

export default layoutSlice.reducer;
