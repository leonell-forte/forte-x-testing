import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import { IOrganization } from "../pages/Organizations/types";
import { z } from "zod";
import { organizations } from "../lib/validators/organizations";

class OrganizationService {
  async list(page: number = 1, listAll?: boolean) {
    const params = new URLSearchParams();

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

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
