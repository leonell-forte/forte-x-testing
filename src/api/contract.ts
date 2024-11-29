import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import { generateODataQuery, IODataObject } from "../lib/utils";
import { ContractFieldValues, IContractFilters } from "../lib/types/contracts";

class ContractService {
  async list(
    page: number,

    filters: IContractFilters,

    search?: string,

    listAll?: boolean,
  ) {
    const params = new URLSearchParams();

    const filtersData: IODataObject = {
      "organizations.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "projects.name": {
        value: filters.project,

        exact: true,
      },

      "contracts.status": {
        value: filters.status!.toUpperCase(),

        exact: true,
      },

      "contracts.startDate": {
        value: filters.date,

        exact: false,

        isDate: true,
      },
    };

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$listAll", listAll ? "true" : "false");

    params.append("$pageNum", page.toString());

    if (generateODataQuery(filtersData)) {
      params.append("$filter", generateODataQuery(filtersData));
    }

    const res = await api.get(`/contracts?${params}`);

    return res.data;
  }

  async add(data: ContractFieldValues): Promise<ContractFieldValues> {
    const response = await api.post("/contracts", data);

    return response.data.data;
  }

  async update(values: ContractFieldValues) {
    const response = await api.put("/contracts", values);

    return response.data.data;
  }

  async getOne(id: string) {
    const response = await api.get(`/contracts/${id}`);

    return response.data.data;
  }

  async delete(id: string) {
    const response = await api.delete(`/contracts/${id}`);

    return response.data;
  }
}

const contractService = new ContractService();

export default contractService;
