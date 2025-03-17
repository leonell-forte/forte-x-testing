import { useQuery } from "@tanstack/react-query";
import invoiceService from "api/invoices";

import { InvoiceFilters } from "lib/types/invoices";

type UseInvoiceList = {
  page?: number;
  search?: string;
  key?: any[];
  enabled?: boolean;
  filters?: InvoiceFilters;
};

const useInvoiceList = ({ search, page, key, enabled }: UseInvoiceList) => {
  const { data, isLoading } = useQuery({
    queryKey: ["invoices", ...(key ? key : [])],
    queryFn: () => invoiceService.list({ search, page: page || 1 }),
    enabled: enabled ? enabled : true,
  });

  return { invoices: data, isLoading };
};

export default useInvoiceList;
