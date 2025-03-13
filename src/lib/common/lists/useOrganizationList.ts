import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useMemo } from "react";

import { IFilters, IOrganization } from "lib/types/organizations";
import { sortOptions } from "lib/utils";

import { IOption } from "components/ui/dropdown";

type UseOrganizationList = {
  key?: any[];
  filters?: IFilters;
  listAll?: boolean;
  page?: number;
  enabled?: boolean;
  search?: string;
};

const useOrganizationList = ({
  key,
  page,
  listAll,
  filters,
  enabled,
  search,
}: UseOrganizationList = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["organizations", ...(key ? key : [])],

    queryFn: () =>
      organizationService.list({
        page: page || 1,
        listAll,
        filters: filters || {},
        search,
      }),
    refetchOnWindowFocus: false,
    enabled: enabled ? enabled : true,
  });

  const organizations: IOption[] = useMemo(
    () =>
      data?.items?.map((item: IOrganization) => ({
        label: item.name,

        value: item.id?.toString() as string,
      })) || [],

    [data]
  );
  return {
    organizations: sortOptions(organizations),
    isLoading,
    rawList: data,
  };
};

export default useOrganizationList;
