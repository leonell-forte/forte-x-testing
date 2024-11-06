import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";

class UserService {
  async list(page: number) {
    const params = new URLSearchParams();

    params.append("pageSize", DEFAULT_PAGE_SIZE);
    params.append("pageNum", page.toString());

    const res = await api.get(`/users?${params.toString}`);
    return res;
  }
}

const userService = new UserService();

export default userService;
