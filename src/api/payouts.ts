import { api } from "lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "lib/constants";
import { Payout } from "lib/types/payouts";
import { IODataObject, generateODataQuery } from "lib/utils";

type ListParams = {
  page: number;
  search?: string;
  filters?: any;
};

class PayoutsService {
  async list({ page, search, filters }: ListParams): Promise<{
    items: Payout[];
    totalSize: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams();

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$orderBy", `"payout"."created_at" desc`);

    const searchFilter: IODataObject = {
      "payout.id": {
        value: search!,

        exact: false,

        isSearch: true,
      },

      "provider.id": {
        value: filters?.provider,

        exact: true,
      },

      "payout.status": {
        value: filters?.status || "",

        exact: true,
      },
    };

    if (generateODataQuery(searchFilter)) {
      params.append("$filter", generateODataQuery(searchFilter));
    }

    const res = await api.get(`/payouts?${params}`);

    return res.data;
  }

  async generate(id: string) {
    const res = await api.post(`/payouts/${id}/generate`);

    return res.data;
  }

  async getById(id: string): Promise<Payout> {
    const res = await api.get(`/payouts/${id}`);

    return res.data.data;
  }

  async pay(id: string) {
    const res = await api.post(`/payouts/${id}/pay`);

    return res.data;
  }
}

const payoutsService = new PayoutsService();

export default payoutsService;
