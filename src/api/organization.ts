import { omit } from "lodash";

import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import {
  BankDetails,
  IFilters,
  IOrganization,
  OrganizationFieldTypes,
  Partner,
  PartnerFieldTypes,
} from "../lib/types/organizations";
import { IODataObject, generateODataQuery } from "../lib/utils";

interface IListProps {
  page: number;

  listAll?: boolean;

  search?: string;

  filters?: IFilters;

  pageSize?: number;
}

class OrganizationService {
  async list({
    page = 1,

    listAll,

    search,

    filters,

    pageSize,
  }: IListProps): Promise<{
    items: IOrganization[];
    totalSize: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams();

    params.append("$pageNum", page.toString());

    params.append("$pageSize", pageSize?.toString() || DEFAULT_PAGE_SIZE);

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

    params.append("$orderBy", '"organizations"."createdAt" desc');

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

  async getOne(id: string | number): Promise<IOrganization> {
    const response = await api.get(`/organizations/${id}`);

    return response.data.data;
  }

  async update(org: OrganizationFieldTypes) {
    const response = await api.put("/organizations", omit(org, ["type"]));

    return response;
  }

  async addPartner(data: PartnerFieldTypes): Promise<Partner> {
    const { organizationId, partner } = data;
    const { id } = partner;
    const response = await api.post("/organizations/partnership", {
      organizationId,
      partnerId: id,
    });

    return response.data.data;
  }

  async getPartners(id: string): Promise<Partner[]> {
    const response = await api.get(`/organizations/partnership/${id}`);

    return response.data.data;
  }

  async deletePartner(id: string) {
    const response = await api.delete(`/organizations/partnership/${id}`);

    return response;
  }

  async getStripeOnboardingLink(id: string): Promise<{
    data: string;
  }> {
    const response = await api.get(
      `/organizations/${id}/stripe/onboarding-link`
    );

    return response.data;
  }

  async getBankDetails(id: string): Promise<{ data: BankDetails[] }> {
    const response = await api.get(`/organizations/${id}/stripe/bank-details`);

    return response.data;
  }
}

const organizationService = new OrganizationService();

export default organizationService;
