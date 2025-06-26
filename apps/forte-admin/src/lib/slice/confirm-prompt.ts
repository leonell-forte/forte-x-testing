import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showPrompt: false,
};

export const confirmPromptSlice = createSlice({
  name: "confirm-prompt",
  initialState,
  reducers: {
    setPromptState: (state, action: { payload: boolean }) => {
      state.showPrompt = action.payload;
    },
  },
});

export const { setPromptState } = confirmPromptSlice.actions;
export default confirmPromptSlice.reducer;
