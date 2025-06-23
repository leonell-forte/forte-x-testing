import { SortValues } from "lib/types/common";

import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import {
  ContractFieldValues,
  ContractSortLabel,
  IContract,
  IContractFilters,
  StatusType,
} from "../lib/types/contracts";
import { IODataObject, generateODataQuery } from "../lib/utils";

interface IContractListProps {
  page?: number;

  filters?: IContractFilters | null;

  search?: string;

  listAll?: boolean;

  projectId?: number;

  pageSize?: number;
}

class ContractService {
  async list({
    page = 1,

    filters,

    search,

    listAll,

    projectId,

    pageSize,
  }: IContractListProps): Promise<{
    items: IContract[];
    totalSize: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams();

    let filtersData: IODataObject = {
      "contract.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "project.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "organization.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "organization.id": {
        value: filters?.providerId || "",

        exact: true,
      },

      "funder.id": {
        value: filters?.funderId || "",

        exact: true,
      },

      "contract.status": {
        value: filters?.status.toUpperCase() || "",

        exact: true,
      },

      "contract.startDate": {
        value: filters?.date || "",

        exact: false,

        isDate: true,
      },

      "contract.projectId": {
        value: projectId?.toString() ?? filters?.project ?? "",

        exact: true,
      },
    };

    params.append("$pageSize", pageSize?.toString() || DEFAULT_PAGE_SIZE);

    params.append("$pageNum", (page || 1).toString());

    params.append(
      "$orderBy",
      `${filters?.sortLabel || ContractSortLabel.CREATED_AT} ${filters?.sortValue || SortValues.DESC}`
    );

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
    let body = {
      ...values,

      outcomeRates: values.outcomeRates.map((item) => ({
        ...item,

        threshold: Number(item.threshold),
      })),
    };

    const response = await api.put("/contracts", body);

    return response.data.data;
  }

  async getOne(id: string | number): Promise<IContract> {
    const response = await api.get(`/contracts/${id}`);

    return {
      ...response.data.data,
      status: response.data.data.status.toLowerCase() as StatusType,
    };
  }

  async delete(id: string) {
    const response = await api.delete(`/contracts/${id}`);

    return response.data;
  }

  async changeStatus(id: string, status: StatusType) {
    const response = await api.patch(`/contracts/${id}/status/${status}`, {
      id,
      status,
    });

    return response.data;
  }
}

const contractService = new ContractService();

export default contractService;
