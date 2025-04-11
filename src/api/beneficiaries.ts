import { IMilestone } from "lib/types/milestones";

import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
  IBeneficiariesFilter,
  IImportBeneficiariesFieldValues,
} from "../lib/types/beneficiaries";
import { IODataObject, generateODataQuery } from "../lib/utils";
import { IMilestoneListProps } from "./milestones";

interface IBeneficiariesListProps {
  page?: number;

  listAll?: boolean;

  search?: string;

  filters?: IBeneficiariesFilter;

  pageSize?: number;
}

class BeneficiariesService {
  async list({
    page = 1,

    listAll,

    search,

    filters,

    pageSize,
  }: IBeneficiariesListProps): Promise<{
    items: IBeneficiaries[];

    totalSize: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams();

    const filterData: IODataObject = {
      "beneficiary.firstName": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "beneficiary.lastName": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "beneficiary.phone": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "beneficiary.cohort_name": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "beneficiary.email": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "beneficiary.project_id": {
        value: filters?.project as string,

        exact: true,
      },

      "beneficiary.status": {
        value: filters?.status as string,

        exact: true,
      },

      "beneficiary.provider_id": {
        value: filters?.provider?.toString() || "",

        exact: true,
      },

      "beneficiary.risk_level": {
        value: filters?.riskLevel || "",

        exact: true,
      },

      "beneficiary.cohort_start_date": {
        value: filters?.startDate || "",

        exact: false,

        isDate: true,
      },

      "beneficiary.contract_id": {
        value: filters?.contractId || "",

        exact: true,
      },
    };

    params.append("$pageNum", page.toString());

    params.append("$pageSize", pageSize ? String(pageSize) : DEFAULT_PAGE_SIZE);

    params.append("$orderBy", `"beneficiary"."createdAt" desc`);

    if (generateODataQuery(filterData)) {
      params.append("$filter", generateODataQuery(filterData));
    }

    if (listAll) {
      params.append("$listAll", "true");
    }

    const res = await api.get(`/beneficiaries?${params}`);

    return res.data;
  }

  async add(beneficiaries: IBeneficiariesFieldValues) {
    const body = {
      ...beneficiaries,

      disabilityStatus: beneficiaries.disabilityStatus === "yes" ? true : false,
    };

    const res = await api.post("/beneficiaries", body);

    return res;
  }

  async getOne(id?: number): Promise<IBeneficiaries> {
    const response = await api.get(`/beneficiaries/${id}`);

    return response.data.data;
  }

  async update(beneficiary: IBeneficiariesFieldValues) {
    const body = {
      ...beneficiary,

      disabilityStatus: beneficiary.disabilityStatus === "yes" ? true : false,
    };

    const response = await api.put("/beneficiaries", body);

    return response;
  }

  async delete(id: number) {
    const response = await api.delete(`/beneficiaries/${id}`);

    return response;
  }

  async bulkStatusUpdate(data: { ids: number[]; status: string }) {
    const response = api.patch("/beneficiaries/status", data);

    return response;
  }

  async importBeneficiaries(values: IImportBeneficiariesFieldValues) {
    const formData = new FormData();

    formData.append("file", values.file!);

    formData.append(
      "isOverwriteByEmailEnabled",
      values.isOverwriteByEmailEnabled.toString()
    );
    const response = await api.post("/beneficiaries/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  }

  async bulkEvidenceExport(data: { beneficiaryIds: number[] }) {
    const response = api.post("/beneficiaries/evidences/download", data, {
      responseType: "arraybuffer",
    });

    return response;
  }

  async bulkExportBeneficiaries(data: { beneficiaryIds: number[] }) {
    const response = api.post("/beneficiaries/export", data, {
      responseType: "arraybuffer",
    });

    return response;
  }

  async listMilestones({
    page = 1,

    filters,

    search,

    pageSize,

    beneficiaryId,
  }: IMilestoneListProps & { beneficiaryId: number }): Promise<{
    data: IMilestone[];
    totalSize: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams();

    let filtersData: IODataObject = {
      "milestone.id": {
        value: search!,

        exact: false,

        isSearch: true,
      },
      "funder.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },
      "provider.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },
      "contract.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },
      "contract.id": {
        value: filters?.contractId || "",

        exact: true,
      },

      "milestone.status": {
        value: filters?.status || "",

        exact: true,
      },

      "milestone.type": {
        value: filters?.type || "",

        exact: true,
      },
    };

    params.append("$pageSize", String(pageSize || DEFAULT_PAGE_SIZE));

    params.append("$pageNum", (page || 1).toString());

    params.append("$orderBy", `"milestone"."created_at" desc`);

    if (generateODataQuery(filtersData)) {
      params.append("$filter", generateODataQuery(filtersData));
    }

    const res = await api.get(`/beneficiaries/${beneficiaryId}/milestones`, {
      params,
    });

    return res.data;
  }
}

const beneficiariesService = new BeneficiariesService();

export default beneficiariesService;
