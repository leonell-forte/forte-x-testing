import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import { useMemo } from "react";

import { useDebouncedSearch } from "lib/hooks";
import { IEvidenceFilters, MainEvidence } from "lib/types/evidence";
import { sortOptions } from "lib/utils";

import { IOption } from "components/ui/dropdown";

type UseEvidenceList = {
  key?: any[];
  page?: number;
  listAll?: boolean;
  enabled?: boolean;
  pageSize?: number;
  filter?: IEvidenceFilters;
};

const useEvidenceList = ({
  key,
  page,
  // listAll,
  enabled,
  pageSize,
  filter,
}: UseEvidenceList) => {
  const [debouncedEvidenceSearch, setEvidenceSearch, milestoneSearch] =
    useDebouncedSearch("");

  const handleSearchEvidence = (value: string) => {
    setEvidenceSearch(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["evidences", ...(key ? key : []), debouncedEvidenceSearch],

    queryFn: () =>
      evidenceService.listAll(
        page || 1,
        pageSize || 10,
        debouncedEvidenceSearch,
        filter
      ),
    refetchOnWindowFocus: false,
    enabled: enabled ? enabled : true,
  });

  const evidences: IOption[] = useMemo(
    () =>
      data?.items?.map((item: MainEvidence) => ({
        label: `Evidence ID: ${item.id}`,

        value: item.id?.toString() as string,
      })) || [],

    [data]
  );

  return {
    evidences: sortOptions(evidences),
    isLoading,
    rawList: data,
    handleSearchEvidence,
    searchEvidenceValue: milestoneSearch,
  };
};

export default useEvidenceList;
