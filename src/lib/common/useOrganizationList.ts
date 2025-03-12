import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useMemo } from "react";

import { IFilters, IOrganization } from "lib/types/organizations";

import { IOption } from "components/ui/dropdown";

type UseOrganizationList = {
  key?: any[];
  filters?: IFilters;
  listAll?: boolean;
  page?: number;
};

const useOrganizationList = ({
  key,
  page,
  listAll,
  filters,
}: UseOrganizationList = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["organizations", ...(key ? key : [])],

    queryFn: () =>
      organizationService.list({
        page: page || 1,
        listAll,
        filters: filters || {},
      }),
    refetchOnWindowFocus: false,
  });

  const organizations: IOption[] = useMemo(
    () =>
      data?.items
        ?.map((item: IOrganization) => ({
          label: item.name,

          value: item.id?.toString() as string,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) || [],

    [data]
  );
  return { organizations, isLoading, rawList: data?.items || [] };
};

export default useOrganizationList;
