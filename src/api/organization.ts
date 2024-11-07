import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";

class OrganizationService {
  async list(page: number = 1, listAll?: boolean) {
    const params = new URLSearchParams();

    params.append("pageNum", page.toString());
    params.append("pageSize", DEFAULT_PAGE_SIZE);
    if (listAll) params.append("listAll", "true");
    const res = await api.get(`/organizations?${params}`);

    return res;
  }
}

const organizationService = new OrganizationService();

export default organizationService;
