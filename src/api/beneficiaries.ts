import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
} from "../lib/types/beneficiaries";
import { generateODataQuery, IODataObject } from "../lib/utils";

interface IBeneficiariesListProps {
  page?: number;

  listAll?: boolean;

  search?: string;
}

class BeneficiariesService {
  async list({
    page = 1,

    listAll,

    search,
  }: IBeneficiariesListProps): Promise<{
    items: IBeneficiaries[];

    totalSize: number;
  }> {
    const params = new URLSearchParams();

    const filterData: IODataObject = {
      "beneficiaries.firstName": {
        value: search!,

        exact: false,

        isSearch: true,
      },
    };

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    if (generateODataQuery(filterData)) {
      params.append("$filter", generateODataQuery(filterData));
    }

    if (listAll) {
      params.append("$listAll", "true");
    }

    const res = await api.get(`/beneficiaries?${params}`);

    return res.data;
  }

  async add(beneficiaries: IBeneficiariesFieldValues) {
    const body = {
      ...beneficiaries,

      disabilityStatus: beneficiaries.disabilityStatus === "yes" ? true : false,
    };

    const res = await api.post("/beneficiaries", body);

    return res;
  }

  async getOne(id?: number): Promise<IBeneficiaries> {
    const response = await api.get(`/beneficiaries/${id}`);

    return response.data.data;
  }

  async update(beneficiary: IBeneficiariesFieldValues) {
    const body = {
      ...beneficiary,

      disabilityStatus: beneficiary.disabilityStatus === "yes" ? true : false,
    };

    const response = await api.put("/beneficiaries", body);

    return response;
  }
}

const beneficiariesServce = new BeneficiariesService();

export default beneficiariesServce;
