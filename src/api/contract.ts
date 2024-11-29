import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import { generateODataQuery, IODataObject } from "../lib/utils";
import { ContractFieldValues, StatusType } from "../lib/types/contracts";

class ContractService {
  async list(page: number, search: string, status: StatusType) {
    const params = new URLSearchParams();

    const filters: IODataObject = {
      "organizations.name": {
        value: search,

        exact: false,

        isSearch: true,
      },

      "contracts.project.name": {
        value: search,

        exact: false,

        isSearch: true,
      },

      "contracts.status": {
        value: status.toUpperCase(),

        exact: true,
      },
    };

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$pageNum", page.toString());

    if (generateODataQuery(filters)) {
      params.append("$filter", generateODataQuery(filters));
    }

    const res = await api.get(`/contracts?${params}`);

    return res.data;
  }

  async add(data: ContractFieldValues): Promise<ContractFieldValues> {
    const response = await api.post("/contracts", data);

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
