import { useQuery } from "@tanstack/react-query";
import invoiceService from "api/invoices";

import { InvoiceFilters } from "lib/types/invoices";

type UseInvoiceList = {
  page?: number;
  search?: string;
  key?: any[];
  enabled?: boolean;
  filters?: InvoiceFilters;
  pageSize?: number;
};

const useInvoiceList = ({
  search,
  page,
  key,
  enabled,
  filters,
  pageSize,
}: UseInvoiceList) => {
  const { data, isLoading } = useQuery({
    queryKey: ["invoices", key],
    queryFn: () => invoiceService.list({ search, page: page || 1, filters, pageSize }),
    enabled: enabled ? enabled : true,
  });

  return { invoices: data, isLoading };
};

export default useInvoiceList;
