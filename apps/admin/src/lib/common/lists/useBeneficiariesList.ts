import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "@/api/beneficiaries";
import { useMemo } from "react";

import { useDebouncedSearch } from "@/lib/hooks";
import type { IBeneficiaries, IBeneficiariesFilter } from "@/lib/types/beneficiaries";
import { sortOptions } from "@/lib/utils";

import type { IOption } from "@/components/ui/dropdown";

type UseBeneficiariesList = {
  key?: any[];
  filters?: IBeneficiariesFilter;
  listAll?: boolean;
  page?: number;
  enabled?: boolean;
  pageSize?: number;
};

const useBeneficiariesList = ({
  key,
  page,
  listAll,
  filters,
  enabled,
  pageSize,
}: UseBeneficiariesList = {}) => {
  const [debouncedBeneSearch, setBeneSearch, orgSearch] =
    useDebouncedSearch("");
  const handleSearchBene = (value: string) => {
    setBeneSearch(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["beneficiaries", ...(key ? key : []), debouncedBeneSearch],

    queryFn: () =>
      beneficiariesService.list({
        page: page || 1,
        listAll,
        filters: filters || {},
        search: debouncedBeneSearch,
        pageSize: pageSize || undefined,
      }),
    refetchOnWindowFocus: false,
    enabled: enabled ? enabled : true,
  });

  const beneficiaries: IOption[] = useMemo(
    () =>
      data?.items?.map((item: IBeneficiaries) => ({
        label: `${item.firstName} ${item.lastName}`,

        value: item.id?.toString() as string,
      })) || [],

    [data]
  );
  return {
    beneficiaries: sortOptions(beneficiaries),
    isLoading,
    rawList: data,
    handleSearchBene,
    searchBeneValue: orgSearch,
  };
};

export default useBeneficiariesList;
