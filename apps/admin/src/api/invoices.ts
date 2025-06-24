import { api } from "@/lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { SortValues } from "@/lib/types/common";
import { Invoice, InvoiceFilters, SortInvoiceLabel } from "@/lib/types/invoices";
import { IODataObject, generateODataQuery } from "@/lib/utils";

type ListParams = {
  page: number;
  search?: string;
  filters?: InvoiceFilters;
  pageSize?: number;
};

export class InvoiceService {
  async list({ page, search, filters, pageSize }: ListParams): Promise<{
    items: Invoice[];
    totalSize: number;
    pageSize: number;
  }> {
    const params = new URLSearchParams();

    params.append("$pageNum", page.toString());

    params.append("$pageSize", pageSize?.toString() || DEFAULT_PAGE_SIZE);

    params.append(
      "$orderBy",
      `${filters?.sortLabel || SortInvoiceLabel.CREATED_AT} ${filters?.sortValue || SortValues.DESC}`
    );

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
