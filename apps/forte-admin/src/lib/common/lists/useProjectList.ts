import { useQuery } from "@tanstack/react-query";
import projectService from "@/api/projects";
import { useMemo } from "react";

import { useDebouncedSearch } from "@/lib/hooks";
import type { IProject, ProjectFilter } from "@/lib/types/projects";
import { sortOptions } from "@/lib/utils";

import type { IOption } from "@/components/ui/dropdown";

type UseProjectList = {
  key?: any[];
  page?: number;
  listAll?: boolean;
  enabled?: boolean;
  pageSize?: number;
  filter?: ProjectFilter;
};

const useProjectList = ({
  key,
  page,
  listAll,
  enabled,
  pageSize,
  filter,
}: UseProjectList) => {
  const [debouncedProjectSearch, setProjectSearch, projectSearch] =
    useDebouncedSearch("");

  const handleSearchProject = (value: string) => {
    setProjectSearch(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["projects", ...(key ? key : []), debouncedProjectSearch],

    queryFn: () =>
      projectService.list({
        page,
        search: debouncedProjectSearch,
        listAll,
        pageSize,
        filter,
      }),

    refetchOnWindowFocus: false,
    enabled: enabled ? enabled : true,
  });

  const projects: IOption[] = useMemo(
    () =>
      data?.items?.map((item: IProject) => ({
        label: item.name,

        value: item.id?.toString() as string,
      })) || [],

    [data]
  );

  return {
    projects: sortOptions(projects),
    isLoading,
    rawList: data,
    handleSearchProject,
    searchProjectValue: projectSearch,
  };
};

export default useProjectList;
