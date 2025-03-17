import { createSlice } from "@reduxjs/toolkit";
import React from "react";

export const MODAL_SIZE_CLASS = {
  xs: "max-w-sm",
  sm: "max-w-md",
  base: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  "2xl": "max-w-3xl",
};

type TModalConfig = {
  component: React.ReactNode | null;
  size?: keyof typeof MODAL_SIZE_CLASS;
  title?: string;
};

export type TModal = {
  isOpen: boolean;
  config?: TModalConfig;
};

const initialState: TModal = {
  isOpen: false,
  config: undefined,
};

export const modalSlice = createSlice({
  name: "modal-v2",
  initialState,
  reducers: {
    openModal: (state, action: { payload: TModal["config"] }) => {
      state = {
        isOpen: true,
        config: action.payload,
      };
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
