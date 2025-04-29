import { useQuery } from "@tanstack/react-query";
import userService from "api/users";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { BiSlider as SliderIcon } from "react-icons/bi";
import { TbFilterX as FilterIcon } from "react-icons/tb";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import usePayoutsList from "lib/common/lists/usePayoutsList";
import { PAYOUT_STATUS } from "lib/constants";
import { usePage } from "lib/hooks";
import { IsAuthorized, Organizations } from "lib/role-permissions";
import { Filter } from "lib/types/payouts";
import { findLabelFromOptions } from "lib/utils";

import BankDetails from "components/Dashboard/Payouts/BankDetails";
import GeneratePayout from "components/Dashboard/Payouts/GeneratePayout";
import { useProfile } from "components/ProfileContext";
import PayoutsTable from "components/tables/Payouts";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

type ModalLabelTypes = "filter" | "generate" | "";

const PayoutsPage = () => {
  const { profile } = useProfile();

  const isForte = profile?.organization === "Forte";

  const isProvider = profile?.role?.split(".")[0] === "provider";

  const { data: userData } = useQuery({
    queryKey: ["specific user", profile?.id],

    queryFn: () => userService.getOne(profile?.id as string),

    enabled: !!profile?.id,
  });

  const initialFilters = {
    provider: !isForte ? userData?.organization?.toString() || "" : "",

    status: "",
  };

  const { page, setPage } = usePage();

  const [modal, setModal] = useState<ModalLabelTypes>("");

  const [filters, setFilters] = useState<Filter>(initialFilters as Filter);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      provider: !isForte ? userData?.organization?.toString() || "" : "",
    }));
  }, [isForte, userData]);

  const {
    rawList: payouts,
    isLoading,
    searchPayoutValue,
    handleSearchPayout,
  } = usePayoutsList({
    key: [page, filters],
    page,
    filters,
  });

  const providerId = userData?.organization || "";

  const handleClose = () => {
    setModal("");
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "filter":
        return (
          <Dialogue
            hideClose
            title="Filters"
            isVisible={modal === "filter"}
            handleClose={handleClose}
          >
            <div className="space-y-6">
              <Filters
                filters={filters}
                setFilters={setFilters}
                initialFilters={initialFilters}
                isForte={isForte}
              />
              <div className="flex justify-end gap-2">
                <Button
                  buttonType="secondary"
                  onClick={() => {
                    setFilters(initialFilters);
                  }}
                >
                  Clear
                </Button>
                <Button onClick={handleClose}>Apply</Button>
              </div>
            </div>
          </Dialogue>
        );

      case "generate":
        return <GeneratePayout handleClose={handleClose} />;
    }
    //eslint-disable-next-line
  }, [modal, filters]);

  return (
    <>
      {renderModal()}
      <div className="space-y-6">
        <div className="itemsc flex justify-between">
          <p className="text-[24px] font-semibold">Payouts</p>
          {isForte && (
            <Button onClick={() => setModal("generate")}>
              Generate payouts
            </Button>
          )}
        </div>
        <div className="space-y-10">
          {isProvider && <BankDetails providerId={providerId.toString()} />}

          <div>
            {!!payouts?.items.length && (
              <div className="flex gap-2.5 md:flex-wrap">
                <div className="w-full md:w-auto">
                  <SearchInput
                    value={searchPayoutValue}
                    onChange={(e) => {
                      handleSearchPayout(e.target.value);
                      setPage(1);
                    }}
                    containerClass="lg:max-w-[286px]"
                    placeholder="Search"
                    onClear={() => handleSearchPayout("")}
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
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    initialFilters={initialFilters}
                    isForte={isForte}
                  />
                </div>
              </div>
            )}
            <div className="flex h-full flex-col justify-between gap-4">
              <PayoutsTable list={payouts?.items || []} isLoading={isLoading} />

              {!!payouts?.items.length && (
                <div className="flex w-full items-center justify-end">
                  <Pagination
                    page={page}
                    onPageChange={(val) => setPage(val)}
                    total={payouts.totalSize as number}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayoutsPage;

interface IFilterProps {
  filters: Filter;

  setFilters: Dispatch<SetStateAction<Filter>>;

  initialFilters: Filter;

  isForte: boolean;
}

const Filters = ({
  filters,
  setFilters,
  initialFilters,
  isForte,
}: IFilterProps) => {
  const {
    organizations,
    isLoading: orgLoading,
    handleSearchOrg,
  } = useOrganizationList({
    key: ["filter"],
    filters: { type: "provider" },
    enabled: IsAuthorized([Organizations.LIST]),
    pageSize: 1000,
  });
  const { setPage } = usePage();
  const handleSelectFilter = (key: keyof Filter, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleRemoveFilters = () => {
    setFilters(initialFilters as Filter);
  };
  return (
    <div className="grid w-full grid-cols-1 gap-2.5 lg:flex">
      <div className="grid w-full grid-cols-1 gap-2.5 lg:flex">
        {IsAuthorized([Organizations.LIST]) && isForte && (
          <Dropdown
            loading={orgLoading}
            options={organizations}
            placeholder="Provider"
            className="xl:w-[166px]"
            value={findLabelFromOptions(
              organizations,

              filters.provider as string
            )}
            handleSelect={(val) => {
              setPage(1);
              setFilters((prev) => ({
                ...prev,
                provider: val as string,
              }));
            }}
            enableSearch
            onChange={(e) => handleSearchOrg(e.target.value)}
          />
        )}
        <Dropdown
          value={filters.status}
          handleSelect={(val) => {
            handleSelectFilter("status", val);
          }}
          placeholder="Status"
          className="lg:max-w-[166px]"
          options={PAYOUT_STATUS}
        />
      </div>

      <button
        onClick={handleRemoveFilters}
        className="group hidden flex-shrink-0 lg:block"
      >
        <FilterIcon className="h-auto w-5 fill-white transition-all group-hover:fill-mint group-hover:stroke-mint" />
      </button>
    </div>
  );
};
