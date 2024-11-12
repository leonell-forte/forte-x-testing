import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import { IOrganization } from "@/pages/Organizations/types";

class OrganizationService {
  async list(page: number = 1, listAll?: boolean) {
    const params = new URLSearchParams();

    params.append("pageNum", page.toString());
    params.append("pageSize", DEFAULT_PAGE_SIZE);
    if (listAll) params.append("listAll", "true");
    const res = await api.get(`/organizations?${params}`);

    return res.data;
  }

  async add(data: IOrganization) {
    const response = await api.post("/organizations", data);
    return response;
  }
}

const organizationService = new OrganizationService();

export default organizationService;
