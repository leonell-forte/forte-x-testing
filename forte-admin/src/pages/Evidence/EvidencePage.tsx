import { Dispatch, SetStateAction, useState } from "react";
import { TbFilterX as FilterIcon } from "react-icons/tb";
import { Route, Routes, useLocation } from "react-router-dom";

import useEvidenceList from "lib/common/lists/useEvidenceList";
import { EVIDENCE_STATUS, MILESTONE_TYPES } from "lib/constants";
import { usePage, usePageSize, useStatusParams } from "lib/hooks";
import { SortValues } from "lib/types/common";
import { EvidenceSortLabel, IEvidenceFilters } from "lib/types/evidence";
import { EvidenceStatus } from "lib/types/milestones";

import MainEvidencesTable from "components/tables/MainEvidences";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";
import Tile from "components/ui/tile/Tile";

import ViewEvidence from "./ViewEvidence";

const EvidencesComp = () => {
  const { pageSize, setPageSize } = usePageSize();

  const paramStatus = useStatusParams();

  const initialFilter: IEvidenceFilters = {
    status: paramStatus,
    type: "",
    sortLabel: EvidenceSortLabel.CREATED_AT,
    sortValue: SortValues.DESC,
  };

  const { page, setPage } = usePage();

  const [filters, setFilters] = useState<IEvidenceFilters>(initialFilter);

  const {
    isLoading,
    rawList: evidences,
    handleSearchEvidence,
    searchEvidenceValue,
  } = useEvidenceList({
    key: [page, filters, pageSize],
    page,
    filter: filters,
    listAll: false,
    pageSize,
  });

  const { rawList: evidencesStats } = useEvidenceList({
    key: ["stats", filters.type],
    filter: filters,
    listAll: false,
  });

  const tiles = [
    {
      label: "Total",
      value: evidencesStats?.totalSize,
      activeKey: "",
    },
    {
      label: "Pending Review",
      value: evidencesStats?.pendingCount,
      activeKey: "pending review",
    },
    {
      label: "More Info Requested",
      value: evidencesStats?.moreInformationRequestedCount,
      activeKey: "more information requested",
    },
    {
      label: "Approved",
      value: evidencesStats?.approvedCount,
      activeKey: "approved",
    },
    {
      label: "Rejected",
      value: evidencesStats?.rejectedCount,
      activeKey: "rejected",
    },
  ];

  return (
    <div className="flex h-full flex-col space-y-2.5">
      <div className="space-y-5">
        <p className="text-[24px] font-semibold">Evidence</p>

        <div className="flex flex-col justify-between gap-2.5 md:flex-row">
          {tiles.map((item, index) => {
            return (
              <Tile
                key={index}
                label={item.label}
                value={item.value}
                isActive={item.activeKey === filters.status}
              />
            );
          })}
        </div>
        <div className="flex flex-col justify-between gap-2.5 sm:flex-row">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="flex gap-2">
              <div className="w-full md:w-auto">
                <SearchInput
                  value={searchEvidenceValue}
                  onChange={(e) => {
                    handleSearchEvidence(e.target.value);
                    setPage(1);
                  }}
                  containerClass="w-full lg:max-w-[286px]"
                  placeholder="Search evidences"
                  onClear={() => handleSearchEvidence("")}
                  tooltip="Search by evidence ID, funder name, or provider name."
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
        <MainEvidencesTable
          list={evidences?.items || []}
          isLoading={isLoading}
          handleSort={(sortLabel) =>
            setFilters((prev) => ({
              ...prev,
              sortLabel,
              sortValue:
                prev.sortValue === SortValues.ASC
                  ? SortValues.DESC
                  : SortValues.ASC,
            }))
          }
        />

        {!!evidences?.items.length && (
          <div className="flex w-full items-center justify-end">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              pageSize={pageSize}
              total={evidences?.totalSize as number}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface IFilterProps {
  filters: IEvidenceFilters;

  setFilters: Dispatch<SetStateAction<IEvidenceFilters>>;

  initialFilter: IEvidenceFilters;
}

const Filters = ({ filters, setFilters, initialFilter }: IFilterProps) => {
  const { setPage } = usePage();

  return (
    <div className="flex flex-col gap-2.5 md:flex-row">
      <Dropdown
        placeholder="Status"
        className="w-full lg:max-w-[180px]"
        options={EVIDENCE_STATUS}
        value={filters.status}
        handleSelect={(val) => {
          setFilters((state) => ({ ...state, status: val as EvidenceStatus }));
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

export default function EvidencesPage() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <Routes>
      <Route index element={<EvidencesComp />} />
      <Route
        path=":milestoneId"
        element={
          <>
            <BreadCrumb href="/milestones">Evidences</BreadCrumb>
            <BreadCrumb>Evidences ID: {pathnames?.[1] || ""}</BreadCrumb>
            <ViewEvidence />
          </>
        }
      />
    </Routes>
  );
}
