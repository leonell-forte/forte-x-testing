import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import projectService from "api/projects";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { BiSlider as SliderIcon } from "react-icons/bi";
import { TbFilterX as FilterIcon } from "react-icons/tb";

import { CONTRACT_STATUS } from "lib/constants";
import { useDebounce, usePage, usePageTitle } from "lib/hooks";
import { Contracts, IsAuthorized } from "lib/role-permissions";
import { IContract, IContractFilters, StatusType } from "lib/types/contracts";
import { IProject } from "lib/types/projects";
import { findLabelFromOptions } from "lib/utils";

import { ContractsProvider } from "components/Dashboard/Contracts/Dialogues/ContractContext";
import ContractDialogue from "components/Dashboard/Contracts/Dialogues/ContractDialogue";
import ContractsTable from "components/tables/Contracts";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Dropdown, { IOption } from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

const ContractsPage = () => {
  usePageTitle("Contracts");

  const { page, setPage } = usePage();

  const [search, setSearch] = useState("");

  const initialFilter = {
    status: "",

    project: "",

    date: "",
  };

  const [filters, setFilters] = useState<IContractFilters>(initialFilter);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [contractId, setContractId] = useState<number | null>(null);

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,

    [search]
  );

  const { data: contractList, isLoading } = useQuery({
    queryKey: ["contracts", page, debouncedSearch, filters],

    queryFn: () =>
      contractService.list({
        page,

        filters,

        search: debouncedSearch,

        listAll: false,
      }),
  });

  const contracts: IContract[] = useMemo(
    () =>
      contractList?.items.map((item) => ({
        ...item,
        documentName: item.document?.toString(),
      })) || [],

    [contractList]
  );

  const [modal, setModal] = useState<"contract" | "delete" | "filter" | null>(
    null
  );

  const close = () => {
    setContractId(null);

    setModal(null);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "contract":
        return (
          <ContractDialogue
            id={contractId!}
            isVisible={modal === "contract"}
            handleClose={close}
          />
        );

      case "filter":
        return (
          <Dialogue
            hideClose
            isVisible={modal === "filter"}
            title="Filters"
            handleClose={close}
          >
            <div className="space-y-6">
              <Filters filters={filters} setFilters={setFilters} />
              <div className="flex justify-end gap-2">
                <Button
                  buttonType="secondary"
                  onClick={() => {
                    setFilters(initialFilter);
                  }}
                >
                  Clear
                </Button>
                <Button onClick={close}>Apply</Button>
              </div>
            </div>
          </Dialogue>
        );
    }
    //eslint-disable-next-line
  }, [modal, contractId, filters]);

  return (
    <ContractsProvider>
      {renderModal()}

      <div className="flex h-full flex-col space-y-2.5">
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
                  placeholder="Search contracts"
                  onClear={() => setSearch("")}
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
            </div>

            <div className="hidden lg:block">
              <Filters filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {IsAuthorized([Contracts.CREATE]) && (
            <Button
              eventName="Add Contract"
              onClick={() => setModal("contract")}
            >
              Add contract
            </Button>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <ContractsTable list={contracts} isLoading={isLoading} />

          {!!contracts.length && (
            <div className="flex w-full items-center justify-end">
              <Pagination
                page={page}
                onPageChange={(val) => setPage(val)}
                total={contractList?.totalSize as number}
              />
            </div>
          )}
        </div>
      </div>
    </ContractsProvider>
  );
};

export default ContractsPage;

interface IFilterProps {
  filters: IContractFilters;

  setFilters: Dispatch<SetStateAction<IContractFilters>>;
}

const Filters = ({ filters, setFilters }: IFilterProps) => {
  const { page, setPage } = usePage();

  const { data: projectList, isLoading: isProjectLoading } = useQuery({
    queryKey: ["projects"],

    queryFn: () => projectService.list({ page, listAll: true }),
  });
  const projects: IOption[] = useMemo(
    () =>
      projectList?.items
        ?.map((item: IProject) => ({
          label: item.name,

          value: item.id.toString(),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) || [],

    [projectList]
  );
  return (
    <div className="grid grid-cols-1 gap-2.5 md:flex">
      <Dropdown
        placeholder="Status"
        className="lg:max-w-[166px]"
        options={CONTRACT_STATUS}
        value={filters.status}
        handleSelect={(val) => {
          setFilters((prev) => ({ ...prev, status: val as StatusType }));
          setPage(1);
        }}
      />

      <div className="flex w-full items-center gap-2.5 lg:w-auto">
        <Dropdown
          value={findLabelFromOptions(projects, filters.project)}
          handleSelect={(val) => {
            setFilters((prev) => ({ ...prev, project: val as string }));
            setPage(1);
          }}
          loading={isProjectLoading}
          options={projects}
          placeholder="Project"
          className="lg:max-w-[166px]"
        />

        <button
          onClick={() =>
            setFilters({
              status: "",

              project: "",

              date: "",
            })
          }
          className="group hidden md:block"
        >
          <FilterIcon className="h-auto w-5 fill-white transition-all group-hover:fill-mint group-hover:stroke-mint" />
        </button>
      </div>
    </div>
  );
};
