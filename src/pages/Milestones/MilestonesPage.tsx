import { Dispatch, SetStateAction, useState } from "react";
import { TbFilterX as FilterIcon } from "react-icons/tb";
import { Route, Routes, useLocation } from "react-router-dom";

import useMilestoneList from "lib/common/lists/useMilestoneList";
import { MILESTONE_STATUS, MILESTONE_TYPES } from "lib/constants";
import { usePage } from "lib/hooks";
import { IMilestoneFilters, MilestoneStatus } from "lib/types/milestones";

import MilestonesTable from "components/tables/Milestones";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

import ViewMilestone from "./ViewMilestone";

type MilestonesProps = {
  hideHeader?: boolean;
  contractId?: string;
  providerId?: string;
  funderId?: string;
};

const MilestonesComp = ({
  hideHeader,
  contractId,
  providerId,
  funderId,
}: MilestonesProps) => {
  const initialFilter = {
    status: "",
    contractId: contractId || "",
    type: "",
    providerId: providerId || "",
    funderId: funderId || "",
  };

  const { page, setPage } = usePage();

  const [filters, setFilters] = useState<IMilestoneFilters>(initialFilter);

  const {
    isLoading,
    rawList: milestones,
    handleSearchMilestone,
    searchMilestoneValue,
  } = useMilestoneList({
    key: [page, filters],
    page,
    filter: filters,
    listAll: false,
    pageSize: 10,
  });

  return (
    <div className="flex h-full flex-col space-y-2.5">
      <div className="space-y-5">
        {!hideHeader && <p className="text-[24px] font-semibold">Milestones</p>}

        <div className="flex flex-col justify-between gap-2.5 sm:flex-row">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="flex gap-2">
              <div className="w-full md:w-auto">
                <SearchInput
                  value={searchMilestoneValue}
                  onChange={(e) => {
                    handleSearchMilestone(e.target.value);
                    setPage(1);
                  }}
                  containerClass="w-full lg:max-w-[286px]"
                  placeholder="Search milestones"
                  onClear={() => handleSearchMilestone("")}
                  tooltip="Search by milestone ID, funder name, or provider name."
                />
              </div>
            </div>

            <div className="flex-1 flex-grow">
              <Filters
                filters={filters}
                setFilters={setFilters}
                initialFilter={initialFilter}
              />
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

  initialFilter: IMilestoneFilters;
}

const Filters = ({ filters, setFilters, initialFilter }: IFilterProps) => {
  const { setPage } = usePage();

  return (
    <div className="flex flex-col gap-2.5 md:flex-row">
      <Dropdown
        placeholder="Status"
        className="w-full lg:max-w-[180px]"
        options={MILESTONE_STATUS}
        value={filters.status}
        handleSelect={(val) => {
          setFilters((state) => ({ ...state, status: val as MilestoneStatus }));
          setPage(1);
        }}
      />

      <Dropdown
        placeholder="Type"
        className="w-full lg:max-w-[180px]"
        options={MILESTONE_TYPES}
        value={filters.type}
        handleSelect={(val) => {
          setFilters((state) => ({ ...state, type: val as string }));
          setPage(1);
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

export default function MilestonePage({
  hideHeader,
  contractId,
  providerId,
  funderId,
}: MilestonesProps) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <Routes>
      <Route
        index
        element={
          <MilestonesComp
            hideHeader={hideHeader}
            contractId={contractId}
            providerId={providerId}
            funderId={funderId}
          />
        }
      />
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
