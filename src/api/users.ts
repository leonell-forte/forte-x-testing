import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import { z } from "zod";
import { users } from "../lib/validators/users";
import { IUser } from "@/pages/Users/types";

class UserService {
  async list(page: number, search?: string) {
    const params = new URLSearchParams();

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$pageNum", page.toString());

    // params.append("$filter", "contains('user.firstName', 'leonell')");

    const res = await api.get(`/users?${params.toString()}`);

    return res.data;
  }

  async getOne(id: string): Promise<IUser> {
    const res = await api.get(`/users/${id}`);

    return res.data.data;
  }

  async add(user: z.infer<typeof users.schema>) {
    const res = await api.post("/users", user);

    return res;
  }

  async update(user: z.infer<typeof users.schema>) {
    const res = await api.put(`/users`, user);

    return res;
  }
}

const userService = new UserService();

export default userService;
