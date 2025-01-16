import { createSlice } from "@reduxjs/toolkit";

interface IEvidenceDatas {
  beneficiaryId: number | null;

  projectId: number | null;

  contractId: number | null;
}

const initialState: IEvidenceDatas = {
  beneficiaryId: null,

  projectId: null,

  contractId: null,
};

export const evidenceSlice = createSlice({
  name: "evidence",

  initialState,

  reducers: {
    setSelectedData: (state, action: { payload: IEvidenceDatas }) => {
      const { contractId, projectId, beneficiaryId } = action.payload;

      state.projectId = projectId;

      state.contractId = contractId;

      state.beneficiaryId = beneficiaryId;
    },
  },
});

export const { setSelectedData } = evidenceSlice.actions;

export default evidenceSlice.reducer;
