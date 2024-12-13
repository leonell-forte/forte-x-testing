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
      status: values.status,

      description: values.description,

      fileId: values.file?.id,

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

  async getOne(beneficiaryId: number, evidenceId: number): Promise<Evidence> {
    const response = await api.get(
      `/beneficiaries/${beneficiaryId}/evidences/${evidenceId}`,
    );

    return response.data.data;
  }

  async update({ beneficiaryId, values }: AddEvidenceParams) {
    const body = {
      id: values.id,

      status: values.status,

      description: values.description,

      fileId: values.file?.id,

      outcomeId: Number(values.outcomeId),
    };

    const response = await api.put(
      `/beneficiaries/${beneficiaryId}/evidences`,
      body,
    );

    return response.data.data;
  }
}

const evidenceService = new EvidenceService();

export default evidenceService;
