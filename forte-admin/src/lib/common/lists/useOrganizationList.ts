import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useMemo } from "react";

import { useDebouncedSearch } from "lib/hooks";
import { IFilters, IOrganization } from "lib/types/organizations";
import { sortOptions } from "lib/utils";

import { IOption } from "components/ui/dropdown";

type UseOrganizationList = {
  key?: any[];
  filters?: IFilters;
  listAll?: boolean;
  page?: number;
  enabled?: boolean;
  pageSize?: number;
};

const useOrganizationList = ({
  key,
  page,
  listAll,
  filters,
  enabled,
  pageSize,
}: UseOrganizationList = {}) => {
  const [debouncedOrgSearch, setOrgSearch, orgSearch] = useDebouncedSearch("");
  const handleSearchOrg = (value: string) => {
    setOrgSearch(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["organizations", ...(key ? key : []), debouncedOrgSearch],

    queryFn: () =>
      organizationService.list({
        page: page || 1,
        listAll,
        filters: filters || {},
        search: debouncedOrgSearch,
        pageSize: pageSize || undefined,
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
    handleSearchOrg,
    searchOrgValue: orgSearch,
  };
};

export default useOrganizationList;
