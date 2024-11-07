import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import { z } from "zod";
import { users } from "../lib/validators/users";

class UserService {
  async list(page: number) {
    const params = new URLSearchParams();

    params.append("pageSize", DEFAULT_PAGE_SIZE);
    params.append("pageNum", page.toString());

    const res = await api.get(`/users?${params.toString}`);
    return res;
  }

  async add(user: z.infer<typeof users.schema>) {
    const res = await api.post("/users", user);

    return res;
  }
}

const userService = new UserService();

export default userService;
