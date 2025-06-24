import { SortValues } from "@/lib/types/common";

import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { ActivityLogs } from "../lib/types/activity-logs";
import {
  AddEvidenceParams,
  DeleteParams,
  Evidence,
  EvidenceSortLabel,
  IEvidenceFilters,
  MainEvidence,
} from "../lib/types/evidence";
import { IODataObject, generateODataQuery } from "../lib/utils";

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

  async listAll(
    page: number,
    pageSize: number,
    search?: string,
    filters?: IEvidenceFilters
  ): Promise<{
    items: MainEvidence[];
    totalSize: number;
    pageSize: number;
    rejectedCount: number;
    pendingCount: number;
    approvedCount: number;
    moreInformationRequestedCount: number;
  }> {
    const params = new URLSearchParams();

    let filtersData: IODataObject = {
      "evidence.status": {
        value: filters?.status || "",

        exact: true,
      },

      type: {
        value: filters?.type || "",

        exact: true,
      },
    };

    params.append("$pageSize", String(pageSize || DEFAULT_PAGE_SIZE));

    params.append("$pageNum", (page || 1).toString());

    params.append(
      "$orderBy",
      `${filters?.sortLabel || EvidenceSortLabel.CREATED_AT} ${filters?.sortValue || SortValues.DESC}`
    );

    if (generateODataQuery(filtersData)) {
      params.append("$filter", generateODataQuery(filtersData));
    }

    const response = await api.get(`/evidences`, { params });

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

  async bulkEvidenceExport(data: { ids: number[] }) {
    const response = api.post("/evidences/download", data, {
      responseType: "arraybuffer",
    });

    return response;
  }
}

const evidenceService = new EvidenceService();

export default evidenceService;
