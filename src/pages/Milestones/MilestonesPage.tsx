import { useQuery } from "@tanstack/react-query";
import milestoneService from "api/milestones";
import { Dispatch, SetStateAction, useState } from "react";
import { TbFilterX as FilterIcon } from "react-icons/tb";
import { Route, Routes, useLocation } from "react-router-dom";

import { MILESTONE_STATUS } from "lib/constants";
import { useDebounce, usePage } from "lib/hooks";
import { IMilestoneFilters } from "lib/types/milestones";

import MilestonesTable from "components/tables/Milestones";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

import ViewMilestone from "./ViewMilestone";

const initialFilter = {
  status: "",
  contractId: "",
};

const MilestonesComp = () => {
  const { page, setPage } = usePage();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<IMilestoneFilters>(initialFilter);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,

    [search]
  );

  const { data: milestones, isLoading } = useQuery({
    queryKey: ["milestones", page, debouncedSearch, filters],

    queryFn: () =>
      milestoneService.list({
        page,

        filters,

        search: debouncedSearch,

        listAll: false,
      }),
  });

  return (
    <div className="flex h-full flex-col space-y-2.5">
      <div className="space-y-5">
        <p className="text-[24px] font-semibold">Milestones</p>
        <div className="flex flex-col justify-between gap-2.5 sm:flex-row">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="flex gap-2">
              <div className="w-full md:w-auto">
                <SearchInput
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  containerClass="w-full lg:max-w-[286px]"
                  placeholder="Search milestones"
                  onClear={() => setSearch("")}
                />
              </div>
            </div>

            <div>
              <Filters filters={filters} setFilters={setFilters} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col justify-between gap-4">
        <MilestonesTable list={milestones?.items || []} isLoading={isLoading} />

        {!!milestones?.items.length && (
          <div className="flex w-full items-center justify-end">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={milestones?.totalSize as number}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface IFilterProps {
  filters: IMilestoneFilters;

  setFilters: Dispatch<SetStateAction<IMilestoneFilters>>;
}

const Filters = ({ filters, setFilters }: IFilterProps) => {
  return (
    <div className="grid grid-cols-1 gap-2.5 md:flex">
      <Dropdown
        placeholder="Status"
        className="lg:max-w-[166px]"
        options={MILESTONE_STATUS}
        value={filters.status}
        handleSelect={(val) => {
          console.log(val);
        }}
      />

      <div className="flex w-full items-center gap-2.5 lg:w-auto">
        <button
          onClick={() => setFilters(initialFilter)}
          className="group hidden md:block"
        >
          <FilterIcon className="h-auto w-5 fill-white transition-all group-hover:fill-mint group-hover:stroke-mint" />
        </button>
      </div>
    </div>
  );
};

export default function MilestonePage() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <Routes>
      <Route index element={<MilestonesComp />} />
      <Route
        path=":milestoneId"
        element={
          <>
            <BreadCrumb href="/milestones">Milestones</BreadCrumb>
            <BreadCrumb>Milestone ID: {pathnames?.[1] || ""}</BreadCrumb>
            <ViewMilestone />
          </>
        }
      />
    </Routes>
  );
}
