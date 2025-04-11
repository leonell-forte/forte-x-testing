import { useQuery } from "@tanstack/react-query";
import payoutsService from "api/payouts";

import { useDebouncedSearch } from "lib/hooks";

type UsePayoutsList = {
  page?: number;
  key?: any[];
  enabled?: boolean;
  filters?: any;
};

const usePayoutsList = ({ page, key, enabled, filters }: UsePayoutsList) => {
  const [debouncedPayoutSearch, setPayoutSearch, payoutSearch] =
    useDebouncedSearch("");
  const handleSearchPayout = (value: string) => {
    setPayoutSearch(value);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["payouts", key, debouncedPayoutSearch, filters],
    queryFn: () =>
      payoutsService.list({
        search: debouncedPayoutSearch,
        page: page || 1,
        filters,
      }),
    enabled: enabled ? enabled : true,
  });

  return {
    rawList: data,
    isLoading,
    handleSearchPayout,
    searchPayoutValue: payoutSearch,
  };
};

export default usePayoutsList;
