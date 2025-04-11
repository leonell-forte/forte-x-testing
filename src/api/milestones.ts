import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { IMilestone, IMilestoneFilters } from "../lib/types/milestones";
import { IODataObject, generateODataQuery } from "../lib/utils";

export interface IMilestoneListProps {
  page?: number;

  filters?: IMilestoneFilters | null;

  search?: string;

  listAll?: boolean;

  pageSize?: number;
}

type TAchieved = {
  funderId: string;
  startDate: string;
  endDate: string;
};

type TGenerate = {
  funderId: string;
  milestoneIds: string[];
};

class MilestoneService {
  async list({
    page = 1,

    filters,

    search,

    pageSize,
  }: IMilestoneListProps): Promise<{
    items: IMilestone[];
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

    const res = await api.get(`/milestones`, { params });

    return res.data;
  }

  async getOne(id: string): Promise<IMilestone> {
    const response = await api.get(`/milestones/${id}`);

    return response.data.data;
  }

  async getAchievedMilestones(payload: TAchieved): Promise<IMilestone[]> {
    const response = await api.post(`/milestones/achieved-milestones`, {
      ...payload,
      funderId: Number(payload.funderId),
    });

    return response.data.data;
  }

  async generateInvoice(payload: TGenerate): Promise<any> {
    const response = await api.post(`/invoices`, {
      ...payload,
      funderId: Number(payload.funderId),
    });

    return response.data.data;
  }
}

const milestoneService = new MilestoneService();

export default milestoneService;
