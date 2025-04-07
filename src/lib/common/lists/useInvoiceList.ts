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

const useInvoiceList = ({
  search,
  page,
  key,
  enabled,
  filters,
}: UseInvoiceList) => {
  const { data, isLoading } = useQuery({
    queryKey: ["invoices", key],
    queryFn: () => invoiceService.list({ search, page: page || 1, filters }),
    enabled: enabled ? enabled : true,
  });

  return { invoices: data, isLoading };
};

export default useInvoiceList;
