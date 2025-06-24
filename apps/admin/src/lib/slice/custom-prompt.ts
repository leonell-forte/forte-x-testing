import { createSlice } from "@reduxjs/toolkit";

export type TPrompt = {
  show: boolean;
  config: {
    title: string;
    subText?: string;
    yesLabel?: string;
    noLabel?: string;
    onNo?: () => void;
    onYes: () => void;
  };
};

const initialState: TPrompt = {
  show: false,
  config: {
    title: "Confirmation",
    subText: "",
    yesLabel: "Send email with changes",
    noLabel: "Cancel",
    onYes: () => {},
  },
};

export const confirmPromptSlice = createSlice({
  name: "confirm-prompt",
  initialState,
  reducers: {
    setShow: (state, action: { payload: TPrompt["show"] }) => {
      state.show = action.payload;
    },
    setConfig: (state, action: { payload: TPrompt["config"] }) => {
      state.config = { ...state.config, ...action.payload };
    },
  },
});

export const { setShow, setConfig } = confirmPromptSlice.actions;
export default confirmPromptSlice.reducer;
