import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { IUser, UserFieldTypes } from "../lib/types/users";
import { IODataObject, generateODataQuery } from "../lib/utils";

class UserService {
  async list(
    page: number,
    search?: string,
    role?: string,
    organization?: string[]
  ) {
    const params = new URLSearchParams();

    const filter: IODataObject = {
      "user.firstName": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "user.lastName": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "user.role": {
        value: role!,

        exact: true,
      },

      '"organization"."name"': {
        value: organization!,

        exact: false,
      },
    };

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$pageNum", page.toString());

    if (generateODataQuery(filter)) {
      params.append("$filter", generateODataQuery(filter));
    }

    const res = await api.get(`/users?${params.toString()}`);

    return res.data;
  }

  async getOne(id: string): Promise<IUser> {
    const res = await api.get(`/users/${id}`);

    return res.data.data;
  }

  async add(user: UserFieldTypes) {
    const res = await api.post("/users", user);

    return res;
  }

  async update(user: UserFieldTypes) {
    const res = await api.put(`/users`, user);

    return res;
  }
}

const userService = new UserService();

export default userService;
