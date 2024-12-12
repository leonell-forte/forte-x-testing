import { api } from "../lib/axios/interceptor";
import { AddEvidenceParams } from "../lib/types/evidence";

export class EvidenceService {
  async add({
    beneficiaryId,

    // projectId,

    // contractId,

    values,
  }: AddEvidenceParams) {
    const body = {
      ...values,

      outcomeId: Number(values.outcomeId),
    };
    const response = await api.post(
      `/beneficiaries/${beneficiaryId}/evidences`,
      body,
    );

    return response;
  }

  async list(beneficiaryId: number) {
    const response = await api.get(`/beneficiaries/${beneficiaryId}/evidences`);

    return response;
  }
}

const evidenceService = new EvidenceService();

export default evidenceService;
