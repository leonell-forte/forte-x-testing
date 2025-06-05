import { SortValues } from "lib/types/common";

import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import {
  IUser,
  SortType,
  UserFieldTypes,
  UserSortLabel,
} from "../lib/types/users";
import { IODataObject, generateODataQuery } from "../lib/utils";

class UserService {
  async list(
    page: number,
    search?: string,
    role?: string,
    organization?: string[],
    sort?: SortType
  ): Promise<{ items: IUser[]; totalSize: number; pageSize: number }> {
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

      "user.email": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "user.role": {
        value: role!,

        exact: false,
      },

      '"organization"."id"': {
        value: organization!,

        exact: false,
      },
    };

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$pageNum", page.toString());

    params.append(
      "$orderBy",
      `${sort?.label || UserSortLabel.CREATED_AT} ${sort?.value || SortValues.DESC}`
    );

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
    const payload = { ...user } as IUser;
    delete payload.email;
    const res = await api.put(`/users`, {
      ...payload,
      // makes sure only roles (owner, admin, user, read-only) are passed without appended organization type (provider.owner, provider.admin, etc.)
      role: user.role.split(".").pop(),
    });

    return res;
  }

  async delete(userId: string) {
    const res = await api.delete(`/users/${userId}`);

    return res;
  }

  async resendInvitation(userId: string) {
    const res = await api.post(`/users/${userId}/resend-invite`);

    return res;
  }
}

const userService = new UserService();

export default userService;
