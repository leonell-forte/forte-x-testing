import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { BiSlider as SliderIcon } from "react-icons/bi";
import { TbFilterX as FilterIcon } from "react-icons/tb";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import { REGIONS, STATUS } from "lib/constants";
import { usePage } from "lib/hooks";
import { IFilters, OrgTypes } from "lib/types/organizations";

import OrganizationDialogue from "components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import OrganizationTable from "components/tables/Organization";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

type PageComponentProps = {
  type: OrgTypes;
  initialFilters: IFilters;
};

const PageComponent = ({ type, initialFilters }: PageComponentProps) => {
  const [modal, setModal] = useState<"org" | "filter" | null>(null);

  const { page, setPage } = usePage();

  const [selectedOrg, setSelectedOrg] = useState("");

  const [filters, setFilters] = useState<IFilters>(initialFilters);

  const {
    rawList: organizationList,
    isLoading: orgLoading,
    handleSearchOrg,
    searchOrgValue,
  } = useOrganizationList({
    key: [page, filters],
    page,
    filters,
  });

  const close = () => {
    setSelectedOrg("");

    setModal(null);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "org":
        return (
          <OrganizationDialogue
            orgId={selectedOrg}
            isVisible={modal === "org"}
            handleClose={close}
            addSuccessCallback={() => {
              setPage(1);
            }}
            type={type}
          />
        );

      case "filter":
        return (
          <Dialogue
            hideClose
            title="Filters"
            isVisible={modal === "filter"}
            handleClose={close}
          >
            <FilterWrapper
              onApply={close}
              onClear={() => setFilters(initialFilters)}
            >
              <Filters
                initialFilters={initialFilters}
                filters={filters}
                setFilters={setFilters}
              />
            </FilterWrapper>
          </Dialogue>
        );
    }
  }, [modal, filters, selectedOrg, setPage, initialFilters, type]);

  return (
    <>
      {renderModal()}

      <div className="flex h-full flex-col space-y-2.5">
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-2.5 sm:flex-row">
            <p className="text-[24px] font-semibold">Providers</p>
            <Button
              eventName="Add Organization"
              onClick={() => {
                setModal("org");
              }}
            >
              Add {type}
            </Button>
          </div>

          <div className="flex gap-2.5 md:flex-wrap">
            <div className="w-full md:w-auto">
              <SearchInput
                value={searchOrgValue}
                onChange={(e) => {
                  handleSearchOrg(e.target.value);
                  setPage(1);
                }}
                containerClass="lg:max-w-[286px]"
                placeholder="Search providers"
                onClear={() => handleSearchOrg("")}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModal("filter");
              }}
              className="group flex-shrink-0 lg:hidden"
            >
              <SliderIcon className="h-auto w-6 transition-all group-hover:fill-mint" />
            </button>
            <div className="hidden lg:block">
              <FilterWrapper>
                <Filters
                  initialFilters={initialFilters}
                  filters={filters}
                  setFilters={setFilters}
                />
              </FilterWrapper>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <OrganizationTable
            list={organizationList?.items || []}
            isLoading={orgLoading}
            type={type}
          />

          {!!organizationList?.items.length && (
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

export default PageComponent;

interface IFilterProps {
  filters: IFilters;

  setFilters: Dispatch<SetStateAction<IFilters>>;

  initialFilters: IFilters;
}

const FilterWrapper = ({
  children,
  onApply,
  onClear,
}: {
  children: React.ReactNode;
  onApply?: () => void;
  onClear?: () => void;
}) => (
  <div className="space-y-6">
    {children}
    {(onApply || onClear) && (
      <div className="flex justify-end gap-2">
        {onClear && (
          <Button buttonType="secondary" onClick={onClear}>
            Clear
          </Button>
        )}
        {onApply && <Button onClick={onApply}>Apply</Button>}
      </div>
    )}
  </div>
);

const Filters = ({ filters, setFilters, initialFilters }: IFilterProps) => {
  const { setPage } = usePage();
  const handleSelectFilter = (
    key: keyof IFilters,
    value: string | string[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="grid w-full grid-cols-1 gap-2.5 lg:flex">
      <Dropdown
        enableSearch
        isMultiSelect
        value={filters.region}
        handleSelect={(val) => handleSelectFilter("region", val)}
        placeholder="Region"
        className="lg:max-w-[166px]"
        options={REGIONS}
        filterOptions
      />

      <Dropdown
        value={filters.status}
        handleSelect={(val) => handleSelectFilter("status", val)}
        placeholder="Status"
        className="lg:max-w-[166px]"
        options={STATUS}
      />

      <button
        onClick={() => setFilters(initialFilters)}
        className="group hidden flex-shrink-0 lg:block"
      >
        <FilterIcon className="h-auto w-5 fill-white transition-all group-hover:fill-mint group-hover:stroke-mint" />
      </button>
    </div>
  );
};
