import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useMemo, useState } from "react";

import closeFilter from "assets/images/icons/close-filter.svg";

import { REGIONS, STATUS, TYPES } from "lib/constants";
import { useDebounce, usePage, usePageTitle } from "lib/hooks";
import { IFilters, IOrganization } from "lib/types/organizations";

import OrganizationDialogue from "components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import OrganizationTable from "components/tables/Organization";
import Button from "components/ui/button";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

const OrganizationsPage = () => {
  usePageTitle("Organizations");

  const [modal, setModal] = useState<"org" | null>(null);

  const { page, setPage } = usePage();

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,
    [search]
  );

  const [selectedOrg, setSelectedOrg] = useState("");

  const initialFilters = {
    region: [],

    status: "",

    type: "",
  };

  const [filters, setFilters] = useState<IFilters>(initialFilters);

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations", page, debouncedSearch, filters],

    queryFn: () =>
      organizationService.list({
        page,

        listAll: false,

        search: debouncedSearch,

        filters,
      }),
  });

  const organizations: IOrganization[] = useMemo(
    () => organizationList?.items || [],

    [organizationList]
  );

  const close = () => {
    setSelectedOrg("");

    setModal(null);
  };

  const handleSelectFilter = (
    key: keyof IFilters,
    value: string | string[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <>
      {modal === "org" && (
        <OrganizationDialogue
          orgId={selectedOrg}
          isVisible={modal === "org"}
          handleClose={close}
        />
      )}

      <div className="space-y-2.5">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!w-[286px]"
            placeholder="Search organizations"
            onClear={() => setSearch("")}
          />

          <div className="flex items-center gap-6">
            <Button
              eventName="Add Organization"
              onClick={() => {
                setModal("org");
              }}
            >
              Add organization
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-[10px]">
          <p className="text-[20px] font-medium">Filter by</p>

          <Dropdown
            enableSearch
            isMultiSelect
            value={filters.region}
            handleSelect={(val) => {
              handleSelectFilter("region", val);
            }}
            placeholder="Region"
            className="max-w-[184px]"
            options={REGIONS}
          />

          <Dropdown
            value={filters.status}
            handleSelect={(val) => {
              handleSelectFilter("status", val);
            }}
            placeholder="Status"
            className="max-w-[184px]"
            options={STATUS}
          />

          <Dropdown
            value={filters.type}
            handleSelect={(val) => {
              handleSelectFilter("type", val);
            }}
            placeholder="Type"
            className="max-w-[184px]"
            options={TYPES}
          />

          <button onClick={handleRemoveFilters}>
            <img src={closeFilter} alt="close-filter" />
          </button>
        </div>

        <div className="space-y-4">
          <OrganizationTable
            list={organizationList?.items || []}
            isLoading={orgLoading}
          />

          {!!organizations.length && (
            <div className="flex w-full items-center justify-end">
              <Pagination
                page={page}
                onPageChange={(val) => setPage(val)}
                total={organizationList?.totalSize as number}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrganizationsPage;
