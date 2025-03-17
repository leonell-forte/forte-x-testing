import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { IMilestone, IMilestoneFilters } from "../lib/types/milestones";
import { IODataObject, generateODataQuery } from "../lib/utils";

interface IMilestoneListProps {
  page?: number;

  filters?: IMilestoneFilters | null;

  search?: string;

  listAll?: boolean;

  projectId?: number;
}

class MilestoneService {
  async list({
    page = 1,

    filters,

    search,
  }: IMilestoneListProps): Promise<{ items: IMilestone[]; totalSize: number }> {
    const params = new URLSearchParams();

    let filtersData: IODataObject = {
      "milestone.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "milestone.status": {
        value: filters?.status.toUpperCase() || "",

        exact: true,
      },
    };

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$pageNum", (page || 1).toString());

    params.append("$orderBy", `"milestone"."createdAt" desc`);

    if (generateODataQuery(filtersData)) {
      params.append("$filter", generateODataQuery(filtersData));
    }

    const res = await api.get(`/milestones?${params}`);

    return res.data;
  }

  async getOne(id: string): Promise<IMilestone> {
    const response = await api.get(`/milestones/${id}`);

    return response.data.data;
  }
}

const milestoneService = new MilestoneService();

export default milestoneService;
