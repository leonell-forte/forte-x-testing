import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
  IBeneficiariesFilter,
  IImportBeneficiariesFieldValues,
} from "../lib/types/beneficiaries";
import { IODataObject, generateODataQuery } from "../lib/utils";

interface IBeneficiariesListProps {
  page?: number;

  listAll?: boolean;

  search?: string;

  filters?: IBeneficiariesFilter;
}

class BeneficiariesService {
  async list({
    page = 1,

    listAll,

    search,

    filters,
  }: IBeneficiariesListProps): Promise<{
    items: IBeneficiaries[];

    totalSize: number;
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
    };

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    if (generateODataQuery(filterData)) {
      params.append("$filter", generateODataQuery(filterData));
    }

    if (listAll) {
      params.append("$listAll", "true");
    }

    const res = await api.get(`/beneficiaries?${params}`);
    console.log(res.data);

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

    console.log(response);

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
}

const beneficiariesService = new BeneficiariesService();

export default beneficiariesService;
