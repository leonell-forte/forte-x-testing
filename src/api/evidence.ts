import { api } from "../lib/axios/interceptor";
import { ActivityLogs } from "../lib/types/activity-logs";
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

      outcomeId: values.outcomeId ? Number(values.outcomeId) : null,
    };

    const response = await api.post(
      `/beneficiaries/${beneficiaryId}/evidences`,

      body
    );

    return response.data;
  }

  async list(
    beneficiaryId: number
  ): Promise<{ items: Evidence[]; totalSize: number }> {
    const response = await api.get(`/beneficiaries/${beneficiaryId}/evidences`);

    return response.data;
  }

  async getOne(beneficiaryId: number, evidenceId: number): Promise<Evidence> {
    const response = await api.get(
      `/beneficiaries/${beneficiaryId}/evidences/${evidenceId}`
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
      body
    );

    return response.data.data;
  }

  async getActivityLogs(
    beneficiary: number,
    evidence: number
  ): Promise<ActivityLogs> {
    const res = await api.get(
      `/beneficiaries/${beneficiary}/evidences/${evidence}/activity-logs`
    );
    return res.data.items;
  }

  async getFile(fileId: string, fileName?: string): Promise<any> {
    const response = await api.get(`/files${fileId}`, { responseType: "blob" });
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    if (fileName) {
      link.href = fileURL;
      link.download = fileName;
      link.click();
      return;
    }

    return fileURL;
  }
}

const evidenceService = new EvidenceService();

export default evidenceService;
