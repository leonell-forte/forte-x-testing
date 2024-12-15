import { api } from "../lib/axios/interceptor";
import { AddEvidenceParams, Evidence } from "../lib/types/evidence";

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

    return response.data;
  }

  async list(
    beneficiaryId: number,
  ): Promise<{ items: Evidence[]; totalSize: number }> {
    const response = await api.get(`/beneficiaries/${beneficiaryId}/evidences`);

    return response.data;
  }
}

const evidenceService = new EvidenceService();

export default evidenceService;
