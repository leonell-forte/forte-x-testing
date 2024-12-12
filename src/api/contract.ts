import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import { generateODataQuery, IODataObject } from "../lib/utils";
import {
  ContractFieldValues,
  IContract,
  IContractFilters,
} from "../lib/types/contracts";

interface IContractListProps {
  page?: number;

  filters?: IContractFilters | null;

  search?: string;

  listAll?: boolean;

  projectId?: number;
}

class ContractService {
  async list({
    page = 1,

    filters,

    search,

    listAll,

    projectId,
  }: IContractListProps): Promise<{ items: IContract[]; totalSize: number }> {
    const params = new URLSearchParams();

    let filtersData: IODataObject = {
      "organizations.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "projects.name": {
        value: filters?.project || "",

        exact: true,
      },

      "contracts.status": {
        value: filters?.status.toUpperCase() || "",

        exact: true,
      },

      "contracts.startDate": {
        value: filters?.date || "",

        exact: false,

        isDate: true,
      },

      "projects.id": {
        value: projectId ? projectId.toString() : "",

        exact: true,
      },
    };

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$pageNum", (page || 1).toString());

    if (listAll) {
      params.append("$listAll", "true");
    }

    if (generateODataQuery(filtersData)) {
      params.append("$filter", generateODataQuery(filtersData));
    }

    const res = await api.get(`/contracts?${params}`);

    return res.data;
  }

  async add(data: ContractFieldValues): Promise<ContractFieldValues> {
    const body = {
      ...data,

      targetNoOfBenefeciaries: Number(data.targetNoOfBenefeciaries),

      documentId: Number(data.documentId),

      outcomeRates: data.outcomeRates.map((item) => ({
        ...item,

        threshold: Number(item.threshold),
      })),
    };

    const response = await api.post("/contracts", body);

    return response.data.data;
  }

  async update(values: ContractFieldValues) {
    const body = {
      ...values,

      contractOutcomeRates: values.outcomeRates.map((item) => ({
        ...item,

        threshold: Number(item.threshold),
      })),
    };

    const response = await api.put("/contracts", body);

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
