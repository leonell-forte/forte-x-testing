import { createSlice } from "@reduxjs/toolkit";

import { PartnerFieldTypes } from "lib/types/organizations";

type InitialState = {
  partnersToAdd: PartnerFieldTypes[];
};

const initialState: InitialState = {
  partnersToAdd: [],
};

export const partnersSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {
    setPartnersToAdd: (state, action: { payload: PartnerFieldTypes }) => {
      state.partnersToAdd = [...state.partnersToAdd, action.payload];
    },
    removePartner: (state, action: { payload: number }) => {
      state.partnersToAdd = state.partnersToAdd.filter(
        (partner) => partner.partner.id !== action.payload
      );
    },
    clearPartners: (state) => {
      state.partnersToAdd = [];
    },
  },
});

export const { setPartnersToAdd, removePartner, clearPartners } =
  partnersSlice.actions;
export default partnersSlice.reducer;
