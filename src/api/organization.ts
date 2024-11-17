import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import { IFilters, IOrganization } from "../pages/Organizations/types";
import { z } from "zod";
import { organizations } from "../lib/validators/organizations";
import { generateODataQuery, IODataObject } from "../lib/utils";

class OrganizationService {
  async list(
    page: number = 1,

    listAll?: boolean,

    search?: string,

    filters?: IFilters
  ) {
    const params = new URLSearchParams();

    // inprogress not yet working on be
    console.log(filters);

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    const searchFilter: IODataObject = {
      "organizations.name": {
        value: search!,

        exact: false,
      },
    };

    if (search) {
      params.append("$filter", generateODataQuery(searchFilter));
    }

    if (listAll) params.append("listAll", "true");

    const res = await api.get(`/organizations?${params}`);

    return res.data;
  }

  async add(data: IOrganization) {
    const response = await api.post("/organizations", data);

    return response;
  }

  async getOne(id: string) {
    const response = await api.get(`/organizations/${id}`);

    return response.data.data;
  }

  async update(org: z.infer<typeof organizations.schema>) {
    const response = await api.put("/organizations", org);

    return response;
  }
}

const organizationService = new OrganizationService();

export default organizationService;
