import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import {
  IFilters,
  IOrganization,
  OrganizationFieldTypes,
} from "../lib/types/organizations";
import { IODataObject, generateODataQuery } from "../lib/utils";

interface IListProps {
  page: number;

  listAll?: boolean;

  search?: string;

  filters?: IFilters;
}

class OrganizationService {
  async list({
    page = 1,

    listAll,

    search,

    filters,
  }: IListProps): Promise<{ items: IOrganization[]; totalSize: number }> {
    const params = new URLSearchParams();

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    const searchFilter: IODataObject = {
      "organizations.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "organizations.registeredName": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "organizations.registrationNumber": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      '"regions"."name"': {
        value: filters?.region || "",

        exact: false,
      },

      "organizations.type": {
        value: filters?.type?.toLowerCase() || "",

        exact: false,
      },

      "organizations.status": {
        value: filters?.status?.toLowerCase() || "",

        exact: true,
      },
    };

    if (generateODataQuery(searchFilter)) {
      params.append("$filter", generateODataQuery(searchFilter));
    }

    if (listAll) {
      params.append("$listAll", "true");
    }

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

  async update(org: OrganizationFieldTypes) {
    const response = await api.put("/organizations", org);

    return response;
  }
}

const organizationService = new OrganizationService();

export default organizationService;
