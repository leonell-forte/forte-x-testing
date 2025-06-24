import { useQuery } from "@tanstack/react-query";
import milestoneService from "@/api/milestones";
import { useMemo } from "react";

import { useDebouncedSearch } from "@/lib/hooks";
import type { IMilestone, IMilestoneFilters } from "@/lib/types/milestones";
import { sortOptions } from "@/lib/utils";

import type { IOption } from "@/components/ui/dropdown";

type UseMilestoneList = {
  key?: any[];
  page?: number;
  listAll?: boolean;
  enabled?: boolean;
  pageSize?: number;
  filter?: IMilestoneFilters;
};

const useMilestoneList = ({
  key,
  page,
  listAll,
  enabled,
  pageSize,
  filter,
}: UseMilestoneList) => {
  const [debouncedMilestoneSearch, setMilestoneSearch, milestoneSearch] =
    useDebouncedSearch("");

  const handleSearchMilestone = (value: string) => {
    setMilestoneSearch(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["milestones", ...(key ? key : []), debouncedMilestoneSearch],

    queryFn: () =>
      milestoneService.list({
        page,
        search: debouncedMilestoneSearch,
        listAll,
        pageSize,
        filters: filter,
      }),

    refetchOnWindowFocus: false,
    enabled: enabled ? enabled : true,
  });

  const milestones: IOption[] = useMemo(
    () =>
      data?.items?.map((item: IMilestone) => ({
        label: `Milestone ID: ${item.id}`,

        value: item.id?.toString() as string,
      })) || [],

    [data]
  );

  return {
    milestones: sortOptions(milestones),
    isLoading,
    rawList: data,
    handleSearchMilestone,
    searchMilestoneValue: milestoneSearch,
  };
};

export default useMilestoneList;
