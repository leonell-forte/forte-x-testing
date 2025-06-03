import { api } from "../lib/axios/interceptor";
import { ActivityLogs } from "../lib/types/activity-logs";
import {
  AddEvidenceParams,
  DeleteParams,
  Evidence,
} from "../lib/types/evidence";

export class EvidenceService {
  async add({
    milestoneId,

    values,
  }: AddEvidenceParams) {
    const body = {
      status: values.status,

      description: values.description,

      fileId: values.file?.id,

      milestoneId: milestoneId,
    };

    const response = await api.post(
      `/beneficiaries/${values.beneficiaryId}/evidences`,

      body
    );

    return response.data;
  }

  async list(
    beneficiaryId: number
  ): Promise<{ items: Evidence[]; totalSize: number; pageSize: number }> {
    const response = await api.get(`/beneficiaries/${beneficiaryId}/evidences`);

    return response.data;
  }

  async getOne(beneficiaryId: number, evidenceId: number): Promise<Evidence> {
    const response = await api.get(
      `/beneficiaries/${beneficiaryId}/evidences/${evidenceId}`
    );

    return response.data.data;
  }

  async update({ values, milestoneId }: AddEvidenceParams) {
    const body = {
      id: values.id,

      status: values.status,

      description: values.description,

      fileId: values.file?.id,

      milestoneId: milestoneId,
    };

    const response = await api.put(
      `/beneficiaries/${values.beneficiaryId}/evidences`,
      body
    );

    return response.data.data;
  }

  async remove({ beneficiaryId, evidenceId }: DeleteParams) {
    const response = await api.delete(
      `/beneficiaries/${beneficiaryId}/evidences/${evidenceId}`
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
    const response = await api.get(`/files${fileId}`, {
      responseType: "blob",
    });
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

  async updateStatus(evidenceIds: number[], status: string, comment?: string) {
    const res = await api.patch("/evidences/status", {
      evidenceIds,
      status,
      comment,
    });

    return res.data;
  }
}

const evidenceService = new EvidenceService();

export default evidenceService;
