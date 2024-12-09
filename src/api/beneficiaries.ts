import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
  IBeneficiariesFilter,
} from "../lib/types/beneficiaries";
import { generateODataQuery, IODataObject } from "../lib/utils";

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
      "beneficiaries.firstName": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "beneficiary.project_id": {
        value: filters?.project as string,

        exact: true,
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
}

const beneficiariesService = new BeneficiariesService();

export default beneficiariesService;
