import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { api } from "../lib/axios/interceptor";

class ContractService {
  async get() {
    const params = new URLSearchParams();

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$pageNum", "1");

    const response = api.get(`/contracts?${params}`);

    return response;
  }
}

const contractService = new ContractService();

export default contractService;
