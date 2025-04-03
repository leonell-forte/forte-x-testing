import { api } from "lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "lib/constants";
import { Invoice, InvoiceFilters } from "lib/types/invoices";
import { IODataObject, generateODataQuery } from "lib/utils";

type ListParams = {
  page: number;
  search?: string;
  filters?: InvoiceFilters;
};

export class InvoiceService {
  async list({ page, search, filters }: ListParams): Promise<{
    items: Invoice[];
    totalSize: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams();

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    const searchFilter: IODataObject = {
      "invoice.id": {
        value: search!,

        exact: false,

        isSearch: true,
      },
      "invoice.status": {
        value: filters?.status || "",

        exact: true,
      },
    };

    if (generateODataQuery(searchFilter)) {
      params.append("$filter", generateODataQuery(searchFilter));
    }
    const res = await api.get(`/invoices?${params}`);
    return res.data;
  }

  async getOne(id: string): Promise<Invoice> {
    const res = await api.get(`/invoices/${id}`);
    return res.data.data;
  }
}

const invoiceService = new InvoiceService();
export default invoiceService;
