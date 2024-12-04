import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
} from "../lib/types/beneficiaries";

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

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

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
}

const beneficiariesServce = new BeneficiariesService();

export default beneficiariesServce;
