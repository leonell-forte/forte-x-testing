import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import { useMemo } from "react";

import { useDebouncedSearch } from "lib/hooks";
import { IContract, IContractFilters } from "lib/types/contracts";
import { sortOptions } from "lib/utils";

import { IOption } from "components/ui/dropdown";

type UseContractList = {
  key?: any[];
  page?: number;
  listAll?: boolean;
  enabled?: boolean;
  filters?: IContractFilters;
};

const useContractList = ({
  key,
  page,
  listAll,
  filters,
  enabled,
}: UseContractList) => {
  const [debouncedContractSearch, setContractSearch, contractSearch] =
    useDebouncedSearch("");

  const handleSearchContract = (value: string) => {
    setContractSearch(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["contracts", ...(key ? key : []), debouncedContractSearch],

    queryFn: () =>
      contractService.list({
        page: page || 1,
        search: debouncedContractSearch,
        listAll,
        filters: filters,
      }),
  });

  const contracts: IOption[] = useMemo(
    () =>
      data?.items?.map((item: IContract) => ({
        label: item.name,

        value: item.id?.toString() as string,
      })) || [],

    [data]
  );

  const rawData = useMemo(
    () => ({
      ...data,
      items:
        data?.items.map((item) => ({
          ...item,
          documentName: item.document?.toString(),
        })) || [],
    }),

    [data]
  );

  return {
    contracts: sortOptions(contracts),
    isLoading,
    rawList: rawData,
    handleSearchContract,
    searchContractValue: contractSearch,
  };
};

export default useContractList;
